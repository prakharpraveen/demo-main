import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.less';
export default class Main extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className='main-color'>
				main page
				<Link to='/ifr'> to ifr</Link>
			</div>
		);
	}
}
