import { notification } from 'antd';
const Notice = ({ status, msg = '操作成功' }) => {
	let Obj = {};
	notification.config({
		placement:'topRight',
		top: 150,
	});
	switch (status) {
		case 'success':
			Obj = {
				message: '已成功！',
				description: `${msg}`,
				style: {
					color: '#67C23A',
				}
			};
			break;
		case 'warning':
			Obj = {
				message: '请注意！',
				description: `${msg}`,
				style: {
					color: '#FF8B00'
				}
			};
			break;
		case 'error':
			Obj = {
				message: '出错了！',
				description: `${msg}`,
				style: {
					color: '#F56C6C'
				}
			};
			break;
		default:
			break;
	}
	notification.open({ ...Obj });
};

export default Notice;
