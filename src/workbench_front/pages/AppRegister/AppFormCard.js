import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Select, Checkbox, Button } from 'antd';
import _ from 'lodash';
import { getFromDataFunc } from 'Store/AppRegister/action';
import Ajax from 'Pub/js/ajax';
import AppTable from './AppTable';
import { createForm } from './CreatForm';

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
					required: true,
					check: (rule, value, callback)=>{
						if(value === this.props.parentData){
							callback('不能与父节点编码重复');
						}else{
							callback();
						}
					}
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
					lable: '应用类型',
					type: 'select',
					code: 'apptype',
					required: true,
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
					lable: '关联元数据ID',
					type: 'search',
					code: 'mdid',
					required: false,
					placeholder: '请输入元数据名称过滤',
					search: this.handleSearch,
					options: []
				},
				{
					lable: '所属集团',
					type: 'input',
					code: 'pk_group',
					required: false
				},
				{
					lable: '是否启用',
					type: 'checkbox',
					code: 'isenable',
					required: false
				},
				{
					lable: '是否加载占用',
					type: 'checkbox',
					code: 'uselicense_load',
					required: false
				},
				{
					lable: '是否CA用户可用',
					type: 'checkbox',
					code: 'iscauserusable',
					required: false
				},
				{
					lable: '默认页面',
					type: 'select',
					code: 'target_path',
					required: false,
					options: []
				},
				{
					lable: '帮助文件名',
					type: 'input',
					code: 'help_name',
					required: false
				},
				{
					lable: '应用描述',
					type: 'input',
					code: 'app_desc',
					required: false,
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
				},
			]
		};
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
		let url,data;
		if(code === 'target_path'){
			url = `/nccloud/platform/appregister/querypagesel.do`;
			data = { pk_appregister: this.props.nodeData.moduleid };
		}else{
			url = `/nccloud/platform/appregister/queryorgtype.do`;
		}
		Ajax({
			url: url,
			data: data,
			success: ({ data }) => {
				if (data.success && data.data) {
					let options;
					if(code === 'target_path'){
						options = data.data;
					}else{
						options = data.data.rows;
						options = options.map((option, i) => {
							return {
								value: option.refpk,
								text: option.refname
							};
						});
					}
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
		this.getOptionsData('orgtypecode');
		this.getOptionsData('target_path');
		this.props.getFromDataFunc(this.getFromData);
	}

	render() {
		// console.log(this.props.nodeData);
		return (
			<div>
				<Form className='from-card'>
					<Row gutter={24}>{createForm(this.state.DOMDATA, this.props)}</Row>
				</Form>
				<div style={{ 'margin-top': '16px', background: '#ffffff', padding: '10px', 'border-radius': '6px' }}>
					<AppTable />
				</div>
			</div>
		);
	}
}
AppFromCard = Form.create()(AppFromCard);
AppFromCard.PropTypes = {
	nodeData: PropTypes.object.isRequired,
	billStatus: PropTypes.object.isRequired,
	getFromDataFunc: PropTypes.func.isRequired,
	parentData: PropTypes.string.isRequired,
};
export default connect(
	(state) => {
		let { nodeData, billStatus,parentData } = state.AppRegisterData;
		return { nodeData, billStatus,parentData };
	},
	{ getFromDataFunc }
)(AppFromCard);
