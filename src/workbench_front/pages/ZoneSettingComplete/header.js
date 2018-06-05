import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class MyHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div className='template-setting-header'>
				<div className='header-name'>
					<span>配置完成</span>
				</div>
			</div>
		);
	}
}
export default MyHeader;
