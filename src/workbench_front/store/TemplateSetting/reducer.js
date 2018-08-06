import * as TemplateSetting from './action-type';
import renameActionType from 'Store/renameActionType';
renameActionType(TemplateSetting, 'TemplateSetting');

let defaultState = {
    // 树数据
    treeData: [],
    //页面模板树 数据
    treeTemBillData: [],
    //打印模板树 数据
    treeTemPrintData: [],
    // 树节点对象
    nodeData: {},
    // 树节点信息
    nodeInfo: {
        id: '',
        code: '',
        name: '',
        parentId: '',
        isleaf: false
    },
    def1: '',
    // 应用参数数据
    appParamVOs: [],
    // 页面按钮数据
    appButtonVOs: [],
    // 页面模板数据
    pageTemplets: [],
    // 树展开树节点数组
    expandedKeys: [ '00' ],
    // 树选中节点数组
    selectedKeys: [ '00' ],
    // 节点类型
    optype: '',
    // 页面节点页签激活项
    pageActiveKey: '1',
    // 是否是新增
    isNew: false,
    // 是否是编辑
    isEdit: false
};
// 首页表单数据
export const TemplateSettingData = (state = defaultState, action = {}) => {
    switch (action.type) {
        case TemplateSetting.CLEARDATA:
            return {
                ...state,
                ...defaultState
            };
        case TemplateSetting.SETTREEDATA:
            return {
                ...state,
                ...{
                    treeData: action.data
                }
            };
        case TemplateSetting.SETTREETEMBILLDATA:
            return {
                ...state,
                ...{
                    treeTemBillData: action.data
                }
            };
        case TemplateSetting.SETDEF1:
        return {
            ...state,
            ...{
                def1: action.data
            }
        };   
        case TemplateSetting.SETTREETEMPRINTDATA:
            return {
                ...state,
                ...{
                    treeTemPrintData: action.data
                }
            };
        case TemplateSetting.SETNODEINFO:
            return {
                ...state,
                ...{
                    nodeInfo: action.data
                }
            };
        case TemplateSetting.SETNODEDATA:
            return {
                ...state,
                ...{
                    nodeData: action.data
                }
            };
        case TemplateSetting.APPPARAMDATA:
            return {
                ...state,
                ...{
                    appParamVOs: action.data
                }
            };
        case TemplateSetting.PAGEBUTTONDATA:
            return {
                ...state,
                ...{
                    appButtonVOs: action.data
                }
            };
        case TemplateSetting.PAGETEMPLATEDATA:
            return {
                ...state,
                ...{
                    pageTemplets: action.data
                }
            };
        case TemplateSetting.ISNEW:
            return {
                ...state,
                ...{
                    isNew: action.data
                }
            };
        case TemplateSetting.ISEDIT:
            return {
                ...state,
                ...{
                    isEdit: action.data
                }
            };
        case TemplateSetting.EXPANDEDKEYS:
            return {
                ...state,
                ...{
                    expandedKeys: action.data.concat([ '00' ])
                }
            };
        case TemplateSetting.SELECTEDKEYS:
            return {
                ...state,
                ...{
                    selectedKeys: action.data
                }
            };
        case TemplateSetting.OPTYPE:
            return {
                ...state,
                ...{
                    optype: action.data
                }
            };
        case TemplateSetting.PAGEACTIVEKEY:
            return {
                ...state,
                ...{
                    pageActiveKey: action.data
                }
            };
        default:
            return state;
    }
};
