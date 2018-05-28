import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Button, Table, Switch, Icon, Popconfirm } from 'antd';
import { PageLayout } from 'Components/PageLayout';
import TreeTable from './TreeTable';
import Ajax from 'Pub/js/ajax.js';
import { createTree } from 'Pub/js/createTree.js';
import './index.less';

class MenuItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			treeDataArray: [],
			menuItemData:{},
			treeTableData: []
		};
	}
	componentDidMount = () => {
		Ajax({
			url: `/nccloud/platform/appregister/queryappmenus.do`,
			info: {
				name: '菜单注册',
				action: '应用树查询'
			},
			data: {
				pk_menu:this.props.menuItemData.pk_menu
			},
			success: (res) => {
				let { success, data } = res.data;
				if (success && data) {
					this.setState({ treeDataArray: data},()=>{this.updateTreeData(data)});
				}
			}
		});
	};
	updateTreeData = (data)=>{
		let treeTableData = createTree(data, 'menuitemcode', 'parentcode');
		this.setState({ treeTableData });
	}
	render() {
		let { treeTableData } = this.state;
		return (
			<PageLayout className="nc-workbench-menuitem">
				<div className="nc-workbench-menuitem-card">
					<div className="menuitem-card-title">
						菜单注册
						<Button type="primary">保存</Button>
					</div>
					<div className="menuitem-card-form" />
					<div className="menuitem-card-table">
						<TreeTable rowKey={'menuitemcode'} treeTableData={treeTableData} />
					</div>
				</div>
			</PageLayout>
		);
	}
}
MenuItem.propTypes = {
	menuItemData: PropTypes.object.isRequired,
};
export default connect((state)=>{
	return {
		menuItemData:state.menuRegisterData.menuItemData
	}
},{})(MenuItem);
