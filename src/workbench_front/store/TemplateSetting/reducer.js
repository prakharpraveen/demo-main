import * as TemplateSetting from './action-type';

let defaultState = {
	// 树节点对象
	nodeData: {},
	// 	节点类型 模块、应用分类、应用
	optype: '',
	// 页面当前状态
	billStatus: {
		// 是否编辑态
		isEdit: false,
		// 是否新增
		isNew: false
	},
	// 应用参数数据
	appParamVOs: [],
	// 页面按钮数据
	appButtonVOs:[],
	// 页面模板数据
	pageTemplets:[],
	// 父节点信息
	parentData: '',
	// 应用类型 1 为 小应用 2 为 小部件
	appType: 2,
	// 更新树节点
	updateTreeData: () => {},
	// 请求树数据
	reqTreeData: ()=>{},
	//请求模板树数据
	// 获取表单数据
	getFromData: ()=>{},
	// 添加树节点
	addTreeData: ()=>{},
	// 删除树节点
	delTreeData: ()=>{}
};
// 首页表单数据
export const TemplateSettingData = (state = defaultState, action = {}) => {
	switch (action.type) {
		case TemplateSetting.CLEARDATA:
			return { ...state,
				...defaultState
			};
		case TemplateSetting.REQTREEDATA:
			return { ...state,
				...{
					reqTreeData: action.data
				}
			};
		case TemplateSetting.SETNODEDATA:
			return { ...state,
				...{
					nodeData: action.data
				}
			};
		case TemplateSetting.UPDATENODEDATA:
			return { ...state,
				...{
					updateTreeData: action.updateTreeData
				}
			};
		case TemplateSetting.ADDNODEDATA:
			return { ...state,
				...{
					addTreeData: action.addTreeData
				}
			};
		case TemplateSetting.DELNODEDATA:
			return { ...state,
				...{
					delTreeData: action.delTreeData
				}
			};
		case TemplateSetting.OPERATIONTYPE:
			return { ...state,
				...{
					optype: action.optype
				}
			};
		case TemplateSetting.BILLSTATUS:
			return { ...state,
				...{
					billStatus: action.billStatus
				}
			};
		case TemplateSetting.PARENTDATA:
			return { ...state,
				...{
					parentData: action.parentData
				}
			};
		case TemplateSetting.APPTYPE:
			return { ...state,
				...{
					appType: action.appType
				}
			};
		case TemplateSetting.APPPARAMDATA:
			return { ...state,
				...{
					appParamVOs: action.data
				}
			};
		case TemplateSetting.PAGEBUTTONDATA:
			return { ...state,
				...{
					appButtonVOs: action.data
				}
			};
		case TemplateSetting.PAGETEMPLATEDATA:
			return { ...state,
				...{
					pageTemplets: action.data
				}
			};
		case TemplateSetting.PRINTTEMPLATEDATA:
			return { ...state,
				...{
					printSystemplateVO: action.data
				}
			};
		case TemplateSetting.GETFROMDATA:
			return { ...state,
				...{
					getFromData: action.getFromData
				}
			};
		default:
			return state;
	}
};