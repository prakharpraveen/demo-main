import * as ZoneRegister from './action-type';

// 设置 区域参数信息 数据
export const setZoneParamData = (data) => {
	return {
		type: ZoneRegister.ZONEPARAMDATA,
		data
	};
};
// 设置 区域对应的模板id 
export const setZoneTempletid = (data) => {
	return {
		type: ZoneRegister.ZONETEMPLATID ,
		data
	};
};
// 设置 区域单据的模板状态 
export const setZoneState= (data) => {
	return {
		type: ZoneRegister.ZONESTATE,
		data
	};
};