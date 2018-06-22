import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Layout, Modal, Tree, Input, Select, Menu, Dropdown, Icon } from 'antd';
import { PageLayout } from 'Components/PageLayout';
import Ajax from 'Pub/js/ajax.js';
import Item from 'antd/lib/list/Item';
import Notice from 'Components/Notice';
import BusinessUnitTreeRef from "Components/Refers/BusinessUnitTreeRef";
import 'nc-lightapp-front/dist/platform/nc-lightapp-front/index.css';
const Option = Select.Option;
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const initRoTreeData = {
	key: 'abc1234567',
	id: 'abc1234567',
	text: '角色',
	name: '角色',
	children: []
};
const initUserTreeData = {
	key: 'abc2234567',
	id: 'abc2234567',
	text: '用户',
	name: '用户',
	children: []
};
const initAbiTreeData = {
	key: 'abc3334567',
	id: 'abc3334567',
	text: '职责',
	name: '职责',
	children: []
};
class AssignComponennt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expandedKeys: ['0'],
			selectedKeys: [],
			treeDataArray: [],
			treeData: [],
			searchValue: '',
			autoExpandParent: true
		};
	}
	componentDidMount() {
		let {
			treeData
		} = this.state;
		treeData = initTreeData;
		this.setState({
			treeData
		}, this.reqTreeData);
		this.props.reqTreeData(this.reqTreeData);
	}
	onSelect = (typeSelect, key, e)=>{
		switch(typeSelect){
			case 'systemOnselect':
				this.onSelectQuery(key, e)
				break;
			case 'templateOnselect':
				this.onTemSelect(key, e);
				break;
			case 'resOnselect':
				this.selectRoFun(key, e);
				break;
			case 'allowedOnselect':
				this.onSelectedAllow(key, e);
			default:
			break;
		}
	}
	treeResAndUser = (data, typeSelect, hideSearch)=>{
		const {
			expandedKeys,
			autoExpandParent,
			selectedKeys,
			searchValue
		} = this.state;
		const loop = (data) => {
			return data.map((item) => {
				let {
					text,
					key,
					children
				} = item;
				const index = text.indexOf(searchValue);
				const beforeStr = text.substr(0, index);
				const afterStr = text.substr(index + searchValue.length);
				const title = index > -1 ? ( 
					<span> 
						{beforeStr} 
						<span style = {{color: '#f50'}} > 
							{searchValue} 
						</span>
							{afterStr} 
					</span>
				) : (
					<div>
						<span> {text} </span> 
					</div>
				);
				if (children) {
					return ( <TreeNode key = {key} title = {text} > {loop(children)} </TreeNode>
					);
				}
				return <TreeNode key = {key} title = {text}
				/>;
			});
		};
		return (<div>
			{ hideSearch?"":(<Search 
			style = {{marginBottom: 8}}
			placeholder = 'Search'
			onChange = {this.onChange}
		/>) } 
		{data.length > 0 && ( 
			<Tree showLine onExpand = {this.onExpand}
				expandedKeys = {expandedKeys}
				onSelect = {this.onSelect.bind(this,typeSelect)}
				autoExpandParent = {autoExpandParent}
				selectedKeys = {selectedKeys} >
				{loop(data)} 
			</Tree>
		)} 
	</div>)
	}
	render() {
		const {
			expandedKeys,
			searchValue,
			autoExpandParent,
			selectedKeys,
			treeData
		} = this.state;
		return(
			<Modal
				title="多角色和用户模板分配"
				visible={alloVisible}
				onOk={this.handleAlloOk}
				onCancel={this.handleOrlCancel}
				width={720}
			>
				<div className='allocationPage'>
					<p className='pageCode-show'><span>功能节点：</span><span>{pageCode ?pageCode:""}</span></p>
					<div className='allocationPage-content'>
						<div className='allocationPage-content-select'>
							<Select
								showSearch
								style={{ width: 200 }}
								placeholder="按角色和用户分配"
								optionFilterProp="children"
								onSelect={(e)=>{
									if(e==='按角色和用户分配'){
										this.setState({
											treeRoVisible:true
										})
									}else if(e==='按职责分配'){
										this.setState({
											treeRoVisible:false
										})
									}
								}}
								filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
							>
								<Option value="按角色和用户分配">按角色和用户分配</Option>
								<Option value="按职责分配">按职责分配</Option>
							</Select>
							<BusinessUnitTreeRef
								value={org_df_biz}
								placeholder={"默认业务单元"}
								onChange={value => {
									this.handdleRefChange(value, "org_df_biz");
								}}
							/>
						</div>
						<div className='allocationPage-content-tree'>
							<div className='allocation-treeCom'>{treeRoVisible ?this.treeResAndUser(treeRoData,"resOnselect") : this.treeResAndUser(treeResData,"resOnselect")}</div>
							<div className='allocation-button'>
								<p><Button onClick={this.allowClick.bind(this, 'allowRole')}>
									分配
								</Button></p>
								<p><Button onClick={this.allowClick.bind(this, 'allowRoleCancel')}>
									取消
								</Button></p>
							</div>
							<div className='allocation-tree'>
							{treeAllowedData.length >0 &&this.treeResAndUser(treeAllowedData,'allowedOnselect','hideSearch')}
							</div>
						</div>
					</div>
				</div>
			</Modal>
		);
	}
}
export default AssignComponennt