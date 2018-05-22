import axios from 'axios';
import Loading from '../base/nc_Loading';
import ReactDOM from 'react-dom';
import toast from './toast';
import moment from 'moment';
import Gzip from './gzip';

export default function Ajax({
	url = '/',
	method = 'post',
	data = {},
	async = false,
	loading = true,
	loadingContainer,
	success = function (res) {
		console.log(res);
	},
	error = function (res) {
		console.error(res);
		toast({ color: 'danger', content: res.message });
	},
	mode = '',
	params = {}
}) {
	// data.vs1h8do0 = window.vs1h8do0;
	let gziptools = new Gzip();
	let div;
	if (loading) {
		div = document.createElement('div');
		document.body.appendChild(div);
		loadingContainer
			? ReactDOM.render(<Loading show={true} container={loadingContainer} />, div)
			: ReactDOM.render(<Loading show={true} fullScreen />, div);
	}

	//window.actionName
	let app = '';
	let appN = decodeURIComponent(window.location.href).split('?');
	if (appN && appN[1]){
		let appPrams = appN[1].split('&');
		if(appPrams && appPrams instanceof Array){
			appPrams.find((item) => {
				if (item.indexOf('n') != -1 && item.split('=')) {
					app = item.split('=')[1] && item.split('=')[1];
				}
			});
		}
	}
	let newData = {
		busiParamJson: data,
		sysParamJson: {
			busiaction: `应用:${app},操作:${window.actionName}`,
			ts: moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
		}
	}

	if (async) {
		//异步
		axios({
			method: method,
			params: params,
			url: url,
			data: newData,
			transformRequest : [function (data) {
				//Do whatever you want to transform the data
				let gData = gziptools.zip(JSON.stringify(data));
				return gData;
			}],
			transformResponse: [function (data) {
				// 对 data 进行任意转换处理
				let resData =  gziptools.unzip(data);	
				console.log(resData)
				return resData;
			}]
		})
			.then((res) => {
				div && ReactDOM.unmountComponentAtNode(div);
				if (mode === 'normal') {
					success(res);
				} else {
					if (res.data.success) {
						success(res.data);
					} else {
						throw new Error(res.data.error.message);
					}
				}
			})
			.catch((res) => {
				div && ReactDOM.unmountComponentAtNode(div);
				error(res);
			});
	} else {
		//同步
		ajax({
			type: method,
			url: url, //添加自己的接口链接
			//data: JSON.stringify(data),
			data: gziptools.zip(JSON.stringify(newData)),
			async: async,
			//timeOut: 5000,
			before: function () {
				console.log('before');
			},
			success: function (str) {
				try {
					div && ReactDOM.unmountComponentAtNode(div);
					let res = gziptools.unzip(str);
					//let res = JSON.parse(ures);
					if (res.success) {
						success(res);
					} else {
						throw new Error(res.error.message);
					}
				} catch (e) {
					div && ReactDOM.unmountComponentAtNode(div);
					error(e);
				}
			}
		});
	}
}

function ajax(options) {
	//编码数据
	function setData() {
		//设置对象的遍码
		function setObjData(data, parentName) {
			function encodeData(name, value, parentName) {
				var items = [];
				name = parentName === undefined ? name : parentName + '[' + name + ']';
				if (typeof value === 'object' && value !== null) {
					items = items.concat(setObjData(value, name));
				} else {
					name = encodeURIComponent(name);
					value = encodeURIComponent(value);
					items.push(name + '=' + value);
				}
				return items;
			}
			var arr = [],
				value;
			if (Object.prototype.toString.call(data) == '[object Array]') {
				for (var i = 0, len = data.length; i < len; i++) {
					value = data[i];
					arr = arr.concat(encodeData(typeof value == 'object' ? i : '', value, parentName));
				}
			} else if (Object.prototype.toString.call(data) == '[object Object]') {
				for (var key in data) {
					value = data[key];
					arr = arr.concat(encodeData(key, value, parentName));
				}
			}
			return arr;
		}
		//设置字符串的遍码，字符串的格式为：a=1&b=2;
		function setStrData(data) {
			var arr = data.split('&');
			for (var i = 0, len = arr.length; i < len; i++) {
				let name = encodeURIComponent(arr[i].split('=')[0]);
				let value = encodeURIComponent(arr[i].split('=')[1]);
				arr[i] = name + '=' + value;
			}
			return arr;
		}

		if (data) {
			if (typeof data === 'string') {
				data = setStrData(data);
			} else if (typeof data === 'object') {
				data = setObjData(data);
			}
			data = data.join('&').replace('/%20/g', '+');
			//若是使用get方法或JSONP，则手动添加到URL中
			if (type === 'get' || dataType === 'jsonp') {
				url += url.indexOf('?') > -1 ? (url.indexOf('=') > -1 ? '&' + data : data) : '?' + data;
			}
		}
	}
	// JSONP
	function createJsonp() {
		var script = document.createElement('script'),
			timeName = new Date().getTime() + Math.round(Math.random() * 1000),
			callback = 'JSONP_' + timeName;

		window[callback] = function (data) {
			clearTimeout(timeout_flag);
			document.body.removeChild(script);
			success(data);
		};
		script.src = url + (url.indexOf('?') > -1 ? '&' : '?') + 'callback=' + callback;
		script.type = 'text/javascript';
		document.body.appendChild(script);
		setTime(callback, script);
	}
	//设置请求超时
	function setTime(callback, script) {
		if (timeOut !== undefined) {
			timeout_flag = setTimeout(function () {
				if (dataType === 'jsonp') {
					delete window[callback];
					document.body.removeChild(script);
				} else {
					timeout_bool = true;
					xhr && xhr.abort();
				}
				console.log('timeout');
			}, timeOut);
		}
	}

	// XHR
	function createXHR() {
		//由于IE6的XMLHttpRequest对象是通过MSXML库中的一个ActiveX对象实现的。
		//所以创建XHR对象，需要在这里做兼容处理。
		function getXHR() {
			if (window.XMLHttpRequest) {
				return new XMLHttpRequest();
			} else {
				//遍历IE中不同版本的ActiveX对象
				var versions = ['Microsoft', 'msxm3', 'msxml2', 'msxml1'];
				for (var i = 0; i < versions.length; i++) {
					try {
						var version = versions[i] + '.XMLHTTP';
						return new ActiveXObject(version);
					} catch (e) { }
				}
			}
		}
		//创建对象。
		xhr = getXHR();
		xhr.open(type, url, async);
		//设置请求头
		if (type === 'post' && !contentType) {
			//若是post提交，则设置content-Type 为application/x-www-four-urlencoded
			xhr.setRequestHeader('Content-Type', 'application/x-www-four-urlencoded;charset=UTF-8');
		} else if (contentType) {
			xhr.setRequestHeader('Content-Type', contentType);
		}
		//添加监听
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (timeOut !== undefined) {
					//由于执行abort()方法后，有可能触发onreadystatechange事件，
					//所以设置一个timeout_bool标识，来忽略中止触发的事件。
					if (timeout_bool) {
						return;
					}
					clearTimeout(timeout_flag);
				}
				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
					success(xhr.responseText);
				} else {
					error(xhr.status, xhr.statusText);
				}
			}
		};
		//发送请求
		xhr.send(type === 'get' ? null : data);
		setTime(); //请求超时
	}

	var url = options.url || '', //请求的链接
		type = (options.type || 'get').toLowerCase(), //请求的方法,默认为get
		data = options.data, //|| JSON.stringify({}), //请求的数据
		contentType = options.contentType || '', //请求头
		dataType = options.dataType || '', //请求的类型
		async = options.async === undefined ? true : options.async, //是否异步，默认为true.
		timeOut = options.timeOut, //超时时间。
		before = options.before || function () { }, //发送之前执行的函数
		error = options.error || function () { }, //错误执行的函数
		success = options.success || function () { }; //请求成功的回调函数
	var timeout_bool = false, //是否请求超时
		timeout_flag = null, //超时标识
		xhr = null; //xhr对角
	//setData();
	before();
	if (dataType === 'jsonp') {
		createJsonp();
	} else {
		createXHR();
	}
}
