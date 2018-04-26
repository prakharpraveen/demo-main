import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Select, Checkbox, Button } from 'antd';
import { updateTreeData, getFromDataFunc } from 'Store/AppRegister/action';
import Ajax from 'Pub/js/ajax';
const FormItem = Form.Item;
const Option = Select.Option;
class ModuleFromCard extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			DOMDATA: [
				{
					lable: '模块编码',
					type: 'input',
					code: 'systypecode',
					required: true
				},
				{
					lable: '模块号',
					type: 'input',
					code: 'moduleid',
					required: true
				},
				{
					lable: '模块名称',
					type: 'input',
					code: 'systypename',
					required: true
				},
				{
					lable: '对应模块号',
					type: 'input',
					code: 'devmodule',
					required: false
				},
				{
					lable: '应用范围',
					type: 'select',
					code: 'appscope',
					required: false,
					options: [
						{
							value: 0,
							text: '全局'
						},
						{
							value: 1,
							text: '集团'
						}
					]
				},
				{
					lable: '组织类型',
					type: 'select',
					code: 'orgtypecode',
					required: false,
					options: []
				},
				{
					lable: '多语字段',
					type: 'input',
					code: 'resid',
					required: false
				},
				{
					lable: '是否支持开关帐设置',
					type: 'checkbox',
					code: 'supportcloseaccbook',
					required: false
				},
				{
					lable: '是否发送会计平台',
					type: 'checkbox',
					code: 'isaccount',
					required: false
				}
			]
		};
	}
	/**
	 * 创建dom
	 * @param {Object} nodeData 
	 */
	getFields(nodeData) {
		const children = [];
		let { DOMDATA } = this.state;
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
	 */
	createOption = (options) => {
		return options.map((item, index) => {
			return <Option value={item.value}>{item.text}</Option>;
		});
	};
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
	 * 创建dom
	 */
	createDom = (itemInfo, nodeData) => {
		const { getFieldDecorator } = this.props.form;
		const { isEdit } = this.props.billStatus;
		let { lable, type, code, required } = itemInfo;
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
			case 'checkbox':
				return (
					<FormItem>
						{getFieldDecorator(code, {
							valuePropName: 'checked',
							initialValue: nodeData[code]
						})(<Checkbox disabled={!isEdit}>{lable}</Checkbox>)}
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
	componentDidMount() {
		this.props.getFromDataFunc(this.getFromData);
		this.getOptionsData('orgtypecode');
	}

	render() {
		return (
			<Form className='from-card'>
				<Row gutter={24}>{this.getFields(this.props.nodeData)}</Row>
			</Form>
		);
	}
}
ModuleFromCard = Form.create()(ModuleFromCard);
ModuleFromCard.PropTypes = {
	updateTreeData: PropTypes.func.isRequired,
	nodeData: PropTypes.object.isRequired,
	billStatus: PropTypes.object.isRequired,
	getFromDataFunc: PropTypes.func.isRequired
};
export default connect(
	(state) => {
		let { nodeData, updateTreeData, billStatus } = state.AppRegisterData;
		return { nodeData, updateTreeData, billStatus };
	},
	{
		getFromDataFunc
	}
)(ModuleFromCard);
