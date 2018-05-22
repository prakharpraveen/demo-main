import React, {
	Component
} from 'react';
import {
	connect
} from 'react-redux';
import PropTypes from 'prop-types';
import { setZoneData } from 'Store/ZoneSetting/action';

import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import Item from 'antd/lib/list/Item';

import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

class SearchTree extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		  zoneArr: []
		};
	}
	onSelect = (selectedKeys, info) => {
		console.log('selected', selectedKeys, info);
	}
	onCheck = (checkedKeys, info) => {
		let zoneArr;
		console.log('onCheck', checkedKeys, info);
	//	info && info.node && console.log(info.node.isLeaf())
		zoneArr = info.checkedNodes.filter((v, i) => {
			return !v.props.children
		})  
		this.setState({ zoneArr});
		
		
	/* 	console.log( info.checkedNodes.filter((v, i) => {
			return !v.props.children
})  ) */
	}
	debugger;
	// 确定添加元数据到列表 
	handleAdd = () => {
		debugger;
		let zoneArr = this.state.zoneArr;
		this.props.setZoneData(zoneArr);
		console.log(this.props.zoneArr,'111')
	}
	render() {
		return (
			<div>
				<span class='add' onClick={()=> this.handleAdd()}>增加</span>
				<Tree
					checkable
					defaultExpandedKeys={['0-0-0', '0-0-1']}
					defaultSelectedKeys={['0-0-0', '0-0-1']}
				//	defaultCheckedKeys={['0-0-0', '0-0-1']}
					onSelect={this.onSelect}
					onCheck={this.onCheck}
				>
					<TreeNode title="parent 1" key="0-0">
						<TreeNode title="parent 1-0" key="0-0-0" >
							<TreeNode title="leaf" key="0-0-0-0" />
							<TreeNode title="leaf" key="0-0-0-1" />
						</TreeNode>
						<TreeNode title="parent 1-1" key="0-0-1">
							<TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} key="0-0-1-0" />
						</TreeNode>
					</TreeNode>
				</Tree>
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
SearchTree.PropTypes = {
	setNodeData: PropTypes.func.isRequired,
	updateTreeData: PropTypes.func.isRequired,
	setOpType: PropTypes.func.isRequired,
	setBillStatus: PropTypes.func.isRequired,
	setParentData: PropTypes.func.isRequired,
	setAppParamData: PropTypes.func.isRequired,
	setPageButtonData: PropTypes.func.isRequired,
	setPageTemplateData: PropTypes.func.isRequired,
	setPrintTemplateData: PropTypes.func.isRequired,
	addTreeData: PropTypes.func.isRequired,
	delTreeData: PropTypes.func.isRequired,
	reqTreeData: PropTypes.func.isRequired
};
export default connect(
	(state) => {
		return { zoneArr: state.zoneSettingData.zoneArray};
	}, {
		setZoneData
	}
)(SearchTree);