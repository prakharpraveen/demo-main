import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Select, Checkbox, Button } from 'antd';
import _ from 'lodash';
import { updateTreeData, setNodeData, setAppData, getFromDataFunc } from 'Store/AppRegister/action';
import ChooseImageForForm from 'Components/ChooseImageForForm';
import Ajax from 'Pub/js/ajax';
import FromTable from './FromTable';
const FormItem = Form.Item;
const Option = Select.Option;
const imgs = [{
	name:'img1',
	value:'/nccloud/resources/workbench/assets/images/img1.png',
	src:'assets/images/img1.png'
},{
	name:'img2',
	value:'/nccloud/resources/workbench/assets/images/img2.png',
	src:'assets/images/img2.png'
},{
	name:'img3',
	value:'/nccloud/resources/workbench/assets/images/img3.png',
	src:'assets/images/img3.png'
},{
	name:'img4',
	value:'/nccloud/resources/workbench/assets/images/img4.png',
	src:'assets/images/img4.png'
},{
	name:'img5',
	value:'/nccloud/resources/workbench/assets/images/img5.png',
	src:'assets/images/img5.png'
},{
	name:'img6',
	value:'/nccloud/resources/workbench/assets/images/img6.png',
	src:'assets/images/img6.png'
}];
let timeout;
let currentValue;
/**
	 * 关联元数据 ID 数据查询
	 * @param {*} value 
	 * @param {*} callback 
	 */
function fetch(value, callback) {
	if (timeout) {
		clearTimeout(timeout);
		timeout = null;
	}
	currentValue = value;
	function fake() {
		Ajax({
			url: `/nccloud/platform/appregister/querymdid.do`,
			data: { search_content: value },
			success: ({ data }) => {
				if (data.success && data.data) {
					callback(data.data.rows);
				}
			}
		});
	}
	timeout = setTimeout(fake, 300);
}
class AppFromCard extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			DOMDATA: [
				{
					lable: '应用编码',
					type: 'input',
					code: 'code',
					required: true
				},
				{
					lable: '应用名称',
					type: 'input',
					code: 'name',
					required: true
				},
				{
					lable: '组织类型',
					type: 'select',
					code: 'orgtypecode',
					required: true,
					options: []
				},
				{
					lable: '功能点类型',
					type: 'select',
					code: 'funtype',
					required: true,
					options: [
						{
							value: 0,
							text: '业务类应用'
						},
						{
							value: 1,
							text: '管理类应用'
						},
						{
							value: 2,
							text: '系统类应用'
						},
						{
							value: 3,
							text: '管理+业务类应用'
						}
					]
				},
				{
					lable: '应用描述',
					type: 'input',
					code: 'app_desc',
					required: false
				},
				{
					lable: '帮助文件名',
					type: 'input',
					code: 'help_name',
					required: false
				},
				{
					lable: '关联元数据ID',
					type: 'search',
					code: 'mdid',
					required: false,
					placeholder: '请输入元数据名称过滤',
					options: []
				},
				{
					lable: '所属集团',
					type: 'input',
					code: 'pk_group',
					required: false
				},
				{
					lable: '应用类型',
					type: 'select',
					code: 'apptype',
					required: false,
					options: [
						{
							value: 1,
							text: '小应用'
						},
						{
							value: 2,
							text: '小部件'
						}
					]
				},

				{
					lable: '应用宽',
					type: 'input',
					code: 'width',
					required: true
				},
				{
					lable: '应用高',
					type: 'input',
					code: 'height',
					required: true
				},
				{
					lable: '是否启用',
					type: 'checkbox',
					code: 'isenable',
					required: false
				},
				{
					lable: '是否CA用户可用',
					type: 'checkbox',
					code: 'iscauserusable',
					required: false
				},
				{
					lable: '是否加载占用',
					type: 'checkbox',
					code: 'uselicense_load',
					required: false
				},
				{
					lable: '跳转路径',
					type: 'input',
					code: 'target_path',
					required: true,
					md: 24,
					lg: 24,
					xl: 24
				},
				{
					lable: '图标路径',
					type: 'chooseImage',
					code: 'image_src',
					required: true,
					md: 24,
					lg: 24,
					xl: 24
				}
			]
		};
	}
	/**
	 * 动态创建页面dom
	 * @param {*} nodeData 
	 */
	getFields(nodeData) {
		let { DOMDATA } = this.state;
		if (nodeData.systypename) {
			return;
		}
		const children = [];
		DOMDATA.map((item, index) => {
			let { lable, md = 24, lg = 12, xl = 8 } = item;
			children.push(
				<Col md={md} lg={lg} xl={xl} key={index}>
					{this.createDom(item, nodeData)}
				</Col>
			);
		});
		return children;
	}

	/**
	 * 下拉数据浏览态展示
	 * 
	 */
	optionShow = (options, value) => {
		let option = options.find((item) => item.value === value);
		if (option) {
			return option.text;
		}
	};
	/**
	 * 获取组织类型 下拉数据
	 * @param {String} code 
	 */
	getOptionsData = (code) => {
		let { DOMDATA } = this.state;
		Ajax({
			url: `/nccloud/platform/appregister/queryorgtype.do`,
			success: ({ data }) => {
				if (data.success && data.data) {
					let options = data.data.rows;
					options = options.map((option, i) => {
						return {
							value: option.refpk,
							text: option.refname
						};
					});
					DOMDATA.map((item, index) => {
						if (item.code === code) {
							item.options = options;
						}
						return item;
					});
					this.setState({ DOMDATA });
				}
			}
		});
	};
	/**
	 * 创建 下拉内容
	 * @param {Array} options
	 */
	createOption = (options) => {
		return options.map((item, index) => {
			return <Option value={item.value}>{item.text}</Option>;
		});
	};
	/**
	 * 关联元数据 ID
	 * @param {String} value
	 */
	handleSearch = (searchValue) => {
		this.props.form.setFieldsValue({
			mdid: searchValue
		});
		fetch(searchValue, (options) => {
			let { DOMDATA } = this.state;
			options = options.map((option, i) => {
				return {
					value: option.refpk,
					text: `${option.refname} ${option.refcode}`
				};
			});
			DOMDATA.map((item, index) => {
				if (item.code === 'mdid') {
					item.options = options;
				}
				return item;
			});
			this.setState({ DOMDATA });
		});
	};
	createDom = (itemInfo, nodeData) => {
		const { getFieldDecorator } = this.props.form;
		const { isEdit } = this.props.billStatus;
		let { lable, type, code,required } = itemInfo;
		switch (type) {
			case 'select':
				return isEdit ? (
					<FormItem label={lable} hasFeedback>
						{getFieldDecorator(code, {
							initialValue: nodeData[code],
							rules: [ { required: required, message: `请选择${lable}` } ]
						})(<Select placeholder={`请选择${lable}`}>{this.createOption(itemInfo.options)}</Select>)}
					</FormItem>
				) : (
					<FormItem label={lable}>
						<span className='ant-form-text'>{this.optionShow(itemInfo.options, nodeData[code])}</span>
					</FormItem>
				);
			case 'search':
				return isEdit ? (
					<FormItem label={lable} hasFeedback>
						{getFieldDecorator(code, {
							initialValue: nodeData[code],
							rules: [
								{ required: required, message: itemInfo.placeholder ? itemInfo.placeholder : `请选择${lable}` }
							]
						})(
							<Select
								placeholder={itemInfo.placeholder ? itemInfo.placeholder : `请选择${lable}`}
								mode='combobox'
								defaultActiveFirstOption={false}
								showArrow={false}
								filterOption={false}
								onChange={this.handleSearch}
							>
								{this.createOption(itemInfo.options)}
							</Select>
						)}
					</FormItem>
				) : (
					<FormItem label={lable}>
						<span className='ant-form-text'>{nodeData[code]}</span>
					</FormItem>
				);
			case 'checkbox':
				return (
					<FormItem>
						{getFieldDecorator(code, {
							valuePropName: 'checked',
							initialValue: nodeData[code]
						})(<Checkbox disabled={!isEdit}>{lable}</Checkbox>)}
					</FormItem>
				);
			case 'chooseImage':
				return isEdit ? (
					<FormItem label={lable}>
							{getFieldDecorator(code, {
								initialValue: nodeData[code],
								rules: [
									{ required: required, message: itemInfo.placeholder ? itemInfo.placeholder : `请选择${lable}` }
								],
							})(<ChooseImageForForm data={imgs} title={'图标选择'}/>)}
						</FormItem>
				) : (
					<FormItem label={lable}>
						<span className='ant-form-text'>{nodeData[code]}</span>
					</FormItem>
				);
			default:
				return isEdit ? (
					<FormItem label={lable}>
						{getFieldDecorator(code, {
							initialValue: nodeData[code],
							rules: [
								{
									required: required,
									message: `请输入${lable}`
								}
							]
						})(<Input placeholder={`请输入${lable}`} />)}
					</FormItem>
				) : (
					<FormItem label={lable}>
						<span className='ant-form-text'>{nodeData[code]}</span>
					</FormItem>
				);
		}
	};
	getFromData = () => {
		const { getFieldsValue, validateFields } = this.props.form;
		let flag = false;
		validateFields((err, values) => {
			if (!err) {
				flag = true;
			}
		});
		return flag ? getFieldsValue() : null;
	};
	componentWillMount() {
		this.props.getFromDataFunc(this.getFromData);
		this.getOptionsData('orgtypecode');
	}
	render() {
		// console.log(this.props.nodeData);
		return (
			<div>
				<Form className='from-card'>
					<Row gutter={24}>{this.getFields(this.props.nodeData)}</Row>
				</Form>
				<div style={{ 'margin-top': '16px', background: '#ffffff', padding: '10px', 'border-radius': '6px' }}>
					<FromTable />
				</div>
			</div>
		);
	}
}
AppFromCard = Form.create()(AppFromCard);
AppFromCard.PropTypes = {
	updateTreeData: PropTypes.func.isRequired,
	nodeData: PropTypes.object.isRequired,
	billStatus: PropTypes.object.isRequired,
	setNodeData: PropTypes.func.isRequired,
	setAppData: PropTypes.func.isRequired,
	getFromDataFunc: PropTypes.func.isRequired
};
export default connect(
	(state) => {
		let { nodeData, updateTreeData, billStatus } = state.AppRegisterData;
		return { nodeData, updateTreeData, billStatus };
	},
	{ setNodeData, setAppData, getFromDataFunc }
)(AppFromCard);
