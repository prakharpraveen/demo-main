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
							// if (property === 'datatype') {
							// 	this.props.selectCard.dataval = "";
							// }
							this.handleSelectChange(value, 'color');
						}}
					>
						{utilService['colorObj'].map((c, index) => {
							return (
								<Option key={index} value={c.value}>
									{c.name}
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
			case 'componenttype':
				result_div = (
					<Select
						value={
							this.props.value ? this.props.value : utilService['componentTypeObj'][0].value
						}
						onChange={(value) => {
							// if (property === 'datatype') {
							// 	this.props.selectCard.dataval = "";
							// }
							this.handleSelectChange(value, 'color');
						}}
						
					>
						{utilService['componentTypeObj'].map((c, index) => {
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
			type === 'int' ? (<InputNumber defaultValue={value} min={0} max={9999} onChange={this.handleNumChange} />):
							(<Input
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
			title: '主键',
			dataIndex: 'pk_query_property',
			width: 100,
			fixed: 'left'
		},
		 {
			title: '区域ID',
			dataIndex: 'areaid',
			width: 150,
		}, 
		{
			title: '显示名称',
			dataIndex: 'label', 
			width: 150,
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
			title: '元数据',
			width: 150,
			dataIndex: 'metapath', 
			render: (text, record) => ( 
				<EditableCell
					value={text}
					onChange={this.onCellChange(record.key, 'metapath')} />
				),
			},
			
			{
				title: '组件长度',
				dataIndex: 'componentsize', 
				width: 150,
				render: (text, record) => (
					<EditableCell
						type='int'
						value={text}
						onChange={this.onCellChange(record.key, 'componentsize')}
					/>
				),
			},  
			/* 	{
				title: '组件类型',
				dataIndex: 'componenttype', 
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						type='int'
						onChange={this.onCellChange(record.key, 'componenttype')}
					/>
				),
			},  */ 
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
				title: '参照编码',
				dataIndex: 'refcode', 
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						onChange={this.onCellChange(record.key, 'refcode')}
					/>
				),
			},  
			{
				title: '下拉选项',
				dataIndex: 'options', 
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						onChange={this.onCellChange(record.key, 'options')}
					/>
				),
			},
			{
				title: '是否可见',
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
				title: '是否可修改',
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
				title: '是否必输',
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
				title: '是否可用',
				dataIndex: 'isenable',
				width: 100, 
				render: (text, record) => (
					<EditableCheck
						value={text}
						onChange={this.onCellChange(record.key, 'isenable')}
					/>
				),
			}, 
			{
				title: '必须启用',
				dataIndex: 'mustuse', 
				width: 100,
				render: (text, record) => (
					<EditableCheck
							value={text}
						onChange={this.onCellChange(record.key, 'mustuse')}
					/>
				),
			}, 
			{
				title: '是否自动检查',
				dataIndex: 'ischeck', 
				width: 100,
				render: (text, record) => (
					<EditableCheck
							value={text}
						onChange={this.onCellChange(record.key, 'ischeck')}
					/>
				),
			}, 
			{
				title: '是否使用函数',
				dataIndex: 'usefunc', 
				width: 100,
				render: (text, record) => (
					<EditableCheck
						value={text}
						onChange={this.onCellChange(record.key, 'usefunc')}
					/>
				),
			}, 
			{
				title: '精度',
				dataIndex: 'scale', 
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						onChange={this.onCellChange(record.key, 'scale')}
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
						type='int'
						onChange={this.onCellChange(record.key, 'maxlength')}
					/>
				),
			}, 
			{
				title: '单位',
				dataIndex: 'unit', 
				width: 150,
				render: (text, record) => (
					<EditableCell
							value={text}
						onChange={this.onCellChange(record.key, 'unit')}
					/>
				),
			}, 
			{
				title: '计算比率',
				dataIndex: 'ratio',
				width: 150, 
				render: (text, record) => (
					<EditableCell
							value={text}
						onChange={this.onCellChange(record.key, 'ratio')}
					/>
				),
			}, 
			{
				title: '格式化类型',
				dataIndex: 'formattype', 
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						onChange={this.onCellChange(record.key, 'formattype')}
					/>
				),
			}, 
			{
				title: '宽度',
				dataIndex: 'width', 
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
						type='int'
						onChange={this.onCellChange(record.key, 'width')}
					/>
				),
			}, 
			{
				title: '多语',
				dataIndex: 'resid', 
				width: 150,
				render: (text, record) => (
					<EditableCell
							value={text}
						onChange={this.onCellChange(record.key, 'resid')}
					/>
				),
			}, 
			{
				title: '位置',
				dataIndex: 'position', 
				width: 150,
				render: (text, record) => ( 
					<EditableCell
						value={text}
						type='int'
						onChange={this.onCellChange(record.key, 'position')}
					/>
				),
			}, 
			{
				title: '操作符',
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
			/* {
				title: '数据类型',
				dataIndex: 'datatype',
				width: 150, 
				render: (text, record) => (
					<EditableCell
						value={text}
						onChange={this.onCellChange(record.key, 'datatype')}
					/>
				),
			},  */
			{
				title: '显示类型',
				dataIndex: 'showtype', 
				width: 150,
				render: (text, record) => (
					<EditableCell
						value={text}
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
						onChange={this.onCellChange(record.key, 'returntype')}
					/>
				),
			}, 
			{
				title: '组件类型',
				dataIndex: 'componenttype',
				width: 150,
				render: (text, record) => (
					<SelectCell
						value={text}
						type='componenttype'
						onChange={this.onCellChange(record.key, 'componenttype')}
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
		console.log(dataSource,2223322)
		return (
				<Table bordered dataSource={dataSource.queryPropertyList} columns={columns} pagination={false} scroll={{ x: 4500, y:400 }} />
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