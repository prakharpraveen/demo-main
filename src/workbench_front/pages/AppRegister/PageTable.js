import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setAppData } from 'Store/AppRegister/action';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import { Tabs, Button, Table, Input, Popconfirm } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
const TabPane = Tabs.TabPane;
const BTNS = [
	{
		name: '新增行'
	}
];
const EditableCell = ({ editable, value, onChange }) => (
	<div>
		{editable ? (
			<Input style={{ margin: '-5px 0' }} value={value} onChange={(e) => onChange(e.target.value)} />
		) : (
			value
		)}
	</div>
);
function dragDirection(dragIndex, hoverIndex, initialClientOffset, clientOffset, sourceClientOffset) {
	const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
	const hoverClientY = clientOffset.y - sourceClientOffset.y;
	if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
		return 'downward';
	}
	if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
		return 'upward';
	}
}
let BodyRow = (props) => {
	const {
		isOver,
		connectDragSource,
		connectDropTarget,
		moveRow,
		dragRow,
		clientOffset,
		sourceClientOffset,
		initialClientOffset,
		...restProps
	} = props;
	const style = { ...restProps.style, cursor: 'move' };

	let className = restProps.className;
	if (isOver && initialClientOffset) {
		const direction = dragDirection(
			dragRow.index,
			restProps.index,
			initialClientOffset,
			clientOffset,
			sourceClientOffset
		);
		if (direction === 'downward') {
			className += ' drop-over-downward';
		}
		if (direction === 'upward') {
			className += ' drop-over-upward';
		}
	}

	return connectDragSource(connectDropTarget(<tr {...restProps} className={className} style={style} />));
};
const rowTarget = {
	drop(props, monitor) {
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return;
		}
		// Time to actually perform the action
		props.moveRow(dragIndex, hoverIndex);
		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex;
	}
};
const rowSource = {
	beginDrag(props) {
		return {
			index: props.index
		};
	}
};
BodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	sourceClientOffset: monitor.getSourceClientOffset()
}))(
	DragSource('row', rowSource, (connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		dragRow: monitor.getItem(),
		clientOffset: monitor.getClientOffset(),
		initialClientOffset: monitor.getInitialClientOffset()
	}))(BodyRow)
);

class PageTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeKey: '1'
		};
		this.columnsBtn = [
			{
				title: '序号',
				dataIndex: 'num',
				width: '5%'
			},
			{
				title: '按钮编码',
				dataIndex: 'btncode',
				width: '15%',
				render: (text, record) => this.renderColumns(text, record, 'btncode')
			},
			{
				title: '按钮名称',
				dataIndex: 'btnname',
				width: '15%',
				render: (text, record) => this.renderColumns(text, record, 'btnname')
			},
			{
				title: 'pagecode',
				dataIndex: 'pagecode',
				width: '10%',
				render: (text, record) => this.renderColumns(text, record, 'pagecode')
			},
			{
				title: '按钮功能描述',
				dataIndex: 'btndesc',
				width: '40%',
				render: (text, record) => this.renderColumns(text, record, 'btndesc')
			}
		];
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
			}
		];
		this.operationCol = {
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
								<Popconfirm title='确定取消?' onConfirm={() => this.cancel(record)}>
									<a className='margin-right-5'>取消</a>
								</Popconfirm>
							</span>
						) : (
							<span>
								<a className='margin-right-5' onClick={() => this.edit(record)}>
									编辑
								</a>
								<Popconfirm title='确定删除?' onConfirm={() => this.del(record)}>
									<a className='margin-right-5'>删除</a>
								</Popconfirm>
							</span>
						)}
					</div>
				);
			}
		};
		this.cacheData;
	}
	components = {
		body: {
			row: BodyRow
		}
	};
	moveRow = (dragIndex, hoverIndex) => {
		let { appButtonVOs } = this.props.appData;
		const dragRow = appButtonVOs[dragIndex];
		let sortData = update(this.props.appData, {
			appButtonVOs: {
				$splice: [ [ dragIndex, 1 ], [ hoverIndex, 0, dragRow ] ]
			}
		});
		sortData.appButtonVOs.map((item, index) => (item.btnorder = index));
		Ajax({
			url: `/nccloud/platform/appregister/orderbuttons.do`,
			data: sortData.appButtonVOs,
			success: ({ data }) => {
				if (data.success && data.data) {
					this.props.setAppData(sortData);
				}
			}
		});
	};
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
		console.log(record);

		let newData = this.getNewData();
		this.cacheData = _.cloneDeep(newData);
		const target = newData.filter((item) => record.num === item.num)[0];
		if (target) {
			target.editable = true;
			this.setNewData(newData);
		}
	}
	del(record) {
		if (record.pk_btn || record.pk_param) {
			let url, data;
			let { activeKey } = this.state;
			let newData = this.getNewData();
			if (activeKey === '1') {
				url = `/nccloud/platform/appregister/deletebutton.do`;
				data = {
					pk_btn: record.pk_btn
				};
			} else {
				url = `/nccloud/platform/appregister/deleteparam.do`;
				data = {
					pk_param: record.pk_param
				};
			}
			Ajax({
				url: url,
				data: data,
				success: ({ data }) => {
					if (data.success && data.data) {
						if (record.pk_btn) {
							_.remove(newData, (item) => record.pk_btn === item.pk_btn);
						} else {
							_.remove(newData, (item) => record.pk_param === item.pk_param);
						}
						this.setNewData(newData);
						this.cacheData = _.cloneDeep(newData);
					}
				}
			});
		}
	}
	save(record) {
		let { activeKey } = this.state;
		let newData = this.getNewData();
		let url, listData;
		const target = newData.filter((item) => record.num === item.num)[0];
		if (target) {
			if (target.pk_btn || target.pk_param) {
				if (activeKey === '1') {
					url = `/nccloud/platform/appregister/editbutton.do`;
				} else {
					url = `/nccloud/platform/appregister/editparam.do`;
				}
			} else {
				if (activeKey === '1') {
					url = `/nccloud/platform/appregister/insertbutton.do`;
				} else {
					url = `/nccloud/platform/appregister/insertparam.do`;
				}
			}
			listData = {
				...target
			};
			Ajax({
				url: url,
				data: listData,
				success: ({ data }) => {
					if (data.success && data.data) {
						delete target.editable;
						if (listData.pk_btn || listData.pk_param) {
							newData.map((item, index) => {
								if (listData.pk_btn === item.pk_btn || listData.pk_param === item.pk_param) {
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
		let { activeKey } = this.state;
		let parentId = this.props.nodeData.pk_appregister;
		let newData = this.getNewData();
		this.cacheData = _.cloneDeep(newData);
		let flag = activeKey === '1';
		if (flag) {
			newData.push({
				editable: true,
				btncode: '',
				btnname: '',
				btndesc: '',
				parent_id: parentId,
				isenable: true,
				pagecode: ''
			});
		} else {
			newData.push({
				editable: true,
				paramname: '',
				paramvalue: '',
				parentid: parentId
			});
		}
		this.setNewData(newData);
	}
	getNewData() {
		let { activeKey } = this.state;
		let { appParamVOs, appButtonVOs } = this.props.appData;
		if (activeKey === '1') {
			return _.cloneDeep(appButtonVOs);
		} else {
			return _.cloneDeep(appParamVOs);
		}
	}
	setNewData(newData) {
		let { activeKey } = this.state;
		let { appParamVOs, appButtonVOs } = this.props.appData;
		if (activeKey === '1') {
			this.props.setAppData({ appParamVOs, appButtonVOs: newData });
		} else {
			this.props.setAppData({ appButtonVOs, appParamVOs: newData });
		}
	}
	/**
     * 创建按钮
     */
	createBtns = () => {
		return BTNS.map((item, index) => {
			item = this.setBtnsShow(item);
			// if (item.isShow) {
				return (
					<div>
						<span style={{color:'#e14c46'}}>提示：按钮顺序可以通过拖拽进行排序！</span>
						<Button onClick={() => this.add()} style={{ 'margin-left': '8px' }}>
							{item.name}
						</Button>
					</div>
				);
			// }
		});
	};
	/**
     * 设置按钮显影性
     * @param {Object} item
     */
	setBtnsShow = (item) => {
		let { isEdit } = this.props.billStatus;
		if (isEdit) {
			item.isShow = true;
		} else {
			item.isShow = false;
		}
		return item;
	};
	/**
     * 创建 页签内容
     */
	createTabPane = () => {
		let { appButtonVOs = [], appParamVOs = [] } = this.props.appData;
		let columns1 = _.cloneDeep(this.columnsBtn);
		// if (this.props.billStatus.isEdit) {
			columns1.push(this.operationCol);
		// }
		let tabsArray = [
			<TabPane tab='按钮注册' key='1'>
				<Table
					bordered
					pagination={false}
					rowKey='num'
					components={this.components}
					dataSource={appButtonVOs.map((item, index) => {
						item.num = index + 1;
						return item;
					})}
					onRow={(record, index) => ({
						index,
						moveRow: this.moveRow
					})}
					columns={columns1}
					size='middle'
				/>
			</TabPane>
		];
		if (this.props.appType === 2) {
			let columns2 = _.cloneDeep(this.columnsPar);
			// if (this.props.billStatus.isEdit) {
				columns2.push(this.operationCol);
			// }
			tabsArray.push(
				<TabPane tab='参数注册' key='2'>
					<Table
						bordered
						pagination={false}
						rowKey='num'
						dataSource={appParamVOs.map((item, index) => {
							item.num = index + 1;
							return item;
						})}
						columns={columns2}
						size='middle'
					/>
				</TabPane>
			);
		} else {
		}
		return tabsArray;
	};
	render() {
		return (
			<Tabs
				onChange={(activeKey) => {
					this.setState({ activeKey });
				}}
				type='card'
				tabBarExtraContent={this.createBtns()}
			>
				{this.createTabPane()}
			</Tabs>
		);
	}
}
PageTable.PropTypes = {
	appType: PropTypes.number.isRequired,
	billStatus: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
	setAppData: PropTypes.object.isRequired,
	nodeData: PropTypes.object.isRequired
};
let DragFromeTable = DragDropContext(HTML5Backend)(PageTable);
export default connect(
	(state) => {
		return {
			appType: state.AppRegisterData.appType,
			billStatus: state.AppRegisterData.billStatus,
			appData: state.AppRegisterData.appData,
			nodeData: state.AppRegisterData.nodeData
		};
	},
	{ setAppData }
)(DragFromeTable);
