import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Select, Checkbox, Button } from 'antd';
import { getFromDataFunc } from 'Store/AppRegister/action';
const FormItem = Form.Item;
const Option = Select.Option;
class ClassFromCard extends Component {
	constructor(props, context) {
		super(props, context);
		this.state ={
			DOMDATA:[
				{
					lable: '应用编码',
					type: 'input',
					code: 'code',
					required: true,
					check:(rule, value, callback)=>{
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
					lable: '应用描述',
					type: 'input',
					code: 'app_desc',
					required: false,
					md: 24,
					lg: 24,
					xl: 12
				},
				{
					lable: '帮助文件名',
					type: 'input',
					code: 'help_name',
					required: false,
					md: 24,
					lg: 24,
					xl: 12
				}
			]
		}
	}
	// To generate mock Form.Item
	getFields(nodeData) {
		const children = [];
		let {DOMDATA} = this.state;
		DOMDATA.map((item, index) => {
			let { lable, md = 24, lg = 12, xl = 12 } = item;
			children.push(
				<Col md={md} lg={lg} xl={xl} key={index}>
					{this.createDom(item, nodeData)}
				</Col>
			);
		});
		return children;
	}
	createDom = (itemInfo, nodeData) => {
		const { getFieldDecorator } = this.props.form;
		const { isEdit } = this.props.billStatus;
		let { lable, type, code, required,check } = itemInfo;
		switch (type) {
			case 'select':
				return isEdit ? (
					<FormItem label={lable} hasFeedback>
						{getFieldDecorator(code, {
							initialValue: nodeData[code],
							rules: [ { required: required, message: `请选择${lable}` } ]
						})(
							<Select placeholder={`请选择${lable}`}>
								<Option value='0'>全局</Option>
								<Option value='1'>集团</Option>
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
			default:
				return isEdit ? (
					<FormItem label={lable}>
						{getFieldDecorator(code, {
							initialValue: nodeData[code],
							rules: [
								{
									required: required,
									message: `请输入${lable}`
								},{
									validator: check?check:null,
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
	}

	render() {
		return (
			<Form className='from-card'>
				<Row gutter={24}>{this.getFields(this.props.nodeData)}</Row>
			</Form>
		);
	}
}
ClassFromCard = Form.create()(ClassFromCard);
ClassFromCard.PropTypes = {
	updateTreeData: PropTypes.func.isRequired,
	nodeData: PropTypes.object.isRequired,
	billStatus: PropTypes.object.isRequired,
	getFromDataFunc: PropTypes.func.isRequired,
	parentData:PropTypes.string.isRequired,
};
export default connect(
	(state) => {
		let { nodeData, updateTreeData, billStatus,parentData } = state.AppRegisterData;
		return { nodeData, updateTreeData, billStatus,parentData };
	},
	{ getFromDataFunc }
)(ClassFromCard);
