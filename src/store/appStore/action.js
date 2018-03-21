import * as appStore from './action-type';

// 初始化应用数据
export const initAppData = (value) => {
	return {
		type: appStore.INITAPPDATA,
		value
	};
};

