import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Button, Layout, Modal, Tree, Input, Select, Menu, Dropdown, Icon } from 'antd';
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
const initRoTreeData = {
	key: 'abc1234567',
	id: 'abc1234567',
	text: '角色',
	name: '角色',
	children: []
};
const initUserTreeData = {
	key: 'abc2234567',
	id: 'abc2234567',
	text: '用户',
	name: '用户',
	children: []
};
const initAbiTreeData = {
	key: 'abc3334567',
	id: 'abc3334567',
	text: '职责',
	name: '职责',
	children: []
};
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
			pageCode: '',
			alloVisible: false,
			treeRoData: [],
			treeResData: [],
            org_df_biz: {// 默认业务单元
                refcode: "",
                refname: "",
                refpk: ""
			},
			treeRoVisible: true,
			dataRoKey: '',
			dataRoObj:{},
			roleUserDatas:{},
			allowDataArray:[],
			treeAllowedData:[],
			allowedTreeKey:'',
			orgidObj:{},
			treeRoDataObj:{}
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
			"pageCode": pageCode,"templateId": templatePks ,"name":templateNameVal
		}
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
	menuFun  =()=>{
		return(
			<Menu onClick={this.settingClick.bind(this)}>
			  <Menu.Item key="设置默认">
				<p>设置默认</p>
			  </Menu.Item>
			  <Menu.Divider />
			  <Menu.Item key="取消默认"><p>取消默认</p></Menu.Item>
			</Menu>
		  )
	};
	settingClick = (key)=>{
		let { templateNameVal, templatePks, pageCode } = this.state;
		let infoDataSet={
			"templateId": templatePks ,"pageCode":pageCode
		}
		const btnName=key.key;
		if(!templatePks){
			Notice({ status: 'warning', msg: "请选择模板数据" });
			return;
		}
		switch (btnName) {
			case '设置默认':
				let urlSetting='/nccloud/platform/template/setDefaultTemplate.do';
				this.setDefaultFun(urlSetting, infoDataSet, "设置成功");
				break;
			case '取消默认':
				let urlCancel='/nccloud/platform/template/cancelDefaultTemplate.do';
				this.setDefaultFun(urlCancel, infoDataSet, "取消成功");
				break;
			default:
				break;
		}
	}
	//按钮事件的触发
	handleClick = (btnName) => {
		let { templateNameVal, templatePks, pageCode } = this.state;
		let infoData={
			"templateId": templatePks 
		}
		switch (btnName) {
			case '复制':
				if(!templatePks){
					Notice({ status: 'warning', msg: "请选择模板数据" });
					return;
				}
				this.setState({
					visible: true,
				});
				break;
			case '修改':
				if(!templatePks){
					Notice({ status: 'warning', msg: "请选择模板数据" });
					return;
				}
				this.props.history.push(`/Zone?templetid=${templatePks}`);
			break;
			case '新增':
				this.props.history.push('/Zone');
				break;
			case '删除':
				if(!templatePks){
					Notice({ status: 'warning', msg: "请选择模板数据" });
					return;
				}
				confirm({
					title: '确认删除这个模板信息吗?',
					onOk() {
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
					},
				});
				break;
			case '分配':
				this.setState({
					alloVisible:true
				})
				break;
			default:
				break;
			}
		}
	setDefaultFun = (url, infoData, textInfo)=>{
		let { pageCode }=this.state;
		Ajax({
			url: url,
			data: infoData,
			info:{
				name:'模板设置',
				action:'参数查询'
			},
			success: ({
				data
			}) => {
				if (data.success) {
					Notice({ status: 'success', msg: textInfo });
					this.reqTreeTemData(pageCode)
				}
			}
		});
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
		treeTemDataArray.map((item)=>{
			if(item.isDefault==='y'){
				item.name=item.name+' [默认]'
			}
		})
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
		this.setState({
			pageCode:key[0]
		},this.reqTreeTemData)
	};
	//请求右侧树数据
	reqTreeTemData = (key)=>{
		let {pageCode}=this.state;
		let infoData={
			"pageCode": pageCode
		}
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
				if (data.success) {
					this.setState({
						treeTemDataArray: data.data
					}, this.restoreTreeTemData);
				}
			}
		});
	}
	onSelect = (key, e)=>{
		this.setState({
			templatePks: key[0]
		},this.lookTemplateNameVal);
	}
	lookTemplateNameVal = ()=>{
		let { templateNameVal, treeTemData, templatePks }=this.state;
		for(let i=0;i<treeTemData.length;i++){
			if(treeTemData[i].children&&treeTemData[i].children.length>0){
				let childrenDatas=treeTemData[i].children;
				childrenDatas.map((ele)=>{
					if(ele.templateId===templatePks){
						templateNameVal=ele.text;
					}
				})
			}
		}
		this.setState({
			templateNameVal
		})
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
	reqAllowTreeData = ()=>{
		let { pageCode, templatePks, orgidObj }=this.state;
		let infoData={
			"pageCode":pageCode,"orgId": orgidObj.refpk,"templateId":templatePks
		}
		Ajax({
			url: `/nccloud/platform/template/listAssignmentsOfTemplate.do`,
			info: {
				name:'模板设置模块',
				action:'已分配用户和职责'
			},
			data: infoData,
			success: ({
				data
			}) => {
				if (data.success) {
					this.setState({
						allowDataArray:data.data
					},this.restoreAllowedTree)
				}
			}
		});
	}
	restoreAllowedTree = ()=>{
		let { allowDataArray, treeAllowedData }=this.state;
		allowDataArray.map((item)=>{
			item.text = item.name+item.code;
			item.key = item.id;
		})
		treeAllowedData=generateTreeData(allowDataArray);
		this.setState({
			treeAllowedData
		});
	};
	reqRoTreeData = ()=>{
		let { orgidObj }=this.state;
		let infoData={
			"orgId": orgidObj.refpk
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
					if(data.data.roles||data.data.users){
						this.setState({
							treeRoDataObj:data.data
						},this.restoreRoTreeData)
					}else if(data.data.resps){
						this.restoreResTreeData(data.data.resps);
					}
					this.setState({
						roleUserDatas:data.data
					})
					this.reqAllowTreeData();
				}
			}
		});
	}
	restoreResTreeData = (data)=>{
		let {
			treeResData
		} = this.state;
		treeResData=[];
		let initResData = initAbiTreeData;
		data.map((item, index) => {
			let {
				code,
				id,
				name
			} = item;
			item.key = id;
			item.text = name+code;
		});
		initResData.children = data;
		treeResData.push(initResData);
		this.setState({
			treeResData
		});
	}
	restoreRoTreeData = (data)=>{
		let {
			treeRoData,
			treeRoDataObj
		} = this.state;
		treeRoData=[];
		let initRolesData = initRoTreeData;
		let initUsersData = initUserTreeData;
		initRolesData.children = generateRoData(treeRoDataObj.roles);
		initUsersData.children = generateRoData(treeRoDataObj.users);
		treeRoData.push(initRolesData);
		treeRoData.push(initUsersData);
		treeRoData = generateTreeData(treeRoData);
		this.setState({
			treeRoData
		});
	}
	selectRoFun = (key, e)=>{
		this.setState({
			dataRoKey: key[0]
		},this.lookDataFun)
	}
	lookDataFun = ()=>{
		let {dataRoKey, dataRoObj, roleUserDatas}=this.state;
		if(!dataRoKey){
			Notice({ status: 'warning', msg: "请选中信息" });
			return ;
		}
		for(let key in roleUserDatas){
			roleUserDatas[key].map((item, index)=>{
				if(item.id===dataRoKey){
					dataRoObj.id=item.id;
					dataRoObj.name=item.name;
					dataRoObj.code=item.code;
					if(key==='users'){
						dataRoObj.type='user';
					}else if(key==='roles'){
						dataRoObj.type='role';
					}else if(key==='resps'){
						dataRoObj.type='resp';
					}
				}
			})
		}
		this.setState({
			dataRoObj
		})
	}
	allowClick = (name)=>{
		let { dataRoObj, allowDataArray, treeAllowedData, allowedTreeKey}=this.state;
		let allowDataObj={};
		switch(name){
			case 'allowRole':
				let indexNum="-1";
				if(allowDataArray&&allowDataArray.length>0){
					for(let i=0;i<allowDataArray.length;i++){
						if(allowDataArray[i].id===dataRoObj.id){
							indexNum=1;
						}
					}
				}
				if(Number(indexNum)<=0){
					allowDataObj.id=dataRoObj.id;
					allowDataObj.name=dataRoObj.name;
					allowDataObj.code=dataRoObj.code;
					allowDataObj.type=dataRoObj.type;
					allowDataArray.push(allowDataObj);
				}
				allowDataArray.map((item)=>{
					item.text = item.name+item.code;
					item.key = item.id;
				})
				treeAllowedData=generateTreeData(allowDataArray);
				break;
			case 'allowRoleCancel':
				if(!allowedTreeKey){
					Notice({ status: 'warning', msg: "请选中信息" });
					return ;
				}
				Array.prototype.remove = function(val) {
					let index = this.indexOf(val);
					if (index > -1) {
						this.splice(index, 1);
					}
				};
				for(let i=0;i<treeAllowedData.length;i++){
					if(treeAllowedData[i].id===allowedTreeKey){
						treeAllowedData.remove(treeAllowedData[i]);
					}
				}
			break;
			default:
			break;
		}
		this.setState({
			treeAllowedData,
			allowDataArray
		})
	}
	onSelectedAllow = (key)=>{
		this.setState({
			allowedTreeKey:key[0]
		})
	}
	treeResAndUser = (data)=>{
		const {
			expandedKeys,
			autoExpandParent,
			selectedKeys,
			searchValue
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
					return ( <TreeNode key = {key} title = {text} > {loop(children)} </TreeNode>
					);
				}
				return <TreeNode key = {key} title = {text}
				/>;
			});
		};
		return (<div className='allocation-treeCom'>
		<Search 
			style = {{marginBottom: 8}}
			placeholder = 'Search'
			onChange = {this.onChange}
		/> 
		{data.length > 0 && data[0].children.length > 0 && ( 
			<Tree showLine onExpand = {this.onExpand}
				expandedKeys = {expandedKeys}
				onSelect = {this.selectRoFun}
				autoExpandParent = {autoExpandParent}
				selectedKeys = {selectedKeys} >
				{loop(data)} 
			</Tree>
		)} 
	</div>)
	}
	handleAlloOk = ()=>{
		let { templatePks, pageCode, treeAllowedData, orgidObj } = this.state;
		if(!treeAllowedData){
			Notice({ status: 'warning', msg: "请选中信息" });
			return ;
		}
		let targets={};
		for(let i=0;i<treeAllowedData.length;i++){
			let allowedData=treeAllowedData[i];
			for(let key in allowedData){
				if(key==='id'){
					targets[allowedData[key]]=allowedData.type;
				}
			}
		}
		let infoData={
			"pageCode": pageCode,"templateId": templatePks ,"orgId":orgidObj.refpk
		}
		infoData.targets=targets;
		Ajax({
			url: `/nccloud/platform/template/assignTemplate.do`,
			data: infoData,
			info:{
				name:'模板设置',
				action:'模板分配保存'
			},
			success: ({
				data
			}) => {
				if (data.success) {
					Notice({ status: 'success', msg: '分配成功' });
					this.setState({
						alloVisible:false
					})
				}
			}
		});
	}
	handleOrlCancel = ()=>{
		let { treeAllowedData, treeRoData, treeResData }=this.state;
		this.setState({
			alloVisible:false
		})
	}
	handdleRefChange = (value, type) => {
		let {orgidObj}=this.state;
        let {refname, refcode, refpk} = value;
		orgidObj = {};
        orgidObj["refname"] = refname;
        orgidObj["refcode"] = refcode;
        orgidObj["refpk"] = refpk;
        this.setState({
			orgidObj
		},this.reqRoTreeData);
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
			treeRoData,
			treeResData,
			treeRoVisible,
			allowDataArray,
			treeAllowedData
		} = this.state;
		console.log(templateNameVal);
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
						<Dropdown overlay={this.menuFun()} trigger={['click']}>
						<Button key="" className="margin-left-10" type="primary">
							设置默认模板
						</Button>
						</Dropdown>
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
								<Input value={templateNameVal}  onChange={(e)=>{
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
							width={720}
        				>
							<div className='allocationPage'>
								<p className='pageCode-show'><span>功能节点：</span><span>{pageCode ?pageCode:""}</span></p>
								<div className='allocationPage-content'>
									<div className='allocationPage-content-select'>
										<Select
											showSearch
											style={{ width: 200 }}
											placeholder="按角色和用户分配"
											optionFilterProp="children"
											onSelect={(e)=>{
												if(e==='按角色和用户分配'){
													this.setState({
														treeRoVisible:true
													})
												}else if(e==='按职责分配'){
													this.setState({
														treeRoVisible:false
													})
												}
											}}
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
									<div className='allocationPage-content-tree'>
										{treeRoVisible ?this.treeResAndUser(treeRoData) : this.treeResAndUser(treeResData)}
										<div className='allocation-button'>
											<p><Button onClick={this.allowClick.bind(this, 'allowRole')}>
												分配
											</Button></p>
											<p><Button onClick={this.allowClick.bind(this, 'allowRoleCancel')}>
												取消
											</Button></p>
										</div>
										<div className='allocation-tree'>
											<Tree showLine 
												onExpand = {this.onExpand}
												expandedKeys = {expandedKeys}
												onSelect = {this.onSelectedAllow}
												autoExpandParent = {autoExpandParent}
												selectedKeys = {selectedKeys} >
												{loop(treeAllowedData)}
											</Tree>
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


