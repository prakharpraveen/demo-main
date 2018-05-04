import * as actionType from './action-type';

// 初始化数据
export const updateShadowCard = (shadowCard) => {
	return {
		type: actionType.UPDATESHADOWCARD,
		shadowCard: shadowCard
	};
};
//更新GroupList数据
export const updateGroupList = (groups) => {
	return {
		type: actionType.UPDATEGROUPLIST,
		groups: groups
	};
};