/**
 * 求到的平铺数组 将请第一层节点进行剥离
 * @param {Array} data 
 */
export function generateData(data) {
	// 第一层 tree 数据
	let treeArray = [];
	// 所有 children 数组
	let treeObj = {};
	data.map((item, index) => {
		let {
			parentcode,
			moduleid,
			systypename,
			systypecode
		} = item;
		if(item.children){
			delete item.children;
		}
		if (moduleid.length > 4) {
			item.text = `${systypecode} ${systypename}`;
		} else {
			item.text = `${moduleid} ${systypename}`;
		}
		item.key = moduleid;
		// 以当前节点的 parentcode 为 key，所有含有此 parentcode 节点的元素构成数组 为 值
		if (parentcode) {
			if (!treeObj[parentcode]) {
				treeObj[parentcode] = [];
			}
			treeObj[parentcode].push(item);
		} else {
			// 根据是否为叶子节点 来添加是否有 children 属性
			item.children = [];
			treeArray.push(item);
		}
	});
	return {
		treeArray,
		treeObj
	};
};
export function generateTemData(data){
	// 第一层 tree 数据
	let treeArray = [];
	// 所有 children 数组
	let treeObj = {};
	data.map((item, index) => {
		let {
			templateId,
			parentId,
			name,
			type
		} = item;
		if(item.children){
			delete item.children;
		}
		item.key = templateId;
		item.text = name;
		// 以当前节点的 parentcode 为 key，所有含有此 parentcode 节点的元素构成数组 为 值
		if (parentId==='root') {
			// 根据是否为叶子节点 来添加是否有 children 属性
			item.children = [];
			treeArray.push(item);
		} else {
			treeObj[templateId] = [];
			treeObj[templateId].push(item);
		}
	});
	return {
		treeArray,
		treeObj
	};
}
/**
 * 生成新的树数据
 * @param {Array} data 后台返回的树数据
 */
export function generateTreeData(data) {
	return data.map((item, index) => {
		item = Object.assign({}, item);
		if (item.children) {
			item.isLeaf = false;
			item.children = generateTreeData(item.children);
		} else {
			item.isLeaf = true;
		}
		return item;
	});
};