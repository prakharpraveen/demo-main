import React, { Component } from 'react';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import { connect } from 'react-redux';
import { Input, Icon, Tree, Modal, Button, Checkbox, Select } from 'antd';
import * as utilService from './utilService';
const TreeNode = Tree.TreeNode;
const Option = Select.Option;

class TreeModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			checkedKeys: [],
			selectedKeys: [],
			selectedNodes: [],
			searchValue: '',
			needToBeAllSelectNodeList: []
		};
	}
	showModalHidden = () => {
		// utilService.setPropertyValueForItemInItemList(this.props.metaTree);
		this.setModalVisible(false);
	};
	setModalVisible = (modalVisible) => {
		this.setState({ selectedKeys: [], checkedKeys: [], selectedNodes: [], needToBeAllSelectNodeList: [] });
		this.props.setModalVisible(modalVisible);
	};
	//移动到的弹出框中，点击确认
	onOkMoveDialog = () => {
		const modalVisible = false;
		const { selectedNodes } = this.state;
		const { targetAreaID } = this.props;
		let cardList = [];

		_.forEach(selectedNodes, (s, i) => {
			const { myUniqID, datatype, refname, refcode, pid, refpk, isLeaf, modelname } = s.props.dataRef;
			let cardObj = {};
			if (this.props.targetAreaType === '0') {
				//查询区
				cardObj = {
					pk_query_property: `newMetaData_${myUniqID}`,
					areaid: targetAreaID,
					datatype: datatype,
					code: myUniqID,
					label: refname,
					metapath: myUniqID,
					isnotmeta: false,
					isuse: true,
					opersign: utilService.getOpersignByDatatype(datatype),
					opersignname: utilService.getOpersignNameByDatatype(datatype),
					defaultvalue: '',
					isfixedcondition: false,
					required: false,
					disabled: false,
					visible: true,
					ismultiselectedenabled:false,
					isquerycondition: true,
					refname: datatype === '204' ? modelname : '-99',
					containlower: isLeaf ? false : true,
					ischeck: false,
					isbeyondorg: false,
					usefunc: datatype === '34' ? true : false,
					showtype: '1',
					returntype: 'refpk',
					define1: '',
					define2: '',
					define3: '',
					define4: '',
					define5: '',
					itemtype: 'input'
				};
			} else {
				//非查询区
				cardObj = {
					pk_query_property: `newMetaData_${myUniqID}`,
					areaid: targetAreaID,
					code: myUniqID,
					datatype: datatype,
					label: refname,
					metapath: myUniqID,
					color: '#6E6E77',
					width: '6',
					isrevise: false,
					istotal: false,
					required: false,
					disabled: false,
					visible: true,
					maxlength: '20',
					textrows: '1',
					leftspace: '0',
					rightspace: '0',
					defaultvar: '',
					define1: '',
					define2: '',
					define3: '',
					itemtype: 'input'
				};
			}
			if (this.props.targetAreaType === '2') {
				cardObj.width = '';
			}
			if (cardObj.datatype === '204') {
				cardObj.metaid = refpk;
				cardObj.iscode = false;
				cardObj.modelname = modelname;
			}
			cardObj.itemtype = utilService.getItemtypeByDatatype(cardObj.datatype);

			cardList.push(cardObj);
		});
		//非查询区的参照类型需要添加默认dataval
		if (this.props.targetAreaType !== '0') {
			let ajaxData = [];
			_.forEach(cardList, (c) => {
				if (c.modelname) {
					ajaxData.push(c.modelname);
				}
			});
			if (ajaxData.length > 0) {
				Ajax({
					url: `/nccloud/platform/templet/getRefDefaultSel.do`,
					info: {
						name: '单据模板设置',
						action: '查询参照默认下拉选项'
					},
					data: ajaxData,
					success: (res) => {
						if (res) {
							let { data, success } = res.data;
							if (success && data) {
								_.forEach(data, (d) => {
									_.forEach(cardList, (c) => {
										if (d.name === c.modelname) {
											c.dataval = `${d.pk_refinfo},code=N`;
											c.refname = d.name;
										}
									});
								});
							}
							this.props.addCard(cardList);
							this.setModalVisible(modalVisible);
						}
					}
				});
			} else {
				this.props.addCard(cardList);
				this.setModalVisible(modalVisible);
			}
		} else {
			this.props.addCard(cardList);
			this.setModalVisible(modalVisible);
		}
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
		// console.log('onCheck', checkedKeys, info);
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
		// console.log('onSelect', selectedKeys, info);

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
									title: `${r.refcode} ${r.refname}`,
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
	selectAllTreeNode = (isChecked, metaTreeNodeList) => {
		let { selectedKeys } = this.state;
		selectedKeys = _.cloneDeep(selectedKeys);
		if (isChecked) {
			_.forEach(metaTreeNodeList, (m, i) => {
				if (selectedKeys.indexOf(m.myUniqID) === -1 && m.datatype !== '205') {
					selectedKeys.push(m.myUniqID);
					this.state.selectedNodes.push({
						props: {
							dataRef: {
								...m
							}
						}
					});
				}
			});
		} else {
			_.forEach(metaTreeNodeList, (m, i) => {
				_.remove(selectedKeys, (n) => {
					return n === m.myUniqID;
				});
			});
			_.forEach(metaTreeNodeList, (m, i) => {
				_.remove(this.state.selectedNodes, (n) => {
					return n.props.dataRef.myUniqID === m.myUniqID;
				});
			});
		}
		// console.log(selectedKeys);
		this.setState({ selectedKeys });
	};
	handleChangeSelectTreeNode = (value) => {
		const { metaTree, canSelectTreeNodeList } = this.props;
		_.forEach(canSelectTreeNodeList, (m) => {
			if (value.indexOf(`${m.refcode} ${m.refname}`) === -1) {
				if (m.children !== null) {
					setTimeout(() => {
						this.selectAllTreeNode(false, m.children);
					}, 0);
				}
			} else {
				if (m.children !== null) {
					setTimeout(() => {
						this.selectAllTreeNode(true, m.children);
					}, 0);
				}
			}
		});

		this.setState({ needToBeAllSelectNodeList: value });
	};
	getModalTitleDom = () => {
		return (
			<div>
				<span>添加元数据</span>
				<Checkbox
					style={{ marginLeft: '25px' }}
					onChange={(e) => {
						this.selectAllTreeNode(e.target.checked, this.props.metaTree);
					}}
				>
					全选根节点
				</Checkbox>
				{(() => {
					if (this.props.canSelectTreeNodeList.length > 0) {
						return (
							<Select
								maxTagCount={1}
								size='small'
								style={{ width: '50%' }}
								mode='multiple'
								placeholder='请先展开对应树节点，再选择'
								onChange={this.handleChangeSelectTreeNode}
								value={this.state.needToBeAllSelectNodeList}
							>
								{this.props.canSelectTreeNodeList.map((node, index) => {
									return (
										<Option
											key={`${node.refcode} ${node.refname}`}
											disabled={node.children ? false : true}
										>
											{node.refcode} {node.refname}
										</Option>
									);
								})}
							</Select>
						);
					}
				})()}
			</div>
		);
	};
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
