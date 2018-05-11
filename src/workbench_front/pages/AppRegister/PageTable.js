import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Button, Table, Input, Popconfirm, Select } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import _ from 'lodash';
import { setPageButtonData,setPageTemplateData,setPrintTemplateData } from 'Store/AppRegister/action';
import Ajax from 'Pub/js/ajax';
import Notice from 'Components/Notice';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const EditableInputCell = ({ editable, value, onChange }) => (
	<div>
		{editable ? (
			<Input style={{ margin: '-5px 0' }} value={value} onChange={(e) => onChange(e.target.value)} />
		) : (
			value
		)}
	</div>
);
const EditableSelectCell = ({ editable, value, onChange }) => (
	<div>
		{editable ? (
			<Select  value={value} style={{ width: 120 }} onChange={(selected) => onChange(selected)}>
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
/**
 * 按钮类型选择
 * @param {String} value 
 */
const switchType = (value)=>{
	switch (value) {
		case "button_main":
			return '主要按钮';
		case "button_secondary":
			return '次要按钮';
		case "buttongroup":
			return '按钮组';
		case "dropdown":
			return '下拉按钮';
		case "divider":
			return '分割下拉按钮';
		case "more":
			return '更多按钮';
		default:
			break;
	}
}
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
				width: '10%',
				render: (text, record) => this.renderColumns(text, record, 'btncode')
			},
			{
				title: '按钮名称',
				dataIndex: 'btnname',
				width: '10%',
				render: (text, record) => this.renderColumns(text, record, 'btnname')
			},
			{
				title: '按钮类型',
				dataIndex: 'btntype',
				width: '15%',
				render: (text, record) => this.renderColumns(text, record, 'btntype','select')
			},
			{
				title: '父按钮编码',
				dataIndex: 'parent_code',
				width: '10%',
				render: (text, record) => this.renderColumns(text, record, 'parent_code')
			},
			{
				title: '按钮区域',
				dataIndex: 'btnarea',
				width: '10%',
				render: (text, record) => this.renderColumns(text, record, 'btnarea')
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
				width: '25%',
				render: (text, record) => this.renderColumns(text, record, 'btndesc')
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
			}
		];
		this.columnsSt = [
			{
				title: '序号',
				dataIndex: 'num',
				width: '5%'
			},
			{
				title: '模板编码',
				dataIndex: 'templateid',
				width: '25%',
				render: (text, record) => this.renderColumns(text, record, 'templateid')
			},
			{
				title: '模板名称',
				dataIndex: 'templatename',
				width: '15%',
				render: (text, record) => this.renderColumns(text, record, 'templatename')
			},
			{
				title: '所属模块',
				width: '10%',
				dataIndex: 'moduleid',
				render: (text, record) => this.renderColumns(text, record, 'moduleid')
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
			}
		];
		this.columnsPt = [
			{
				title: '序号',
				dataIndex: 'num',
				width: '5%'
			},
			{
				title: '模板编码',
				dataIndex: 'templateid',
				width: '25%',
				render: (text, record) => this.renderColumns(text, record, 'templateid')
			},
			{
				title: '模板名称',
				dataIndex: 'templatename',
				width: '15%',
				render: (text, record) => this.renderColumns(text, record, 'templatename')
			},
			{
				title: '所属模块',
				width: '10%',
				dataIndex: 'moduleid',
				render: (text, record) => this.renderColumns(text, record, 'moduleid')
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
			}
		];
		this.cacheData;
	}
	components = {
		body: {
			row: BodyRow
		}
	};
	moveRow = (dragIndex, hoverIndex) => {
		let appButtonVOs = this.props.appButtonVOs;
		const dragRow = appButtonVOs[dragIndex];
		let sortData = update(appButtonVOs, {
			$splice: [ [ dragIndex, 1 ], [ hoverIndex, 0, dragRow ] ]
		});
		sortData.map((item, index) => (item.btnorder = index));
		Ajax({
			url: `/nccloud/platform/appregister/orderbuttons.do`,
			data: sortData,
			success: ({ data }) => {
				if (data.success && data.data) {
					this.props.setPageButtonData(sortData);
				}
			}
		});
	};
	renderColumns(text, record, column, type = 'input') {
		record = _.cloneDeep(record);
		if(type === 'input'){
			return (
				<EditableInputCell
					editable={record.editable}
					value={text}
					onChange={(value) => this.handleChange(value, record, column)}
				/>
			);
		}else if(type === 'select'){
			return (
				<EditableSelectCell
					editable={record.editable}
					value={text}
					onChange={(value) => this.handleChange(value, record, column)}
				/>
			);
		}
	}
	handleChange(value, record, column) {
		console.log(value);
		
		let newData = this.getNewData();
		const target = newData.filter((item) => record.num === item.num)[0];
		if (target) {
			target[column] = value;
			this.setNewData(newData);
		}
	}
	edit(record) {
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
			if (target.pk_btn || target.pk_systemplate) {
				if (activeKey === '1') {
					url = `/nccloud/platform/appregister/editbutton.do`;
				} else if(activeKey === '2'){
					url = `/nccloud/platform/appregister/editsystemplate.do`;
				}
			} else {
				if (activeKey === '1') {
					url = `/nccloud/platform/appregister/insertbutton.do`;
				} else if(activeKey === '2'){
					url = `/nccloud/platform/appregister/insertsystemplate.do`;
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
						if (listData.pk_btn || listData.pk_systemplate) {
							newData.map((item, index) => {
								if (listData.pk_btn === item.pk_btn || listData.pk_systemplate === item.pk_systemplate) {
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
		if(this.props.billStatus.isNew){
			Notice({ status: 'warning', msg: '请先将页面进行保存！' });
			return;
		}
		let { activeKey } = this.state;
		let parentId = this.props.nodeData.pk_apppage;
		let newData = this.getNewData();
		this.cacheData = _.cloneDeep(newData);
		if (activeKey === '1') {
			newData.push({
				editable: true,
				btntype:'button_main',
				btncode: '',
				btnname: '',
				parent_code:'',
				btnarea:'',
				btndesc: '',
				parent_id: parentId,
				isenable: true,
				pagecode: ''
			});
		} else if(activeKey === '2'){
			newData.push({
				editable: true,
				tempstyle: 0,
				templatename: '',
				parent_id: parentId,
				isenable: true,
				pagecode: ''
			});
		}else if(activeKey === '3'){
			newData.push({
				editable: true,
				tempstyle: 1,
				templatename: '',
				parent_id: parentId,
				isenable: true,
				pagecode: ''
			});
		}
		this.setNewData(newData);
	}
	getNewData() {
		let { activeKey } = this.state;
		let { appButtonVOs,pageSystemplateVO,printSystemplateVO } = this.props;
		if (activeKey === '1') {
			return _.cloneDeep(appButtonVOs);
		} else if(activeKey === '2'){
			return _.cloneDeep(pageSystemplateVO);
		}else if(activeKey === '3'){
			return _.cloneDeep(printSystemplateVO);
		}
	}
	setNewData(newData) {
		let { activeKey } = this.state;
		if (activeKey === '1') {
			this.props.setPageButtonData(newData);
		} else if(activeKey === '2'){
			this.props.setPageTemplateData(newData);
		} else if(activeKey === '3'){
			this.props.setPrintTemplateData(newData);
		}
	}
	/**
     * 创建按钮
     */
	creatAddLineBtn = () => {
		return (
			<div>
				{this.state.activeKey === '1'?<span style={{color:'#e14c46'}}>提示：按钮可通过拖拽进行排序！</span>:null}
				<Button onClick={() => this.add()} style={{ 'margin-left': '8px' }}>
					新增行
				</Button>
			</div>
		);
	};
	render() {
		let { appButtonVOs,pageSystemplateVO,printSystemplateVO } = this.props;
		return (
			<Tabs
				onChange={(activeKey) => {
					this.setState({ activeKey });
				}}
				type='card'
				tabBarExtraContent={this.creatAddLineBtn()}
			>
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
						columns={this.columnsBtn}
						size='middle'
					/>
				</TabPane>
				<TabPane tab='页面模板注册' key='2'>
					<Table
						bordered
						pagination={false}
						rowKey='num'
						dataSource={pageSystemplateVO.map((item, index) => {
							item.num = index + 1;
							return item;
						})}
						columns={this.columnsSt}
						size='middle'
					/>
				</TabPane>
				<TabPane tab='打印模板注册' key='3'>
					<Table
						bordered
						pagination={false}
						rowKey='num'
						dataSource={printSystemplateVO.map((item, index) => {
							item.num = index + 1;
							return item;
						})}
						columns={this.columnsSt}
						size='middle'
					/>
				</TabPane>
			</Tabs>
		);
	}
}
PageTable.PropTypes = {
	appType: PropTypes.number.isRequired,
	billStatus: PropTypes.object.isRequired,
	appButtonVOs: PropTypes.array.isRequired,
	pageSystemplateVO: PropTypes.array.isRequired,
	printSystemplateVO: PropTypes.array.isRequired,
	setPageTemplateData: PropTypes.func.isRequired,
	setPrintTemplateData: PropTypes.func.isRequired,
	setPageButtonData: PropTypes.func.isRequired,
	nodeData: PropTypes.object.isRequired
};
let DragFromeTable = DragDropContext(HTML5Backend)(PageTable);
export default connect(
	(state) => {
		return {
			appType: state.AppRegisterData.appType,
			billStatus: state.AppRegisterData.billStatus,
			printSystemplateVO: state.AppRegisterData.printSystemplateVO,
			pageSystemplateVO: state.AppRegisterData.pageSystemplateVO,
			appButtonVOs: state.AppRegisterData.appButtonVOs,
			nodeData: state.AppRegisterData.nodeData
		};
	},
	{ setPageButtonData,setPageTemplateData,setPrintTemplateData }
)(DragFromeTable);
