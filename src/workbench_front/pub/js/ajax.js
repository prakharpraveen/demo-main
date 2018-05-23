import Axios from 'axios';
import { Alert } from 'antd';
import Notice from 'Components/Notice';
import moment from 'moment';
import Gzip from './gzip';
// createAlertDom = ()=>{
// 	let alertDom = document.createElement('div');
// 	alertDom.id = 'alertDom';
// 	document.querySelector('body').appendChild(alertDom);
// }
const Ajax = ({
	url,
	data = '',
	method = 'post',
	alert = false,
	info = {name:'',action:''},
	success = (res) => {
		cosnole.log(res);
	}
}) => {
	let gziptools = new Gzip();
	// data = {
	// 	busiParamJson: data,
	// 	sysParamJson: {
	// 		busiaction: `应用:${info.name},操作:${info.action}`,
	// 		ts: moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
	// 	}
	// }
	Axios({
		url,
		data,
		method,
		transformRequest : [function (data) {
			// 不压缩
			let gData = JSON.stringify(data);
			//Do whatever you want to transform the data
			// 启动压缩
			// let gData = gziptools.zip(JSON.stringify(data));
			// console.log(data)
			return gData;
		}],
		transformResponse: [function (data) {
			let gData = JSON.parse(data);
			// 对 data 进行任意转换处理
			// 启动压缩
			// let resData =  gziptools.unzip(data);	
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
};

export default Ajax;
