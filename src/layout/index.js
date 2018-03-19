import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.less';

export default class Layout extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="layout">
				<ul className="menu">
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/ifr">Ifr</Link>
					</li>
				</ul>
				{this.props.children}
			</div>
		);
	}
}
