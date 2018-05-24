import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { setNodeData, setBillStatus, setOpType, setAppParamData, setPageButtonData,
// 	setPageTemplateData,
// 	setPrintTemplateData,setParentData } from 'Store/AppRegister/action';
import Ajax from 'Pub/js/ajax';
import './index.less';
import {  Input, Icon,Tree } from 'antd';
const TreeNode = Tree.TreeNode;
class MyLeftSider extends Component {
	constructor(props) {
		super(props);
		this.state = {
            searchValue:''
        };
	}

	componentDidMount() {}
    onInputSearch = () => {
		const relateidObj = this.props.relateidObj;
		const ajaxData =
			relateidObj.type === 'userID'
				? { search_content: this.state.searchValue, userid: relateidObj.data }
				: { search_content: this.state.searchValue };
		Ajax({
			url: `/nccloud/platform/appregister/searchapp.do`,
			info: {
				name:'工作桌面配置',
				action:'模糊搜索应用和部件'
			},
			data: ajaxData,
			success: (res) => {
				const { data, success } = res.data;
				if (success && data && data.children &&data.children.length>0) {
					data.isShow = true;
					data.checkedAll = false;
					data.indeterminate = false;
					_.forEach(data.children, (c) => {
						c.checked = false;
					});
					this.setState({ appGroupArr: [data], isAllShow: true });
				}
			}
		});
		console.log(this.state.searchValue, '搜索开始');
    };
    //搜索框文本改变
	onInputChange = (e) => {
		let _serachText = e.target.value;
		// console.log(_groupName);
		this.state.searchValue = _serachText;
    };
    

    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
      }
      onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
      }
	render() {
		return (
					
            <div className='template-setting-left-sider template-setting-sider' >
            <div className="sider-content">
            <div class="sider-search">
            <Input
						placeholder='请搜索元数据名称'
						style={{ width: '213px' }}
						onPressEnter={this.onInputSearch}
						onChange={this.onInputChange}
						addonAfter={<Icon type='search' className='search-input-icon' onClick={this.onInputSearch} />}
					/>
            </div>
          
                    <div class="sider-tree">
                    <Tree
        checkable
        defaultExpandedKeys={['0-0-0', '0-0-1']}
        defaultSelectedKeys={['0-0-0', '0-0-1']}
        defaultCheckedKeys={['0-0-0', '0-0-1']}
        onSelect={this.onSelect}
        onCheck={this.onCheck}
      >
        <TreeNode title="parent 1" key="0-0">
          <TreeNode title="parent 1-0" key="0-0-0" disabled>
            <TreeNode title="leaf" key="0-0-0-0" disableCheckbox />
            <TreeNode title="leaf" key="0-0-0-1" />
          </TreeNode>
          <TreeNode title="parent 1-1" key="0-0-1">
            <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} key="0-0-1-0" />
          </TreeNode>
        </TreeNode>
      </Tree>
                    </div>
                </div>
            </div>
		);
	}
}
export default connect((state) => ({}), {})(MyLeftSider);
