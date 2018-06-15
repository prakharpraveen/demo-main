import * as AppRegister1 from "./action-type";

let defaultState = {
  // 树数据
  treeData: [],
  // 树节点对象
  nodeData: {},
  // 树节点信息
  nodeInfo: {
    id: "",
    code: "",
    name: ""
  },
  // 应用参数数据
  appParamVOs: [],
  // 页面按钮数据
  appButtonVOs: [],
  // 页面模板数据
  pageTemplets: [],
  // 是否是新增
  isNew: false,
  // 是否是编辑
  isEdit: false
};
// 首页表单数据
export const AppRegisterData1 = (state = defaultState, action = {}) => {
  switch (action.type) {
    case AppRegister1.CLEARDATA:
      return {
        ...state,
        ...defaultState
      };
    case AppRegister1.SETTREEDATA:
      return {
        ...state,
        ...{
          treeData: action.data
        }
      };
    case AppRegister1.SETNODEINFO:
      return {
        ...state,
        ...{
          nodeInfo: action.data
        }
      };
    case AppRegister1.SETNODEDATA:
      return {
        ...state,
        ...{
          nodeData: action.data
        }
      };
    case AppRegister1.APPPARAMDATA:
      return {
        ...state,
        ...{
          appParamVOs: action.data
        }
      };
    case AppRegister1.PAGEBUTTONDATA:
      return {
        ...state,
        ...{
          appButtonVOs: action.data
        }
      };
    case AppRegister1.PAGETEMPLATEDATA:
      return {
        ...state,
        ...{
          pageTemplets: action.data
        }
      };
    case AppRegister1.ISNEW:
      return {
        ...state,
        ...{
          isNew: action.data
        }
      };
    case AppRegister1.ISEDIT:
      return {
        ...state,
        ...{
          isEdit: action.data
        }
      };
    default:
      return state;
  }
};
