/**
 * 碰撞检测
 * 
 */
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
/** 
 * 获取layout中，item第一个碰撞到的物体
 * @param {any} layout 
 * @param {any} item 
 * @returns {item||null} 被碰撞的item或者null
 */
export const getFirstCollison = (layout, item)=>{
	for(let i=0, length = layout.length; i<length ; i++){
		if(collision(layout[i],item)){
			return layout[i]
		}
	}
	return null;
}
/**
 * 布局检测，递归检测移动过的item和其他item有没有碰撞，如果有Y坐标下移
 *  
 */
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
			else if( fristItemID === cardID){
				return {...item, ...layoutItem} 
			}

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
