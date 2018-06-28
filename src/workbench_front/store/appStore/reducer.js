import * as appStore from './action-type';

(() => {
	for (let key in appStore) {
		appStore[key] = `appStore/${appStore[key]}`;
	}
})();

let defaultState = {
	lang: 'zh-CN',
	userInfo: 'xxx',
	intlDone: false,
	isOpen: false,
	userID:'0001Z51000000005I123'
};
// 首页表单数据
export const appData = (state = defaultState, action = {}) => {
	switch (action.type) {
		case appStore.INITAPPDATA:
			return { ...state, ...action.value };
		case appStore.CHANGELANG:
			return { ...state, ...{ intlDone: action.value } };
		case appStore.DRAWEROPEN:
			return { ...state, ...{ isOpen: action.value } };
		default:
			return state;
	}
};
