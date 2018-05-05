import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import './index.less';
// drag && drop
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
//ant
import { Layout } from 'antd';
const { Header, Content } = Layout;
//自定义组件
import {collision,layoutCheck} from './collision';
import {compactLayout} from './compact.js';
import { checkInContainer } from './correction';
import MySider from './sider';
import MyFooter from './footer'
import GroupItem from './groupItem.js';

import { connect } from 'react-redux';
import { updateShadowCard, updateGroupList, updateSelectCardIDList, updateCurrEditID, updateLayout } from 'Store/test/action';
import * as utilService from './utilService';

class Test extends Component {
	constructor(props) {
		super(props);
		this.state = {
			workbenchid:''
		 };
	}

	componentWillMount() {
		
	}

	componentDidMount() {
		Ajax({
			url: `/nccloud/platform/appregister/queryapp.do`,
			data: {
				// 'cuserid': '0001Z5100000000396E0'
				relateid:'reid1'
			},
			success: (res) => {
				if (res) {
					
					let { data, success } = res.data;
					if (success && data && data.length > 0) {
						_.forEach(data[0].groups, (d) => {
							d.type = "group";
						})
						this.props.updateGroupList(data[0].groups);
						this.setState({workbenchid: data[0].pk_workbench})
					}
				}
			}
		});
	}

	/*
	 * 工作桌面 用户桌面设置 页面
	 * 关于卡片的操作
	 */
	//计算容器的每一个格子多大
	calColWidth() {
		const { containerWidth, col, containerPadding, margin } = this.props.layout;

		if (margin) {
			return (containerWidth - containerPadding[0] * 2 -  margin[0] * (col + 1)) / col
		}
		return (containerWidth - containerPadding[0] * 2 - 0 * (col + 1)) / col
	}
	//计算container中可以放多少个格子
	calColNum(){
		const { containerWidth, col, containerPadding, margin } = this.props.layout;
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
		let groupIndex;
		_.forEach(groups, (g, index) => {
			if (g.pk_app_group === hoverItem.id) {
				groupIndex = index;
				return false;
			}
		});
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
		
		// if(shadowCard.pk_appregister.indexOf('_') !== -1){
		// 	const pk_appregister = shadowCard.pk_appregister.split('_')[0];
		// 	const isContain = utilService.checkCardContainInGroup(groups[groupIndex], pk_appregister);
			
			
		// 	if(isContain){
		// 		console.log(isContain);
		// 		return;
		// 	}
		// }else{
		// 	const pk_appregister = shadowCard.pk_appregister;
		// 	const isContain = utilService.checkCardContainInGroup(groups[groupIndex], pk_appregister);
			
		// 	if(isContain){
		// 		console.log(isContain);
		// 		return;
		// 	}
		// }
		//再判断拖拽卡片为siderCard并且pk_appregister不包含当前组id
		// if(shadowCard.pk_appregister.indexOf('_') !== -1 && shadowCard.pk_appregister.indexOf(groups[groupIndex].pk_app_group) === -1){
		// 	shadowCard.pk_appregister = `${shadowCard.siderCardID}_${groups[groupIndex].pk_app_group}`
		// 	console.log(shadowCard.pk_appregister)
		// }

		groups[groupIndex].apps.push(shadowCard);


		const { GridX, GridY } = this.calGridXY(x, y, shadowCard.width);
		shadowCard = { ...shadowCard, gridx: GridX, gridy: GridY };
		
		const newlayout = layoutCheck(groups[groupIndex].apps, shadowCard, shadowCard.pk_appregister, shadowCard.pk_appregister);
		
		const compactedLayout = compactLayout(newlayout, shadowCard);
		groups[groupIndex].apps = compactedLayout;
		console.log(shadowCard.gridx,shadowCard.gridy)
		this.props.updateShadowCard(shadowCard);
		this.props.updateGroupList(groups);
	}


	// moveCardInGroupItem(dragItem, hoverItem, x, y) {
	// 	let { groups } = this.state;
	// 	let groupIndex;
	// 	let removeCardArr = [];
	// 	const tmpCard = {};

	// 	_.forEach(groups, (g, index) => {
	// 		if (g.pk_app_group === hoverItem.id) {
	// 			groupIndex = index;
	// 		}
	// 		const tmpCard = _.remove(g.apps, (a) => {
	// 			return a.pk_appregister === dragItem.id;
	// 		})
	// 		removeCardArr = _.concat(removeCardArr, tmpCard);
	// 	});

	// 	let removeCard;
	// 	if(removeCardArr.length === 0){
	// 		removeCard = {
	// 			pk_appregister: dragItem.id,
	// 			height: 2,
	// 			width: 2,
	// 			specID:"123456",
	// 			name: dragItem.id
	// 		};
	// 	}else{
	// 		removeCard = removeCardArr[0];
	// 	}

	// 	_.forEach(groups, (g, index) => {
	// 		_.remove(g.apps, (a) => {
	// 			return a.specID === "123456";
	// 		})
	// 	});
		 
	// 	const { GridX, GridY } = this.calGridXY(x, y, removeCard.width);
	// 	removeCard = { ...removeCard, gridx: GridX, gridy: GridY };
	// 	groups[groupIndex].apps.push(removeCard);
	// 	const newlayout = layoutCheck(groups[groupIndex].apps, removeCard, removeCard.pk_appregister, removeCard.pk_appregister);

	// 	const compactedLayout = compactLayout(newlayout, removeCard);
	// 	groups[groupIndex].apps = compactedLayout;
	// 	this.setState({ groups });
	// }

	//释放卡片到组
	dropCardToGroupItem(dragItem,dropItem,x,y){
		
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
	//获得组的宽度后，重新设置layout
	resetContainer(layout){
		this.props.updateLayout(layout);
	}
	//创建组
	createGroupItem(pk_app_group, groupname, type, index, length, cards) {
		return <GroupItem key={pk_app_group} id={pk_app_group} type={type} index={index} length={length} cards={cards} groupname={groupname} 
			
			resetContainer={this.resetContainer.bind(this)}
			dropCardToGroupItem={this.dropCardToGroupItem.bind(this)}
			moveCardInGroupItem = {this.moveCardInGroupItem.bind(this)}
			onDrop={this.onDrop.bind(this)}
			moveGroupItem={this.moveGroupItem.bind(this)}
		/>
	}
	//初始化组
	initGroupItem(groups) {
		let itemDoms = [];
		_.forEach(groups, (g, i) => {
			itemDoms.push(
				this.createGroupItem(g.pk_app_group, g.groupname, g.type, i, groups.length, g.apps)
			);
		});
		return itemDoms;
	}
	/*
	* 工作桌面 用户桌面设置 页面
	* 关于删除、移动到、保存、取消的操作
	*/
	//保存
	saveGroupItemAndCard() {
		let tmpData = [];
		_.forEach(this.props.groups, (g,i) => {

			let tmp = {
				"groupname": g.groupname,
				"apps": [],
				"position": i,
			}
			if (g.pk_app_group.indexOf("newGroupItem") === -1) {
				tmp.pk_app_group = g.pk_app_group
			}
			_.forEach(g.apps, (a) => {
				if(a.pk_appregister.indexOf('_')!==-1){
					const tmpIDArr = a.pk_appregister.split('_');
					a.pk_appregister = tmpIDArr[0];
				}
				tmp.apps.push({
					'pk_appregister': a.pk_appregister,
					'gridx': a.gridx,
					'gridy': a.gridy
				})
			})
			tmpData.push(tmp);
		})
		const saveData = {
			'workbenchid': this.state.workbenchid,
			'data': tmpData
		} 
		console.log(saveData)
		Ajax({
			url: `/nccloud/platform/appregister/setapp.do`,
			data: saveData,
			success: (res) => {
				const { data, success } = res.data;
					if (success) {
						// location.reload();
					}
			}
		});
	}
	render() {
		let { groups } = this.props;
		const contentHeight = 'calc(100vh - 116px)';
		return (
			<Layout>
				{/* Header占位符 */}
				<Header style={{ height: '48px' }}></Header>
				<div className="bread-crumb" style={{height:'20px'}}>
				面包屑
				</div>
				<Layout>
					<MySider contentHeight={contentHeight}/>
					<Content style={{ height: contentHeight }}>
						<div className='nc-workbench-home-container'>
							{this.initGroupItem(groups)}
						</div>
					</Content>
				</Layout>

				<MyFooter
					saveGroupItemAndCard={this.saveGroupItemAndCard.bind(this)}
				/>
			</Layout>
		);
	}
}

const draDrop = DragDropContext(HTML5Backend)(Test);

export default (connect(
	(state) => ({
		groups: state.templateDragData.groups,
		shadowCard: state.templateDragData.shadowCard,
		selectCardIDList: state.templateDragData.selectCardIDList,
		layout: state.templateDragData.layout,
	}),
	{
		updateShadowCard,
		updateGroupList,
		updateSelectCardIDList,
		updateCurrEditID,
		updateLayout
	}
)(draDrop))
	