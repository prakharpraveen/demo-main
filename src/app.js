import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import PropTypes from 'prop-types';
import Ajax from 'Pub/js/ajax';
import $NCPE from 'Pub/js/pe';
import { initAppData } from 'Store/appStore/action';
import { GetQuery } from 'Pub/js/utils';
import store from './store';
import Routes from './routes';
import 'Pub/css/public.less';
import './theme/theme.css';
window.proxyAction = $NCPE.proxyAction;

class App extends Component {
	static propTypes = {
		initAppData: PropTypes.func.isRequired
	};
	constructor(props) {
		super(props);
	}
	openNewApp = ({ appOption, type }) => {
		let { code, name } = appOption;
		let win = window.open('', '_blank');
		let { pk_appregister } = appOption;
		Ajax({
			url: `/nccloud/platform/appregister/openapp.do`,
			data: {
				pk_appregister: pk_appregister
			},
			success: (res) => {
				if (res) {
					let { data, success } = res.data;
					if (success) {
						// 成功之后进行页面跳转
						if (type === 'current') {
							// 浏览器当前页打开
							window.location.hash = `#/ifr?ifr=${encodeURIComponent(data)}`;
						} else {
							// 浏览器新页签打开  n 为 nodeName c 为 nodeCode
							win.location = `#/ifr?ifr=${encodeURIComponent(data)}&n=${encodeURIComponent(
								name
							)}&c=${encodeURIComponent(code)}`;
							win.focus();
						}
					}
				}
			}
		});
	};
	componentWillMount() {
		window.peData = {
			userID: 'xxx',
			projectCode: 'nccloud'
		};
		/**
		 * 在新页签中打开
		 * @param　{String} appOption // 应用 描述信息 实际需要 name 和 code
		 * @param　{String} type // new - 浏览器新页签打开 不传参数在当前页打开
		 */
		window.openNew = (appOption, type) => {
			let { code, name } = appOption;
			window.peData.nodeName = name;
			window.peData.nodeCode = code;
			proxyAction(this.openNewApp, this, '打开应用')({ appOption, type });
		};
	}
	componentDidMount() {
		// 模拟数据，应该在此处进行数据请求，返回用户初始信息
		let data = {
			lang: 'zh-CN',
			userInfo: '小明'
		};
		this.props.initAppData(data);
	}
	render() {
		return <Routes />;
	}
}
const AppStore = connect((state) => ({ ifrData: state.ifrData }), {
	initAppData
})(App);
ReactDOM.render(
	<Provider store={store}>
		<AppStore />
	</Provider>,
	document.querySelector('#ncc')
);
