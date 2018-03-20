import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Axios from 'axios';
import store from './store';
import Routes from './routes';
export default class App extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		console.log('ajax');
	}
	render() {
		return <Routes />;
	}
}
ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.querySelector('#ncc')
);
