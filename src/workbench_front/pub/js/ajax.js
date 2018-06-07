import Axios from 'axios';
import { Alert } from 'antd';
import Notice from 'Components/Notice';
// import moment from 'moment';
import Gzip from './gzip';
// createAlertDom = ()=>{
// 	let alertDom = document.createElement('div');
// 	alertDom.id = 'alertDom';
// 	document.querySelector('body').appendChild(alertDom);
// }
Axios.defaults.headers.post['Content-Type'] = 'application/json';
const Ajax = ({
	url,
	data,
	method = 'post',
	alert = false,
	switchKey = false,
	info = {name:'',action:''},
	success = (res) => {
		cosnole.log(res);
	}
}) => {

	let gzipSwitch = sessionStorage.getItem('gzip') - 0;
	let gziptools = new Gzip();
	data = {
		busiParamJson: JSON.stringify(data),
		sysParamJson: {
			busiaction: `${info.name}-${info.action}`,
			ts: Date.parse(new Date())
		}
	}
	/**
	 * 是否为压缩的压缩的
	 */
	if(switchKey){
		Axios({
			url,
			data,
			method,
			transformRequest : [function (data) {
				// 不压缩
				let gData = JSON.stringify(data);
				return gData;
			}],
			transformResponse: [function (data,headers) {
				if(headers.contentpath){
					window.location.href = headers.contentpath;
				}
				let gData = JSON.parse(data);
				return gData;
			}]
		}).then((res) => {
			if (res.data.success) {
				success(res);
			} else {
				Notice({ status: 'error', msg: res.data.error.message });
				console.log(res);
			}
		});	
	}else{
		Axios({
			url,
			data,
			method,
			transformRequest : [function (data) {
				// 不压缩
				let gData = JSON.stringify(data);
				//Do whatever you want to transform the data
				// 启动压缩
				if(gzipSwitch){
					gData = gziptools.zip(gData);
				}
				// console.log(data)
				return gData;
			}],
			transformResponse: [function (data,headers) {
				if(headers.contentpath){
					window.location.href = headers.contentpath;
				}
				// 对 data 进行任意转换处理
				let gData;
				// 启动压缩
				if(gzipSwitch){
					gData =  gziptools.unzip(data);	
				}else{
					gData = JSON.parse(data);
				}
				// console.log(gData)
				return gData;
			}]
		}).then((res) => {
			if (res.data.success) {
				// if (alert) {
				// 	message.info(<Alert message='成功' description='你所提交的信息已经保存成功。' type='success' showIcon />);
				// }
				success(res);
			} else {
				Notice({ status: 'error', msg: res.data.error.message });
				console.log(res);
			}
		});	
	}
	
};

export default Ajax;
