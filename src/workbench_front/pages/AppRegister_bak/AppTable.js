import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Button, Table, Input, Popconfirm } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import _ from 'lodash';
import { setAppParamData } from 'Store/AppRegister_bak/action';
import Ajax from 'Pub/js/ajax';
import Notice from 'Components/Notice';
const TabPane = Tabs.TabPane;
const EditableCell = ({ editable, value, onChange }) => (
	<div>
		{editable ? (
			<Input style={{ margin: '-5px 0' }} value={value} onChange={(e) => onChange(e.target.value)} />
		) : (
			value
		)}
	</div>
);

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
				width: '5%'
			},
			{
				title: '参数名称',
				dataIndex: 'paramname',
				width: '25%',
				render: (text, record) => this.renderColumns(text, record, 'paramname')
			},
			{
				title: '参数值',
				width: '55%',
				dataIndex: 'paramvalue',
				render: (text, record) => this.renderColumns(text, record, 'paramvalue')
			},{
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
									<a className='margin-right-5' onClick={() => this.edit(record)}>
										编辑
									</a>
									<Popconfirm title='确定删除?' cancelText={'取消'} okText={'确定'} onConfirm={() => this.del(record)}>
										<a className='margin-right-5'>删除</a>
									</Popconfirm>
								</span>
							)}
						</div>
					);
				}
			}
		];
		this.cacheData;
	}
	renderColumns(text, record, column) {
		record = _.cloneDeep(record);
		return (
			<EditableCell
				editable={record.editable}
				value={text}
				onChange={(value) => this.handleChange(value, record, column)}
			/>
		);
	}
	handleChange(value, record, column) {
		let newData = this.getNewData();
		const target = newData.filter((item) => record.num === item.num)[0];
		if (target) {
			target[column] = value;
			this.setNewData(newData);
		}
	}
	edit(record) {
		let newData = this.getNewData();
		const dataList = newData.filter((item) => item.editable === true);
		if(dataList.length > 0){
			Notice({ status: 'warning', msg: '请逐条修改按钮！' });
			return;
		}
		this.cacheData = _.cloneDeep(newData);
		const target = newData.filter((item) => record.num === item.num)[0];
		if (target) {
			target.editable = true;
			this.setNewData(newData);
		}
	}
	del(record) {
		if (record.pk_param) {
			let url, data;
			let newData = this.getNewData();
			url = `/nccloud/platform/appregister/deleteparam.do`;
			data = {
				pk_param: record.pk_param
			};
			Ajax({
				url: url,
				data: data,
				info:{
					name:'应用参数',
					action:'删除'
				},
				success: ({ data }) => {
					if (data.success && data.data) {
						_.remove(newData, (item) => record.pk_param === item.pk_param);
						this.setNewData(newData);
						this.cacheData = _.cloneDeep(newData);
						Notice({ status: 'success' });
					}else{
						Notice({ status: 'error', msg: data.data.true });
					}
				}
			});
		}
	}
	save(record) {
		let { activeKey } = this.state;
		let newData = this.getNewData();
		let url, listData,info;
		const target = newData.filter((item) => record.num === item.num)[0];
		if (target) {
			if (target.pk_param) {
				url = `/nccloud/platform/appregister/editparam.do`;
				info = {
					name:'应用参数',
					action:'编辑'
				};
			} else {
				url = `/nccloud/platform/appregister/insertparam.do`;
				info = {
					name:'应用参数',
					action:'新增'
				};
			}
			listData = {
				...target
			};
			Ajax({
				url: url,
				info:info,
				data: listData,
				success: ({ data }) => {
					if (data.success && data.data) {
						delete target.editable;
						if (listData.pk_param) {
							newData.map((item, index) => {
								if (listData.pk_param === item.pk_param) {
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
					}else{
						Notice({ status: 'error', msg: data.data.true });
					}
				}
			});
		}
	}
	cancel(record) {
		let newData = this.getNewData();
		const target = newData.filter((item) => record.num === item.num)[0];
		if (target) {
			delete target.editable;
			this.setNewData(this.cacheData);
		}
	}
	add() {
		if(this.props.billStatus.isNew){
			Notice({ status: 'warning', msg: '请先将应用进行保存！' });
			return;
		}
		let parentId = this.props.nodeData.pk_appregister;
		let newData = this.getNewData();
		const target = newData.filter((item) => item.editable === true);
		if(target.length > 0){
			Notice({ status: 'warning', msg: '请逐条添加按钮！' });
			return;
		}
		this.cacheData = _.cloneDeep(newData);
		newData.push({
			editable: true,
			paramname: '',
			paramvalue: '',
			parentid: parentId
		});
		this.setNewData(newData);
	}
	getNewData() {
		let { activeKey } = this.state;
		let appParamVOs = this.props.appParamVOs;
		return _.cloneDeep(appParamVOs);
	}
	setNewData(newData) {
		let { activeKey } = this.state;
		let appParamVOs = this.props.appParamVOs;
		this.props.setAppParamData(newData);
	}
	/**
     * 创建按钮
     */
	creatAddLineBtn = () => {
		return (
			<div>
				<Button onClick={() => this.add()} style={{ 'marginLeft': '8px' }}>
					新增行
				</Button>
			</div>
		);
	};
	render() {
		let appParamVOs = this.props.appParamVOs;
		return (
			<Tabs
				onChange={(activeKey) => {
					this.setState({ activeKey });
				}}
				type='card'
				tabBarExtraContent={this.creatAddLineBtn()}
			>
				{/* {this.createTabPane()} */}
				<TabPane tab='参数注册' key='1'>
					<Table
						bordered
						pagination={false}
						rowKey='num'
						dataSource={appParamVOs.map((item, index) => {
							item.num = index + 1;
							return item;
						})}
						columns={this.columnsPar}
						size='middle'
					/>
				</TabPane>
			</Tabs>
		);
	}
}
AppTable.propTypes = {
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
			appType: state.AppRegister_bakData.appType,
			billStatus: state.AppRegister_bakData.billStatus,
			appParamVOs: state.AppRegister_bakData.appParamVOs,
			nodeData: state.AppRegister_bakData.nodeData
		};
	},
	{ setAppParamData }
)(DragFromeTable);