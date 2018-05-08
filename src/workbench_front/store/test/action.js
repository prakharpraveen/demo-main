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
//
//更新GroupList数据
export const updateSelectCardIDList = (selectCardIDList) => {
	return {
		type: actionType.UPDATESELECTCARDIDLIST,
		selectCardIDList: selectCardIDList
	};
};
//
//更新GroupList数据
export const updateCurrEditID = (currEditID) => {
	return {
		type: actionType.UPDATECURREDITID,
		currEditID: currEditID
	};
};
//更新GroupList数据
export const updateLayout = (layout) => {
	return {
		type: actionType.UPDATELAYOUT,
		layout: layout
	};
};
//
