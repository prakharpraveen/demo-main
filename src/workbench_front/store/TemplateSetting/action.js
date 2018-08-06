import * as TemplateSetting from './action-type';

// 清空数据
export const clearData = () => {
	return {
		type: TemplateSetting.CLEARDATA
	};
};
// 设置 树 数据
export const setTreeData = (data)=>{
	return {
		type: TemplateSetting.SETTREEDATA,
		data
	}
}
// 设置 页面模板 树 数据
export const setTreeTemBillData = (data)=>{
	return {
		type: TemplateSetting.SETTREETEMBILLDATA,
		data
	}
}
// 设置 打印模板 树 数据
export const setTreeTemPrintData = (data)=>{
	return {
		type: TemplateSetting.SETTREETEMPRINTDATA,
		data
	}
}
// 设置 树 数据
export const setNodeInfo = (data)=>{
	return {
		type: TemplateSetting.SETNODEINFO,
		data
	}
}
//设置页面与应用区分数据
export const setDef1 = (data)=>{
	return {
		type: TemplateSetting.SETDEF1,
		data
	}
}
// 设置 树节点 数据
export const setNodeData = (data) => {
	return {
		type: TemplateSetting.SETNODEDATA,
		data
	};
};
// 设置 页面按钮 数据
export const setPageButtonData = (data) => {
	return {
		type: TemplateSetting.PAGEBUTTONDATA,
		data
	};
};
// 设置 页面模板 数据
export const setPageTemplateData = (data) => {
	return {
		type: TemplateSetting.PAGETEMPLATEDATA,
		data
	};
};
// 设置 应用参数信息 数据
export const setAppParamData = (data) => {
	return {
		type: TemplateSetting.APPPARAMDATA,
		data
	};
};
// 设置页面是否是新增
export const setIsNew = (data) => {
	return {
		type: TemplateSetting.ISNEW,
		data
	};
};
// 设置 页面是否是编辑
export const setIsEdit = (data) => {
	return {
		type: TemplateSetting.ISEDIT,
		data
	};
};
// 设置 树展开节点key数组
export const setExpandedKeys = (data) => {
	return {
		type: TemplateSetting.EXPANDEDKEYS,
		data
	};
};
// 设置 树展开节点key数组
export const setSelectedKeys = (data) => {
	return {
		type: TemplateSetting.SELECTEDKEYS,
		data
	};
};
// 设置 节点类型
export const setOptype = (data) => {
	return {
		type: TemplateSetting.OPTYPE,
		data
	};
};
// 设置 页面节点页签激活项
export const setPageActiveKey = (data) => {
	return {
		type: TemplateSetting.PAGEACTIVEKEY,
		data
	};
};