import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Button, Table, Switch, Icon, Popconfirm, Layout, Modal } from 'antd';
import { PageLayout } from 'Components/PageLayout';
import {
	setNodeData,
	setBillStatus,
	setOpType,
	setAppParamData,
	setPageButtonData,
	setPageTemplateData,
	setParentData
} from 'Store/templateSetting/action';
import SearchTree from './SearchTree';
import TemplateTree from './TemplateTree'
import Ajax from 'Pub/js/ajax.js';
import { createTree } from 'Pub/js/createTree.js';
const { Header, Footer, Sider, Content } = Layout;
const confirm = Modal.confirm;
import './index.less';
const Btns = [
	{
		name: '新增',
		type: 'primary'
	},
	{
		name: '修改',
		type: 'primary'
	},
	{
		name: '删除',
		type: 'primary'
	},
	{
		name: '复制',
		type: 'primary'
	},
	{
		name: '分配',
		type: 'primary'
	},
	{
		name: '设置默认模板',
		type: 'primary'
	}
];
class templateSetting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			treeDataArray: [],
			menuItemData:{},
			siderHeight: "280"
		};
	}
	// 按钮显隐性控制
	setBtnsShow = (item) => {
		let { name } = item;
		let { optype, parentData, billStatus } = this.props;
		let { isEdit, isNew } = billStatus;
		let isShow = false;
		switch (name) {
			case '新增':
					isShow = true;
				break;
			case '修改':
					isShow = true;
				break;
			case '删除':
					isShow = true;
				break;
			case '复制':
					isShow = true;
				break;
			case '分配':
				isShow = false;
				break;
			case '设置默认模板':
				isShow = true;
				break;
			default:
				break;
		}
		return { ...item, isShow };
	};
	//生成按钮方法
	creatBtn = (btnObj) => {
		let { name, isShow, type } = btnObj;
		if (isShow) {
			return (
				<Button key={name} className="margin-left-10" type={type} onClick={this.handleClick.bind(this, name)}>
					{name}
				</Button>
			);
		}
	};
	handleClick = (btnName) => {
		let url, Obj;
		switch (btnName) {
			case '增加模块':
				this.actionType = 1;
				this.nodeData = this.props.nodeData;
				if (!this.props.parentData) {
					this.props.setParentData(this.nodeData.moduleid);
				}
				this.optype = this.props.optype;
				let moduleData = {
					systypecode: '',
					moduleid: '',
					systypename: '',
					orgtypecode: undefined,
					appscope: undefined,
					isaccount: false,
					supportcloseaccbook: false,
					resid: '',
					dr: 0
				};
				this.props.setNodeData(moduleData);
				this.props.setOpType('module');
				this.props.setBillStatus({
					isEdit: true,
					isNew: true
				});
				break;
			default:
				break;
			}
		}
	componentDidMount = () => {
		// 样式处理
		window.onresize = () => {
			let siderHeight = document.querySelector('.ant-layout-content').offsetHeight;
			this.setState({ siderHeight });
		};
	};
	render() {
		return (
			<PageLayout className="nc-workbench-templateSetting">
				<Layout>
					<Header>
						{Btns.map((item, index) => {
							item = this.setBtnsShow(item);
							return this.creatBtn(item);
						})}
					</Header>
					<Layout height={'100%'}>
						<Sider
							width={280}
							height={'auto'}
							style={{
								background: '#fff',
								width: '500px',
								minHeight: 'calc(100vh - 64px - 48px)',
								height: `${this.state.siderHeight}px`,
								overflowY: 'auto',
								padding: '20px'
							}}
						>
							<SearchTree />
						</Sider>
						<Content style={{ padding: '20px', minHeight: 280 }}><TemplateTree/></Content>
					</Layout>
				</Layout>
			</PageLayout>
		);
	}
}
templateSetting.propTypes = {
	optype: PropTypes.string.isRequired,
	billStatus: PropTypes.object.isRequired,
	setBillStatus: PropTypes.func.isRequired,
	parentData: PropTypes.string.isRequired,
	setOpType: PropTypes.func.isRequired,
	nodeData: PropTypes.object.isRequired,
	setPageButtonData: PropTypes.func.isRequired,
	setPageTemplateData: PropTypes.func.isRequired,
	addTreeData: PropTypes.func.isRequired,
	delTreeData: PropTypes.func.isRequired,
	updateTreeData: PropTypes.func.isRequired,
	setParentData: PropTypes.func.isRequired,
	reqTreeData: PropTypes.func.isRequired
};
export default connect(
	(state) => ({
		optype: state.AppRegisterData.optype,
		billStatus: state.AppRegisterData.billStatus,
		parentData: state.AppRegisterData.parentData,
		nodeData: state.AppRegisterData.nodeData,
		addTreeData: state.AppRegisterData.addTreeData,
		delTreeData: state.AppRegisterData.delTreeData,
		updateTreeData: state.AppRegisterData.updateTreeData,
		reqTreeData: state.AppRegisterData.reqTreeData
	}),
	{
		setNodeData,
		setBillStatus,
		setOpType,
		setAppParamData,
		setPageButtonData,
		setPageTemplateData,
		setParentData
	}
)(templateSetting);
