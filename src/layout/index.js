import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import IntlCom from './../intl';
import './index.less';
console.log(intl.get('hello'));
class Layout extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className='nc-workbench-layout'>
				<ul className='nc-workbench-menu nccwb-header'>
					<li>
						<Link to='/'>Home</Link>
					</li>
					<li>
						<span onClick={openNew.bind(this, 'http://www.china.com.cn/', 'new')}>打开新页签</span>
					</li>
					<li>
						<span onClick={openNew.bind(this, 'http://127.0.0.1:5500/dist/index.html#/')}>在当前页打开</span>
					</li>
					<li>
						<IntlCom />
					</li>
					<li>{intl.get('hello')}</li>
				</ul>
				<div className='nc-workbench-container'>{this.props.children}</div>
			</div>
		);
	}
}
Layout.PropTypes = { appData: PropTypes.object.isRequired };
export default connect((state) => ({
	appData: state.appData
}), {})(Layout);
