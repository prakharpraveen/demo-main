import _ from 'lodash';
export const getCardByCardID = (groups, cardID) => {
    let result = {};
	_.forEach(groups,(g)=>{
        _.forEach(g.apps,(a)=>{
            if(a.pk_appregister === cardID){
                result = a;
                return false;
            }
        })
    })
    return result;
};
export const setIsShadowForCards = (groups, isShadow)=>{
    _.forEach(groups, (g, index) => {
        _.forEach(g.apps, (a) => {
            a.isShadow = false;
        })
    });
}