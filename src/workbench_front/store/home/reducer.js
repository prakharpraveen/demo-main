import * as home from './action-type';
import renameActionType from 'Store/renameActionType';
renameActionType(home,'home');

let defaultState = {
	type: '', // 类型
	path: '', // js 相对路径
	position: '', // 小部件位置
	module: '', // 模块编码
	mountId: '', // 小部件挂载id
	row: '', // 行
	col: '', // 列
	groups:[],
};
// 首页表单数据
export const homeData = (state = defaultState, action = {}) => {
	switch (action.type) {
		case home.CLEARDATA:
			return { ...state, ...defaultState };
		case home.UPDATEGROUPLIST:
			return { ...state, ...{ groups: action.groups } };
		default:
			return state;
	}
};
