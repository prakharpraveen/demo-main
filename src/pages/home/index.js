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
			<div className='nc-workbench-home-container'>
				Home page
				<Link to='/ifr'> to Ifr page</Link>
				<div className='home-container-top n-row'>
					<div className='n-col-6'>1</div>
					<div className='n-col-6'>2</div>
				</div>
				<div className='home-container-bottom'>
					<div className='n-col-6'>1</div>
					<div className='n-col-6'>2</div>
				</div>
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
