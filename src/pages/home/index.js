import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { saveFormData, saveImg, clearData } from 'Store/home/action';
import './index.less';
class Home extends Component {
	static propTypes = {
		formData: PropTypes.object.isRequired,
		saveFormData: PropTypes.func.isRequired,
		saveImg: PropTypes.func.isRequired,
		clearData: PropTypes.func.isRequired
	};
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
export default connect(
	(state) => ({
		formData: state.formData,
		proData: state.proData
	}),
	{
		saveFormData,
		saveImg,
		clearData
	}
)(Home);
