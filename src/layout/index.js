import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import IntlCom from './../intl';
import './index.less';
/**
 * 工作桌面整体布局组件
 */
class Layout extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="nc-workbench-layout">
				<nav className="nc-workbench-nav nccwb-header">
					<div className="nav-left n-left n-v-middle">
						<div className="nc-workbench-hp margin-right-10">
							<img src="http://www.qqzhi.com/uploadpic/2014-09-23/000247589.jpg" alt="logo" />
						</div>
						<div>集团切换</div>
					</div>
					<div className="nav-middle ">
						<span>首页</span>
					</div>
					<div className="nav-right n-right n-v-middle">
						<span className="margin-right-10">搜索</span>
						<span className="margin-right-10">应用</span>
						<span className="margin-right-10">消息</span>
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
				<div className="nc-workbench-container">{this.props.children}</div>
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
