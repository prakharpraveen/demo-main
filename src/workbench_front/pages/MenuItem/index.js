import React, { Component } from 'react';
import { Button, Table, Switch, Icon, Popconfirm } from 'antd';
import { PageLayout } from 'Components/PageLayout';
import TreeTable from './TreeTable';
import Ajax from 'Pub/js/ajax.js';
import { createTree } from 'Pub/js/createTree.js';
import TreeData from './data.json';
import './index.less';
console.log(TreeData);

class MenuItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			treeTableData: []
		};
	}
	componentDidMount = () => {
		let treeTableData = createTree(TreeData.data, 'menuitemcode', 'parentcode');
		console.log(treeTableData);
		this.setState({ treeTableData });
		// Ajax({
		// 	url: `/nccloud/platform/appregister/queryappmenus.do`,
		// 	info: {
		// 		name: '菜单注册',
		// 		action: '应用树查询'
		// 	},
		// 	data: '',
		// 	success: (res) => {
		// 		let { success, data } = res.data;
		// 		if (success && data) {
		// 			let treeTableData = createTree(data);
		// 			this.setState({ treeTableData });
		// 		}
		// 	}
		// });
	};

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
export default MenuItem;
