import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import name from 'module';
export default class Layout extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
				<div>
					<ul>
						<li>
							<Link to='/'>Home</Link>
						</li>
						<li>
							<Link to='/ifr'>Ifr</Link>
						</li>
					</ul>
					{this.props.children}
				</div>
		);
	}
}
