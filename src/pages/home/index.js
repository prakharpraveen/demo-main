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
			<div className="nc-workbench-home-container">
				<div className="n-col">
					<div className='title'>
						应用
					</div>
					<div className="n-row">
						<div className="n-6-1 n-r-1">1</div>
						<div className="n-6-1 n-r-1">2</div>
					</div>
				</div>
				<div className="n-col">
					<div className='title'>
						监控分析
					</div>
					<div className=" n-row">
						<div className="n-3-1 n-r-2">1</div>
						<div className="n-3-1 n-r-2">2</div>
					</div>
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
