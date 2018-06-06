import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Button, Layout, Modal, Tree, Input, Select } from 'antd';
import { PageLayout } from 'Components/PageLayout';
import Ajax from 'Pub/js/ajax.js';
import Item from 'antd/lib/list/Item';
import Notice from 'Components/Notice';
import BusinessUnitTreeRef from "Components/Refers/BusinessUnitTreeRef";
import 'nc-lightapp-front/dist/platform/nc-lightapp-front/index.css';
const Option = Select.Option;
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const initRoTreeData = [{
	key: '1000',
	id: '',
	text: '角色',
	name: '角色',
	children: []
}];
const initTreeData = [{
	key: '0',
	systypename: '应用节点',
	moduleid: '',
	text: '应用节点',
	children: []
}];
const { Header, Footer, Sider, Content } = Layout;
import './index.less';
import { generateData, generateTemData, generateTreeData, generateRoData } from './method';
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
class TemplateSetting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siderHeight: "280",
			expandedKeys: ['0'],
			selectedKeys: [],
			treeDataArray: [],
			treeData: [],
			searchValue: '',
			autoExpandParent: true,
			treeTemData: [],
			treeTemDataArray: [],
			templatePks: '',
			visible: false,
			templateNameVal: '',
			pageCode: '0001Z51000000008ABZI',
			alloVisible: false,
			treeRoData: [],
			treeRoDataArray: [],
            org_df_biz: {// 默认业务单元
                refcode: "",
                refname: "",
                refpk: ""
            }
		};
	}
	// 按钮显隐性控制
	setBtnsShow = (item) => {
		let { name } = item;
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
				isShow = true;
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
	//保存
	handleOk = (e) => {
		let { templateNameVal, templateTitleVal, templatePks, pageCode } = this.state;
		if(!templateNameVal){
			Notice({ status: 'warning', msg: "请输入模板标题" });
			return ;
		}
		let infoData={
			"pageCode": pageCode,"templateId": "0001A110000000002475" ,"name":""
		}
		infoData.templateId=templatePks;
		infoData.name=templateNameVal;
		//infoData.pageCode=pageCode;
		Ajax({
			url: `/nccloud/platform/template/copyTemplate.do`,
			data: infoData,
			info:{
				name:'模板设置',
				action:'模板复制'
			},
			success: ({
				data
			}) => {
				if (data.success) {
					this.reqTreeTemData(pageCode)
					this.setState({
						visible: false,
						templateNameVal:'',
					});
				}
			}
		});
	}
	//取消
	handleCancel = (e) => {
		this.setState({
			visible: false,
			templateNameVal:'',
		});
	}
	//按钮事件的触发
	handleClick = (btnName) => {
		let { templateNameVal, templatePks, pageCode } = this.state;
		if(!templatePks){
			Notice({ status: 'warning', msg: "请选择模板数据" });
			return;
		}
		switch (btnName) {
			case '复制':
				this.setState({
					visible: true,
				});
				break;
			case '新增':
				this.props.history.push('/Zone');
				break;
			case '删除':
				confirm({
					title: '确认删除这个模板信息吗?',
					onOk() {
						let infoData={
							"templateId": templatePks 
						}
						Ajax({
							url: `/nccloud/platform/template/deleteTemplateDetail.do`,
							data: infoData,
							info:{
								name:'模板设置',
								action:'删除'
							},
							success: ({
								data
							}) => {
								if (data.success) {
									this.reqTreeTemData(pageCode)
								}
							}
						});
					},
					onCancel() {
						console.log('Cancel');
					},
				});
				break;
			case '分配':
				this.setState({
					alloVisible:true
				})
				this.reqRoTreeData();
				break;
			default:
				break;
			}
		}
	componentDidMount = () => {
		let {
			treeData
		} = this.state;
		treeData = initTreeData;
		this.setState({
			treeData
		}, this.reqTreeData);
		// 样式处理
		// window.onresize = () => {
		// 	let siderHeight = document.querySelector('.ant-layout-content').offsetHeight;
		// 	this.setState({ siderHeight });
		// };
	};
	//右侧树组装数据
	restoreTreeTemData = ()=>{
		let {
			treeTemData,
			treeTemDataArray
		} = this.state;
		let treeInfo = generateTemData(treeTemDataArray);
		let {
			treeArray,
			treeObj
		} = treeInfo;
		treeArray.map((item, index)=>{
			for (const key in treeObj) {
				if (treeObj.hasOwnProperty(key)) {
					if(item.templateId===treeObj[key][0].parentId){
						item.children.push(treeObj[key][0]);
					}
				}
			}
		})
		//处理树数据
		treeTemData = treeInfo.treeArray;
		treeTemData = generateTreeData(treeTemData);
		this.setState({
			treeTemData
		});
	}
	 // 将平铺树数组转换为树状数组
	restoreTreeData = () => {
		let {
			treeData,
			treeDataArray
		} = this.state;
		let treeInfo = generateData(treeDataArray);
		let {
			treeArray,
			treeObj
		} = treeInfo;
		for (const key in treeObj) {
			if (treeObj.hasOwnProperty(key)) {
				const element = treeObj[key];
				if (element.length > 0) {
					treeObj[key] = element.map((item, index) => {
						if (treeObj[item.moduleid]) {
							item.children = treeObj[item.moduleid];
						} else if (treeObj[item.systypecode]) {
							item.children = treeObj[item.systypecode];
						}
						return item;
					});
				}
			}
		}
		treeArray = treeArray.map((item, index) => {
			if (treeObj[item.moduleid]) {
				item.children = treeObj[item.moduleid];
			}
			return item;
		});
		// 处理树数据
		treeData[0].children = treeInfo.treeArray;
		treeData = generateTreeData(treeData);
		this.setState({
			treeData
		});
	};
	onExpand = (expandedKeys) => {
		this.setState({
			expandedKeys,
			autoExpandParent: false
		});
	};
	onChange = (e) => {
		const value = e.target.value;
		this.setState({
			expandedKeys,
			searchValue: value,
			autoExpandParent: true
		});
	};
	//加载右侧模板数据
	onSelectQuery = (key, e) => {
		this.reqTreeTemData(key[0]);
	};
	//请求右侧树数据
	reqTreeTemData = (key)=>{
		let infoData={
			"pageCode": "0001Z51000000008ABZI","orgId": "0001A110000000002475" 
		}
		//infoData.pageCode=key;
		Ajax({
			url: `/nccloud/platform/template/getTemplatesOfPage.do`,
			data: infoData,
			info:{
				name:'模板设置',
				action:'参数查询'
			},
			success: ({
				data
			}) => {
				if (data.success && data.data.length > 0) {
					this.setState({
						treeTemDataArray: data.data,
						pageCode:key
					}, this.restoreTreeTemData);
				}
			}
		});
	}
	onSelect = (key, e)=>{
		this.setState({
			templatePks: key[0]
		});
	}
	/**
	 * tree 数据请求
	 */
	reqTreeData = () => {
		Ajax({
			url: `/nccloud/platform/appregister/querymodules.do`,
			info: {
				name:'应用注册模块',
				action:'查询'
			},
			success: ({
				data
			}) => {
				if (data.success && data.data.length > 0) {
					this.setState({
						treeDataArray: data.data
					}, this.restoreTreeData);
				}
			}
		});
	};
	reqRoTreeData = ()=>{
		let infoData={
			"orgId": "0001A1100000000005T5"
		}
		Ajax({
			url: `/nccloud/platform/template/getAllRoleUserAndResp.do`,
			info: {
				name:'应用注册模块',
				action:'角色和用户职责'
			},
			data: infoData,
			success: ({
				data
			}) => {
				if (data.success&&data.data) {
					this.restoreRoTreeData(data.data)
				}
			}
		});
	}
	restoreRoTreeData = (data)=>{
		let {
			treeRoData
		} = this.state;
		let initRolesData = initRoTreeData;
		let initUsersData = initRoTreeData;
		initUsersData.text='用户';
		initUsersData.name='用户';
		initRolesData.children = generateRoData(data.roles);
		initUsersData.children = generateRoData(data.users);
		treeRoData.push(initRolesData);
		treeRoData.push(initUsersData);
		treeRoData = generateTreeData(treeRoData);
		this.setState({
			treeRoData
		});
	}
	handleChange = ()=>{

	}
	handleFocus = ()=>{

	}
	handleBlur = ()=>{
		
	}
	handleAlloOk = ()=>{
		this.setState({
			alloVisible:false
		})
	}
	handleOrlCancel = ()=>{
		this.setState({
			alloVisible:false
		})
	}
	handdleRefChange = (value, type) => {
        let {refname, refcode, refpk} = value;
        let obj = {};
        obj[type] = {};
        obj[type]["refname"] = refname;
        obj[type]["refcode"] = refcode;
        obj[type]["refpk"] = refpk;
        this.setState(obj);
    };
	render() {
		const {
			expandedKeys,
			searchValue,
			autoExpandParent,
			selectedKeys,
			treeData,
			treeTemData,
			templateNameVal,
			visible,
			alloVisible,
			pageCode,
			org_df_biz,
			treeRoData
		} = this.state;
		const loop = (data) => {
			return data.map((item) => {
				let {
					text,
					key,
					children
				} = item;
				const index = text.indexOf(searchValue);
				const beforeStr = text.substr(0, index);
				const afterStr = text.substr(index + searchValue.length);
				const title = index > -1 ? ( 
					<span> 
						{beforeStr} 
						<span style = {{color: '#f50'}} > 
							{searchValue} 
						</span>
							{afterStr} 
					</span>
				) : (
					<div>
						<span> {text} </span> 
					</div>
				);
				if (children) {
					return ( <TreeNode key = {key} title = {title} > {loop(children)} </TreeNode>
					);
				}
				return <TreeNode key = {key} title = {title}
				/>;
			});
		};
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
							<div>
								<Search 
								style = {{marginBottom: 8}}
								placeholder = 'Search'
								onChange = {this.onChange}
								/> 
								{treeData.length > 0 && treeData[0].children.length > 0 && ( 
									<Tree showLine onExpand = {this.onExpand}
									expandedKeys = {expandedKeys}
									onSelect = {this.onSelectQuery}
									autoExpandParent = {autoExpandParent}
									selectedKeys = {selectedKeys} >
									{loop(treeData)} 
									</Tree>
								)} 
							</div>
						</Sider>
						<Content style={{ padding: '20px', minHeight: 280 }}>
							<Tree showLine 
								onExpand = {this.onExpand}
								expandedKeys = {expandedKeys}
								onSelect = {this.onSelect}
								autoExpandParent = {autoExpandParent}
								selectedKeys = {selectedKeys} >
								{loop(treeTemData)} 
							</Tree>
						</Content>
						<Modal
							title="请录入正确的模板名称和标题"
							visible={visible}
							onOk={this.handleOk}
							onCancel={this.handleCancel}
        				>
							<div>
								<Input placeholder="模板名称" value={templateNameVal}  onChange={(e)=>{
									const templateNameVal = e.target.value;
									this.setState({
										templateNameVal
									})
								}} style={{marginBottom:"20px"
								}}/>
							</div>
        				</Modal>
						<Modal
							title="多角色和用户模板分配"
							visible={alloVisible}
							onOk={this.handleAlloOk}
							onCancel={this.handleOrlCancel}
        				>
							<div>
								<p><span>功能节点：</span><span>{pageCode ?pageCode:""}</span></p>
								<div>
									<div style={{display:'flex',justifyContent:'space-between',padding:'10px 20px'}}>
										<Select
											showSearch
											style={{ width: 200 }}
											placeholder="按角色和用户分配"
											optionFilterProp="children"
											onChange={this.handleChange}
											onFocus={this.handleFocus}
											onBlur={this.handleBlur}
											filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
										>
											<Option value="按角色和用户分配">按角色和用户分配</Option>
											<Option value="按职责分配">按职责分配</Option>
										</Select>
										<BusinessUnitTreeRef
											value={org_df_biz}
											placeholder={"默认业务单元"}
											onChange={value => {
												this.handdleRefChange(value, "org_df_biz");
											}}
                    					/>
									</div>
									<div style={{display:'flex',justifyContent:'space-between'}}>
										<div>
											<Search 
											style = {{marginBottom: 8}}
											placeholder = 'Search'
											onChange = {this.onChange}
											/> 
											{treeRoData.length > 0 && treeRoData[0].children.length > 0 && ( 
												<Tree showLine onExpand = {this.onExpand}
												expandedKeys = {expandedKeys}
												onSelect = {this.onSelectQuery}
												autoExpandParent = {autoExpandParent}
												selectedKeys = {selectedKeys} >
												{loop(treeRoData)} 
												</Tree>
											)} 
										</div>
										<div>
											<Button className="margin-left-10">
												分配
											</Button>
											<Button className="margin-left-10">
												取消分配
											</Button>
										</div>
										<div style={{ padding: '20px', minHeight: 280 }}>
											<p>fdasdfdasfdsddsafd</p>
										</div>
									</div>
								</div>
							</div>
        				</Modal>
					</Layout>
				</Layout>
			</PageLayout>
		);
	}
}
export default TemplateSetting


