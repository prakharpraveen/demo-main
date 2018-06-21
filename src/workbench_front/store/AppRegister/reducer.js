import * as AppRegister from "./action-type";

let defaultState = {
  // 树数据
  treeData: [],
  // 树节点对象
  nodeData: {},
  // 树节点信息
  nodeInfo: {
    id: "",
    code: "",
    name: "",
    parentId: ""
  },
  // 应用参数数据
  appParamVOs: [],
  // 页面按钮数据
  appButtonVOs: [],
  // 页面模板数据
  pageTemplets: [],
  // 树展开树节点数组
  expandedKeys:['00'],
  // 是否是新增
  isNew: false,
  // 是否是编辑
  isEdit: false
};
// 首页表单数据
export const AppRegisterData = (state = defaultState, action = {}) => {
  switch (action.type) {
    case AppRegister.CLEARDATA:
      return {
        ...state,
        ...defaultState
      };
    case AppRegister.SETTREEDATA:
      return {
        ...state,
        ...{
          treeData: action.data
        }
      };
    case AppRegister.SETNODEINFO:
      return {
        ...state,
        ...{
          nodeInfo: action.data
        }
      };
    case AppRegister.SETNODEDATA:
      return {
        ...state,
        ...{
          nodeData: action.data
        }
      };
    case AppRegister.APPPARAMDATA:
      return {
        ...state,
        ...{
          appParamVOs: action.data
        }
      };
    case AppRegister.PAGEBUTTONDATA:
      return {
        ...state,
        ...{
          appButtonVOs: action.data
        }
      };
    case AppRegister.PAGETEMPLATEDATA:
      return {
        ...state,
        ...{
          pageTemplets: action.data
        }
      };
    case AppRegister.ISNEW:
      return {
        ...state,
        ...{
          isNew: action.data
        }
      };
    case AppRegister.ISEDIT:
      return {
        ...state,
        ...{
          isEdit: action.data
        }
      };
      case AppRegister.EXPANDEDKEYS:
      return {
        ...state,
        ...{
          expandedKeys: action.data.concat(['00'])
        }
      };
    default:
      return state;
  }
};
