import React, { Component } from 'react';
import { Button } from 'antd';
import ComLayout from './ComLayout';
import FormContent from './FormCreate';
class DefaultSetting extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.getFormDataFun1;
		this.getFormDataFun2;
		this.setFormDataFun1;
		this.setFormDataFun2;
		this.defaultForm = [
			{
				placeholder: '单选树表',
				refName: '交易类型',
				refCode: 'cont',
				refType: 'gridTree',
				queryTreeUrl: '/nccloud/reva/ref/materialclass.do',
				queryGridUrl: '/nccloud/reva/ref/material.do',
				onChange: (val) => {
					console.log(val);
					// this.setFieldsValue({ cont: val });
				},
				columnConfig: [
					{
						name: [ '编码', '名称' ],
						code: [ 'refcode', 'refname' ]
					}
				],
				isMultiSelectedEnabled: false
			}
		];
		this.defaultLang = [
			{
				placeholder: '多选树表',
				refName: '交易类型',
				refCode: 'cont1',
				refType: 'gridTree',
				queryTreeUrl: '/nccloud/reva/ref/materialclass.do',
				queryGridUrl: '/nccloud/reva/ref/material.do',
				onChange: (val) => {
					console.log(val);
					// this.setFieldsValue({ cont1: val });
				},
				columnConfig: [
					{
						name: [ '编码', '名称' ],
						code: [ 'refcode', 'refname' ]
					}
				],
				isMultiSelectedEnabled: false
			}
		];
	}
	getFormData1 = (fun) => {
		if (typeof fun === 'function') {
			this.getFormDataFun1 = fun;
		} else {
			return this.getFormDataFun1();
		}
	};
	getFormData2 = (fun) => {
		if (typeof fun === 'function') {
			this.getFormDataFun2 = fun;
		} else {
			return this.getFormDataFun2();
		}
	};
	setFormData1 = (fun) => {
		if (typeof fun === 'function') {
			this.setFormDataFun1 = fun;
		} else {
			this.setFormDataFun1(fun);
		}
	};
	setFormData2 = (fun) => {
		if (typeof fun === 'function') {
			this.setFormDataFun2 = fun;
		} else {
			this.setFormDataFun2(fun);
		}
	};
	getAllFormData = () => {
		let formData1 = this.getFormData1();
		let formData2 = this.getFormData2();
		console.log(formData1, formData2);
	};
	componentDidMount = () => {
		this.setFormData1({
			cont: { refpk: '12323', refCode: 'con', value: '123' }
		});
		this.setFormData2({
			cont1: { refpk: '12323', refCode: 'con1', value: '123' }
		});
	};

	render() {
		return (
			<ComLayout className="defaultSetting" title={this.props.title}>
				<div className="default-title">默认设置</div>
				<div className="dafault-form">
					<FormContent
						formData={this.defaultForm}
						getFormData={this.getFormData1}
						setFormData={this.setFormData1}
					/>
				</div>
				<div className="default-title">默认语言格式</div>
				<div className="dafault-form">
					<FormContent
						formData={this.defaultLang}
						getFormData={this.getFormData2}
						setFormData={this.setFormData2}
					/>
				</div>
				<div className="default-footer">
					<Button type="primary" onClick={this.getAllFormData}>
						应用
					</Button>
				</div>
			</ComLayout>
		);
	}
}
export default DefaultSetting;
