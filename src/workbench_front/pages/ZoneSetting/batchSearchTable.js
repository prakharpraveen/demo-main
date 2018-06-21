import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Input, Icon, Button, InputNumber, Select,Form,Switch} from 'antd';
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
									{c.name}
									<span className="color-select-color" style={{ backgroundColor: c.value }}/>
								</Option>
							);
						})}
					</Select>
				);
				break;
			case 'datatype':
				result_div = (
					<Select
						value={
							this.props.value ? this.props.value : utilService['dataTypeObj'][0].value
						}
						onChange={(value) => {
							// if (property === 'datatype') {
							// 	this.props.selectCard.dataval = "";
							// }
							this.handleSelectChange(value);
						}}
					
					>
						{utilService['dataTypeObj'].map((c, index) => {
							return (
								<Option key={index} value={c.value}>
									{c.name}
								</Option>
							);
						})}
					</Select>
				);
				break;
			case 'showtype':
				result_div = (
					<Select
						value={
							this.props.value ? this.props.value : utilService['showAndReturnType'][0].value
						}
						onChange={(value) => {
							// if (property === 'datatype') {
							// 	this.props.selectCard.dataval = "";
							// }
							this.handleSelectChange(value);
						}}
						
					>
						{utilService['showAndReturnType'].map((c, index) => {
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
			type === 'int' ? (<InputNumber size='small' defaultValue={value} min={0} max={9999} onChange={this.handleNumChange} />):
							(<Input
								size = 'small'
								value={value}
								onChange = {this.handleChange}
							/>)	
		);
	}
}

// 可编辑表格复选框
class EditableCheck extends React.Component {
	state = {
		value: this.props.value,
	}
	handleChange = (value) => {
		this.setState({ value },()=>{this.props.onChange(value)});
	}
	render() {
		const { value } = this.state;
		return (
			<div className="editable-cell">
				<div className="editable-cell-input-wrapper">
					<Switch defaultChecked={value}  onChange={this.handleChange}></Switch>
		    	</div>
			</div>
		);
	}
}

// 可编辑的表格 
class BatchSearchTable extends React.Component {
	constructor(props) {
		super(props);
		let {areaList, areaIndex}  = this.props;
		this.state = {
			dataSource: areaList[areaIndex],
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
				title: '操作符编码',
				dataIndex: 'opersign',
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						onChange={this.onCellChange(record.key, 'opersign')}
					/>
				),
			}, 
			{
				title: '操作符名称',
				dataIndex: 'opersignname',
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						onChange={this.onCellChange(record.key, 'opersignname')}
					/>
				),
			}, 
			{
				title: '默认取值',
				dataIndex: 'defaultvalue',
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						onChange={this.onCellChange(record.key, 'defaultvalue')}
					/>
				),
			}, 
			{
				title: '固定条件',
				dataIndex: 'isfixedcondition',
				width: 150,
				render: (text, record) => (
					<EditableCheck
						value={text}
						onChange={this.onCellChange(record.key, 'isfixedcondition')}
					/>
				),
			}, 
			{
				title: '必输条件',
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
				title: '查询条件',
				dataIndex: 'isquerycondition',
				width: 150,
				render: (text, record) => (
					<EditableCheck
						value={text}
						onChange={this.onCellChange(record.key, 'isquerycondition')}
					/>
				),
			}, 
			{
				title: '数据类型',
				dataIndex: 'datatype',
				width: 150,
				render: (text, record) => (
					<SelectCell
						value={text}
						type='datatype'
						onChange={this.onCellChange(record.key, 'datatype')}
					/>
				),
			}, 
			{
				title: '参照名称',
				dataIndex: 'refname',
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						onChange={this.onCellChange(record.key, 'refname')}
					/>
				),
			}, 
			{
				title: '参照是否包含下级',
				dataIndex: 'containlower',
				width: 200,
				render: (text, record) => (
					<EditableCheck
						value={text}
						onChange={this.onCellChange(record.key, 'containlower')}
					/>
				),
			}, 
			{
				title: '参照是否自动检查',
				dataIndex: 'ischeck',
				width: 200,
				render: (text, record) => (
					<EditableCheck
						value={text}
						onChange={this.onCellChange(record.key, 'ischeck')}
					/>
				),
			}, 
			{
				title: '参照是否跨集团',
				dataIndex: 'isbeyondorg',
				width: 200,
				render: (text, record) => (
					<EditableCheck
						value={text}
						onChange={this.onCellChange(record.key, 'isbeyondorg')}
					/>
				),
			}, 
			{
				title: '是否使用系统函数',
				dataIndex: 'usefunc',
				width: 200,
				render: (text, record) => (
					<EditableCheck
						value={text}
						onChange={this.onCellChange(record.key, 'usefunc')}
					/>
				),
			}, 
			{
				title: '显示类型 ',
				dataIndex: 'showtype',
				width: 150,
				render: (text, record) => (
					<SelectCell
						value={text}
						type='showtype'
						onChange={this.onCellChange(record.key, 'showtype')}
					/>
				),
			}, 
			{
				title: '返回类型',
				dataIndex: 'returntype',
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						type='showtype'
						onChange={this.onCellChange(record.key, 'returntype')}
					/>
				),
			},
			{
				title: '元数据属性',
				dataIndex: 'metadataproperty',
				width: 150,
				render: (text, record) => {
					if (!record.metapath) {
						return (
							<EditableCell
								value={text}
								onChange={this.onCellChange(record.key, 'metadataproperty')}
							/>
						)
					}
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
			},
			{
				title: '自定义项4',
				dataIndex: 'define4',
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						onChange={this.onCellChange(record.key, 'define4')}
					/>
				),
			},
			{
				title: '自定义项5',
				dataIndex: 'define5',
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						onChange={this.onCellChange(record.key, 'define5')}
					/>
				),
			}];
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
				<Table bordered dataSource={dataSource.queryPropertyList} columns={columns} pagination={false} scroll={{ x: 3800, y:400 }} />
		);
	}
}


export default connect((state) => ({ 
    areaList: state.zoneSettingData.areaList,
}), {
   // updateAreaList,
	})(BatchSearchTable);