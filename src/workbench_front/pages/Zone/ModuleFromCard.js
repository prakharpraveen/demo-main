import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Form, Select } from 'antd';
import { setZoneData, setZoneDataFun } from 'Store/Zone/action';
import Ajax from 'Pub/js/ajax';
import { createForm } from './CreatForm';
const Option = Select.Option;

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
					lable: '多语字段',
					type: 'input',
					code: 'resid',
					//required: true,
				},
				{
					lable: '模板描述',
					type: 'input',
					code: 'templetdesc',
					required: false
				},
				{
					lable: '聚合类',
					type: 'input',
					code: 'clazz',
					required: false
				},
				{
					lable: '设置表头',
					type: 'select',
					code: 'headcode',
					options: [],
					required: true
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

	/**
	 * @param {*} DOMDATA
	 * 添加表头
	*/
	getFormItem = (DOMDATA) => {
		let { newListData } = this.props,
			form = [], table = [];
		newListData && newListData.map((v, i) => {
			if (v.areatype === '1') {
				form.push(v);
			} else if (v.areatype === '2') {
				table.push(v)
			}
		});

		// 过滤掉表头列
		if (!form.length || !table.length) {
			DOMDATA = DOMDATA && DOMDATA.filter((v, i) => v.code !=='headcode');

		}

		else if (form.length && table.length) {
			let item = DOMDATA.find(item => item.code === 'headcode');
			if (item) {
				item.options = creatOption();
			}
		}
		function creatOption() {
			let newArray = newListData && newListData.filter((v, i) => {
				return v.areatype === '1'
			})
			return (newArray && newArray.map((item, i) => {
				return (
					<Option key={item.code} value={item.code}>
						{item.name}
					</Option>
				);
			}))
		}
		return DOMDATA;
	}
	render() {

		let { DOMDATA } = this.state;
		DOMDATA = this.getFormItem(DOMDATA);
		return (
			<Form className='from-card'>
				<Row gutter={24}>{createForm(DOMDATA, this.props)}</Row>
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
		let { zoneDatas, zoneFormData, newListData } = state.zoneRegisterData;
		return { zoneDatas, zoneFormData, newListData };
	},
	{
		setZoneDataFun
	}
)(ModuleFromCard);
