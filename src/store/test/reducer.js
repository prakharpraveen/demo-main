import * as templateStore from './action-type';

let defaultState = {
    shadowCard:{},
    groups:[]
};
// 首页表单数据
export const templateDragData = (state = defaultState, action = {}) => {
	switch (action.type) {
		case templateStore.UPDATESHADOWCARD:
            return { ...state, ...{ shadowCard: action.shadowCard } };
        case templateStore.UPDATEGROUPLIST:
            return { ...state, ...{ groups: action.groups }};
		default:
			return state;
	}
};
