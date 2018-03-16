import React, { Component } from 'react';
export default class NotFound extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		let { location } = this.props;
		return (
			<div>
				<h3>
					Not Found <code>{location.pathname}</code>
				</h3>
			</div>
		);
	}
}
