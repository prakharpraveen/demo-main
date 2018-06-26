import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Button, Layout, Modal, Tree, Input, Select, Menu, Dropdown, Icon, Tabs } from 'antd';
import { PageLayout,
  PageLayoutHeader,
  PageLayoutLeft,
  PageLayoutRight } from 'Components/PageLayout';
import Ajax from 'Pub/js/ajax.js';
import Item from 'antd/lib/list/Item';
import Notice from 'Components/Notice';
import BusinessUnitTreeRef from "Components/Refers/BusinessUnitTreeRef";
import 'nc-lightapp-front/dist/platform/nc-lightapp-front/index.css';
import PreviewModal from "./showPreview";
import AssignComponennt from "./assignComponennt";
const Option = Select.Option;
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const TabPane = Tabs.TabPane;
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
		name: '浏览',
		type: 'primary'
	},
	{
		name: '刷新',
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
			treeTemData: [],//单据模板数据
			treeSearchTemData: [],//查询模板数据
			treePrintTemData: [],
			treeTemDataArray: [],
			templatePks: '',
			visible: false,
			templateNameVal: '',
			pageCode: '',
			alloVisible: false,
            org_df_biz: {// 默认业务单元
                refcode: "",
                refname: "",
                refpk: ""
			},
			orgidObj: {},
			parentIdcon: '', //树节点的key
			activeKey: "1",
			batchSettingModalVisibel: false //控制预览摸态框的显隐属性
		};
	}
	// 按钮显隐性控制
	setBtnsShow = (item) => {
		let {parentIdcon, activeKey} = this.state;
		let { name } = item;
		let isShow = false;
		switch (name) {
			case '新增':
				isShow = true;
				break;
			case '修改':
				if(activeKey==="3"){
					isShow = false;
				}else{
					if(parentIdcon==='root'){
						isShow = false;
					}else{
						isShow = true;
					}
				}
				break;
			case '删除':
				if(activeKey==="3"){
					isShow = false;
				}else{
					if(parentIdcon==='root'){
						isShow = false;
					}else{
						isShow = true;
					}
				}
				break;
			case '复制':
				isShow = true;
				break;
			case '分配':
				if(parentIdcon==='root'){
					isShow = false;
				}else{
					isShow = true;
				}
				break;
			case '设置默认模板':
				isShow = true;
				break;
			case '浏览':
				isShow = true;
				break;
			case '刷新':
				if(activeKey==="3"){
					isShow = true;
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
	//保存
	handleOk = (e) => {
		let { templateNameVal, templateTitleVal, templatePks, pageCode, activeKey } = this.state;
		if(!templateNameVal){
			Notice({ status: 'warning', msg: "请输入模板标题" });
			return ;
		}
		let infoData={
			"pageCode": pageCode,"templateId": templatePks ,"name":templateNameVal
		}
		if(activeKey==='1'){
			infoData.templateType = 'bill';
		}else if(activeKey==='2'){
			infoData.templateType = 'query';
		}else if(activeKey==='3'){
			infoData.templateType = 'print';
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
	//设置默认模板 菜单栏
	menuFun = ()=>{
		let {templateNameVal} = this.state;
		const len=templateNameVal.length;
		let isButton = false;
		if(templateNameVal.slice((len-3),(len-1))==='默认'){
			isButton=true
		}
		return(
			<Menu onClick={this.settingClick.bind(this)}>
			  <Menu.Item key="设置默认">
				<button disabled={isButton}>设置默认</button>
			  </Menu.Item>
			  <Menu.Divider />
			  <Menu.Item key="取消默认"><button disabled={!isButton}>取消默认</button></Menu.Item>
			</Menu>
		  )
	};
	//设置默认模板方法
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
				this.props.history.push(`/ZoneSetting?templetid=${templatePks}&status=${"billTemplate"}`);
				break;
			case '新增':
				this.props.history.push(`/ZoneSetting?status=${"templateSetting"}`);
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
			case '浏览':
				if(!templatePks){
					Notice({ status: 'warning', msg: "请选择模板数据" });
					return;
				}
				this.setState({
					batchSettingModalVisibel: true
				});
				break;
			default:
				break;
			}
		}
	/**
	 * 设置默认模板的ajax请求
	 * @param url 请求路径
	 * @param infoData 请求参数
	 * @param textInfo 请求成功后的提示信息
	 */
	setDefaultFun = (url, infoData, textInfo)=>{
		let { pageCode, activeKey }=this.state;
		if(activeKey==='1'){
			infoData.templateType = 'bill';
		}else if(activeKey==='2'){
			infoData.templateType = 'query';
		}else if(activeKey==='3'){
			infoData.templateType = 'print';
		}
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
	restoreTreeTemData = (templateType)=>{
		let {
			treeTemData,
			treeTemDataArray,
			selectedKeys,
			parentIdcon,
			activeKey,
			treeSearchTemData
		} = this.state;
		treeTemDataArray.map((item)=>{
			if(item.isDefault==='y'){
				item.name=item.name+' [默认]'
			}
		})
		let treeData=[];
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
		treeData = treeInfo.treeArray;
		treeData = generateTreeData(treeData);
		if(treeData.length>0){
			let newinitKeyArray=[];
			newinitKeyArray.push(treeData[0].key);
			this.setState({
				selectedKeys:newinitKeyArray,
				parentIdcon:treeData[0].parentId,
			});
		}
		if(templateType==='bill'){
			treeTemData=treeData;
			this.setState({
				treeTemData
			});
		}else if(templateType==='query'){
			treeSearchTemData=treeData;
			this.setState({
				treeSearchTemData
			});
		}
	}
	 //将平铺树数组转换为树状数组
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
	//tree的查询方法
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
			selectedKeys:key,
			pageCode:key[0]
		},this.reqTreeTemData)
	};
	//请求右侧树数据
	reqTreeTemData = (key)=>{
		let { pageCode, activeKey } = this.state;
		let infoData={
			"pageCode": pageCode
		}
		if(!infoData.pageCode){
			return;
		}
		infoData.templateType = 'bill';
		this.reqTreeTemAjax(infoData, 'bill');
		infoData.templateType = 'query';
		this.reqTreeTemAjax(infoData, 'query');
		if(activeKey==='3'){
			infoData.templateType = 'print';
			this.reqTreeTemAjax(infoData, 'print');
		}
	}
	//请求右侧树数据ajax方法封装
	reqTreeTemAjax = (infoData, templateType)=>{
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
					}, this.restoreTreeTemData(templateType))
				}
			}
		});
	}
	onTemSelect = (key, e)=>{
		this.setState({
			selectedKeys:key,
			templatePks: key[0]
		},this.lookTemplateNameVal);
	}
	//在模板数据中查找当前PK值的中文名称
	lookTemplateNameVal = ()=>{
		let { templateNameVal, treeTemData, templatePks, parentIdcon }=this.state;
		for(let i=0;i<treeTemData.length;i++){
			if(treeTemData[i].templateId===templatePks){
				parentIdcon=treeTemData[i].parentId;
				templateNameVal=treeTemData[i].text;
			}
			if(treeTemData[i].children&&treeTemData[i].children.length>0){
				let childrenDatas=treeTemData[i].children;
				childrenDatas.map((ele)=>{
					if(ele.templateId===templatePks){
						templateNameVal=ele.text;
						parentIdcon=ele.parentId;
					}
				})
			}
		}
		this.setState({
			templateNameVal,
			parentIdcon
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
	//树点击事件的汇总
	onSelect = (typeSelect, key, e)=>{
		switch(typeSelect){
			case 'systemOnselect':
				this.onSelectQuery(key, e)
				break;
			case 'templateOnselect':
				this.onTemSelect(key, e);
				break;
			case 'resOnselect':
				this.selectRoFun(key, e);
				break;
			case 'allowedOnselect':
				this.onSelectedAllow(key, e);
			default:
			break;
		}
	}
	//树组件的封装
	treeResAndUser = (data, typeSelect, hideSearch)=>{
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
		return (<div>
			{ hideSearch?"":(<Search 
			style = {{marginBottom: 8}}
			placeholder = 'Search'
			onChange = {this.onChange}
		/>) } 
		{data.length > 0 && ( 
			<Tree showLine onExpand = {this.onExpand}
				expandedKeys = {expandedKeys}
				onSelect = {this.onSelect.bind(this,typeSelect)}
				autoExpandParent = {autoExpandParent}
				selectedKeys = {selectedKeys} >
				{loop(data)} 
			</Tree>
		)} 
	</div>)
	}
	//预览摸态框显示方法
	setModalVisibel = (visibel) => {
		this.setState({batchSettingModalVisibel: visibel});
	};
	//分配摸态框显示方法
	setAssignModalVisible = (visibel) => {
		this.setState({alloVisible: visibel});
	};
	render() {
		const {
			treeData,
			treeTemData,
			treeSearchTemData,
			templateNameVal,
			visible,
			alloVisible,
			pageCode,
			org_df_biz,
			activeKey,
			templatePks,
			batchSettingModalVisibel
		} = this.state;
		return (
			<PageLayout className="nc-workbench-templateSetting"
				header={
					<PageLayoutHeader>
						{(treeTemData.length >0||treeSearchTemData.length >0) && Btns.map((item, index) => {
							item = this.setBtnsShow(item);
							return this.creatBtn(item);
						})}
						{treeTemData.length >0 &&(<Dropdown overlay={this.menuFun()} trigger={['click']}>
						<Button key="" className="margin-left-10" type="primary">
							设置默认模板
						</Button>
						</Dropdown>)}
					</PageLayoutHeader>
				}
			>
				<PageLayoutLeft
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
					{treeData.length >0&&treeData[0].children.length > 0 &&this.treeResAndUser(treeData,'systemOnselect')}
				</PageLayoutLeft>
				<PageLayoutRight>
					<Tabs
						defaultActiveKey="1"
						onChange={activeKey => {
							this.setState({activeKey});
						}}
						type="card"
						activeKey={activeKey}
					>
						<TabPane tab="页面模板" key="1">
							{treeTemData.length >0 &&this.treeResAndUser(treeTemData,'templateOnselect','hideSearch')}
						</TabPane>
						<TabPane tab="查询模板" key="2">
							{treeSearchTemData.length >0 &&this.treeResAndUser(treeSearchTemData,'templateOnselect','hideSearch')}
						</TabPane>
						<TabPane tab="打印模板" key="3">
							<div>
								<p>1111111111</p>
								<p>2222222222</p>
								<p>3333333333</p>
								<p>44444444444</p> 
							</div>
						</TabPane>
					</Tabs>
				</PageLayoutRight>
						{batchSettingModalVisibel && (
							<PreviewModal
								templetid={templatePks}
								batchSettingModalVisibel={batchSettingModalVisibel}
								setModalVisibel={this.setModalVisibel}
							/>
                		)}
						<Modal
							title = "请录入正确的模板名称和标题"
							visible = {visible}
							onOk = {this.handleOk}
							onCancel = {this.handleCancel}
        				>
							<div className = "copyTemplate">
								<Input value = {templateNameVal}  onChange={(e)=>{
									const templateNameVal = e.target.value;
									this.setState({
										templateNameVal
									})
								}}/>
							</div>
        				</Modal>
						{alloVisible&&(
							<AssignComponennt
							templatePks = {templatePks}
							alloVisible = {alloVisible}
							setAssignModalVisible = {this.setAssignModalVisible}
							pageCode = {pageCode}
							activeKey = {activeKey}
							/>
						)
						}
			</PageLayout>
		);
	}
}
export default TemplateSetting
