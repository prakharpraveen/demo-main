import * as AppRegister from './action-type';

let defaultState = {
	// 树节点对象
	nodeData: '',
	// 	节点类型 模块、应用分类、应用
	optype: '',
	// 页面当前状态
	billStatus: {
		// 是否编辑态
		isEdit: false,
		// 是否新增
		isNew: false
	},
	// 应用数据
	appData: {},
	// 父节点信息
	parentData: '',
	// 应用类型 1 为 小应用 2 为 小部件
	appType: 2,
	// 更新树节点
	updateTreeData: () => {}
};
// 首页表单数据
export const AppRegisterData = (state = defaultState, action = {}) => {
	switch (action.type) {
		case AppRegister.CLEARDATA:
			return { ...state, ...defaultState };
		case AppRegister.SETNODEDATA:
			return { ...state, ...{ nodeData: action.data } };
		case AppRegister.UPDATENODEDATA:
			return { ...state, ...{ updateTreeData: action.updateTreeData } };
		case AppRegister.ADDNODEDATA:
			return { ...state, ...{ addTreeData: action.addTreeData } };
		case AppRegister.DELNODEDATA:
			return { ...state, ...{ delTreeData: action.delTreeData } };
		case AppRegister.OPERATIONTYPE:
			return { ...state, ...{ optype: action.optype } };
		case AppRegister.BILLSTATUS:
			return { ...state, ...{ billStatus: action.billStatus } };
		case AppRegister.PARENTDATA:
			return { ...state, ...{ parentData: action.parentData } };
		case AppRegister.APPTYPE:
			return { ...state, ...{ appType: action.appType } };
		case AppRegister.APPDATA:
			return { ...state, ...{ appData: action.appData } };
		case AppRegister.GETFROMDATA:
			return { ...state, ...{ getFromData: action.getFromData } };
		default:
			return state;
	}
};
