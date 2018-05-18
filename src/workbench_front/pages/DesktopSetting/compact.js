import { getFirstCollison } from "./collision";
import {layoutHorizontalRowLength} from './utilService';
/** 
 * 布局的item排序，按照gridy由小到大，gridx由小到大
 * @param {array} layout 布局的数组
 * @returns {array} 新的布局数组
 */
const sortLayout = (layout)=>{
    return [].concat(layout).sort((a,b)=>{
        if(a.gridy>b.gridy || (a.gridy === b.gridy && a.gridx > b.gridx)){
            return 1;
        }else if(a.gridy === b.gridy && a.gridx === b.gridx){
            return 0;
        }
        return -1;
    })
}
 /**
  * 
  * 压缩单个元素，使得每一个元素都会紧挨着边界或者相邻的元素
  * @param {*} finishedLayout 压缩完的元素会放进这里来，用来对比之后的每一个元素是否需要压缩
  * @param {*} item 
  * @returns {item} 返回新的坐标位置的item
  */
 const compactItem = (finishedLayout, item) => {
     const newItem = {...item};
    if(finishedLayout.length === 0){
        return {...newItem, gridy:0};
    }

    while(true){
        let FirstCollison = getFirstCollison(finishedLayout, newItem)
        if(FirstCollison){
            newItem.gridy = FirstCollison.gridy + FirstCollison.height
            return newItem
        }

        newItem.gridy --
        if(newItem.gridy < 0) return {...newItem, gridy: 0}//碰到边界，gridy设为0
    }

}
/**
 * 压缩layout，使得每一个元素都会紧挨着边界或者相邻的元素
 * @param {any} layout 
 * @param {any} movingItem 
 * @returns {layout} 最新的layout布局
 */
export const compactLayout = function( layout, movingItem ){
    let sorted = sortLayout(layout);
    const compareList = []
    const needCompact = Array(layout.length)

    for(let i=0, length=sorted.length; i<length; i++){
        let finished = compactItem(compareList, sorted[i])
        // if(movingItem){
        //     if(movingItem.pk_appregister === finished.pk_appregister){
        //         movingItem.gridx = finished.gridx;
        //         movingItem.gridy = finished.gridy;
        //     }
        // }else{

        // }
        compareList.push(finished)
        needCompact[i] = finished;
    }
    return needCompact;
}
//横向压缩 horizontal  compact Layout
export const compactLayoutHorizontal = function( layout, cols ){
    let sorted = sortLayout(layout);
    const compareList = []
    const needCompact = Array(layout.length)

    for(let i=0;i<sorted.length;i++){
        sorted[i].gridy = 0;
        sorted[i].gridx = 0;
    }
    let rowCount = 0;
    for(let i=0, length=sorted.length; i<length; i++){
        //获得某行已存在卡片的最大累加宽度
        const compareListRow = _.filter(compareList,(c)=>{
            return c.gridy == rowCount
        });
        const ll = layoutHorizontalRowLength(compareListRow);
        //如果当前最大宽度加上当前卡片宽度大于cols，则放入下一行，
        //否则设置gridx
        if(ll+sorted[i].width > cols){
            rowCount++;
            sorted[i].gridy = rowCount;
        }else{
            sorted[i].gridy = rowCount;
            sorted[i].gridx = ll;
        }
        compareList.push(sorted[i]);
        needCompact[i] = sorted[i];
    }
    return needCompact;
}