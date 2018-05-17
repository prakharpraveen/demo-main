import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Form } from 'antd';
import { getFromDataFunc } from 'Store/AppRegister/action';
import { createForm } from './CreatForm';
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
					md: 24,
					lg: 24,
					xl: 12,
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
					required: true,
					md: 24,
					lg: 24,
					xl: 12
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
				<Row gutter={24}>{createForm(this.state.DOMDATA,this.props)}</Row>
			</Form>
		);
	}
}
ClassFromCard = Form.create()(ClassFromCard);
ClassFromCard.propTypes = {
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
