import * as AppRegister_bak from "./action-type";

let defaultState = {
    // 树数据
    treeData: [],
    // 树节点对象
    nodeData: {},
    // 应用参数数据
    appParamVOs: [],
    // 页面按钮数据
    appButtonVOs: [],
    // 页面模板数据
    pageTemplets: [],

    optype: "",
    // 页面当前状态
    billStatus: {
        // 是否编辑态
        isEdit: false,
        // 是否新增
        isNew: false
    },
    // 父节点信息
    parentData: "",
    // 父节点信息
    pageParentCode: "",
    // 应用类型 1 为 小应用 2 为 小部件
    appType: 2,
    // 更新树节点
    updateTreeData: () => {},
    // 请求树数据
    reqTreeData: () => {},
    // 获取表单数据
    getFromData: () => {},
    // 添加树节点
    addTreeData: () => {},
    // 删除树节点
    delTreeData: () => {}
};
// 首页表单数据
export const AppRegister_bakData = (state = defaultState, action = {}) => {
    switch (action.type) {
        case AppRegister_bak.CLEARDATA:
            return {
                ...state,
                ...defaultState
            };
        case AppRegister_bak.SETTREEDATA:
            return {
                ...state,
                ...{
                    treeData: action.data
                }
            };
        case AppRegister_bak.REQTREEDATA:
            return {
                ...state,
                ...{
                    reqTreeData: action.data
                }
            };
        case AppRegister_bak.SETNODEDATA:
            return {
                ...state,
                ...{
                    nodeData: action.data
                }
            };
        case AppRegister_bak.UPDATENODEDATA:
            return {
                ...state,
                ...{
                    updateTreeData: action.updateTreeData
                }
            };
        case AppRegister_bak.ADDNODEDATA:
            return {
                ...state,
                ...{
                    addTreeData: action.addTreeData
                }
            };
        case AppRegister_bak.DELNODEDATA:
            return {
                ...state,
                ...{
                    delTreeData: action.delTreeData
                }
            };
        case AppRegister_bak.BILLSTATUS:
            return {
                ...state,
                ...{
                    billStatus: action.billStatus
                }
            };
        case AppRegister_bak.PARENTDATA:
            return {
                ...state,
                ...{
                    parentData: action.parentData
                }
            };
        case AppRegister_bak.APPTYPE:
            return {
                ...state,
                ...{
                    appType: action.appType
                }
            };
        case AppRegister_bak.APPPARAMDATA:
            return {
                ...state,
                ...{
                    appParamVOs: action.data
                }
            };
        case AppRegister_bak.PAGEBUTTONDATA:
            return {
                ...state,
                ...{
                    appButtonVOs: action.data
                }
            };
        case AppRegister_bak.PAGETEMPLATEDATA:
            return {
                ...state,
                ...{
                    pageTemplets: action.data
                }
            };
        case AppRegister_bak.PRINTTEMPLATEDATA:
            return {
                ...state,
                ...{
                    printSystemplateVO: action.data
                }
            };
        case AppRegister_bak.GETFROMDATA:
            return {
                ...state,
                ...{
                    getFromData: action.getFromData
                }
            };
        case AppRegister_bak.SETOPTYPE:
            return {
                ...state,
                ...{
                    optype: action.data
                }
            };
        case AppRegister_bak.PAGEPARENTCODE:
            return {
                ...state,
                ...{
                    pageParentCode: action.data
                }
            };
        default:
            return state;
    }
};
