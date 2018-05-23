import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Form } from 'antd';
import { updateTreeData, getFromDataFunc } from 'Store/AppRegister/action';
import { setZoneData} from 'Store/ZoneSetting/action';
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
					// check: (rule, value, callback) => {
					// 	if (value === this.props.parentData) {
					// 		callback('不能与父节点编码重复');
					// 	} else {
					// 		callback();
					// 	}
					// }
				},
				{
					lable: '模板描述',
					type: 'input',
					code: 'description',
					required: false
				}
			]
		};
	}
	/**
	 * 获取组织类型 下拉数据
	 * @param {String} code 
	 */
	/* getFromData = () => {
		const { getFieldsValue, validateFields } = this.props.form;
		let flag = false;
		validateFields((err, values) => {
			if (!err) {
				flag = true;
			}
		});
		return flag ? getFieldsValue() : null;
	}; */
	componentDidMount() {
		this.props.getFromDataFunc(this.getFromData);
	//	this.getOptionsData('orgtypecode');
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
	updateTreeData: PropTypes.func.isRequired,
	nodeData: PropTypes.object.isRequired,
	billStatus: PropTypes.object.isRequired,
	getFromDataFunc: PropTypes.func.isRequired,
	parentData: PropTypes.string.isRequired
};
export default connect(
	(state) => {
		let { zoneArr} = state.zoneSettingData.zoneArray;
		let { zoneDatas } = state.zoneRegisterData;
		//let { nodeData, updateTreeData, billStatus, parentData } = state.AppRegisterData;
		return { zoneArr, zoneDatas };
	},
	{
		getFromDataFunc
	}
)(ModuleFromCard);
