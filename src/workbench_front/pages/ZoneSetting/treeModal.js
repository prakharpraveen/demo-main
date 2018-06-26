import React, { Component } from 'react';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import { connect } from 'react-redux';
import { Input, Icon, Tree, Modal, Button, Checkbox } from 'antd';
import * as utilService from './utilService';
const TreeNode = Tree.TreeNode;

class TreeModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			checkedKeys: [],
			selectedKeys: [],
			selectedNodes: [],
			searchValue: ''
		};
	}
	showModalHidden = () => {
		// utilService.setPropertyValueForItemInItemList(this.props.metaTree);
		this.setModalVisible(false);
	};
	setModalVisible = (modalVisible) => {
		this.setState({ selectedKeys: [], checkedKeys: [],selectedNodes:[] });
		this.props.setModalVisible(modalVisible);
	};
	//移动到的弹出框中，点击确认
	onOkMoveDialog = () => {
		const modalVisible = false;
		const { selectedNodes } = this.state;
		const { targetAreaID } = this.props;
		let cardList = [];
		_.forEach(selectedNodes, (s, i) => {
			const { myUniqID, datatype, refname, refcode, pid,refpk,isLeaf } = s.props.dataRef;
			let cardObj = {}
			if(this.props.targetAreaType === '0'){
				//查询区
				cardObj = {
					pk_query_property: `newMetaData_${myUniqID}`,
					areaid: targetAreaID,
					datatype: datatype,
					code: myUniqID,
					label: refname,
					metapath: myUniqID,
					opersign:utilService.getOpersignByDatatype(datatype),
					opersignname:utilService.getOpersignNameByDatatype(datatype),
					defaultvalue:'',
					isfixedcondition:false,
					required:false,
					visible:true,
					isquerycondition:true,
					refname: datatype==='204'?refname:'-99',
					containlower:isLeaf?false:true,
					ischeck:false,
					isbeyondorg:false,
					usefunc:datatype==='34'?true:false,
					showtype:'1',
					returntype:'1',
					define1:"",
					define2:"",
					define3:"",
					define4:"",
					define5:"",
					itemtype:'input'
					
				}
			}else{//非查询区
				cardObj = {
					pk_query_property: `newMetaData_${myUniqID}`,
					areaid: targetAreaID,
					code: myUniqID,
					datatype: datatype,
					label: refname,
					metapath: myUniqID,
					color: '#6E6E77',
					width: '6',
					isrevise:false,
					istotal:false,
					required:false,
					disabled:false,
					visible:true,
					maxlength:'20',
					textrows:'1',
					leftspace:'0',
					rightspace:'0',
					defaultvar:'',
					define1:"",
					define2:"",
					define3:"",
					itemtype:'input'
				}
			}
			if(this.props.targetAreaType === '2'){
				cardObj.width = '';
			}
			if(cardObj.datatype === '204'){
				cardObj.metaid = refpk
			}
			cardList.push(cardObj);
		});
		this.props.addCard(cardList);
		this.setModalVisible(modalVisible);
	};
	//关于搜索框的方法;
	onInputSearch = () => {
		console.log(this.state.searchValue, '搜索开始');
		const { metaTree } = this.props;

		metaTree.map((item) => {
			if (checkedKeys.indexOf(item.key) !== -1) {
				cardList.push(item);
			}
		});

		this.setModalVisible(modalVisible);
	};
	//搜索框文本改变
	onInputChange = (e) => {
		let _serachText = e.target.value;
		// console.log(_groupName);
		this.state.searchValue = _serachText;
	};

	//关于树的方法
	//选中
	onCheck = (checkedKeys, info) => {
		console.log('onCheck', checkedKeys, info);
		_.forEach(info.checkedNodes, (v, i) => {
			_.forEach(v.props.children, (c, index) => {
				if (checkedKeys.checked.indexOf(c.key) === -1) {
					checkedKeys.checked.push(c.key);
				}
			});
		});
		this.setState({ checkedKeys: checkedKeys });
	};
	onSelect = (selectedKeys, info) => {
		console.log('onSelect', selectedKeys, info);

		this.setState({ selectedKeys, selectedNodes: info.selectedNodes });
	};

	renderTreeNodes = (data) => {
		return data.map((item) => {
			if (item.children) {
				return (
					<TreeNode title={item.title} key={item.key} dataRef={item}>
						{this.renderTreeNodes(item.children)}
					</TreeNode>
				);
			}
			return <TreeNode {...item} dataRef={item} />;
		});
	};
	onLoadData = (treeNode) => {
		return new Promise((resolve) => {
			if (treeNode.props.children) {
				resolve();
				return;
			}
			Ajax({
				url: `/nccloud/platform/templet/querymetapro.do`,
				info: {
					name: '单据模板设置',
					action: '元数据树结构查询'
				},
				data: {
					// metaid: metaid
					metaid: treeNode.props.refpk
				},
				success: (res) => {
					if (res) {
						let { data, success } = res.data;
						if (success && data && data.rows && data.rows.length > 0) {
							let metaTree = [];
							data.rows.map((r, index) => {
								metaTree.push({
									...r,
									title:`${r.refcode} ${r.refname}` ,
									key: `${treeNode.props.myUniqID}.${r.refcode}`,
									myUniqID: `${treeNode.props.myUniqID}.${r.refcode}`,
									isLeaf: r.isleaf
								});
							});
							treeNode.props.dataRef.children = [].concat(metaTree);
							this.props.updateMetaTreeData([ ...this.props.metaTree ]);
							resolve();
						}
					}
				}
			});
		});
	};
	getContentDom = () => {
		const { metaTree } = this.props;
		return (
			<div className='template-setting-left-sider template-setting-sider'>
				<div className='sider-content'>
					<div className='sider-search'>
						{/* <Input
							placeholder='请搜索元数据名称'
							style={{ width: '70%' }}
							onPressEnter={this.onInputSearch}
							onChange={this.onInputChange}
							addonAfter={
								<Icon type='search' className='search-input-icon' onClick={this.onInputSearch} />
							}
						/> */}
					</div>

					<div className='sider-tree'>
						<Tree
							loadData={this.onLoadData}
							showLine={true}
							multiple={true}
							onSelect={this.onSelect}
							selectedKeys={this.state.selectedKeys}
						>
							{this.renderTreeNodes(metaTree)}
						</Tree>
					</div>
				</div>
			</div>
		);
	};
	selectAllTreeNode = (e)=>{
		const isChecked = e.target.checked;
		const {metaTree} = this.props;
		let {selectedKeys} = this.state;
		selectedKeys = _.cloneDeep(selectedKeys)
		if(isChecked){
			_.forEach(metaTree,(m,i)=>{
				if(selectedKeys.indexOf(m.myUniqID)===-1){
					selectedKeys.push(m.myUniqID);
					this.state.selectedNodes.push({
						props:{
							dataRef:{
								...m
							}
						}
					});
				}
			})
		}else{
			_.forEach(metaTree,(m,i)=>{
				_.remove(selectedKeys, (n)=> {
					return n === m.myUniqID;
				  });
			})
			_.forEach(metaTree,(m,i)=>{
				_.remove(this.state.selectedNodes, (n)=> {
					return n.props.dataRef.myUniqID === m.myUniqID;
				  });
			})
		}
		console.log(selectedKeys,metaTree,this.state.selectedNodes);
		this.setState({selectedKeys});

	}
	getModalTitleDom =()=>{
		return (
			<div>
				<span>添加元数据</span>
				<Checkbox style={{marginLeft:'25px'}} onChange={this.selectAllTreeNode}>全选根节点</Checkbox>
			</div>	
		)
	}
	render() {
		return (
			<Modal
				title={this.getModalTitleDom()}
				mask={false}
				wrapClassName='vertical-center-modal'
				visible={this.props.modalVisible}
				onOk={this.onOkMoveDialog}
				onCancel={this.showModalHidden}
				destroyOnClose={true}
				width={'50%'}
				style={{ top: 20 }}
				// bodyStyle={{width: 640, height:'100%',overflowY:'auto'}}
				footer={[
					<Button
						key='submit'
						disabled={this.state.selectedKeys.length === 0}
						type='primary'
						onClick={this.onOkMoveDialog}
					>
						确定
					</Button>,
					<Button key='back' onClick={this.showModalHidden}>
						取消
					</Button>
				]}
			>
				{this.getContentDom()}
			</Modal>
		);
	}
}
export default connect((state) => ({}), {})(TreeModal);
