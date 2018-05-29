import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Button, Table, Switch, Icon, Popconfirm, Layout, Modal } from 'antd';

import { createPage, ajax, base } from 'nc-lightapp-front';
import { PageLayout } from 'Components/PageLayout';
import TreeTable from './TreeTable';
import SearchTree from './SearchTree';
import Ajax from 'Pub/js/ajax.js';
import { createTree } from 'Pub/js/createTree.js';
const { Header, Footer, Sider, Content } = Layout;
const confirm = Modal.confirm;
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
							<SearchTree />
						</Sider>
					</Layout>
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
