import Axios from 'axios';

const Ajax = ({
	url,
	data,
	method = 'post',
	success = (res) => {
		cosnole.log(res);
	}
}) => {
	Axios({
		url,
		data,
		method
	}).then(success);
};

export default Ajax;
