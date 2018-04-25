import Axios from 'axios';
import { Alert } from 'antd';
// createAlertDom = ()=>{
// 	let alertDom = document.createElement('div');
// 	alertDom.id = 'alertDom';
// 	document.querySelector('body').appendChild(alertDom);
// }
const Ajax = ({
	url,
	data,
	method = 'post',
	alert = false,
	success = (res) => {
		cosnole.log(res);
	}
}) => {
	Axios({
		url,
		data,
		method
	}).then((res) => {
		if (res.data.success) {
			// if (alert) {
			// 	message.info(<Alert message='成功' description='你所提交的信息已经保存成功。' type='success' showIcon />);
			// }
			success(res);
		}
	});
};

export default Ajax;
