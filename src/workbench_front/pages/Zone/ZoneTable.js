import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Input, Icon, Button, Popconfirm, Select} from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import _ from 'lodash'; 
import { setZoneListData, setZoneTempletid, setNewList } from 'Store/Zone/action'; 
import Ajax from 'Pub/js/ajax';
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
		case 1:
			return '非查询区'
		case 0:
			return '查询区'
		default:
			return value;	
	/* 	default:
			break; */
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
		this.setState({ editable: true });
	}
	render() {
		const { value, editable } = this.state;
		return (
			<div className="editable-cell">
				{
					editable ?
						<div className="editable-cell-input-wrapper">
							<Input
								value={value}
								onChange={this.handleChange}
								onPressEnter={this.check}
							/>
							<Icon
								type="check"
								className="editable-cell-icon-check"
								onClick={this.check}
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
	//	const value = e.target.value;
		this.setState({ value });
	}
	check = () => { 
		this.setState({ editable: false });
		if (this.props.onChange) {
			this.props.onChange(this.state.value);
		}
	}
	edit = () => {
		this.setState({ editable: true });
	}
	render() {
		const { value, editable } = this.state;
		return (
			<div className="editable-cell">
				{
					editable ?
						<div className="editable-cell-input-wrapper">
							<Select showSearch optionFilterProp="children" value={value} style={{ width: 120 }} onChange={(selected) =>this.handleChange(selected)} filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
								<Option value={0}>查询区</Option>
								<Option value={1}>非查询区</Option>
							</Select>
							<Icon
								type="check"
								className="editable-cell-icon-check"
								onClick={this.check}
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

// li 
// 可编辑表格下拉框 
class EditableCell_1 extends React.Component {
	state = {
		value: this.props.value,
		editable: false,
		currency5:{}
	}
	// 组件更新 
	componentWillReceiveProps(nextProps) {
	//	if (nextProps.zoneDatas.areaList) {
			this.setState({
				value: nextProps.value,
			})
//		}
	}

	handleChange = (value) => {
		//	const value = e.target.value;
		this.setState({ value });
	}
	check = () => {

		this.setState({ editable: false });
		if (this.props.onChange) {
			this.props.onChange(this.state.currency5);
		}
	}
	edit = () => {
		this.setState({ editable: true });
	}
	render() {
		const { value, editable } = this.state;
		return (
			<div className="editable-cell">
				{
					editable ?
						<div className="editable-cell-input-wrapper">
							<Refer
								placeholder={'单选树表'}
								refName={'交易类型'}
								refCode={'cont'}
								refType={'gridTree'}
								queryTreeUrl={'nccloud/platform/templet/querymetatree.do'}
								queryGridUrl={'nccloud/platform/templet/querymetatree.do'}
								value={this.state.currency5}
								onChange={(val) => {
									console.log(val);
									this.setState({
										currency5: val
									});
								}}
								columnConfig={[
									{
										name: ['编码', '名称'],
										code: ['refcode', 'refname']
									}
								]}
								isMultiSelectedEnabled={false}
							/>
							<Icon
								type="check"
								className="editable-cell-icon-check"
								onClick={this.check}
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
			currency5:{},
			show:true,
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
			render: (text, record) => (
					<EditableCell
					value={text}
					onChange={this.onCellChange(record.key, 'name')}
					/>
				),
		}, {
			title: '区域类型',
			dataIndex: 'areatype', 
			render: (text, record) => (
				<EditableSelect
					value={text}
					onChange={this.onCellChange(record.key, 'areatype')}
					/>
				),
			},
			{
				title: '关联元数据',
				dataIndex: 'metaname', 
				render: (text, record) => (
					<EditableCell_1
					value={text}
						onChange={this.onCellChange(record.key, 'metaname')}
					/>
				),
			},  
			{
			title: '操作',
			dataIndex: 'operation',
			render: (text, record) => {
				return (
					this.state.dataSource.length > 1 ?
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
			})
		}
	}

	onCellChange = (key, dataIndex) => {
		return (value) => {
			const dataSource = [...this.state.dataSource];
			const target = dataSource.find(item => item.key === key);
			if (target) {
				debugger;
				target[dataIndex] = value && value.refname;
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
			areatype:1,
		};
		this.setState({
			dataSource: [...dataSource, newData],
			count: count + 1,
		});
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
let DragFromeTable = DragDropContext(HTML5Backend)(ZoneTable);
export default connect(
	(state) => {
		return {
			zone: state.zoneRegisterData.zoneParamdata,
			templetid: state.zoneRegisterData.templetid,
			zoneDatas: state.zoneRegisterData.zoneDatas,
		};
	},
	{ setZoneListData, setZoneTempletid, setNewList }
)(DragFromeTable);