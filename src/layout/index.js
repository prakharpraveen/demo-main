import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import { Select } from 'antd';
import Drawer from 'react-motion-drawer';
import PropTypes from 'prop-types';
import { GetQuery } from 'Pub/js/utils';
import { withRouter } from 'react-router';
import IntlCom from './../intl';
import './index.less';
const Option = Select.Option;
/**
 * 工作桌面整体布局组件
 */
class Layout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			nodeName: '首页'
		};
	}
	handleDrawerChange = (isOpen) => {
		this.setState({ isOpen });
	};

	handleChange = (value) => {
		console.log(`selected ${value}`);
	};

	componentWillMount() {
		let { n } = GetQuery(this.props.location.search);
		if (n) {
			let nodeName = decodeURIComponent(n);
			this.setState({
				nodeName
			});
		}
	}

	render() {
		let { isOpen, nodeName } = this.state;
		return (
			<div className='nc-workbench-layout'>
				<nav className='nc-workbench-nav nccwb-header'>
					<div className='nav-left n-left n-v-middle'>
						<div
							className='nc-workbench-hp margin-right-10'
							onClick={() => {
								this.setState({
									isOpen: !isOpen
								});
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
					<div className='nav-middle '>
						{/* <Link to='/'>首页</Link> */}
						<span>{nodeName}</span>
					</div>
					<div className='nav-right n-right n-v-middle'>
						<span className='margin-right-10'>
							<i class='iconfont icon-sousuo' />
						</span>
						<span className='margin-right-10'>
							<i class='iconfont icon-quanbuyingyong' />
						</span>
						<span className='margin-right-10'>
							<i class='iconfont icon-xiaoxi' />
						</span>
					</div>
					{/* <ul className='nc-workbench-menu '>
						<li>
							<Link to='/'>Home</Link>
						</li>
						<li>
							<span onClick={openNew.bind(this, 'http://www.china.com.cn/', 'new')}>打开新页签</span>
						</li>
						<li>
							<span onClick={openNew.bind(this, 'http://www.baidu.com/')}>在当前页打开</span>
						</li>
						<li>
							<IntlCom />
						</li>
						<li>{intl.get('hello')}</li>
					</ul> */}
				</nav>
				<div className='nc-workbench-container'>{this.props.children}</div>
				<Drawer className='nc-workbench-drawer' open={isOpen} onChange={this.handleDrawerChange}>
					<div className='drawer-top'>
						<div className='drawer-logo'>
							<img src='http://www.qqzhi.com/uploadpic/2014-09-23/000247589.jpg' alt='logo' />
						</div>
					</div>
					<div className='drawer-buttom'>
						<ul>
							<li>
								<Link to='/ar'>添加应用</Link>
							</li>
						</ul>
					</div>
				</Drawer>
			</div>
		);
	}
}
Layout.PropTypes = { appData: PropTypes.object.isRequired };
export default withRouter(
	connect(
		(state) => ({
			appData: state.appData
		}),
		{}
	)(Layout)
);
