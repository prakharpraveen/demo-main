import * as templateStore from './action-type';

let defaultState = {
	relateid: '',
	shadowCard: {},
	groups: [],
	selectCardInGroupObj: {},
	moveModal: {
		selectedValue: 1
	},
	currEditID: '',
	layout: {
		containerWidth: 1200,
		containerHeight: 300,
		calWidth: 175,
		rowHeight: 175,
		col: 6,
		margin: [ 10, 10 ],
		containerPadding: [ 0, 0 ]
	},
	defaultLayout: {
		containerWidth: 1200,
		containerHeight: 300,
		calWidth: 175,
		rowHeight: 175,
		col: 6,
		margin: [ 10, 10 ],
		containerPadding: [ 0, 0 ]
	}
};
// 首页表单数据
export const templateDragData = (state = defaultState, action = {}) => {
	switch (action.type) {
		case templateStore.UPDATESHADOWCARD:
			return { ...state, ...{ shadowCard: action.shadowCard } };
		case templateStore.UPDATEGROUPLIST:
			return { ...state, ...{ groups: action.groups } };
		case templateStore.UPDATESELECTCARDINGROUPOBJ:
			return { ...state, ...{ selectCardInGroupObj: action.selectCardInGroupObj } };
		case templateStore.UPDATECURREDITID:
			return { ...state, ...{ currEditID: action.currEditID } };
		case templateStore.UPDATELAYOUT:
			return { ...state, ...{ layout: action.layout } };
		case templateStore.UPDATERELATEID:
			return { ...state, ...{ relateid: action.relateid } };
		default:
			return state;
	}
};
