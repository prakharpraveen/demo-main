import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.less';

export default class Layout extends Component {
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
				</ul>
				{console.log(this.props.children)}
				<div className='nc-workbench-container'>{this.props.children}</div>
			</div>
		);
	}
}
