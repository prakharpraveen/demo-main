import _ from 'lodash';
import card from './card';
//
export const getGroupByGroupID = (groups, groupID) => {
    let tmpGroup = {};
    _.forEach(groups, (g)=>{
        if(g.pk_app_group === groupID){
            tmpGroup = g;
            return false;
        }
    });
    return tmpGroup;
};
//
export const getGroupIndexByGroupID = (groups, groupID) => {
    let tmpIndex;
    _.forEach(groups, (g,i)=>{
        if(g.pk_app_group === groupID){
            tmpIndex = i;
            return false;
        }
    });
    return tmpIndex;
};
//通过GroupID找到某个组，通过CardID找到该组内的卡片对象
export const getCardByGroupIDAndCardID = (groups, groupID, cardID)=>{
    let tmpGroup = {};
    let resultCard = {};
    _.forEach(groups, (g)=>{
        if(g.pk_app_group === groupID){
            tmpGroup = g;
            return false;
        }
    });
    _.forEach(tmpGroup.apps,(a)=>{
        if(a.pk_appregister === cardID){
            resultCard = a;
            return false;
        }
    })
    return resultCard;
}
//
export const removeCardInGroupByCardID = (group, cardID)=>{
    let resultCardArr = [];
    resultCardArr = _.remove(group.apps, (a) => {
        return a.pk_appregister === cardID;
    })
    return resultCardArr[0];
}
//通过GroupID找到某个组，通过CardID找到该组内的卡片对象,并删除该卡片
export const removeCardByGroupIDAndCardID = (groups, groupID, cardID)=>{
    let tmpGroupIndex;
    let resultCardArr = [];
    _.forEach(groups, (g,i)=>{
        if(g.pk_app_group === groupID){
            tmpGroupIndex = i;
            return false;
        }
    });
    resultCardArr = _.remove(groups[tmpGroupIndex].apps, (a) => {
        return a.pk_appregister === cardID;
    })
    return resultCardArr[0];
}
export const setIsShadowForCards = (groups, isShadow)=>{
    _.forEach(groups, (g, index) => {
        _.forEach(g.apps, (a) => {
            a.isShadow = false;
        })
    });
}
export const checkCardContainInGroup = (groups, cardID)=>{
    let tmpFlag = false;
    _.forEach(groups.apps, (a) => {
        if( a.pk_appregister === cardID && a.isShadow === false){
            tmpFlag = true;
        }
    })
    return tmpFlag;
}
//获得新添加组个数
export const getAddedGroupItemCount = (groups)=>{
    let count = 0;
    _.forEach(groups, (g) => {
        if (g.pk_app_group.indexOf("newGroupItem") !== -1) {
            count++;
        }
    })
    return count;
}