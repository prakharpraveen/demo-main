import * as TemplateSetting from './action-type';
import renameActionType from 'Store/renameActionType';
renameActionType(TemplateSetting,'TemplateSetting');

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
	reqTemplateTreeData: () =>{},
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
		case TemplateSetting.REQTEMPLATETREEDATA:
			return { ...state,
				...{
					reqTemplateTreeData: action.data
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
		case TemplateSetting.PARENTDATA:
			return { ...state,
				...{
					parentData: action.parentData
				}
			};
		default:
			return state;
	}
};