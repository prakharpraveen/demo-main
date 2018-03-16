import React, { Component } from 'react';
import { Link } from 'react-router-dom';
export default class Layout extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
				<div>
					<ul>
						<li>
							<Link to='/'>main</Link>
						</li>
						<li>
							<Link to='/ifr'>ifr</Link>
						</li>
					</ul>
					{this.props.children}
				</div>
		);
	}
}
