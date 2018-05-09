import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './index.less';
//ant
import { Button, Layout } from 'antd';
const { Content } = Layout;
//自定义组件
import {layoutCheck} from './collision';
import {compactLayout} from './compact.js';
import { checkInContainer } from './correction';
import GroupItem from './groupItem.js';

import { connect } from 'react-redux';
import { updateShadowCard, updateGroupList } from 'Store/test/action';
import * as utilService from './utilService';

class MyContent extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	//通过坐标x，y计算所在的单元格
	calGridXY(x, y,width) {
		const { margin, containerWidth, col, rowHeight } = this.props.layout;

		/**坐标转换成格子的时候，无须计算margin */
		//向下取整
		let GridX = Math.floor(x / containerWidth * col)
		let GridY = Math.floor(y / (rowHeight + (margin ? margin[1] : 0)))

		// /**防止元素出container */
		return checkInContainer(GridX, GridY, col, width);
	}
	//拖拽中卡片在组上移动
	moveCardInGroupItem(dragItem, hoverItem, x, y) {
		let groups = this.props.groups;
		let shadowCard = this.props.shadowCard;
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

		const { GridX, GridY } = this.calGridXY(x, y, shadowCard.width);
		// shadowCard = { ...shadowCard, gridx: GridX, gridy: GridY };
		shadowCard.gridx = GridX;
		shadowCard.gridy = GridY;
		const newlayout = layoutCheck(groups[groupIndex].apps, shadowCard, shadowCard.pk_appregister, shadowCard.pk_appregister);
		
		const compactedLayout = compactLayout(newlayout, shadowCard);
		groups[groupIndex].apps = compactedLayout;
		// console.log(shadowCard.gridx,shadowCard.gridy)
		this.props.updateShadowCard(shadowCard);
		this.props.updateGroupList(groups);
	}
	/*
	 * 工作桌面 用户桌面设置 页面
	 * 关于组的操作
	 */
	//移动组顺序
	moveGroupItem(dragIndex, hoverIndex) {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		const dragCard = groups[dragIndex];
		groups.splice(dragIndex, 1);
		groups.splice(hoverIndex, 0, dragCard);
		this.props.updateGroupList(groups);
	}
	//拖拽组
	onDrop(dragItem, dropItem) {
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

	}
	//添加第一个组
	addFirstGroupItem(groupID) {
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
	}
	//创建组
	createGroupItem(pk_app_group, groupname, type, index, length, cards) {
		return (
			<GroupItem
				key={pk_app_group}
				id={pk_app_group}
				type={type}
				index={index}
				length={length}
				cards={cards}
				groupname={groupname}
				moveCardInGroupItem={this.moveCardInGroupItem.bind(this)}
				onDrop={this.onDrop.bind(this)}
				moveGroupItem={this.moveGroupItem.bind(this)}
			/>
		);
	}
	//初始化组
	initGroupItem(groups) {
		let itemDoms = [];
		if (groups.length === 0) {
			itemDoms.push(
				<div className='first-add'>
					<Button
						className='group-item-add'
						onClick={() => {
							this.addFirstGroupItem();
						}}
					>
						{' '}
						+ 添加分组
					</Button>
				</div>
			);
		}
		_.forEach(groups, (g, i) => {
			itemDoms.push(this.createGroupItem(g.pk_app_group, g.groupname, g.type, i, groups.length, g.apps));
		});
		return itemDoms;
	}

	render() {
		console.log('content')
		const { groups, contentHeight } = this.props;
		return (
			<Content style={{ height: contentHeight }}>
				<div className='nc-workbench-home-container'>{this.initGroupItem(groups)}</div>
			</Content>
		);
	}
}
export default connect(
	(state) => ({
		groups: state.templateDragData.groups,
		shadowCard: state.templateDragData.shadowCard,
		layout: state.templateDragData.layout,
	}),
	{
		updateGroupList,
		updateShadowCard
	}
)(MyContent);
