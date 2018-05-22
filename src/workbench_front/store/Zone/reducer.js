import * as ZoneRegister from './action-type';

let defaultState = {
	// 初始区域列表 
	zoneParamdata:[],
	templatid:'',
	zoneState:'',
};
// 首页表单数据
export const zoneRegisterData = (state = defaultState, action = {}) => {
	switch (action.type) {
		case ZoneRegister.ZONEPARAMDATA:
			return { ...state,
				...{
					zoneParamdata: action.data
				}
			};
		case ZoneRegister.ZONETEMPLATID:
			return {
				...state,
				...{
					templetid: action.data
				}
			};
		case ZoneRegister.ZONESTATE:
			return {
				...state,
				...{
					zoneState: action.data
				}
			};
		default:
			return state;
	}
};