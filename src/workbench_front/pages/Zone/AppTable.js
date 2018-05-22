import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Button, Table, Input, Popconfirm, Select } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import _ from 'lodash';
import { setZoneParamData, setZoneTempletid } from 'Store/Zone/action'; 
import Ajax from 'Pub/js/ajax';
import Notice from 'Components/Notice';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const EditableInputCell = ({ editable, value, type, onChange }) => (
	<div>
		{ editable ? (
			<Input style={{ margin: '-5px 0' }} value={value} onChange={(e) => onChange(e.target.value)} />
		) : (
				value
			)}
		{/* {editable ? (
			<Input style={{ margin: '-5px 0' }} value={value} onChange={(e) => onChange(e.target.value)} />
		) : (
				value
			)} */}
	</div>
);
const EditableSelectCell = ({ editable, value, type, column, onChange }) => (
	<div>
		{editable ? (
			type ==1?
				<Select showSearch optionFilterProp="children"  value={value} style={{ width: 120 }} onChange={(selected) => onChange(selected)} filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
					<Option value={0}>查询区</Option>
					<Option value={1}>非查询区</Option>
				</Select> : 
				<Select value={value} style={{ width: 120 }} onChange={(selected) => onChange(selected)}>
					<Option value="button_main">主要按钮</Option>
					<Option value="button_secondary">次要按钮</Option>
					<Option value="buttongroup">按钮组</Option>
					<Option value="dropdown">下拉按钮</Option>
					<Option value="divider">分割下拉按钮</Option>
					<Option value="more">更多按钮</Option>
				</Select>		
		) : (switchType(value))}
	</div>
);


//获取页面参数
const getUrlParam = (pop) => {
	if (!pop) return;
	let result;
	let params = window.location.hash.split('?');
	if (params) {
		params = params[1].split('&');
		params.find((item) => {
			if (item.indexOf(pop) != -1) {
				result = item.split('=')[1];
			}
		});
		return result;
	}
};

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
class AppTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeKey: '1'
		};
		this.columnsPar = [
			{
				title: '序号',
				dataIndex: 'num',
				width: '10%',
			//	render: (text, record) => this.renderColumns(text, record, 'code')
			},
			{
				title: '区域编码',
				dataIndex: 'code',
				width: '20%',
				render: (text, record) => this.renderColumns(text, record, 'code')
			},
			{
				title: '区域名称',
				dataIndex: 'name',
				width: '20%',
				render: (text, record) => this.renderColumns(text, record, 'name')
			},
			{
				title: '区域类型',
				dataIndex: 'areatype',
				width: '20%',
				render: (text, record) => this.renderColumns(text, record, 'areatype', 'select_1')
			},
			{
				title: '关联元数据',
				dataIndex: 'metaid',
				width: '20%',
				render: (text, record) => this.renderColumns(text, record, 'metaid', 'select_2')
			},
			{
				title: '操作',
				dataIndex: 'operation',
				render: (text, record) => {
					const { editable } = record;
					return (
						<div className='editable-row-operations'>
							{editable ? (
								<span>
									<a className='margin-right-5' onClick={() => this.save(record)}>
										保存
									</a>
									<Popconfirm title='确定取消?' cancelText={'取消'} okText={'确定'} onConfirm={() => this.cancel(record)}>
										<a className='margin-right-5'>取消</a>
									</Popconfirm>
								</span>
							) : (
									<span>
									{/* 	<a className='margin-right-5' onClick={() => this.edit(record)}>
											编辑
									</a> */}
										<Popconfirm title='确定删除?' cancelText={'取消'} okText={'确定'} onConfirm={() => this.del(record)}>
											<a className='margin-right-5'>删除</a>
										</Popconfirm>
									{/* 	<a className='margin-right-5' onClick={() => this.edit(record)}>
											设置页面区域
									</a> */}
									</span>
								)}
						</div>
					);
				}
			}
		];
		this.cacheData;
	}
    // 获取当前接口的数据 
	componentDidMount(){
			let url, data,templetid;
		//	let newData = this.getNewData();
			url = `/nccloud/platform/templet/queryallarea.do`;
			data = {
				templetid:'1009Z0100000000WWW11'  // todo 从url上取 
			};
			Ajax({
				url: url,
				data: data,
				success: ({ data }) => {
					if (data.success && data.data) {
					/* 	_.remove(newData, (item) => record.pk_param === item.pk_param);
						this.setNewData(newData); */
					//	this.cacheData = _.cloneDeep(newData);
						this.props.setZoneParamData(data.data);
						templetid = data.data && data.data[0] && data.data[0].templetid;
						this.props.setZoneTempletid(templetid);
						console.log(this.props.zone,111);
						Notice({ status: 'success' });
					} else {
						Notice({ status: 'error', msg: data.data.true });
					}
				}
			});
	}
	renderColumns(text, record, column, type = 'input') {
		record = _.cloneDeep(record);
		if (type === 'input') {
			return (
				<EditableInputCell
					editable={record.editable}
					value={text}
					column={column}
					onChange={(value) => this.handleChange(value, record, column)}
				/>
			);
		} else if (type === 'select_1') {
			return (
				<EditableSelectCell
					editable={record.editable}
					value={text}
					type = {1}
					column={column}
					onChange={(value) => this.handleChange(value, record, column)}
				/>
			);
		} else if (type === 'select_2') {
			return (
				<EditableSelectCell
					editable={record.editable}
					value={text}
					type={2}
					column={column}
					onChange={(value) => this.handleChange(value, record, column)}
				/>
			);
		}
	}
	handleChange(value, record, column) {
		let newData = this.getNewData(); //
		const target = newData.filter((item) => record.pk_area === item.pk_area)[0];
		if (target) {
			target[column] = value;
			this.setNewData(newData); //
		}
	}
	edit(record) {
		let newData = this.getNewData();  // 
		const dataList = newData.filter((item) => item.editable === true);
		if (dataList.length > 0) {
			Notice({ status: 'warning', msg: '请逐条修改按钮！' });
			return;
		}
		this.cacheData = _.cloneDeep(newData);
		const target = newData.filter((item) => record.pk_area === item.pk_area)[0];
		if (target) {
			target.editable = true;
			this.setNewData(newData); // 
		}
	}
	del(record) {
	//	if (record.pk_area) { 
			let url, data;
			let newData = this.getNewData();
			url = `/nccloud/platform/templet/deletearea.do`;
			data = { 
				areaid: record.pk_area
			};
			_.remove(newData, (item) => record.pk_area === item.pk_area);
			this.setNewData(newData);
			this.cacheData = _.cloneDeep(newData);
			Notice({ status: 'success' });
		/* 	Ajax({
				url: url,
				data: data,
				success: ({ data }) => {
					if (data.success && data.data) {
						_.remove(newData, (item) => record.pk_area === item.pk_area);
						this.setNewData(newData);
						this.cacheData = _.cloneDeep(newData);
						Notice({ status: 'success' });
					} else {
						Notice({ status: 'error', msg: data.data.true });
					}
				}
			}); */
	//	}
	}
	save(record) {
		let newData = this.getNewData();
		let url, listData;
		const target = newData.filter((item) => record.pk_area === item.pk_area)[0];
		if (target) {
			if (target.pk_area) {
				url = `/nccloud/platform/templet/editarea.do`;
			} else {
				url = `/nccloud/platform/templet/addarea.do`;
			}
			
			listData = {
				...target
			};
			delete target.editable;
			this.setNewData(newData);

		/* 	Ajax({
				url: url,
				data: listData,
				success: ({ data }) => {
					if (data.success && data.data) {
						delete target.editable;
						if (listData.pk_area) {
							 newData.map((item, index) => {
								if (listData.pk_area === item.pk_area) {
									return { ...item, ...listData };
								} else {
									return item;
								}
							});
							this.setNewData(newData);
						} else {
							newData[newData.length - 1] = data.data;
							this.setNewData(newData);
						}
						this.cacheData = _.cloneDeep(newData);
						Notice({ status: 'success' });
					} else {
						Notice({ status: 'error', msg: data.data.true });
					}
				}
			}); */
		}
	}
	cancel(record) {
		let newData = this.getNewData();
		const target = newData.filter((item) => record.pk_area === item.pk_area)[0];
		if (target) {
			delete target.editable;
			this.setNewData(this.cacheData);
		}
	}
	add() {
		/* if (this.props.billStatus.isNew) {
			Notice({ status: 'warning', msg: '请先将应用进行保存！' });
			return;
		} */
		let templetid = this.props.templetid;
		let newData = this.getNewData();
		const target = newData.filter((item) => item.editable === true);
		if (target.length > 0) {
			Notice({ status: 'warning', msg: '请逐条添加按钮！' });
			return;
		}
		this.cacheData = _.cloneDeep(newData);
		newData.push({
			editable: true,
			areatype: '',
			name: '',
			metadata:'',
			templetid: templetid
		});
		this.setNewData(newData);
	}
	getNewData() {
	//	let { activeKey } = this.state;
		let zone = this.props.zone;
		return _.cloneDeep(zone);
	}
	setNewData(newData) {
	//	let { activeKey } = this.state;
	//	let zone = this.props.zone;
		this.props.setZoneParamData(newData);
	}
	/**
     * 创建按钮
     */
	creatAddLineBtn = () => {
		return (
			<div>
				<Button onClick={() => this.add()} style={{ 'margin-left': '8px' }}>
					新增
				</Button>
			</div>
		);
	};
	render() {
		let zone = this.props.zone;
		return (
			<div>
				{this.creatAddLineBtn()}
					<Table
						bordered
						pagination={false}
						rowKey='num'
					    dataSource={zone.map((item, index) => {
						item.num = index + 1;
						return item;
						})}
						columns={this.columnsPar}
						size='middle'
					/>
			</div>		
		);
	}
}
AppTable.PropTypes = {
	appType: PropTypes.number.isRequired,
	billStatus: PropTypes.object.isRequired,
	appParamVOs: PropTypes.array.isRequired,
	setAppParamData: PropTypes.func.isRequired,
	nodeData: PropTypes.object.isRequired
};
let DragFromeTable = DragDropContext(HTML5Backend)(AppTable);
export default connect(
	(state) => {
		return {
			zone: state.zoneRegisterData.zoneParamdata,
			templetid: state.zoneRegisterData.templetid,
		};
	},
	{ setZoneParamData, setZoneTempletid }
)(DragFromeTable);