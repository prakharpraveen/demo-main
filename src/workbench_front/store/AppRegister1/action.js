import * as AppRegister1 from './action-type';

// 清空数据
export const clearData = () => {
	return {
		type: AppRegister1.CLEARDATA
	};
};
// 设置 树 数据
export const setTreeData = (data)=>{
	return {
		type: AppRegister1.SETTREEDATA,
		data
	}
}
// 设置 树 数据
export const setNodeInfo = (data)=>{
	return {
		type: AppRegister1.SETNODEINFO,
		data
	}
}
// 设置 树节点 数据
export const setNodeData = (data) => {
	return {
		type: AppRegister1.SETNODEDATA,
		data
	};
};
// 设置 页面按钮 数据
export const setPageButtonData = (data) => {
	return {
		type: AppRegister1.PAGEBUTTONDATA,
		data
	};
};
// 设置 页面模板 数据
export const setPageTemplateData = (data) => {
	return {
		type: AppRegister1.PAGETEMPLATEDATA,
		data
	};
};
// 设置 应用参数信息 数据
export const setAppParamData = (data) => {
	return {
		type: AppRegister1.APPPARAMDATA,
		data
	};
};
// 设置页面是否是新增
export const setIsNew = (data) => {
	return {
		type: AppRegister1.ISNEW,
		data
	};
};
// 设置 页面是否是编辑
export const setIsEdit = (data) => {
	return {
		type: AppRegister1.ISEDIT,
		data
	};
};

