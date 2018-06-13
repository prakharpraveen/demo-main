import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Input, Icon, Button, InputNumber, Select, Form, Switch } from 'antd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import _ from 'lodash'; 
import Notice from 'Components/Notice';
import * as utilService from './utilService';
const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 按钮类型选择
 * @param {String} value 
 */
const switchType = (value) => {
	switch (value) {
		case '1':
			return '非查询区'
		case '0':
			return '查询区'
		default:
			return typeof(value ==='object')? (value.metaname): value;	
	/* 	default:
			break; */
	}
}

// 下拉组件 
class SelectCell extends React.Component {
	state = {
		value: this.props.value,
	}
	handleSelectChange = (value) => {
		this.setState({ value }, () => { this.props.onChange(value) });
	}
	render() {
		const { value } = this.state;
		const { type } = this.props;
		let result_div;
		switch (type) {
			case 'color':
				result_div = (
					<Select
						value={
							this.props.value ? this.props.value : utilService['colorObj'][0].value
						}
						onChange={(value) => {
							this.handleSelectChange(value, 'color');
						}}

					>
						{utilService['colorObj'].map((c, index) => {
							return (
								<Option key={index} value={c.value}>
									<span className="template-setting-color-select">
										<span>{c.name}</span>
										<span className="color-select-color" style={{ backgroundColor: c.value }}>
										</span>
									</span>
								</Option>
							);
						})}
					</Select>
				);
				break;
			case 'defaultvar':
				result_div = (
					<Select
						value={
							this.props.value ? this.props.value : utilService['defaultvarObj'][0].value
						}
						onChange={(value) => {
							// if (property === 'datatype') {
							// 	this.props.selectCard.dataval = "";
							// }
							this.handleSelectChange(value);
						}}

					>
						{utilService['defaultvarObj'].map((c, index) => {
							return (
								<Option key={index} value={c.value}>
									{c.name}
								</Option>
							);
						})}
					</Select>
				);
				break;
			case 'width':
				result_div = (
					<Select
						value={
							this.props.value ? this.props.value : utilService['componentWidthObj'][0].value
						}
						onChange={(value) => {
							// if (property === 'datatype') {
							// 	this.props.selectCard.dataval = "";
							// }
							this.handleSelectChange(value);
						}}

					>
						{utilService['componentWidthObj'].map((c, index) => {
							return (
								<Option key={index} value={c.value}>
									{c.name}
								</Option>
							);
						})}
					</Select>
				);
				break;

			default:
				break;
		}
		return (
			result_div
		);
	}
}

// 可编辑表格复选框
class EditableCheck extends React.Component {
	state = {
		value: this.props.value,
	}
	handleChange = (value) => {
		this.setState({ value }, () => { this.props.onChange(value) });
	}
	render() {
		const { value } = this.state;
		return (
			<div className="editable-cell">
				<div className="editable-cell-input-wrapper">
					<Switch defaultChecked={value} onChange={this.handleChange}></Switch>
				</div>
			</div>
		);
	}
}


// 可编辑表格input  
class EditableCell extends React.Component {
	state = {
		value: this.props.value,
	}
	handleChange = (e) => {
		const value = e.target.value;
		this.setState({ value },()=>{this.props.onChange(value)});
	}
	handleNumChange = (value) =>{
		this.setState({ value }, () => { this.props.onChange(value) });
	}
	render() {
		const { value } = this.state;
		const {type} = this.props;
		return (
			type === 'int' ? (<InputNumber size='small'  defaultValue={value} min={0} max={9999} onChange={this.handleNumChange} />):
							(<Input
								size='small'
								value={value}
								onChange = {this.handleChange}
							/>)	
		);
	}
}


// 可编辑的表格 
class BatchSearchTable extends React.Component {
	constructor(props) {
		super(props);
		let { areaList, areaIndex, areatype}  = this.props;
		this.state = {
			dataSource: areaList[areaIndex],
			areatype
		};
		this.columns = [
			{
				title: '序号',
				dataIndex: 'num',
				width: 50,
				fixed: 'left'
			},
			{
			title: '显示名称',
			dataIndex: 'label', 
			width: 150,
			fixed: 'left',
			render: (text, record) => (
				<EditableCell
					value={text}
					onChange={this.onCellChange(record.key, 'label')} />
				),
			},
			{
			title: '编码',
			dataIndex: 'code', 
			width: 150,
			render: (text, record) => (
				<EditableCell
					value={text}
					onChange={this.onCellChange(record.key, 'code')} />
				),
			},
			{
			title: '组件长度',
			width: 150,
			dataIndex: 'width', 
			render: (text, record) => {
					if (this.state.areatype==='2') {
						return (
							<EditableCell
								value={text}
								onChange={this.onCellChange(record.key, 'width')} />
						) }
					return (
					<SelectCell
						value={text}
						type='width'
						onChange={this.onCellChange(record.key, 'width')}
					/>)
					},
			},
			
			{
				title: '可修订',
				dataIndex: 'isrevise', 
				width: 150,
				render: (text, record) => (
					<EditableCheck
						value={text}
						onChange={this.onCellChange(record.key, 'isrevise')}
					/>
				),
			},  
			{
				title: '合计',
				dataIndex: 'istotal',
				width: 150,
				render: (text, record) => (
					<EditableCheck
						value={text}
						onChange={this.onCellChange(record.key, 'istotal')}
					/>
				),
			}, 
			{
				title: '必输项',
				dataIndex: 'required',
				width: 150,
				render: (text, record) => (
					<EditableCheck
						value={text}
						onChange={this.onCellChange(record.key, 'required')}
					/>
				),
			}, 
			{
				title: '可修改',
				dataIndex: 'disabled', 
				width: 150,
				render: (text, record) => (
					<EditableCheck
						value={text}
						onChange={this.onCellChange(record.key, 'disabled')}
					/>
				),
			},  
			{
				title: '可见',
				dataIndex: 'visible',
				width: 150,
				render: (text, record) => (
					<EditableCheck
						value={text}
						onChange={this.onCellChange(record.key, 'visible')}
					/>
				),
			},  
			{
				title: '最大长度',
				dataIndex: 'maxlength', 
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						onChange={this.onCellChange(record.key, 'maxlength')}
					/>
				),
			},  
			{
				title: '多行文本显示行数',
				dataIndex: 'textrows',
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						onChange={this.onCellChange(record.key, 'textrows')}
					/>
				),
			}, 
			{
				title: '左空白',
				dataIndex: 'leftspace', 
				width: 150,
				render: (text, record) => (
					<EditableCell
							value={text}
						onChange={this.onCellChange(record.key, 'leftspace')}
					/>
				),
			},  
			{
				title: '右空白',
				dataIndex: 'rightspace', 
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						onChange={this.onCellChange(record.key, 'rightspace')}
					/>
				),
			},  
			{
				title: '颜色',
				dataIndex: 'color',
				width: 150, 
				render: (text, record) => (
					<SelectCell
						value={text}
						type='color'
						onChange={this.onCellChange(record.key, 'color')}
					/>
				),
			},  
			{
				title: '默认系统变量',
				dataIndex: 'defaultvar',
				width: 150,
				render: (text, record) => {
					if (record.datatype==='204') {
						return (
							<SelectCell
								value={text}
								type='defaultvar'
								onChange={this.onCellChange(record.key, 'defaultvar')}
							/>
						) }
					},
			},  
			{
				title: '自定义项1',
				dataIndex: 'define1',
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						onChange={this.onCellChange(record.key, 'define1')}
					/>
				),
			},
			{
				title: '自定义项2',
				dataIndex: 'define2',
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						onChange={this.onCellChange(record.key, 'define2')}
					/>
				),
			},
			{
				title: '自定义项3',
				dataIndex: 'define3',
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						onChange={this.onCellChange(record.key, 'define3')}
					/>
				),
			}
			];
	}
   shouldComponentUpdate(nextProps,nextState){
      if(_.isEqual(nextState.dataSource , this.state.dataSource)){
        return false
	  }
	  return true;
  }
    // 闭包 只对具体的单元格修改 
	onCellChange = (key, dataIndex) => {
		return (value) => {
			const dataSource = _.cloneDeep(this.state.dataSource);
			const target = dataSource.queryPropertyList.find(item => item.key === key);
			if (target) {
				target[dataIndex] = value
				this.setState({ dataSource }, () => { this.props.setNewList(this.state.dataSource)});
			}
		};
	}

	render() {
		let { dataSource } = this.state;
		dataSource && dataSource.queryPropertyList.map((v, i) =>{ v.num = i+1; v.key=i})
		const columns = this.columns;
		return (
			<Table bordered dataSource={dataSource.queryPropertyList} columns={columns} pagination={false} scroll={{ x: 2600, y: 400 }} />
		);
	}
}

BatchSearchTable.propTypes = {
//	zoneDatas: PropTypes.object.isRequired,
};

export default connect((state) => ({ 
    areaList: state.zoneSettingData.areaList,
}), {
   // updateAreaList,
	})(BatchSearchTable);