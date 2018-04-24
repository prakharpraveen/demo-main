import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Select, Checkbox, Button } from 'antd';
import { getFromDataFunc } from 'Store/AppRegister/action';
const FormItem = Form.Item;
const Option = Select.Option;
const DOMDATA = [
	{
		lable: '应用编码',
		type: 'input',
		code: 'code'
	},
	{
		lable: '应用名称',
		type: 'input',
		code: 'name'
	},
	{
		lable: '应用描述',
		type: 'input',
		code: 'app_desc',
		md: 24,
		lg: 24,
		xl: 12
	},
	{
		lable: '帮助文件名',
		type: 'input',
		code: 'help_name',
		md: 24,
		lg: 24,
		xl: 12
	}
];
class ClassFromCard extends Component {
	constructor(props, context) {
		super(props, context);
	}
	// To generate mock Form.Item
	getFields(nodeData) {
		const children = [];
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
		let { lable, type, code } = itemInfo;
		switch (type) {
			case 'select':
				return isEdit ? (
					<FormItem label={lable} hasFeedback>
						{getFieldDecorator(code, {
							initialValue: nodeData[code],
							rules: [ { required: true, message: 'Please select your country!' } ]
						})(
							<Select placeholder='Please select a country'>
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
									required: true,
									message: 'Input something!'
								}
							]
						})(<Input placeholder='placeholder' />)}
					</FormItem>
				) : (
					<FormItem label={lable}>
						<span className='ant-form-text'>{nodeData[code]}</span>
					</FormItem>
				);
		}
	};
	getFromData = () => {
		const { getFieldsValue } = this.props.form;
		return getFieldsValue();
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
	getFromDataFunc: PropTypes.func.isRequired
};
export default connect(
	(state) => {
		let { nodeData, updateTreeData, billStatus } = state.AppRegisterData;
		return { nodeData, updateTreeData, billStatus };
	},
	{ getFromDataFunc }
)(ClassFromCard);
