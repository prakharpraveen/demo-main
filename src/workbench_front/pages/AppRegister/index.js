import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Layout } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
	setNodeData,
	setBillStatus,
	setOpType,
	setAppParamData,
	setPageButtonData,
	setPageTemplateData,
	setParentData
} from 'Store/AppRegister/action';
import Ajax from 'Pub/js/ajax';
import SearchTree from './SearchTree';
import ModuleFormCard from './ModuleFormCard';
import ClassFormCard from './ClassFormCard';
import AppFormCard from './AppFormCard';
import PageFromCard from './PageFromCard';
import { PageLayout } from 'Components/PageLayout';
import Notice from 'Components/Notice';
import './index.less';
const { Header, Footer, Sider, Content } = Layout;
/**
 * 工作桌面 首页 页面
 * 各个此贴应用及工作台中的小部件 通过 js 片段进行加载渲染
 */
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
class AppRegister extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siderHeight: '280'
		};
		this.nodeData;
		this.optype;
		this.actionType;
	}
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
			case '增加应用分类':
				this.actionType = 2;
				this.nodeData = this.props.nodeData;
				if (this.props.parentData === this.nodeData.parentcode) {
					this.props.setParentData(this.nodeData.moduleid);
				}
				this.optype = this.props.optype;
				let classData = {
					apptype: 0,
					isenable: true,
					code: '',
					name: '',
					app_desc: '',
					help_name: ''
				};
				this.props.setNodeData(classData);
				this.props.setOpType('classify');
				this.props.setBillStatus({
					isEdit: true,
					isNew: true
				});
				break;
			case '增加应用':
				this.actionType = 3;
				this.nodeData = this.props.nodeData;
				this.props.setParentData(this.nodeData.pk_appregister);

				this.optype = this.props.optype;
				let appData = {
					code: '',
					name: '',
					orgtypecode: undefined,
					funtype: undefined,
					app_desc: '',
					help_name: '',
					isenable: true,
					iscauserusable: false,
					uselicense_load: true,
					pk_group: '',
					width: '1',
					height: '1',
					target_path: '',
					apptype: 1,
					image_src: ''
				};
				this.props.setAppParamData([]);
				this.props.setNodeData(appData);
				this.props.setOpType('app');
				this.props.setBillStatus({
					isEdit: true,
					isNew: true
				});
				break;
			case '增加页面':
				this.actionType = 4;
				this.optype = this.props.optype;
				this.nodeData = this.props.nodeData;
				this.props.setParentData(this.nodeData.pk_appregister);
				let pageData = {
					pagecode: '',
					pagename: '',
					pagedesc: '',
					pageurl: '',
					resid: '',
					isdefault: false
				};
				this.props.setPageButtonData([]);
				this.props.setPageTemplateData([]);
				this.props.setNodeData(pageData);
				this.props.setOpType('page');
				this.props.setBillStatus({
					isEdit: true,
					isNew: true
				});
				break;
			case '保存':
				let fromData = this.props.getFromData();
				if (!fromData) {
					return;
				}

				let isNew = this.props.billStatus.isNew;
				let reqData, info;
				/**
				 * @param {Number} this.actionType
				 * 
				 * 1 -> 模块
				 * 2 -> 应用分类
				 * 3 -> 应用
				 * 4 -> 页面
				 */
				switch (this.actionType) {
					case 1:
						if (isNew) {
							url = `/nccloud/platform/appregister/insertmodule.do`;
							info = {
								name: '模块',
								action: '新增'
							};
						} else {
							url = `/nccloud/platform/appregister/editmodule.do`;
							info = {
								name: '模块',
								action: '编辑'
							};
						}
						if (this.props.parentData) {
							fromData.parentcode = this.props.parentData;
						}
						reqData = fromData;
						break;
					case 2:
						if (isNew) {
							url = `/nccloud/platform/appregister/insertapp.do`;
							info = {
								name: '应用',
								action: '新增'
							};
						} else {
							url = `/nccloud/platform/appregister/editapp.do`;
							info = {
								name: '应用',
								action: '编辑'
							};
						}
						if (this.optype === 'module') {
							fromData.parent_id = this.nodeData.moduleid;
						} else {
							fromData.parent_id = this.props.parentData;
						}
						reqData = { ...this.props.nodeData, ...fromData };
						break;
					case 3:
						if (isNew) {
							url = `/nccloud/platform/appregister/insertapp.do`;
							info = {
								name: '应用',
								action: '新增'
							};
						} else {
							url = `/nccloud/platform/appregister/editapp.do`;
							info = {
								name: '应用',
								action: '编辑'
							};
						}
						fromData.parent_id = this.props.parentData;
						reqData = { ...this.props.nodeData, ...fromData };
						break;
					case 4:
						if (isNew) {
							url = `/nccloud/platform/appregister/insertpage.do`;
							info = {
								name: '页面',
								action: '新增'
							};
						} else {
							url = `/nccloud/platform/appregister/editpage.do`;
							info = {
								name: '页面',
								action: '编辑'
							};
						}
						fromData.parent_id = this.props.parentData;
						reqData = { ...this.props.nodeData, ...fromData };
						break;
					default:
						break;
				}
				Ajax({
					url: url,
					data: reqData,
					info: info,
					alert: true,
					success: ({ data }) => {
						if (data.success && data.data) {
							Notice({ status: 'success' });
							this.props.setBillStatus({
								isEdit: false,
								isNew: false
							});
							if (isNew) {
								this.props.reqTreeData();
								this.props.setNodeData(data.data);
							} else {
								if (this.props.optype === 'classify' || this.props.optype === 'app') {
									let treeData = {
										moduleid: reqData.pk_appregister,
										parentcode: this.props.parentData,
										systypecode: reqData.code,
										systypename: reqData.name,
										flag: '1'
									};
									this.props.updateTreeData(treeData);
								} else if (this.props.optype === 'page') {
									let treeData = {
										moduleid: data.data.pk_apppage,
										parentcode: this.props.parentData,
										systypecode: data.data.pagecode,
										systypename: data.data.pagename,
										flag: '2'
									};
									this.props.updateTreeData(treeData);
								} else {
									this.props.updateTreeData({ ...reqData, flag: '0' });
								}
								this.props.setNodeData(reqData);
							}
						} else {
							Notice({ status: 'error', msg: res.error.message });
						}
					}
				});
				// 保存成功之后记得更新数据 获取到当前节点id 之后 选中 新增的节点
				// console.log(reqData);
				break;
			case '取消':
				this.props.setOpType(this.optype);
				this.props.setNodeData(this.nodeData);
				this.props.setBillStatus({
					isEdit: false,
					isNew: false
				});
				break;
			case '删除':
				let data, nodeData;
				let { pk_appregister, code, name } = this.props.nodeData;
				switch (this.props.optype) {
					case 'module':
						url = `/nccloud/platform/appregister/deletemodule.do`;
						info = {
							name: '模块',
							action: '删除'
						};
						data = {
							moduleid: this.props.nodeData.moduleid
						};
						nodeData = this.props.nodeData;
						break;
					case 'classify':
						url = `/nccloud/platform/appregister/deleteapp.do`;
						info = {
							name: '应用',
							action: '删除'
						};
						data = {
							pk_appregister: pk_appregister
						};
						nodeData = {
							moduleid: pk_appregister,
							parentcode: this.props.parentData,
							systypecode: code,
							systypename: name
						};
						break;
					case 'app':
						url = `/nccloud/platform/appregister/deleteapp.do`;
						info = {
							name: '应用',
							action: '删除'
						};
						data = {
							pk_appregister: pk_appregister
						};
						nodeData = {
							moduleid: pk_appregister,
							parentcode: this.props.parentData,
							systypecode: code,
							systypename: name
						};
						break;
					case 'page':
						url = `/nccloud/platform/appregister/deletepage.do`;
						info = {
							name: '页面',
							action: '删除'
						};
						data = {
							pk_apppage: this.props.nodeData.pk_apppage
						};
						nodeData = {
							moduleid: this.props.nodeData.pk_apppage,
							parentcode: this.props.parentData,
							systypecode: this.props.nodeData.pagecode,
							systypename: this.props.nodeData.pagename
						};
						break;
					default:
						break;
				}
				Ajax({
					url: url,
					data: data,
					info: info,
					success: ({ data }) => {
						if (data.success && data.data) {
							Notice({ status: 'success', msg: data.data.true });
							this.props.delTreeData(nodeData);
							this.props.setOpType(null);
						} else {
							Notice({ status: 'error', msg: data.data.true });
						}
					}
				});
				break;
			case '修改':
				this.nodeData = this.props.nodeData;
				this.optype = this.props.optype;
				switch (this.optype) {
					case 'module':
						this.actionType = 1;
						break;
					case 'classify':
						this.actionType = 2;
						break;
					case 'app':
						this.actionType = 3;
						break;
					case 'page':
						this.actionType = 4;
						break;
					default:
						break;
				}
				this.props.setBillStatus({
					isEdit: true,
					isNew: false
				});
				break;
			default:
				break;
		}
	};
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
	switchFrom = () => {
		let optype = this.props.optype;
		switch (optype) {
			case 'module':
				return <ModuleFormCard />;
				break;
			case 'classify':
				return <ClassFormCard />;
			case 'app':
				return <AppFormCard />;
			case 'page':
				return <PageFromCard />;
			default:
				return '';
		}
	};
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
	componentDidMount() {
		// 样式处理
		window.onresize = () => {
			let siderHeight = document.querySelector('.ant-layout-content').offsetHeight;
			this.setState({ siderHeight });
		};
	}

	render() {
		return (
			<PageLayout className="nc-workbench-appRegister">
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
						<Content style={{ padding: '20px', minHeight: 280 }}>{this.switchFrom()}</Content>
					</Layout>
				</Layout>
			</PageLayout>
		);
	}
}
AppRegister.propTypes = {
	optype: PropTypes.string.isRequired,
	billStatus: PropTypes.object.isRequired,
	setBillStatus: PropTypes.func.isRequired,
	parentData: PropTypes.string.isRequired,
	setOpType: PropTypes.func.isRequired,
	nodeData: PropTypes.object.isRequired,
	setAppParamData: PropTypes.func.isRequired,
	setPageButtonData: PropTypes.func.isRequired,
	setPageTemplateData: PropTypes.func.isRequired,
	getFromData: PropTypes.func.isRequired,
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
		getFromData: state.AppRegisterData.getFromData,
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
)(AppRegister);
