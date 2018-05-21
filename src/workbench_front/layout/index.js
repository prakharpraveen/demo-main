import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import { Select } from 'antd';
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
const Option = Select.Option;
/**
 * 工作桌面整体布局组件
 */
class Layout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nodeName: '首页'
		};
	}
	
	handleChange = (value) => {
		console.log(`selected ${value}`);
	};

	componentWillMount() {
		console.log(this.props.location.pathname);
		let { n } = GetQuery(this.props.location.search);
		if (n) {
			let nodeName = decodeURIComponent(n);
			this.setState({
				nodeName
			});
		}
	}

	componentDidMount() {
		
	}
	

	render() {
		let { nodeName } = this.state;
		let { isOpen } = this.props;
		return (
			<div className='nc-workbench-layout'>
				<div className='nc-workbench-top-container  nccwb-header' style={{ 'zIndex': '999' }}>
					<nav  field="nccwb-header" fieldname={nodeName}  className='nc-workbench-nav'>
						<div className='nav-left n-left n-v-middle'>
							<div
								className='nc-workbench-hp margin-right-10'
								onClick={() => {
									this.props.changeDrawer(!isOpen);
								}}
							>
								<img src='http://www.qqzhi.com/uploadpic/2014-09-23/000247589.jpg' alt='logo' />
							</div>
							<div>
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
							<span className='margin-right-10'>
								<i className='iconfont icon-sousuo' />
							</span>
							<span className='margin-right-10'>
								<Link to={`all`}><i className='iconfont icon-quanbuyingyong' /></Link>
							</span>
							<span className='margin-right-10'>
								<i className='iconfont icon-xiaoxi' />
							</span>
						</div>
					</nav>
					<div className='nccwb-header-info'>
						{this.props.location.pathname === '/'?<TabsLink />:<Breadcrumb/>}
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
