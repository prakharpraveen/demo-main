import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.less';
export default class Home extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className='main-color'>
				Home page
				<Link to='/ifr'> to Ifr page</Link>
			</div>
		);
	}
}
