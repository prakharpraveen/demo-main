import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Input, Icon, Button, Popconfirm, Select} from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import _ from 'lodash'; 
import {setNewList } from 'Store/Zone/action'; 
import Ajax from 'Pub/js/ajax';
import MdDefaultClassEntityRef from "Components/Refers/mdMainEntityRef";
import Notice from 'Components/Notice';
 import { high } from 'nc-lightapp-front';
import 'nc-lightapp-front/dist/platform/nc-lightapp-front/index.css';
const { Refer } = high;
const Option = Select.Option;

/**
 * 按钮类型选择
 * @param {String} value 
 */
const switchType = (value) => {
	switch (value) {
		case '2':
			return '表格区'
		case '1':
			return '表单区'
		case '0':
			return '查询区'
		default:
			return typeof(value ==='object')? (value.metaname): value;	
	}
}

// 可编辑表格一个单项 
class EditableCell extends React.Component {
	state = {
		value: this.props.value,
		editable: false,
	}
	handleChange = (e) => {
		const value = e.target.value;
		this.setState({ value });
	}
	check = () => {
		this.setState({ editable: false });
		if (this.props.onChange) {
			this.props.onChange(this.state.value);
		}
	}
	edit = () => {
		if (!this.state.editable) {
			this.setState({ editable: true },()=>{
				this.refs.myInput.focus()});
		}
	}
	render() {
		const { value, editable } = this.state;
		return (
			<div className="editable-cell" onClick ={this.edit}>
				{
					editable ?
						<div className="editable-cell-input-wrapper">
							<Input
								value={value}
								onChange={this.handleChange}
								onPressEnter={this.check}
								onBlur={this.check}
								ref='myInput'
							/>
							
						</div>
						:
						<div className="editable-cell-text-wrapper">
							{value || ' '}
							<Icon
								type="edit"
								className="editable-cell-icon"
								onClick={this.edit}
							/>
						</div>
				}
			</div>
		);
	}
}

// 可编辑表格下拉框 
class EditableSelect extends React.Component {
	state = {
		value: this.props.value,
		editable: false,
	}
	handleChange = (value) => {
		this.setState({ value },()=>{this.check()});
	}
	check = () => { 
		this.setState({ editable: false });
		if (this.props.onChange) {
			this.props.onChange(this.state.value);
		}
	}
	edit = () => {
		if (!this.state.editable){
			this.setState({ editable: true });
		}
	}
	render() {
		const { value, editable } = this.state;
		return (
			<div className="editable-cell" onClick={this.edit}>
				{
					editable ?
						<div className="editable-cell-input-wrapper">
							<Select showSearch optionFilterProp="children" value={value} style={{ width: 120 }} onChange={(selected) =>this.handleChange(selected)} filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
								<Option value={'0'}>查询区</Option>
								<Option value={'1'}>表单区</Option>
								<Option value={'2'}>表格区</Option>
							</Select>
							{/* <Icon
								type="check"
								className="editable-cell-icon-check"
								onClick={this.check}
							/> */}
						</div>
						:
						<div className="editable-cell-text-wrapper">
							{(switchType(value)) || ' '}
							<Icon
								type="edit"
								className="editable-cell-icon"
								onClick={this.edit}
							/>
						</div>
				}
			</div>
		);
	}
}

// 可编辑表格参照
class EditableRefer extends React.Component {
	state = {
		value: this.props.value,
		editable: false,
		metaObj: { refcode: this.props.value.refcode, refname: this.props.value.metaname, refpk: this.props.value.metaid}
	}
	
	// 组件更新  obj[type]["refname"] = refname;
	componentWillReceiveProps(nextProps) {
			this.setState({
				value: nextProps.value,
				metaObj: { refcode: nextProps.value.refcode,refname: nextProps.value.metaname, refpk: nextProps.value.metaid }
			})
	}

	check = () => {
		this.setState({ editable: false });
		if (this.props.onChange) {
			this.props.onChange(this.state.metaObj);
		}
	}
	edit = () => {
		if (!this.state.editable) {
			this.setState({ editable: true });
		}
	}
	render() {
		const { value, editable } = this.state;
		return (
			<div className="editable-cell" onClick={this.edit}>
				{
					editable ?
						<div className="editable-cell-input-wrapper">
							<MdDefaultClassEntityRef
								value={this.state.metaObj}
								placeholder={"关联元数据"}
								onChange={(val) => {
									this.setState({
										metaObj: val
									}, () => { this.check() });
								}}    
							/>
						</div>
						:
						<div className="editable-cell-text-wrapper">
							{(switchType(value)) || ' '}
							<Icon
								type="edit"
								className="editable-cell-icon"
								onClick={this.edit}
							/>
						</div>
				}
			</div>
		);
	}
}

// 可编辑的表格 
class ZoneTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			count: null,
		};
		this.columns = [
			{
				title: '序号',
				dataIndex: 'num',
				width: '10%',
			},
			{
			title: '区域编码',
			dataIndex: 'code',
			width: '20%',
			render: (text, record) => (
				<EditableCell
					value={text}
					onChange={this.onCellChange(record.key, 'code')}
				/>
			),
		}, {
			title: '区域名称',
			dataIndex: 'name',
			width: '20%',
			render: (text, record) => (
				<EditableCell
					value={text}
					onChange={this.onCellChange(record.key, 'name')}
					/>
				),
		}, {
			title: '区域类型',
			dataIndex: 'areatype', 
			width: '20%',
			render: (text, record) => {
				if (record.pk_area){
					return (<span>{switchType(text)}</span>)
				}
				return(<EditableSelect
					value={text}
					onChange={this.onCellChange(record.key, 'areatype')}
				/>)
			},
			},
			{
				title: '关联元数据',
				dataIndex: 'metaname', 
				width: '20%',
				render: (text, record) => {
					if(record.pk_area) {
						return (<span>{switchType(record)}</span>)
				}
				return(<EditableRefer
						value={record}
						onChange={this.onCellChange(record.key, 'metaname')}
					/>)
				},
			},  
			{
			title: '操作',
			width: '10%',
			dataIndex: 'operation',
			render: (text, record) => {
				return (
					this.state.dataSource.length?
						(
							<Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
								<a href="javascript:;">删除</a>
							</Popconfirm>
						) : null
				);
			},
		}];
	}
	// 组件更新
	componentWillReceiveProps(nextProps) { 
		if (nextProps.zoneDatas.areaList){
			this.setState({
				dataSource: nextProps.zoneDatas.areaList.map((v, i) => { v.key = i; return v }),
				count: nextProps.zoneDatas.areaList.length,
			});
			// 设置初始 table数组 
			this.props.setNewList(nextProps.zoneDatas.areaList)
		}
	}
    // 闭包 只对具体的单元格修改 
	onCellChange = (key, dataIndex) => {
		return (value) => {
			const dataSource = [...this.state.dataSource];
			const target = dataSource.find(item => item.key === key);
			if (target) {
				if (dataIndex ==='metaname'){
					target[dataIndex] = value && value.refname;
					target['metaid'] = value && value.refpk;
					target['refcode'] = value && value.refcode;
				}else{
					target[dataIndex] = value
				}
				this.setState({ dataSource }, () => { this.props.setNewList(this.state.dataSource)});
			}
		};
	}

	onDelete = (key) => {
		const dataSource = [...this.state.dataSource];
		this.setState({ dataSource: dataSource.filter(item => item.key !== key) },
			() => { this.props.setNewList(this.state.dataSource)}
	);
	}
	handleAdd = () => {
		const { templetid } = this.props;
		const { count, dataSource } = this.state;
		const newData = {
			key: count,
			name: '',
			templetid,
			code: '',
			metaid: '',
			metaname:'',
			areatype:'1',
		};
		this.setState({
			dataSource: [...dataSource, newData],
			count: count + 1,
		}, () => { this.props.setNewList(this.state.dataSource) });
	}
	render() {
		let { dataSource } = this.state;
		dataSource && dataSource.map((v, i) =>{ v.num = i+1})
		const columns = this.columns;
		return (
			<div>
				<Button className="editable-add-btn" onClick={this.handleAdd}>新增</Button>
				<Table bordered dataSource={dataSource} columns={columns} pagination={false} />
			</div>
		);
	}
}

ZoneTable.propTypes = {
	zoneDatas: PropTypes.object.isRequired,
};
// let DragFromeTable = DragDropContext(HTML5Backend)(ZoneTable);
export default connect(
	(state) => {
		return {
		
			templetid: state.zoneRegisterData.templetid, // 当前区域上级模板id 
			zoneDatas: state.zoneRegisterData.zoneDatas, // 后台返回的数据 
		};
	},
	{  setNewList }
)(ZoneTable);