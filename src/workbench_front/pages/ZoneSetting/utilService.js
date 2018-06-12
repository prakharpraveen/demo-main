export const setPropertyValueForItemInItemList = (itemList, property, value) => {
	_.forEach(itemList, (a) => {
		a[property] = value;
	});
};
export const getDatatypeName = (datatype) => {
	let name = '';
	for(let i =0;i<dataTypeObj.length;i++){
		if(dataTypeObj[i].value === datatype){
			name = dataTypeObj[i].name;
		}
	}
	return name;
};
export const getOpersignByDatatype = (datatype) => {
	let name = '';
	for(let i =0;i<opersignObj.length;i++){
		if(opersignObj[i].value === datatype){
			name = opersignObj[i].name;
		}
	}
	return name;
};
export const getOpersignNameByDatatype = (datatype) => {
	let name = '';
	for(let i =0;i<opersignNameObj.length;i++){
		if(opersignNameObj[i].value === datatype){
			name = opersignNameObj[i].name;
		}
	}
	return name;
};

export const opersignObj = [
	{ name: '=@<>@', value: '203' },
	{ name: 'between@=@>@>=@<@<=@', value:'34'  },
	{ name: '=@like@left like@right like@', value: '58' },
	{ name: 'between@=@>@>=@<@<=@', value: '4' },
	{ name: '=@like@left like@right like@', value: '1' },
	{ name: '=', value: '204' }
];
export const opersignNameObj = [
	{ name:  '等于@不等于@', value: '203'},
	{ name: '介于@等于@大于@大于等于@小于@小于等于@', value: '34' },
	{ name: '等于@包含@左包含@右包含@', value: '58' },
	{ name: '介于@等于@大于@大于等于@小于@小于等于@', value:'4'  },
	{ name: '等于@包含@左包含@右包含@', value: '1' },
	{ name:  '等于@' , value:'204'}
];
export const componentWidthObj = [
	{ name: '3', value: '3' },
	{ name: '4', value: '4' },
	{ name: '6', value: '6' },
	{ name: '12', value: '12' }
];
export const showAndReturnType = [ { name: '名称', value: '1' }, { name: '编码', value: '2' } ];
export const colorObj = [
	{ name: '黑色-', value: '1' },
	{ name: '白色', value: '2' },
	{ name: '浅灰色', value: '3' },
	{ name: '灰色', value: '4' },
	{ name: '深灰色', value: '5' },
	{ name: '红色', value: '6' },
	{ name: '粉色', value: '7' },
	{ name: '橘色', value: '8' },
	{ name: '黄色', value: '9' },
	{ name: '绿色', value: '10' },
	{ name: '紫红色', value: '11' },
	{ name: '蓝绿色', value: '12' },
	{ name: '兰色', value: '13' },
	{ name: '深兰色', value: '14' }
];
export const dataTypeObj = [
	{ name: '字符', value: '1' },
	{ name: '小数', value: '2' },
	{ name: '逻辑', value: '3' },
	{ name: '整数', value: '4' },
	{ name: '大文本', value: '30' },
	{ name: '时间戳', value: '34' },
	{ name: '金额', value: '52' },
	// { name: '自定义项', value: '56' },
	{ name: '自定义档案', value: '57' },
	{ name: '多语文本', value: '58' },
	{ name: '下拉', value: '203' },
	{ name: '参照', value: '204' },
	{ name: '密码框', value: '400' }
];
export const defaultvarObj = [
	{ name: '', value: '' },
	{ name: '@SYSCORP', value: '@SYSCORP' },
	{ name: '@SYSOPER', value: '@SYSOPER' },
	{ name: '@SYSUSER', value: '@SYSUSER' },
	{ name: '@SYSDEPT', value: '@SYSDEPT' },
	{ name: '小数', value: '2' }
];
export const showtype = [
	{ name: '名称', value: '1' },
	{ name: '编码', value: '2' }
];
