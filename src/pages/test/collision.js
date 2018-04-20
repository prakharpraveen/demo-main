export const collision = (a, b) => {
	if (a.gridx === b.gridx && a.gridy === b.gridy && a.width === b.width && a.height === b.height) {
		return true;
	}
	if (a.gridx + a.width <= b.gridx) return false; //a处于b的左方
	if (a.gridx >= b.gridx + b.width) return false; //a处于b的右方
	if (a.gridy + a.height <= b.gridy) return false; //a处于b的上方
	if (a.gridy >= b.gridy + b.height) return false; //a处于b的下方
	return true;
};

export const layoutCheck = function(){
	const _layoutCheck = function(layout, layoutItem, cardID, fristItemID){

		let keyArr = []; let movedItem=[];

		let newlayout = layout.map((item , index)=>{

			if(item.pk_appregister !== cardID){
				if(collision(item, layoutItem)){
					keyArr.push(item.pk_appregister)

					let offsetY = item.gridy + 1;

					if(layoutItem.gridy > item.gridy && layoutItem.gridy < item.gridy + item.height){
						offsetY = item.gridy;
					}

					const newItem = {...item, gridy:offsetY}
					movedItem.push(newItem)
					return newItem;
				}
			}
			// else if( fristItemID === cardID){
			// 	return layoutItem
			// }

			return item;
		})

		const length = movedItem.length;
		for(let c=0; c<length; c++){
			newlayout = _layoutCheck(newlayout, movedItem[c], keyArr[c], fristItemID)
		}
		return newlayout;
	}
	return _layoutCheck;
}();
