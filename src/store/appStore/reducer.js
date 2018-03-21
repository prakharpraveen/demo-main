import * as appStore from './action-type';

let defaultState = {
	lang: 'zh-CN',
	userInfo: 'xxx'
};
// 首页表单数据
export const appData = (state = defaultState, action = {}) => {
	switch (action.type) {
		case appStore.INITAPPDATA:
			return { ...state, ...action.value };
		default:
			return state;
	}
};
