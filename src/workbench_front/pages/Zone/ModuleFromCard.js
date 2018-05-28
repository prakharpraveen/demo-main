import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Form } from 'antd';
import { setZoneData,setZoneDataFun} from 'Store/Zone/action';
import Ajax from 'Pub/js/ajax';
import { createForm } from './CreatForm';

class ModuleFromCard extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			DOMDATA: [
				{
					lable: '模板编码',
					type: 'input',
					code: 'code',
					required: true,
				},
				{
					lable: '模板名称',
					type: 'input',
					code: 'name',
					required: true,
				},
				{
					lable: '模板描述',
					type: 'input',
					code: 'templetdesc',
					required: false
				}
			]
		};
	}
	/**
	 * 传递 表单的值  
	 */
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
		this.props.setZoneDataFun(this.getFromData);
	}

	render() {
		return (
			<Form className='from-card'>
				<Row  gutter={24}>{createForm(this.state.DOMDATA, this.props)}</Row>
			</Form>
		);
	}
}
ModuleFromCard = Form.create()(ModuleFromCard); // 必须要包装才能用form的方法 
ModuleFromCard.PropTypes = {
	zoneArr: PropTypes.object.isRequired,
	zoneDatas: PropTypes.object.isRequired,
	zoneFormData: PropTypes.object.isRequired,
	setZoneDataFun: PropTypes.func.isRequired,
};
export default connect(
	(state) => {
		let { zoneDatas, zoneFormData } = state.zoneRegisterData;
		return { zoneDatas, zoneFormData };
	},
	{
		setZoneDataFun
	}
)(ModuleFromCard);
