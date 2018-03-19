import React, { Component } from 'react';
export default class Ifr extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		console.log(this.props.location);
		return <div>ifr page</div>;
	}
}
