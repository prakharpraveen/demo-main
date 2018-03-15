import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

export default class App extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return <div>hello world</div>;
	}
}
ReactDOM.render(<App />, document.querySelector('#ncc'));
