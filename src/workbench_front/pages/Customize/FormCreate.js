import React, { Component } from 'react';
import { Form, Row, Col } from 'antd';
import { high } from 'nc-lightapp-front';
import 'nc-lightapp-front/dist/platform/nc-lightapp-front/index.css';
const { Refer } = high;
const FormItem = Form.Item;
class FormCreate extends Component {
	constructor(props) {
		super(props);
	}
	/**
     * 创建表单项
     */
	createFormItem() {
		const { getFieldDecorator } = this.props.form;
		let children = this.props.formData.map((item, index) => {
			let { refName, refCode, value } = item;
			return (
				<Col xs={24} md={12} lg={12} key={refCode}>
					<FormItem className="form-item" label={refName}>
						{getFieldDecorator(refCode, {
							initialValue: {},
							rules: [
								{
									required: false,
									message: ''
								},
								{
									type: 'object',
									validator: null
								}
							]
						})(<Refer {...item} />)}
					</FormItem>
				</Col>
			);
		});
		return children;
	}
	/**
     * 设置表单数据
     * @param {Object} objValue 对象
     */
	getFormData = () => {
		const { getFieldsValue } = this.props.form;
		return getFieldsValue();
	};
	/**
     * 设置表单数据
     * @param {Object} objValue 对象
     */
	setFormData = (objValue) => {
		const { setFieldsValue } = this.props.form;
		setFieldsValue(objValue);
	};
	componentDidMount = () => {
		this.props.getFormData(this.getFormData);
		this.props.setFormData(this.setFormData);
	};

	render() {
		return (
			<Form layout="inline">
				<Row>{this.createFormItem()}</Row>
			</Form>
		);
	}
}
const FormContent = Form.create()(FormCreate);
export default FormContent;
