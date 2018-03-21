import * as ifr from './action-type';

// 保存表单数据
export const saveIfrData = (data) => {
	return {
		type: ifr.SAVEIFR,
		data
	};
};

