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
				<ul className="nc-workbench-menu nccwb-header">
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<span onClick={openNew.bind(this, 'http://www.china.com.cn/', 'new')}>打开新页签</span>
					</li>
					<li>
						<Link to="/ifr?ifr=http%3A%2F%2Fwww.baidu.com%2F">Home</Link>
					</li>
					<li>
						<span onClick={openNew.bind(this, 'http://www.baidu.com/')}>在当前页打开</span>
					</li>
					<li>
						<IntlCom />
					</li>
					<li>{intl.get('hello')}</li>
				</ul>
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
