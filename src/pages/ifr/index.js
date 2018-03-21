import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { initIfrData, clearData } from 'Store/ifr/action';
import { GetQuery } from 'Static/js/utils';
class Ifr extends Component {
	static propTypes = {
		ifrData: PropTypes.object.isRequired,
		initIfrData: PropTypes.func.isRequired,
		clearData: PropTypes.func.isRequired
	};
	constructor(props) {
		super(props);
		this.state = {
			queryUrl: ''
		};
	}

	componentWillMount() {
		let { ifr } = GetQuery(this.props.location.search);
		this.setState({
			queryUrl: decodeURIComponent(ifr)
		});
	}

	componentDidMount() {
		console.log('ajax');
	}

	render() {
		let { ifrID, ifrName } = this.props.ifrData;
		let { queryUrl } = this.state;
		console.log(this.props.location);
		return <iframe id="mainiframe" src={queryUrl} frameborder="0" scrolling="yes" />;
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
