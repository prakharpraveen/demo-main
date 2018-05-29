import React, { Component } from 'react';
import { Table } from 'antd';
class TreeTable extends Component {
	constructor(props) {
		super(props);
		this.columns = [
			{
				title: '编码',
				dataIndex: 'menuitemcode',
				key: 'menuitemcode'
			},
			{
				title: '名称',
				dataIndex: 'menuitemname',
				key: 'menuitemname'
			},
			{
				title: '多语',
				dataIndex: 'resid',
				key: 'resid'
			},
			{
				title: '操作',
				dataIndex: 'action',
				key: 'action',
				render: () => {
					return (
						<div>
							<span>111</span>
							<span>222</span>
							<span>333</span>
						</div>
					);
				}
			}
		];
	}
	render() {
		return (
			<Table
				rowKey={this.props.rowKey}
				pagination={false}
				size="middle"
				columns={this.columns}
				rowSelection={this.props.rowSelection}
				dataSource={this.props.treeTableData}
			/>
		);
	}
}
export default TreeTable;
