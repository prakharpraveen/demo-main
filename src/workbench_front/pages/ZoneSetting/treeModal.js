import React, { Component } from 'react';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import { connect } from 'react-redux';
import { Input, Icon, Tree, Modal, Button } from 'antd';
import * as utilService from './utilService';
const TreeNode = Tree.TreeNode;

const treeData = [
	{
		title: '0-0',
		key: '0-0',
		children: [
			{
				title: '0-0-0',
				key: '0-0-0',
				children: [
					{ title: '0-0-0-0', key: '0-0-0-0' },
					{ title: '0-0-0-1', key: '0-0-0-1' },
					{ title: '0-0-0-2', key: '0-0-0-2' }
				]
			},
			{
				title: '0-0-1',
				key: '0-0-1',
				children: [
					{ title: '0-0-1-0', key: '0-0-1-0' },
					{ title: '0-0-1-1', key: '0-0-1-1' },
					{ title: '0-0-1-2', key: '0-0-1-2' }
				]
			},
			{
				title: '0-0-2',
				key: '0-0-2'
			}
		]
	},
	{
		title: '0-1',
		key: '0-1',
		children: [
			{ title: '0-1-0-0', key: '0-1-0-0' },
			{ title: '0-1-0-1', key: '0-1-0-1' },
			{ title: '0-1-0-2', key: '0-1-0-2' }
		]
	},
	{
		title: '0-2',
		key: '0-2'
	}
];

class TreeModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedValue: 0,
			checkedKeys: [],
			searchValue: ''
		};
	}
	showModalHidden = () => {
		utilService.setPropertyValueForItemInItemList(this.props.metaTree);
		this.setModalVisible(false);
	};
	setModalVisible = (modalVisible) => {
		this.setState({ selectedValue: 0 });
		this.props.setModalVisible(modalVisible);
	};
	//移动到的弹出框中，点击确认
	onOkMoveDialog = () => {
		const modalVisible = false;
		let cardList = [];
		const { metaTree } = this.props;
		metaTree.map((item) => {
			item.isShow = true;
			if (checkedKeys.indexOf(item.key) !== -1) {
				cardList.push(item);
			}
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
        console.log("onCheck", checkedKeys, info);
        _.forEach(info.checkedNodes,(v,i)=>{
            _.forEach(v.props.children,(c,index)=>{
                if(checkedKeys.checked.indexOf(c.key)===-1){
                    checkedKeys.checked.push(c.key);
                }
            })
           
        })
        this.setState({ checkedKeys: checkedKeys });
      };
      onSelect = (selectedKeys, info) => {
        console.log("onSelect", selectedKeys);
        this.setState({ selectedKeys });
      };
    
    renderTreeNodes = data => {
        return data.map(item => {
          if (item.children) {
            return (
              <TreeNode title={item.title} key={item.key} dataRef={item}>
                {this.renderTreeNodes(item.children)}
              </TreeNode>
            );
          }
          return <TreeNode {...item} />;
        });
    };

	getContentDom = () => {
		const { metaTree } = this.props;
		return (
			<div className='template-setting-left-sider template-setting-sider'>
				<div className='sider-content'>
					<div className='sider-search'>
						<Input
							placeholder='请搜索元数据名称'
							style={{ width: '70%' }}
							onPressEnter={this.onInputSearch}
							onChange={this.onInputChange}
							addonAfter={
								<Icon type='search' className='search-input-icon' onClick={this.onInputSearch} />
							}
						/>
					</div>

					<div className='sider-tree'>
						<Tree
                        showLine={true}
							checkStrictly={true}
							multiple={true}
							checkable
							onCheck={this.onCheck}
							checkedKeys={this.state.checkedKeys}
							onSelect={this.onSelect}
							selectedKeys={this.state.selectedKeys}
						>
							 {this.renderTreeNodes(treeData)}
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
				footer={[
					<Button
						key='submit'
						disabled={this.state.selectedValue === 0}
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
