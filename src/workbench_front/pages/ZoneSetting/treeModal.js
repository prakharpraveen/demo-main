import React, { Component } from 'react';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import { connect } from 'react-redux';
import { Input, Icon, Tree, Modal, Button } from 'antd';
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
		utilService.setPropertyValueForItemInItemList(this.props.metaTree);
		this.setModalVisible(false);
	};
	setModalVisible = (modalVisible) => {
		this.setState({ selectedKeys: [], checkedKeys: [] });
		this.props.setModalVisible(modalVisible);
	};
	//移动到的弹出框中，点击确认
	onOkMoveDialog = () => {
		const modalVisible = false;
		const { selectedNodes } = this.state;
		const { targetAreaID } = this.props;
		let cardList = [];
		_.forEach(selectedNodes, (s, i) => {
			const { myUniqID, datatype, refname, refcode, pid, refpk } = s.props.dataRef;
			cardList.push({
				pk_query_property: `newMetaData_${myUniqID}`,
				areaid: targetAreaID,
				code: refcode,
				label: refname,
				metapath: myUniqID,
				datatype: datatype,
				color: '1',
				componenttype: '0',
				refcode: '1',
				options: '1',
				visible: true,
				disabled: true,
				required: true,
				isenable: true,
				mustuse: true,
				ischeck: true,
				usefunc: true,
				scale: '0',
				maxlength: '20',
				unit: '10',
				ratio: '0',
				formattype: '0',
				width: '11',
				position: '236',
				opersign: 'like',
				defaultvalue: '1',
				showtype: '0',
				returntype: '0',
				dr: '0',
				status: '0',
				metaid: refpk,
				m_isDirty: false
			});
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
	render() {
		return (
			<Modal
				title='添加元数据'
				mask={false}
				wrapClassName='vertical-center-modal'
				visible={this.props.modalVisible}
				onOk={this.onOkMoveDialog}
				onCancel={this.showModalHidden}
				destroyOnClose={true}
				width={640}
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
