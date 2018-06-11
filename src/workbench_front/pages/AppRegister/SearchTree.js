import React, {
	Component
} from 'react';
import {
	connect
} from 'react-redux';
import PropTypes from 'prop-types';
import {
	setNodeData,
	updateTreeData,
	addTreeData,
	setOpType,
	setBillStatus,
	setParentData,
	setAppParamData,
	setPageButtonData,
	setPageTemplateData,
	getPageParentCode,
	delTreeData,
	reqTreeData
} from 'Store/AppRegister/action';
import {
	Tree,
	Input
} from 'antd';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import Item from 'antd/lib/list/Item';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const initTreeData = [{
	key: '0',
	systypename: '应用节点',
	moduleid: '',
	text: '应用节点',
	children: []
}];
class SearchTree extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			expandedKeys: ['0'],
			selectedKeys: [],
			treeDataArray: [],
			treeData: [],
			searchValue: '',
			autoExpandParent: true
		};
	}
	componentDidMount() {
		let {
			treeData
		} = this.state;
		treeData = initTreeData;
		this.setState({
			treeData
		}, this.reqTreeData);
		this.props.addTreeData(this.addTreeData);
		this.props.delTreeData(this.delTreeData);
		this.props.reqTreeData(this.reqTreeData);
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
					// console.log(data.data);
					this.setState({
						treeDataArray: data.data
					}, this.restoreTreeData);
				}
			}
		});
	};
	/**
	 * 新增树节点
	 * @param {Object} nodeData
	 */
	addTreeData = (nodeData) => {
		let {
			treeDataArray,
			selectedKeys,
		} = this.state;
		selectedKeys = [];
		treeDataArray.push(nodeData);
		selectedKeys.push(nodeData.moduleid);
		this.setState({
			treeDataArray,
			selectedKeys,
		}, this.restoreTreeData);
	};
	/**
	 * 删除树节点
	 * @param {Object} nodeData
	 */
	delTreeData = (nodeData) => {
		let {
			treeDataArray,
			selectedKeys
		} = this.state;
		selectedKeys = [];
		treeDataArray = treeDataArray.filter((item) => item.moduleid !== nodeData.moduleid);
		this.setState({
			treeDataArray,
			selectedKeys
		}, this.restoreTreeData);
	};
	/**
	 * 更新树节点
	 * @param {Object} nodeData
	 */
	updateNodeData = (nodeData) => {
		let {
			treeDataArray
		} = this.state;
		treeDataArray = treeDataArray.map((item, index) => {
			if (item.moduleid === nodeData.moduleid) {
				item = nodeData;
			}
			return item;
		});
		this.setState({
				treeDataArray
			},
			this.restoreTreeData
		);
	};
	/**
	 * 将平铺树数组转换为树状数组
	 * 
	 */
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
		// console.log(treeData);
		this.setState({
			treeData
		});
	};
	onExpand = (expandedKeys) => {
		// console.log(expandedKeys);
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
	onSelect = (key, e) => {
		let {
			selectedKeys
		} = this.state;
		selectedKeys = key;
		this.setState({
			selectedKeys
		});
		if (key.length === 0) {
			return;
		} else {
			this.props.setBillStatus({
				isNew: false,
				isEdit: false
			});
		}
		key = key[key.length - 1];
		if (key === '0') {
			this.props.setNodeData('');
			this.props.setOpType('');
			this.props.setParentData('');
		} else {
			let {
				treeDataArray
			} = this.state;
			let selectedNodeData = treeDataArray.find((item) => {
				if (item.key === key) {
					return item;
				}
			});
			if (selectedNodeData.flag + '' === '0') {
				this.props.setOpType('module');
			} else if(selectedNodeData.flag + '' === '1'){
				this.props.getPageParentCode(selectedNodeData.systypecode);
				// 查询应用分类 及 应用数据
				Ajax({
					url: `/nccloud/platform/appregister/query.do`,
					info: {
						name:'应用注册应用',
						action:'查询'
					},
					data: {
						pk_appregister: key
					},
					success: ({
						data
					}) => {
						if (data.success && data.data) {
							if (selectedNodeData.parentcode.length > 4) {
								this.props.setOpType('app');
							} else {
								this.props.setOpType('classify');
							}
							let {
								appRegisterVO,
								appParamVOs
							} = data.data;
							this.props.setAppParamData(appParamVOs);
							this.props.setNodeData(appRegisterVO);
						}
					}
				});
			} else if(selectedNodeData.flag + '' === '2'){
				this.props.setOpType('page');
				// 查询页面数据
				Ajax({
					url: `/nccloud/platform/appregister/querypagedetail.do`,
					info: {
						name:'应用注册页面',
						action:'查询'
					},
					data: {
						pk_apppage: key
					},
					success: ({
						data
					}) => {
						if (data.success && data.data) {
							let {
								apppageVO,
								appButtonVOs,
								pageTemplets,
							} = data.data;
							this.props.setPageButtonData(appButtonVOs);
							this.props.setPageTemplateData(pageTemplets);
							this.props.setNodeData(apppageVO);
						}
					}
				});
			}
			selectedNodeData = Object.assign({}, selectedNodeData);
			if (selectedNodeData.children) {
				delete selectedNodeData.children;
			}
			if (selectedNodeData.parentcode) {
				this.props.setParentData(selectedNodeData.parentcode);
			} else {
				this.props.setParentData('');
			}
			this.props.setNodeData(selectedNodeData);
			this.props.updateTreeData(this.updateNodeData);
		}
	};
	render() {
		const {
			expandedKeys,
			searchValue,
			autoExpandParent,
			selectedKeys,
			treeData
		} = this.state;
		// console.log(treeData);
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
		return( <div>
					<Search 
					style = {{marginBottom: 8}}
					placeholder = 'Search'
					onChange = {this.onChange}
					/> 
					{treeData.length > 0 && treeData[0].children.length > 0 && ( 
						<Tree showLine onExpand = {this.onExpand}
						expandedKeys = {expandedKeys}
						onSelect = {this.onSelect}
						autoExpandParent = {autoExpandParent}
						selectedKeys = {selectedKeys} >
						{loop(treeData)} 
						</Tree>
					)} 
				</div>
		);
	}
}
/**
 * 求到的平铺数组 将请第一层节点进行剥离
 * @param {Array} data 
 */
const generateData = (data) => {
	// 第一层 tree 数据
	let treeArray = [];
	// 所有 children 数组
	let treeObj = {};
	data.map((item, index) => {
		let {
			parentcode,
			moduleid,
			systypename,
			systypecode
		} = item;
		if(item.children){
			delete item.children;
		}
		if (moduleid.length > 4) {
			item.text = `${systypecode} ${systypename}`;
		} else {
			item.text = `${moduleid} ${systypename}`;
		}
		item.key = moduleid;
		// 以当前节点的 parentcode 为 key，所有含有此 parentcode 节点的元素构成数组 为 值
		if (parentcode) {
			if (!treeObj[parentcode]) {
				treeObj[parentcode] = [];
			}
			treeObj[parentcode].push(item);
		} else {
			// 根据是否为叶子节点 来添加是否有 children 属性
			item.children = [];
			treeArray.push(item);
		}
	});
	return {
		treeArray,
		treeObj
	};
};
/**
 * 生成新的树数据
 * @param {Array} data 后台返回的树数据
 */
const generateTreeData = (data) => {
	return data.map((item, index) => {
		item = Object.assign({}, item);
		if (item.children) {
			item.isLeaf = false;
			item.children = generateTreeData(item.children);
		} else {
			item.isLeaf = true;
		}
		return item;
	});
};
SearchTree.propTypes = {
	setNodeData: PropTypes.func.isRequired,
	updateTreeData: PropTypes.func.isRequired,
	setOpType: PropTypes.func.isRequired,
	setBillStatus: PropTypes.func.isRequired,
	setParentData: PropTypes.func.isRequired,
	setAppParamData: PropTypes.func.isRequired,
	setPageButtonData: PropTypes.func.isRequired,
	setPageTemplateData: PropTypes.func.isRequired,
	addTreeData: PropTypes.func.isRequired,
	delTreeData: PropTypes.func.isRequired,
	reqTreeData: PropTypes.func.isRequired,
	getPageParentCode: PropTypes.func.isRequired,
};
export default connect(
	(state) => {
		return {};
	}, {
		setNodeData,
		updateTreeData,
		setOpType,
		setBillStatus,
		setParentData,
		setAppParamData,
		setPageButtonData,
		setPageTemplateData,
		addTreeData,
		delTreeData,
		reqTreeData,
		getPageParentCode
	}
)(SearchTree);