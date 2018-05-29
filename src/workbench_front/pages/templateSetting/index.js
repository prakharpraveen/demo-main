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
} from 'Store/AppRegister/action';
import TreeTable from './TreeTable';
import SearchTree from './SearchTree';
import Ajax from 'Pub/js/ajax.js';
import { createTree } from 'Pub/js/createTree.js';
const { Header, Footer, Sider, Content } = Layout;
const confirm = Modal.confirm;
import './index.less';
const Btns = [
	{
		name: '增加模块',
		type: 'primary'
	},
	{
		name: '增加应用分类',
		type: 'primary'
	},
	{
		name: '增加应用',
		type: 'primary'
	},
	{
		name: '增加页面',
		type: 'primary'
	},
	{
		name: '保存',
		type: 'primary'
	},
	{
		name: '取消'
	},
	{
		name: '删除',
		type: 'primary'
	},
	{
		name: '修改',
		type: 'primary'
	}
];
class templateSetting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			treeDataArray: [],
			menuItemData:{},
			treeTableData: [],
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
			case '增加模块':
				if (isEdit) {
					isShow = false;
				} else {
					if (optype === '' || (optype === 'module' && !parentData)) {
						isShow = true;
					} else {
						isShow = false;
					}
				}
				break;
			case '增加应用分类':
				if (isEdit) {
					isShow = false;
				} else {
					if (optype === 'module' && parentData && parentData.length === 2) {
						isShow = true;
					} else {
						isShow = false;
					}
				}
				break;
			case '增加应用':
				if (isEdit) {
					isShow = false;
				} else {
					if (optype === 'classify') {
						isShow = true;
					} else {
						isShow = false;
					}
				}
				break;
			case '增加页面':
				if (isEdit) {
					isShow = false;
				} else {
					if (optype === 'app') {
						isShow = true;
					} else {
						isShow = false;
					}
				}
				break;
			case '保存':
				if (isEdit) {
					isShow = true;
				} else {
					isShow = false;
				}
				break;
			case '取消':
				if (isEdit) {
					isShow = true;
				} else {
					isShow = false;
				}
				break;
			case '删除':
				if (isNew) {
					isShow = false;
				} else {
					if (optype === '') {
						isShow = false;
					} else {
						isShow = true;
					}
				}
				break;
			case '修改':
				if (isNew || isEdit) {
					isShow = false;
				} else {
					if (optype === '') {
						isShow = false;
					} else {
						isShow = true;
					}
				}
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
	componentDidMount = () => {
		Ajax({
			url: `/nccloud/platform/appregister/queryappmenus.do`,
			info: {
				name: '菜单注册',
				action: '应用树查询'
			},
			data: {
				pk_menu:this.props.menuItemData.pk_menu
			},
			success: (res) => {
				let { success, data } = res.data;
				if (success && data) {
					this.setState({ treeDataArray: data},()=>{this.updateTreeData(data)});
				}
			}
		});
	};
	updateTreeData = (data)=>{
		let treeTableData = createTree(data, 'menuitemcode', 'parentcode');
		this.setState({ treeTableData });
	}
	render() {
		let { treeTableData } = this.state;
		return (
			<PageLayout className="nc-workbench-templateSetting">
					<Layout height={'100%'}>
					<Header>
						{/* {Btns.map((item, index) => {
							item = this.setBtnsShow(item);
							return this.creatBtn(item);
						})} */}
					</Header>
						<Sider
							width={280}
							height={'100%'}
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
					</Layout>
			</PageLayout>
		);
	}
}

templateSetting.propTypes = {
	menuItemData: PropTypes.object.isRequired,
};
export default connect((state)=>{
	return {
		menuItemData:state.menuRegisterData.menuItemData
	}
},{})(templateSetting);

// templateSetting.propTypes = {
// 	optype: PropTypes.string.isRequired,
// 	billStatus: PropTypes.object.isRequired,
// 	setBillStatus: PropTypes.func.isRequired,
// 	parentData: PropTypes.string.isRequired,
// 	setOpType: PropTypes.func.isRequired,
// 	nodeData: PropTypes.object.isRequired,
// 	setAppParamData: PropTypes.func.isRequired,
// 	setPageButtonData: PropTypes.func.isRequired,
// 	setPageTemplateData: PropTypes.func.isRequired,
// 	getFromData: PropTypes.func.isRequired,
// 	addTreeData: PropTypes.func.isRequired,
// 	delTreeData: PropTypes.func.isRequired,
// 	updateTreeData: PropTypes.func.isRequired,
// 	setParentData: PropTypes.func.isRequired,
// 	reqTreeData: PropTypes.func.isRequired
// };
// export default connect(
// 	(state) => ({
// 		optype: state.AppRegisterData.optype,
// 		billStatus: state.AppRegisterData.billStatus,
// 		parentData: state.AppRegisterData.parentData,
// 		nodeData: state.AppRegisterData.nodeData,
// 		getFromData: state.AppRegisterData.getFromData,
// 		addTreeData: state.AppRegisterData.addTreeData,
// 		delTreeData: state.AppRegisterData.delTreeData,
// 		updateTreeData: state.AppRegisterData.updateTreeData,
// 		reqTreeData: state.AppRegisterData.reqTreeData
// 	}),
// 	{
// 		setNodeData,
// 		setBillStatus,
// 		setOpType,
// 		setAppParamData,
// 		setPageButtonData,
// 		setPageTemplateData,
// 		setParentData
// 	}
// )(templateSetting);
