import "babel-polyfill";
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
import Notice from 'Components/Notice';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'Assets/iconfont/iconfont.js';
import 'Pub/css/public.less';
import './theme/theme.css';
moment.locale('zh-cn');
window.proxyAction = $NCPE.proxyAction;

class App extends Component {
	constructor(props) {
		super(props);
	}
	/**
	 * 打开应用
	 * @param {Object} appOption - 应用基本描述
	 * @param {String} type - 打开类型 current - 当前页面打开 
	 * @param {String} query - 需要传递的参数
	 */
	openNewApp = (appOption,type,query) => {
		let { code, name,pk_appregister } = appOption;
		if(name === '应用注册'||name === '菜单注册'||name === '个性化注册'){
			type = 'own';
		}
		if(type !== 'current'){
			let win = window.open('', '_blank');
		}
		
		Ajax({
			url: `/nccloud/platform/appregister/openapp.do`,
			info:{
				name:name,
				action:'打开'
			},
			data: {
				pk_appregister: pk_appregister
			},
			success: (res) => {
				if (res) {
					let { data, success } = res.data;
					if (success) {
						if(data === 'false'){
							win.close();
							Notice({ status: 'error', msg: '请确认当前应用是否设置默认页面！' });
							return;
						}
						if(query){
							switch (type) {
								case 'current':
									// 浏览器当前页打开
									window.location.hash = `#/ifr?ifr=${encodeURIComponent(data)}&${query}&ar=${pk_appregister}&n=${encodeURIComponent(name)}&c=${encodeURIComponent(code)}`;
									break;
								case 'own':
									// 浏览器当前页打开
									win.location = `#/${data}?n=${encodeURIComponent(name)}&c=${encodeURIComponent(code)}`;
									win.focus();
									break;
								default:
									// 浏览器新页签打开  n 为 nodeName c 为 nodeCode
									win.location = `#/ifr?ifr=${encodeURIComponent(
										data
									)}${query}&ar=${pk_appregister}&n=${encodeURIComponent(name)}&c=${encodeURIComponent(code)}`;
									win.focus();
									break;
							}
						}else{
							switch (type) {
								case 'current':
									// 浏览器当前页打开
									window.location.hash = `#/ifr?ifr=${encodeURIComponent(data)}`;
									break;
								case 'own':
									// 浏览器当前页打开
									win.location = `#/${data}?n=${encodeURIComponent(name)}&c=${encodeURIComponent(code)}`;
									win.focus();
									break;
								default:
									// 浏览器新页签打开  n 为 nodeName c 为 nodeCode
									win.location = `#/ifr?ifr=${encodeURIComponent(
										data
									)}&ar=${pk_appregister}&n=${encodeURIComponent(name)}&c=${encodeURIComponent(code)}`;
									win.focus();
									break;
							}
						}
						
					}else{
						Notice({ status: 'error', msg: res.error.message });
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
		 * @param　{String} appOption // 应用 描述信息 name 和 code 及 pk_appregister
		 * @param　{String} type // current - 浏览器新页签打开 不传参数在当前页打开
		 * @param {String} query - 需要传递的参数 需要字符串拼接 如 &a=1&b=2 
		 */
		window.openNew = (appOption,type,query) => {
			let { code, name } = appOption;
			window.peData.nodeName = name;
			window.peData.nodeCode = code;
			proxyAction(this.openNewApp, this, '打开应用')(appOption,type,query);
		};
	}
	componentDidMount() {
		// 模拟数据，应该在此处进行数据请求，返回用户初始信息
		let data = {
			lang: 'zh-CN',
			userInfo: '小明'
		};
		this.props.initAppData(data);
		Ajax({
			url:`/nccloud/platform/gzip/switch.do`,
			switchKey:true,
			info:{
				name:'流量压缩开关',
				action:'查询'
			},
			success:(res)=>{
				let { success , data} = res.data;
				if(success&&data){
					localStorage.setItem('gzip',data?1:0);
				}
			}
		});
	}
	render() {
		return <Routes />;
	}
}
App.propTypes = {
	initAppData: PropTypes.func.isRequired
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
