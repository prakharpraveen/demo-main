import _ from 'lodash';
import card from './card';
//
export const getGroupByGroupID = (groups, groupID) => {
	let tmpGroup = {};
	_.forEach(groups, (g) => {
		if (g.pk_app_group === groupID) {
			tmpGroup = g;
			return false;
		}
	});
	return tmpGroup;
};
//
export const getGroupIndexByGroupID = (groups, groupID) => {
	let tmpIndex;
	_.forEach(groups, (g, i) => {
		if (g.pk_app_group === groupID) {
			tmpIndex = i;
			return false;
		}
	});
	return tmpIndex;
};
//通过GroupID找到某个组，通过CardID找到该组内的卡片对象
export const getCardByGroupIDAndCardID = (groups, groupID, cardID) => {
	let tmpGroup = {};
	let resultCard = {};
	_.forEach(groups, (g) => {
		if (g.pk_app_group === groupID) {
			tmpGroup = g;
			return false;
		}
	});
	_.forEach(tmpGroup.apps, (a) => {
		if (a.pk_appregister === cardID) {
			resultCard = a;
			return false;
		}
	});
	return resultCard;
};
//
export const removeCardInGroupByCardID = (group, cardID) => {
	let resultCardArr = [];
	resultCardArr = _.remove(group.apps, (a) => {
		return a.pk_appregister === cardID;
	});
	return resultCardArr[0];
};
//
export const removeCardByGroupIndexAndCardID = (groups, groupIndex, cardID) => {
	let tmpGroupIndex = groupIndex;
	let resultCardArr = [];
	resultCardArr = _.remove(groups[tmpGroupIndex].apps, (a) => {
		return a.pk_appregister === cardID;
	});
	return resultCardArr[0];
};
//通过GroupID找到某个组，通过CardID找到该组内的卡片对象,并删除该卡片
// export const removeCardByGroupIDAndCardID = (groups, groupID, cardID) => {
// 	let tmpGroupIndex;
// 	let resultCardArr = [];
// 	_.forEach(groups, (g, i) => {
// 		if (g.pk_app_group === groupID) {
// 			tmpGroupIndex = i;
// 			return false;
// 		}
// 	});
// 	resultCardArr = _.remove(groups[tmpGroupIndex].apps, (a) => {
// 		return a.pk_appregister === cardID;
// 	});
// 	return resultCardArr[0];
// };
//
export const setPropertyValueForCards = (groups, property, value) => {
	_.forEach(groups, (g, index) => {
		_.forEach(g.apps, (a) => {
			a[property] = value;
		});
	});
};
//
export const setPropertyValueForCardsInCards = (cards, property, value) => {
		_.forEach(cards, (a) => {
			a[property] = value;
		});
};
//
export const checkCardContainInGroup = (groups, cardID) => {
	let tmpFlag = false;
	_.forEach(groups.apps, (a) => {
		if (a.pk_appregister === cardID && a.isShadow === false) {
			tmpFlag = true;
		}
	});
	return tmpFlag;
};
//获得新添加组个数
export const getAddedGroupItemCount = (groups) => {
	let count = 0;
	_.forEach(groups, (g) => {
		if (g.pk_app_group.indexOf('newGroupItem') !== -1) {
			count++;
		}
	});
	return count;
};
//
export const setGridXGridYMaxInCards = (cardList) => {
	_.forEach(cardList, (c) => {
		c.gridy = 9999;
	});
};
//已知放置格子数量, 计算容器的每一个格子多大
export const calColWidth = (containerWidth, col, containerPadding, margin) => {
	if (margin) {
		return (containerWidth - containerPadding[0] * 2 - margin[0] * (col + 1)) / col;
	}
	return (containerWidth - containerPadding[0] * 2 - 0 * (col + 1)) / col;
};
//已知格子大小，计算容器一行放置格子数量
export const calColCount = (defaultCalWidth, containerWidth, containerPadding, margin) => {
	if (margin) {
		return Math.floor((containerWidth - containerPadding[0] * 2 - margin[0]) / (defaultCalWidth + margin[0]));
	}
};
//计算卡片容器的最大高度
export const getContainerMaxHeight = (cards, rowHeight, margin) => {
	//行转列并且分组
	const rowRes = _.chain(cards).sortBy([ 'gridx', 'gridy' ]).groupBy('gridx').value();
	//寻找每列最后item的GridY和height的和
	let endHeight = [];
	_.forEach(rowRes, (r) => {
		const temp = r[r.length - 1];
		endHeight.push(temp.gridy + temp.height);
	});
	//获得最大的值
	const resultRow = _.max(endHeight);
	return resultRow * rowHeight + (resultRow - 1) * margin[1] + 2 * margin[1];
};
//
export const hasScrolled = (el, direction = 'vertical') => {
	if (direction === 'vertical') {
		return el.scrollHeight > el.clientHeight;
	} else if (direction === 'horizontal') {
		return el.scrollWidth > el.clientWidth;
	}
};
//
export const hasCheckedCardInGroups = (groups) => {
	let flag = false;
	_.forEach(groups, (g) => {
		_.forEach(g.apps, (a) => {
			if (a.isChecked === true) {
				flag = true;
				return false;
			}
		});
		if (flag) {
			return false;
		}
	});
	return flag;
};
//
export const removeCheckedCardsInGroups = (groups) => {
	_.forEach(groups,(g)=>{
        _.remove(g.apps,(a)=>{
            return a.isChecked === true;
        })
    })
};
