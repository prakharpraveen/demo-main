import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './index.less';
//ant
import { Button, Layout } from 'antd';
const { Content } = Layout;
//自定义组件
import { layoutCheck } from './collision';
import { compactLayout } from './compact';
import { checkInContainer } from './correction';
import GroupItem from './groupItem';

import { connect } from 'react-redux';
import { updateShadowCard, updateGroupList, updateCurrEditID,updateLayout } from 'Store/test/action';
import * as utilService from './utilService';
class MyContent extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	//通过坐标x，y计算所在的单元格
	calGridXY(x, y, width) {
		const { margin, containerWidth, col, rowHeight } = this.props.layout;

		/**坐标转换成格子的时候，无须计算margin */
		//向下取整
		let GridX = Math.floor(x / containerWidth * col);
		let GridY = Math.floor(y / (rowHeight + (margin ? margin[1] : 0)));

		// /**防止元素出container */
		return checkInContainer(GridX, GridY, col, width);
	}
	//拖拽中卡片在组上移动
	moveCardInGroupItem = (dragItem, hoverItem, x, y) => {
		let groups = this.props.groups;
		let shadowCard = this.props.shadowCard;
		const { GridX, GridY } = this.calGridXY(x, y, shadowCard.width);
		if(GridX=== shadowCard.gridx && GridY=== shadowCard.gridy){
			return;
		}
		shadowCard = _.cloneDeep(shadowCard);
		let groupIndex = hoverItem.index;
		//先判断组内有没有相同的appID
		const pk_appregister = shadowCard.pk_appregister;
		const isContain = utilService.checkCardContainInGroup(groups[groupIndex], pk_appregister);

		if (isContain) {
			return;
		}
		_.forEach(groups, (g, index) => {
			_.remove(g.apps, (a) => {
				return a.isShadow === true;
			});
		});

		groups[groupIndex].apps.push(shadowCard);

		// console.log(GridX, GridY);
		// shadowCard = { ...shadowCard, gridx: GridX, gridy: GridY };
		shadowCard.gridx = GridX;
		shadowCard.gridy = GridY;
		const newlayout = layoutCheck(
			groups[groupIndex].apps,
			shadowCard,
			shadowCard.pk_appregister,
			shadowCard.pk_appregister
		);

		const compactedLayout = compactLayout(newlayout, shadowCard);
		groups[groupIndex].apps = compactedLayout;
		// console.log(shadowCard.gridx,shadowCard.gridy)
		this.props.updateShadowCard(shadowCard);
		this.props.updateGroupList(groups);
	};
	/*
	 * 工作桌面 用户桌面设置 页面
	 * 关于组的操作
	 */
	//移动组顺序
	moveGroupItem = (dragIndex, hoverIndex) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		const dragCard = groups[dragIndex];
		groups.splice(dragIndex, 1);
		groups.splice(hoverIndex, 0, dragCard);
		this.props.updateGroupList(groups);
	};
	//拖拽组
	onDrop = (dragItem, dropItem) => {
		if (dragItem.type === dropItem.type) {
			return;
		}
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		let card;
		let dropGroupIndex, dragCardIndex, dragCardFromGroupIndex;
		for (let i = 0, len = groups.length; i < len; i++) {
			if (groups[i].pk_app_group === dropItem.id) {
				dropGroupIndex = i;
			}
			for (let j = 0, len2 = groups[i].apps.length; j < len2; j++) {
				let apps = groups[i].apps;
				if (apps[j].pk_appregister === dragItem.id) {
					card = apps[j];
					dragCardIndex = j;
					dragCardFromGroupIndex = i;
				}
			}
		}
		groups[dragCardFromGroupIndex].apps.splice(dragCardIndex, 1);
		groups[dropGroupIndex].apps.push(card);
		this.props.updateGroupList(groups);
	};
	//添加第一个组
	addFirstGroupItem = () => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		let insertIndex;
		const tmpItem = {
			pk_app_group: 'newGroupItem' + new Date().getTime(),
			groupname: `分组`,
			type: 'group',
			apps: []
		};
		groups.push(tmpItem);
		this.props.updateGroupList(groups);
	};
	//初始化组
	initGroupItem(groups) {
		let itemDoms = [];
		if (groups.length === 0) {
			itemDoms.push(
				<div className='first-add' id='first-add'>
					<Button className='group-item-add' onClick={this.addFirstGroupItem}>
						{' '}
						+ 添加分组
					</Button>
				</div>
			);
		}else{
			itemDoms = groups.map((g, i) => {
					return (
							<GroupItem
								key={g.pk_app_group}
								id={g.pk_app_group}
								type={g.type}
								index={i}
								cards={g.apps}
								length={groups.length}
								groupname={g.groupname}
								moveCardInGroupItem={this.moveCardInGroupItem}
								onDrop={this.onDrop}
								moveGroupItem={this.moveGroupItem}
								upGroupItem={this.upGroupItem}
								downGroupItem={this.downGroupItem}
								deleteGroupItem={this.deleteGroupItem}
								addGroupItem={this.addGroupItem}
								changeGroupName={this.changeGroupName}
								getCardsByGroupIndex={this.getCardsByGroupIndex}
								handleLoad={this.handleLoad}
							/>
					)
				})
		}
		return itemDoms;
	}
	//向上移动组
	upGroupItem = (groupIndex) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		if (groupIndex === 0) {
			return;
		}
		const preGroup = groups[groupIndex - 1];
		groups[groupIndex - 1] = groups[groupIndex];
		groups[groupIndex] = preGroup;
		this.props.updateGroupList(groups);
	};
	//向下移动组
	downGroupItem = (groupIndex) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		if (groupIndex === groups.length - 1) {
			return;
		}
		const nextGroup = groups[groupIndex + 1];
		groups[groupIndex + 1] = groups[groupIndex];
		groups[groupIndex] = nextGroup;
		this.props.updateGroupList(groups);
	};
	//删除组
	deleteGroupItem = (groupID) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);

		_.remove(groups, (g) => {
			return g.pk_app_group === groupID;
		});
		this.props.updateGroupList(groups);
	};
	//添加组
	addGroupItem = (groupIndex) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		let insertIndex = groupIndex;
		const tmpItem = {
			pk_app_group: 'newGroupItem' + new Date().getTime(),
			groupname: `分组(${utilService.getAddedGroupItemCount(groups) + 1})`,
			type: 'group',
			apps: []
		};
		groups.splice(insertIndex + 1, 0, tmpItem);
		this.props.updateGroupList(groups);
	};
	//改变组名
	changeGroupName = (groupIndex, groupname) => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		groups[groupIndex].groupname = groupname;
		this.props.updateGroupList(groups);
		this.props.updateCurrEditID('');
	};
	//通过Group Index获取cards
	getCardsByGroupIndex = (groupIndex) => {
		let { groups } = this.props;
		return groups[groupIndex].apps;
	};
	//当页面加载完成，获得卡片容器宽度
	handleLoad =() => {
		let clientWidth;
		const containerDom = document.querySelector("#card-container");
		if(containerDom){
			clientWidth = containerDom.clientWidth;
		}else{
			const firstAddButton = document.querySelector("#first-add");
			clientWidth = firstAddButton.clientWidth -10 ;
		}
		const defaultCalWidth= this.props.defaultLayout.calWidth;
	    const { containerPadding, margin } = this.props.layout;
        let layout = _.cloneDeep(this.props.layout);
        const windowWidth = window.innerWidth - 60*2;
        const col = utilService.calColCount(defaultCalWidth, windowWidth, containerPadding, margin);
        const calWidth = utilService.calColWidth(clientWidth, col, containerPadding, margin);
        console.log(clientWidth,calWidth,col);
        layout.calWidth = layout.rowHeight = calWidth;
        layout.col = col;
        layout.containerWidth = clientWidth;
        this.props.updateLayout(layout);
	}
	componentDidMount() {
		window.addEventListener('resize', this.handleLoad);
	 }
	render() {
		const { groups, contentHeight, anchorHeight } = this.props;
		return (
			<Content style={{ height: contentHeight, 'margin-top':anchorHeight }}>
				{/* <MyContentAnchor/> */}
				<div className='nc-workbench-home-container'>
				{this.initGroupItem(groups)}
				</div>
				
				{/* <div className='nc-workbench-home-container'>{this.initGroupItem(groups)}</div> */}
			</Content>
		);
	}
}

export default connect(
	(state) => ({
		groups: state.templateDragData.groups,
		shadowCard: state.templateDragData.shadowCard,
		layout: state.templateDragData.layout,
		defaultLayout: state.templateDragData.defaultLayout,
	}),
	{
		updateGroupList,
		updateShadowCard,
		updateCurrEditID,
		updateLayout
	}
)(MyContent);
