import * as zonesetting from './action-type';

let defaultState = {
	// 初始区域列表 
	zoneArray:[],
};
// 首页表单数据
export const zoneSettingData = (state = defaultState, action = {}) => { 
	switch (action.type) {
		case zonesetting.ZONESETTING:
			return { ...state,
				...{
					zoneArray: action.data
				}
			};
		default:
			return state;
	}
};