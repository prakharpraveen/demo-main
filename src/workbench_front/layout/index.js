import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import { Select, AutoComplete } from 'antd';
import Drawer from 'react-motion-drawer';
import PropTypes from 'prop-types';
import { GetQuery } from 'Pub/js/utils';
import { withRouter } from 'react-router';
import { changeDrawer } from 'Store/appStore/action';
import IntlCom from './../intl';
import SideDrawer from './SideDrawer';
import Breadcrumb from 'Components/Breadcrumb';
// 工作桌面单页通用布局
import TabsLink from 'Components/TabsLink';
import './index.less';
import Ajax from 'Pub/js/ajax';
const Option = Select.Option;

let resizeWaiter = false;
/**
 * 工作桌面整体布局组件
 */
class Layout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nodeName: '首页',
			isShowSearch: false,
			dataSource: []
		};
	}
	/**
	 * 组织切换
	 * @param {String} value 选中组织的value值
	 */
	handleChange = (value) => {
		console.log(`selected ${value}`);
	};
	/**
	 * 更新标题名称
	 */
	handleUpdateTitleName = () =>{
		let { n } = GetQuery(this.props.location.search);
		if (n) {
			let nodeName = decodeURIComponent(n);
			this.setState({
				nodeName
			});
		}else{
			this.setState({
				nodeName: '首页'
			});
		}
	}

	componentDidMount() {
		this.handleUpdateTitleName();
		window.addEventListener('hashchange',this.handleUpdateTitleName)
	};

	componentWillUnmount(){
		window.removeEventListener('hashchange',this.handleUpdateTitleName);
	}

	changeSearchInput = () => {
		const { isShowSearch } = this.state;
		this.setState({ isShowSearch: !isShowSearch });
	};

	onSelect = (value)=> {
		const { dataSource } = this.state;
		let targetApp = {};
		dataSource.map((d)=>{
			if( d.value ===  value){
				targetApp = d;
			}
		})
		window.openNew({
			code: targetApp.code,
			pk_appregister: targetApp.value,
			name: targetApp.text
		});
	};
	handleSearch = (value) => {
		if(value === ""){
			return;
		}
		if (!resizeWaiter) {
			resizeWaiter = true;
			setTimeout(()=>{
				resizeWaiter = false;
				Ajax({
					url: `/nccloud/platform/appregister/searchapp.do`,
					info: {
						name:'应用搜索',
						action:'模糊搜索应用'
					},
					data: {
						search_content: value,
						userid: this.props.appData.userID,
						apptype: "1"
					},
					success: (res) => {
						const { data, success } = res.data;
						if (success && data && data.children &&data.children.length>0) {
							const dataSource = [];
							data.children.map((c)=>{
								dataSource.push({
									value: c.value,
									text: c.label,
									code: c.code
								});
							})
							this.setState({ dataSource});
						}
					}
				});
			}, 300);
		}
	};
	getSearchDom = () => {
		const { isShowSearch } = this.state;
		if (isShowSearch) {
			const { dataSource } = this.state;
			return (
				<span className='margin-right-10 autocomplete'>
					<AutoComplete dataSource={dataSource} style={{ width: 200, height: 30 }} 
					onSelect={this.onSelect}
					onSearch={this.handleSearch}
					placeholder='请输入应用名称' />
					<i className='iconfont icon-sousuo' onClick={this.changeSearchInput} />
				</span>
			);
		} else {
			return (
				<span className='margin-right-10'>
					<i className='iconfont icon-sousuo' onClick={this.changeSearchInput} />
				</span>
			);
		}
	};

	render() {
		let { nodeName } = this.state;
		let { isOpen } = this.props;
		return (
			<div className='nc-workbench-layout'>
				<div className='nc-workbench-top-container  nccwb-header' style={{ zIndex: '1' }}>
					<nav field='nccwb-header' fieldname={nodeName} className='nc-workbench-nav'>
						<div className='nav-left n-left n-v-middle'>
							<div
								className='nc-workbench-hp margin-right-10'
								onClick={() => {
									this.props.changeDrawer(!isOpen);
								}}
							>
								<img field="logo" fieldname="标识" src='http://www.qqzhi.com/uploadpic/2014-09-23/000247589.jpg' alt='logo' />
							</div>
							<div field="ant-select" fieldname="下拉框">
								<Select defaultValue='yonyou' style={{ width: 234 }} onChange={this.handleChange}>
									<Option value='yonyou'>用友网络科技股份有限公司</Option>
									<Option value='yyjr'>用友（yonyou）</Option>
								</Select>
							</div>
						</div>
						<div className='nav-middle'>
							{/* <Link to='/'>首页</Link> */}
							<span>{nodeName}</span>
						</div>
						<div className='nav-right n-right n-v-middle'>
							{this.getSearchDom()}
							<span className='margin-right-10'>
								<Link to={`all`}>
									<i className='iconfont icon-quanbuyingyong' />
								</Link>
							</span>
							<span className='margin-right-10'>
								<i className='iconfont icon-xiaoxi' />
							</span>
						</div>
					</nav>
					<div className='nccwb-header-info'>
						{this.props.location.pathname === '/' ? <TabsLink /> : <Breadcrumb />}
					</div>
				</div>
				<div className='nc-workbench-container'>{this.props.children}</div>
				<SideDrawer />
			</div>
		);
	}
}
Layout.propTypes = {
	appData: PropTypes.object.isRequired,
	isOpen: PropTypes.bool.isRequired,
	changeDrawer: PropTypes.func.isRequired
};
export default withRouter(
	connect(
		(state) => ({
			appData: state.appData,
			isOpen: state.appData.isOpen
		}),
		{ changeDrawer }
	)(Layout)
);
