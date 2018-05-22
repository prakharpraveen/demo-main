import * as zonesetting from './action-type';

// 设置 区域参数信息 数据
export const setZoneData = (data) => {
	return {
		type: zonesetting.ZONESETTING,
		data
	};
};
