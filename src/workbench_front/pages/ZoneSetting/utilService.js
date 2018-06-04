export const setPropertyValueForItemInItemList = (itemList, property, value) => {
	_.forEach(itemList, (a) => {
		a[property] = value;
	});
};
export const getDatatypeName = (datatype) => {
	let name = '';
	switch (datatype) {
		case "4":
			name = '整数';
			break;
		case "52":
			name = '金额';
			break;
		case "56":
			name = '自定义项';
			break;
		case "57":
			name = '自定义档案';
			break;
		case "203":
			name = '下拉';
			break;
		case "204":
			name = '参照';
			break;
	}
	return name;
};
