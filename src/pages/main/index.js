import React, { Component } from 'react';
import { Link } from 'react-router-dom';
export default class Main extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				main page
				<Link to='/ifr'> to ifr</Link>
			</div>
		);
	}
}
