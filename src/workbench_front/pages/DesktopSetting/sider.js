import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Cascader, Input, Icon, Checkbox, Switch } from 'antd';
import SiderCard from './siderCard.js';
import { connect } from 'react-redux';
import { collision, layoutCheck } from './collision';
import { compactLayout } from './compact';
import { updateGroupList } from 'Store/test/action';
import * as utilService from './utilService';
import {GetQuery} from 'Pub/js/utils';
import MyModal from './modal';
import Ajax from 'Pub/js/ajax';
const { Sider } = Layout;
import Notice from 'Components/Notice';

class MySider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showSearch: false,
			searchValue: '',
			appGroupArr: [],
			modalVisible: false,
			isShowAll: true
		};
	}
	componentDidMount() {
		const relateidObj = this.props.relateidObj;
		const ajaxData =
			relateidObj.type === 'userID'
				? { userid: relateidObj.data }
				: { pk_responsibility: relateidObj.data }
		Ajax({
			url: `/nccloud/platform/appregister/queryapplazy.do`,
			info: {
				name:'工作桌面配置',
				action:'查询一二级领域模块'
			},
			data: ajaxData,
			success: (res) => {
				if (res) {
					let { data, success } = res.data;
					if (success && data && data.length > 0) {
						this.setState({ domainArr: data });
					}else{
						if(data.length === 0){
							Notice({ status: 'error', msg: '领域模块数据为空' });
						}else{
							Notice({ status: 'error', msg: data });
						}
					}
				}
			}
		});
	}
	showModalVisible = () => {
		this.setModalVisible(true);
	};
	setModalVisible = (modalVisible) => {
		this.setState({ modalVisible });
	};
	//搜索框文本改变
	onInputChange = (e) => {
		let _serachText = e.target.value;
		// console.log(_groupName);
		this.state.searchValue = _serachText;
	};
	//应用名模糊搜索
	onInputSearch = () => {
		if(this.state.searchValue === ''){
			return;
		}
		const relateidObj = this.props.relateidObj;
		const ajaxData =
			relateidObj.type === 'userID'
				? { search_content: this.state.searchValue, userid: relateidObj.data }
				: { search_content: this.state.searchValue, pk_responsibility: relateidObj.data };
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
						c.height = Number(c.height);
						c.width = Number(c.width);
					});
					this.setState({ appGroupArr: [data], isAllShow: true });
				}else{
					if(data && data.children &&data.children.length === 0){
						Notice({ status: 'error', msg: '数据为空' });
					}else{
						Notice({ status: 'error', msg: data });
					}
				}
			}
		});
		console.log(this.state.searchValue, '搜索开始');
	};
	//领域模块搜索
	onCascaderChange = (value) => {
		if(value && value.length===0){
			return;
		}
		let cascaderValueArr = value;
		if (cascaderValueArr.length === 1) {
			return;
		}
		const relateidObj = this.props.relateidObj;
		const ownModuleID = cascaderValueArr[1];
		const ajaxData =
			relateidObj.type === 'userID'
				? { own_module: ownModuleID, userid: relateidObj.data }
				: { own_module: ownModuleID, pk_responsibility: relateidObj.data };
		Ajax({
			url: `/nccloud/platform/appregister/queryapplazy.do`,
			info: {
				name:'工作桌面配置',
				action:'查询模块下应用和部件'
			},
			data: ajaxData,
			success: (res) => {
				const { data, success } = res.data;
				if (success && data && data.length > 0) {
					console.log(data);
					_.forEach(data, (d) => {
						d.isShow = true;
						d.checkedAll = false;
						d.indeterminate = false;
						_.forEach(d.children, (c) => {
							c.checked = false;
							c.height = Number(c.height);
							c.width = Number(c.width);
						});
					});
					this.setState({ appGroupArr: data, isAllShow: true });
				}else{
					if(data && data.length === 0){
						Notice({ status: 'error', msg: '数据为空' });
					}else{
						Notice({ status: 'error', msg: data });
					}
				}
			}
		});
	};
	//切换搜索状态
	switchSearch = () => {
		const { showSearch } = this.state;
		this.setState({ showSearch: !showSearch });
	};
	//获取sider上方的搜索框
	getSearchDom() {
		let itemDom;
		if (this.state.showSearch) {
			itemDom = (
				<div className='sider-search'>
					<Input
						placeholder='请输入应用名称'
						style={{ width: '230px' }}
						onPressEnter={this.onInputSearch}
						onChange={this.onInputChange}
						addonAfter={<Icon type='search' className='search-input-icon' onClick={this.onInputSearch} />}
					/>
					<span className='switch-search-cancel' onClick={this.switchSearch}>
						取消
					</span>
				</div>
			);
		} else {
			itemDom = (
				<div className='sider-search'>
					<Cascader
						className='search-cascader'
						style={{ width: '230px' }}
						options={this.state.domainArr}
						onChange={this.onCascaderChange}
						placeholder='领域-模块'
					/>
					<span className='switch-search' onClick={this.switchSearch}>
						<Icon type='search' />
					</span>
				</div>
			);
		}
		return itemDom;
	}
	//搜索结果
	getResultDom() {
		return this.state.appGroupArr.map((item, index) => {
			return (
				<div className='result-group-list' key={index}>
					<h4 className='result-header'>
						<Checkbox
							checked={item.checkedAll}
							indeterminate={item.indeterminate}
							onChange={(e) => {
								this.onCheckAllChange(e, index);
							}}
						/>
						<strong>
						<span
							className='result-header-name'
							onClick={() => {
								this.onChangeShowHide(index);
							}}
						>
							&nbsp;{item.label}&nbsp;
							{item.isShow ? <Icon type='down' /> : <Icon type='right' />}
						</span>
						</strong>
					</h4>
					<div className='result-app-list' style={{ display: item.isShow ? 'flex' : 'none' }}>
						{item.children.map((child, i) => {
							return (
								<div className='app-col' key={i}>
									<div className='list-item'>
										<SiderCard
											id={child.value}
											key={child.value}
											width={child.width}
											height={child.height}
											index={i}
											parentIndex={index}
											name={child.label}
											type={'new'}
											checked={child.checked}
											onChangeChecked={this.onChangeChecked}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			);
		});
	}

	//所有结果展开/收缩显示
	allShowOrHide = (value) => {
		let { appGroupArr, isAllShow } = this.state;
		_.forEach(appGroupArr, (a) => {
			a.isShow = value;
		});
		this.setState({ appGroupArr, isAllShow: value });
	};
	//单个结果展开/收缩展示
	onChangeShowHide(index) {
		let { appGroupArr } = this.state;
		appGroupArr[index].isShow = !appGroupArr[index].isShow;
		this.setState({ appGroupArr });
	}
	//每组的全选与否
	onCheckAllChange = (e, index) => {
		const checked = e.target.checked;
		let { appGroupArr } = this.state;
		let selectGroup = appGroupArr[index];

		selectGroup.checkedAll = e.target.checked;
		selectGroup.indeterminate = false;
		_.forEach(selectGroup.children, (c) => {
			c.checked = checked;
		});
		this.setState({ appGroupArr });
	};
	//单个卡片的选择
	onChangeChecked = (e, groupIndex, index) => {
		const checked = e.target.checked;
		let { appGroupArr } = this.state;
		let selectGroup = appGroupArr[groupIndex];
		let child = selectGroup.children[index];
		child.checked = checked;

		let checkCount = 0;
		_.forEach(selectGroup.children, (c) => {
			if (c.checked) {
				checkCount++;
			}
		});

		selectGroup.checkedAll = checkCount === selectGroup.children.length;
		selectGroup.indeterminate = !!checkCount && checkCount < selectGroup.children.length;
		console.log(selectGroup.indeterminate);
		this.setState({ appGroupArr });
	};
	//sider中有checked的卡片
	hasChechedItem() {
		let flag = false;
		let { appGroupArr } = this.state;
		_.forEach(appGroupArr, (s) => {
			_.forEach(s.children, (c) => {
				if (c.checked) {
					flag = true;
					return false;
				}
			});
			if (flag) {
				return false;
			}
		});
		return flag;
	}
	render() {
		const contentHeight = this.props.contentHeight;
		return (
			<Sider
				className='nc-workbench-home-sider'
				width= {300}
				style={{ height: contentHeight }}
			>
				<div className='sider-content'>
					{this.getSearchDom()}
					<div className='add-item'>
						<Switch
							checkedChildren='展开'
							checked={this.state.isAllShow}
							unCheckedChildren='收缩'
							className={this.state.appGroupArr.length === 0 ? 'cannot-add' : 'aaa'}
							onChange={this.allShowOrHide}
						/>
						<Icon
							className={this.hasChechedItem() ? 'add' : 'cannot-add'}
							type='plus-circle-o'
							title='占位符'
							onClick={this.showModalVisible}
						/>
					</div>
					<div className='sider-result'>{this.getResultDom()}</div>
				</div>
				<MyModal
					appGroupArr={this.state.appGroupArr}
					setModalVisible={this.setModalVisible}
					modalVisible={this.state.modalVisible}
				/>
			</Sider>
		);
	}
}
export default connect(
	(state) => ({
		userID : state.appData.userID
	}),
	{}
)(MySider);
