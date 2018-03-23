import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { initIfrData, clearData } from 'Store/ifr/action';
import { GetQuery } from 'Static/js/utils';
class Ifr extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		let { ifrID, ifrName } = this.props.ifrData;
		let { ifr } = GetQuery(this.props.location.search);
		let queryUrl = decodeURIComponent(ifr);
		console.log(this.props.location);
		return <iframe id='mainiframe' src={queryUrl} frameborder='0' scrolling='yes' />;
	}
}
Ifr.propTypes = {
	ifrData: PropTypes.object.isRequired,
	initIfrData: PropTypes.func.isRequired,
	clearData: PropTypes.func.isRequired
};
export default connect(
	(state) => {
		console.log(state);
		return {
			ifrData: state.ifrData
		};
	},
	{
		initIfrData,
		clearData
	}
)(Ifr);
