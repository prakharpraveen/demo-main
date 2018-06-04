export const setPropertyValueForItemInItemList = (itemList, property, value) => {
	_.forEach(itemList, (a) => {
		a[property] = value;
	});
};
export const getDatatypeName = (datatype) => {
	let name = '';
	switch (datatype) {
		case '4':
			name = '整数';
			break;
		case '52':
			name = '金额';
			break;
		case '56':
			name = '自定义项';
			break;
		case '57':
			name = '自定义档案';
			break;
		case '203':
			name = '下拉';
			break;
		case '204':
			name = '参照';
			break;
	}
	return name;
};
export const componentTypeObj = [
	{ name: '复选', value: '0' },
	{ name: '单选日期', value: '1' },
	{ name: '文本输入框', value: '2' },
	{ name: '静态文本', value: '3' },
	{ name: '数值输入框', value: '4' },
	{ name: '单选', value: '5' },
	{ name: '日期范围', value: '6' },
	{ name: '参照', value: '7' },
	{ name: '下拉框', value: '8' },
	{ name: '开关', value: '9' },
	{ name: '多行文本', value: '10' }
];
export const colorObj = [
	{ name: '黑色', value: '1' },
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
	{ name: '整数', value: '4' },
	{ name: '金额', value: '52' },
	{ name: '自定义项', value: '56' },
	{ name: '自定义档案', value: '57' },
	{ name: '下拉', value: '203' },
	{ name: '参照', value: '204' }
];
