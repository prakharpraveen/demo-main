import Axios from 'axios';
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
				if(headers.environmentmodel){
					window.environmentmodel = headers.environmentmodel;
				}
				let gData = JSON.parse(data);
				return gData;
			}]
		}).then((res) => {
			if(res.status === 200){
				let {data:{success:successStatus,error:errorStatus}} = res;
				if(successStatus){
					success(res);
				}else{
					Notice({ status: 'error', msg: errorStatus.message });
				}
			}
		}).catch((error) =>{
			Notice({ status: 'error', msg: error.message });
		});	
	}else{
		Axios({
			url,
			data,
			method,
			transformRequest : [function (data) {
				// 不压缩
				let gData = JSON.stringify(data);
				// 启动压缩
				if(gzipSwitch){
					gData = gziptools.zip(gData);
				}
				return gData;
			}],
			transformResponse: [function (data,headers) {
				if(headers.contentpath){
					window.location.href = headers.contentpath;
				}
				if(headers.environmentmodel){
					window.environmentmodel = headers.environmentmodel;
				}
				// 对 data 进行任意转换处理
				let gData;
				// 启动压缩
				if(gzipSwitch){
					gData =  gziptools.unzip(data);	
				}else{
					gData = JSON.parse(data);
				}
				return gData;
			}]
		}).then((res) => {
			if(res.status === 200){
				let {data:{success:successStatus,error:errorStatus}} = res;
				if(successStatus){
					success(res);
				}else{
					Notice({ status: 'error', msg: errorStatus.message });
				}
			}
		}).catch((error) =>{
			Notice({ status: 'error', msg: error.message });
		});	
	}
	
};

export default Ajax;
