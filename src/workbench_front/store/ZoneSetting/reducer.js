import * as zonesetting from './action-type';

let defaultState = {
	// 初始区域列表 
	selectCard:[],
	areaList:[]
};
// 首页表单数据
export const zoneSettingData = (state = defaultState, action = {}) => { 
	switch (action.type) {
		case zonesetting.ZONESETTING:
			return { ...state,...{zoneArray: action.data} };
		case zonesetting.UPDATESELECTCARD:
			return { ...state,...{selectCard: action.selectCard} };
		case zonesetting.UPDATEAREALIST:
			return { ...state,...{areaList: action.areaList} };
		default:
			return state;
	}
};