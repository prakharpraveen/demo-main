import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { initIfrData, clearData } from 'Store/ifr/action';
class Ifr extends Component {
	static propTypes = {
		ifrData: PropTypes.object.isRequired,
		initIfrData: PropTypes.func.isRequired,
		clearData: PropTypes.func.isRequired,
	};
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		console.log('ajax');
	}

	render() {
		let { ifrID, ifrName } = this.props.ifrData;
		console.log(this.props.location);
		return <div>Ifr {ifrName}</div>;
	}
}
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
