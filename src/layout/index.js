import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.less';

export default class Layout extends Component {
	constructor(props) {
		super(props);
	}
	/**
	 * 在新页签中打开
	 * @param　{String} url // 目标页面路径
	 */
	openInNewTab = (url) => {
		let win = window.open(`/#/ifr?ifr=${encodeURIComponent(url)}`, '_blank');
		win.focus();
	};
	render() {
		return (
			<div className="nc-workbench-layout">
				<ul className="nc-workbench-menu">
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<span onClick={this.openInNewTab.bind(this, 'http://www.china.com.cn/')}>打开新页签</span>
					</li>
					<li>
						<Link to={`/ifr?ifr=${encodeURIComponent('http://127.0.0.1:5500/dist/index.html#/')}`}>在当前页打开</Link>
					</li>
				</ul>
				<div className="nc-workbench-container">{this.props.children}</div>
			</div>
		);
	}
}
