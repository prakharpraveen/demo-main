import * as AppRegister from './action-type';

// 清空数据
export const clearData = () => {
	return {
		type: AppRegister.CLEARDATA
	};
};
// 获取 树节点 数据
export const setNodeData = (data) => {
	return {
		type: AppRegister.SETNODEDATA,
		data
	};
};
// 更新 树节点 数据
export const updateTreeData = (updateTreeData) => {
	return {
		type: AppRegister.UPDATENODEDATA,
		updateTreeData
	};
};
// 新增 树节点 数据
export const addTreeData = (addTreeData) => {
	return {
		type: AppRegister.ADDNODEDATA,
		addTreeData
	};
};
// 新增 树节点 数据
export const delTreeData = (delTreeData) => {
	return {
		type: AppRegister.DELNODEDATA,
		delTreeData
	};
};
// 操作类型 数据
export const setOpType = (optype) => {
	return {
		type: AppRegister.OPERATIONTYPE,
		optype: optype
	};
};
// 操作类型 数据
export const setBillStatus = (billStatus) => {
	return {
		type: AppRegister.BILLSTATUS,
		billStatus
	};
};
// 父节点 数据
export const setParentData = (parentData) => {
	return {
		type: AppRegister.PARENTDATA,
		parentData
	};
};
// 设置 appTtype 数据
export const setAppType = (appType) => {
	return {
		type: AppRegister.APPTYPE,
		appType
	};
};
// 设置 应用参数信息 数据
export const setAppParamData = (data) => {
	return {
		type: AppRegister.APPPARAMDATA,
		data
	};
};
// 设置 页面按钮 数据
export const setPageButtonData = (data) => {
	return {
		type: AppRegister.PAGEBUTTONDATA,
		data
	};
};
// 设置 页面模板 数据
export const setPageTemplateData = (data) => {
	return {
		type: AppRegister.PAGETEMPLATEDATA,
		data
	};
};
// 设置 页面打印模板 数据
export const setPrintTemplateData = (data) => {
	return {
		type: AppRegister.PRINTTEMPLATEDATA,
		data
	};
};
// 获取表单数据
export const getFromDataFunc = (getFromData)=>{
	return {
		type: AppRegister.GETFROMDATA,
		getFromData
	}
}
