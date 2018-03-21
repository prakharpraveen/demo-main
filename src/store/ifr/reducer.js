import * as ifr from './action-type';

let defaultState = {
	ifrName: 'xxx', //窗口名称
	ifrID: '123', //窗口id
};
// 首页表单数据
export const ifrData = (state = defaultState, action = {}) => {
	switch (action.type) {
		case ifr.SAVEIFR:
			return { ...state, ...adcion };
		case ifr.CLEARDATA:
			return { ...state, ...defaultState };
		default:
			return state;
	}
};
