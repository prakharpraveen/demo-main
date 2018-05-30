import * as TemplateSetting from './action-type';

// 清空数据
export const clearData = () => {
	return {
		type: TemplateSetting.CLEARDATA
	};
};
// 获取树数据
export const reqTreeData = (data)=>{
	return {
		type: TemplateSetting.REQTREEDATA,
		data
	}
}
//获取模板树数据
export const reqTemplateTreeData = (data)=>{
	return {
		type: TemplateSetting.REQTEMPLATETREEDATA,
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
// 更新 树节点 数据
export const updateTreeData = (updateTreeData) => {
	return {
		type: TemplateSetting.UPDATENODEDATA,
		updateTreeData
	};
};
// 新增 树节点 数据
export const addTreeData = (addTreeData) => {
	return {
		type: TemplateSetting.ADDNODEDATA,
		addTreeData
	};
};
// 新增 树节点 数据
export const delTreeData = (delTreeData) => {
	return {
		type: TemplateSetting.DELNODEDATA,
		delTreeData
	};
};
// 操作类型 数据
export const setOpType = (optype) => {
	return {
		type: TemplateSetting.OPERATIONTYPE,
		optype: optype
	};
};
// 父节点 数据
export const setParentData = (parentData) => {
	return {
		type: TemplateSetting.PARENTDATA,
		parentData
	};
};
