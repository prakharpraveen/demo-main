export const setPropertyValueForItemInItemList = (itemList, property, value) => {
    _.forEach(itemList, (a) => {
        a[property] = value;
    });
};