import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import Axios from 'axios';
import PropTypes from 'prop-types';
import { initAppData } from 'Store/appStore/action';
import store from './store';
import Routes from './routes';
class App extends Component {
	static propTypes = {
		initAppData: PropTypes.object.isRequired
	};
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		let data = {
			lang: 'zh-CN',
			userInfo: '小明'
		};
		this.props.initAppData(data);
		console.log('ajax');
	}
	render() {
		return <Routes />;
	}
}
const AppStore = connect((state) => ({}), {
	initAppData
})(App);
ReactDOM.render(
	<Provider store={store}>
		<AppStore />
	</Provider>,
	document.querySelector('#ncc')
);
