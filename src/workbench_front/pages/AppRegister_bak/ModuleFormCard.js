import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Form } from 'antd';
import { updateTreeData, getFromDataFunc } from 'Store/AppRegister_bak/action';
import Ajax from 'Pub/js/ajax';
import { createForm } from './CreatForm';
class ModuleFromCard extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			DOMDATA: [
				{
					lable: '模块编码',
					type: 'input',
					code: 'systypecode',
					required: true,
				},
				{
					lable: '模块号',
					type: 'input',
					code: 'moduleid',
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
							value: '0',
							text: '全局'
						},
						{
							value: '1',
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
	 * 获取组织类型 下拉数据
	 * @param {String} code 
	 */
	getOptionsData = (code) => {
		let { DOMDATA } = this.state;
		Ajax({
			url: `/nccloud/platform/appregister/queryorgtype.do`,
			info : {
				name:'组织类型',
				action:'查询'
			},
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
				<Row gutter={24}>{createForm(this.state.DOMDATA,this.props)}</Row>
			</Form>
		);
	}
}
ModuleFromCard = Form.create()(ModuleFromCard);
ModuleFromCard.propTypes = {
	updateTreeData: PropTypes.func.isRequired,
	nodeData: PropTypes.object.isRequired,
	billStatus: PropTypes.object.isRequired,
	getFromDataFunc: PropTypes.func.isRequired,
	parentData: PropTypes.string.isRequired
};
export default connect(
	(state) => {
		let { nodeData, updateTreeData, billStatus,parentData } = state.AppRegister_bakData;
		return { nodeData, updateTreeData, billStatus,parentData };
	},
	{
		getFromDataFunc
	}
)(ModuleFromCard);
