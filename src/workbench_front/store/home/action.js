import * as home from './action-type';

// 保存图片地址
export const clearData = () => {
	return {
		type: home.CLEARDATA
	};
};

export const updateGroupList = (groups) => {
	return {
		type: home.UPDATEGROUPLIST,
		groups: groups
	};
};