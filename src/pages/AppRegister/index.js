import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Layout } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setNodeData, setBillStatus, setOpType, setAppData, setParentData } from 'Store/AppRegister/action';
import Ajax from 'Pub/js/ajax';
import SearchTree from './SearchTree';
import ModuleFromCard from './ModuleFromCard';
import ClassFromCard from './ClassFromCard';
import AppFromCard from './AppFromCard';
import PageLayout from 'Components/PageLayout';
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
				if (this.nodeData.apptype) {
					this.props.setParentData(this.nodeData.parent_id);
				} else {
					// if (this.props.parentData === this.nodeData.parent_id) {
					this.props.setParentData(this.nodeData.code);
					// }
				}

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
					width: 1,
					height: 1,
					target_path: '',
					apptype: 1,
					image_src: ''
				};
				this.props.setAppData({
					appParamVOs: [],
					appButtonVOs: []
				});
				this.props.setNodeData(appData);
				this.props.setOpType('app');
				this.props.setBillStatus({
					isEdit: true,
					isNew: true
				});
				break;
			case '保存':
				let fromData = this.props.getFromData();
				console.log(fromData);

				if (!fromData) {
					return;
				}

				let isNew = this.props.billStatus.isNew;
				let reqData;
				/**
				 * @param {Number} this.actionType
				 * 
				 * 1 -> 模块
				 * 2 -> 应用分类
				 * 3 -> 应用
				 */
				switch (this.actionType) {
					case 1:
						if (isNew) {
							url = `/nccloud/platform/appregister/insertmodule.do`;
						} else {
							url = `/nccloud/platform/appregister/editmodule.do`;
						}
						if (this.props.parentData) {
							fromData.parentcode = this.props.parentData;
						}
						reqData = fromData;
						break;
					case 2:
						if (isNew) {
							url = `/nccloud/platform/appregister/insertapp.do`;
						} else {
							url = `/nccloud/platform/appregister/editapp.do`;
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
						} else {
							url = `/nccloud/platform/appregister/editapp.do`;
						}
						fromData.parent_id = this.props.parentData;
						// if (this.optype === 'classify') {
						// 	fromData.parent_id = this.nodeData.moduleid;
						// } else {
						// 	fromData.parent_id = this.props.parentData;
						// }
						reqData = { ...this.props.nodeData, ...fromData };
						break;
					default:
						break;
				}
				Ajax({
					url: url,
					data: reqData,
					alert: true,
					success: ({ data }) => {
						if (data.success && data.data) {
							if (isNew) {
								if (this.props.optype === 'classify' || this.props.optype === 'app') {
									let treeData = {
										moduleid: data.data.pk_appregister,
										parentcode: this.props.parentData,
										systypecode: data.data.code,
										systypename: data.data.name
									};
									this.props.addTreeData(treeData);
								} else {
									this.props.addTreeData(reqData);
								}
								this.props.setNodeData(data.data);
							} else {
								if (this.props.optype === 'classify' || this.props.optype === 'app') {
									let treeData = {
										moduleid: reqData.pk_appregister,
										parentcode: this.props.parentData,
										systypecode: reqData.code,
										systypename: reqData.name
									};
									this.props.updateTreeData(treeData);
								} else {
									this.props.updateTreeData(reqData);
								}
								this.props.setNodeData(reqData);
							}
							this.props.setBillStatus({
								isEdit: false,
								isNew: false
							});
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
						data = {
							moduleid: this.props.nodeData.moduleid
						};
						nodeData = this.props.nodeData;
						break;
					case 'classify':
						url = `/nccloud/platform/appregister/deleteapp.do`;
						data = {
							pk_appregister: this.props.nodeData.pk_appregister
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
						data = {
							pk_appregister: this.props.nodeData.pk_appregister
						};
						nodeData = {
							moduleid: pk_appregister,
							parentcode: this.props.parentData,
							systypecode: code,
							systypename: name
						};
						break;
					default:
						break;
				}
				Ajax({
					url: url,
					data: data,
					success: ({ data }) => {
						if (data.success && data.data) {
							this.props.delTreeData(nodeData);
							this.props.setOpType(null);
						}
					}
				});
				console.log(`删除 ${nodeData}`);
				break;
			case '修改':
				this.nodeData = this.props.nodeData;
				this.optype = this.props.optype;
				console.log(this.optype);
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
				<Button className='margin-left-10' type={type} onClick={this.handleClick.bind(this, name)}>
					{name}
				</Button>
			);
		}
	};
	switchFrom = () => {
		let optype = this.props.optype;
		switch (optype) {
			case 'module':
				return <ModuleFromCard />;
				break;
			case 'classify':
				return <ClassFromCard />;
			case 'app':
				return <AppFromCard />;
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
					if (optype === '' || optype === 'module') {
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
					if (
						(optype === 'module' && parentData && parentData.length === 2) ||
						(optype === 'classify' && parentData && parentData.length === 4)
					) {
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
					if (optype === 'classify' || optype === 'app') {
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
			<PageLayout className='nc-workbench-appRegister'>
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
								'min-height': 'calc(100vh - 64px - 48px)',
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
AppRegister.PropTypes = {
	setTreeData: PropTypes.func.isRequired,
	optype: PropTypes.string.isRequired,
	billStatus: PropTypes.object.isRequired,
	setBillStatus: PropTypes.object.isRequired,
	parentData: PropTypes.string.isRequired,
	setOpType: PropTypes.func.isRequired,
	nodeData: PropTypes.object.isRequired,
	setAppData: PropTypes.func.isRequired,
	getFromData: PropTypes.func.isRequired,
	addTreeData: PropTypes.func.isRequired,
	delTreeData: PropTypes.func.isRequired,
	updateTreeData: PropTypes.func.isRequired,
	setParentData: PropTypes.func.isRequired
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
		updateTreeData: state.AppRegisterData.updateTreeData
	}),
	{
		setNodeData,
		setBillStatus,
		setOpType,
		setAppData,
		setParentData
	}
)(AppRegister);
