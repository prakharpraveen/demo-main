import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeIntlData, saveImg, clearData } from 'Store/home/action';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import './index.less';
// drag && drop
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import {collision,layoutCheck} from './collision';
//自定义组件
import { checkInContainer } from './correction';
import Footer from './footer'
import GroupItem from './groupItem.js';

class Test extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectCardIDList:[],
			moveModal:{
				selectedValue:1
			},
			currEditID: "",
			layout: {
				containerWidth: 1200,
				containerHeight: 300,
				calWidth: 175,
				rowHeight: 175,
				col: 6,
				margin: [10, 10],
				containerPadding: [0, 0],
			},
			defaultLayout:{
				containerWidth: 1200,
				containerHeight: 300,
				calWidth: 175,
				rowHeight: 175,
				col: 6,
				margin: [10, 10],
				containerPadding: [0, 0],
			}
		 };
	}

	componentWillMount() {
		
	}

	componentDidMount() {
		Ajax({
			url: `/nccloud/platform/appregister/queryapp.do`,
			data: {
				'cuserid': '1A'
			},
			success: (res) => {
				if (res) {
					let { data, success } = res.data;
					if (success && data && data.length > 0) {
						_.forEach(data, (d) => {
							d.type = "group";
						})
						this.state.groups = data;
						this.setState({ groups: data })
					}
				}
			}
		});
	}

	/*
	 * 工作桌面 用户桌面设置 页面
	 * 关于卡片的操作
	 */
	//删除卡片
	deleteCard(cardID) {
		let { groups, selectCardIDList } = this.state;
		let deleteCardIndex;
		_.forEach(groups, function (g, gIndex) {
			_.remove(g.apps, (c) => {
				return c.pk_appregister === cardID
			});
		});
		_.remove(selectCardIDList,(d)=>{
			return d === cardID;
		});
		this.setState({ groups,selectCardIDList});
	}
	//计算容器的每一个格子多大
	calColWidth() {
		const { containerWidth, col, containerPadding, margin } = this.state.layout;

		if (margin) {
			return (containerWidth - containerPadding[0] * 2 -  margin[0] * (col + 1)) / col
		}
		return (containerWidth - containerPadding[0] * 2 - 0 * (col + 1)) / col
	}
	//通过坐标x，y计算所在的单元格
	calGridXY(x, y,width) {
		const { margin, containerWidth, col, rowHeight } = this.state.layout;

		/**坐标转换成格子的时候，无须计算margin */
		// let GridX = Math.round(x / containerWidth * col)
		// let GridY = Math.round(y / (rowHeight + (margin ? margin[1] : 0)))
		//向下取整
		let GridX = Math.floor(x / containerWidth * col)
		let GridY = Math.floor(y / (rowHeight + (margin ? margin[1] : 0)))

		// /**防止元素出container */
		console.log(checkInContainer(GridX, GridY, col, width));
		return checkInContainer(GridX, GridY, col, width);
	}
	//拖拽中卡片在组上移动
	moveCardInGroupItem(dragItem,hoverItem,x,y){
		const { GridX, GridY } = this.calGridXY(x, y,dragItem.width);
		dragItem = {...dragItem,gridx:GridX,gridy:GridY};
		const newlayout = layoutCheck(hoverItem.cards,dragItem,dragItem.pk_appregister,dragItem.pk_appregister);
		let {groups} = this.state;
		let groupIndex;
		_.forEach(groups,(g, index)=>{
			if(g.pk_app_group === hoverItem.id){
				groupIndex = index;
				return false
			}
		});
		groups[groupIndex].apps = newlayout;
		this.setState({groups});
	}
	//拖拽卡片到组
	dragCardToGroupItem(dragItem,dropItem,x,y){
		const { GridX, GridY } = this.calGridXY(x, y,dragItem.width);
		let { groups } = this.state;

		let targetGropItemIndex;
		let dragCard;
		_.forEach(groups, (g, gIndex) => {
			if (g.pk_app_group === dropItem.id) {
				targetGropItemIndex = gIndex;
			}
		});
		_.forEach(groups, (g, gIndex)=>{
			dragCard = _.remove(g.apps, (c) => {
				return c.pk_appregister === dragItem.id;
			})
			if(dragCard.length !== 0){
				return false;
			}
		});
		dragCard[0].gridx = GridX;
		dragCard[0].gridy = GridY;
		groups[targetGropItemIndex].apps.push(dragCard[0]);
		this.setState({ groups: groups });
	}
	onCheckboxChange(checked, cardID) {
		let { selectCardIDList } = this.state;
		if (checked) {
			selectCardIDList.push(cardID)
		} else {
			_.remove(selectCardIDList, (s) => {
				return s === cardID;
			})
		}
		this.setState({selectCardIDList});
	}
	/*
	 * 工作桌面 用户桌面设置 页面
	 * 关于组的操作
	 */
	//组名进入编辑状态
	editGroupItemName(groupID) {
		this.setState({ currEditID: groupID });
	}
	//获得新添加组个数
	getAddedGroupItemCount() {
		let count = 0;
		_.forEach(this.state.groups, (g) => {
			if (g.pk_app_group.indexOf("newGroupItem") !== -1) {
				count++;
			}
		})
		return count;
	}
	//添加组
	addGroupItem(groupID) {
		let { groups } = this.state;
		let insertIndex;
		_.forEach(groups, (g, i) => {
			if (g.pk_app_group === groupID) {
				insertIndex = i;
				return false;
			}
		})
		const tmpItem = {
			pk_app_group: "newGroupItem" + new Date().getTime(),
			groupname: `分组(${this.getAddedGroupItemCount() + 1})`,
			type: "group",
			apps: []
		}
		groups.splice(insertIndex + 1, 0, tmpItem);
		this.setState({ groups: groups });
	}
	//删除组
	deleteGroupItem(groupID) {
		let { groups } = this.state;
		let deleteIndex;
		if (groups.length <= 1) {
			return;
		}
		_.remove(groups,(g)=>{
			return g.pk_app_group === groupID;
		})
		this.setState({ groups: groups });
	}
	//改变组名
	changeGroupName(groupID, groupName) {
		let { groups } = this.state;
		_.forEach(groups, (g, i) => {
			if (g.pk_app_group === groupID) {
				g.groupname = groupName;
				return false;
			}
		});
		this.setState({ groups: groups, currEditID: "" });
	}
	//取消编辑组名
	cancelGroupName() {
		this.setState({ currEditID: "" });
	}
	//移动组顺序
	moveGroupItem(dragIndex, hoverIndex) {
		let { groups } = this.state;
		const dragCard = groups[dragIndex];
		groups.splice(dragIndex, 1);
		groups.splice(hoverIndex, 0, dragCard);
		this.setState({ groups: groups });
	}
	//拖拽组
	onDrop(dragItem, dropItem) {
		if (dragItem.type === dropItem.type) {
			return;
		}
		let { groups } = this.state;
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
		this.setState({ groups: groups });

	}
	//获得组的宽度后，重新设置layout
	resetContainer(layout){
        this.setState({ layout: layout })
	}
	//创建组
	createGroupItem(pk_app_group, groupname, type, index, cards) {
		return <GroupItem key={pk_app_group} id={pk_app_group} groupname={groupname} type={type} index={index} {...this.state}
			cards={cards}
			layout={this.state.layout}
			defaultLayout = {this.state.defaultLayout}
			currEditID={this.state.currEditID}
			onDrop={this.onDrop.bind(this)}
			addGroupItem={this.addGroupItem.bind(this)}
			deleteGroupItem={this.deleteGroupItem.bind(this)}
			editGroupItemName={this.editGroupItemName.bind(this)}
			moveGroupItem={this.moveGroupItem.bind(this)}
			deleteCard={this.deleteCard.bind(this)}
			changeGroupName={this.changeGroupName.bind(this)}
			cancelGroupName={this.cancelGroupName.bind(this)}
			dragCardToGroupItem={this.dragCardToGroupItem.bind(this)}
			moveCardInGroupItem = {this.moveCardInGroupItem.bind(this)}
			resetContainer={this.resetContainer.bind(this)}
			onCheckboxChange = {this.onCheckboxChange.bind(this)}
		/>
	}
	//初始化组
	initGroupItem(groups) {
		let itemDoms = [];
		_.forEach(groups, (g, i) => {
			itemDoms.push(
				this.createGroupItem(g.pk_app_group, g.groupname, g.type, i, g.apps)
			);
		});
		return itemDoms;
	}
	/*
	* 工作桌面 用户桌面设置 页面
	* 关于删除、移动到、保存、取消的操作
	*/
	//点击删除按钮
	deleteSelectedCardArr(){
		let {selectCardIDList,groups} = this.state;
		_.forEach(groups,(g,i)=>{
			_.remove(g.apps,(a)=>{
				return _.indexOf(selectCardIDList,a.pk_appregister) !== -1
			})
		});
		selectCardIDList = [];
		this.setState({selectCardIDList,groups});
		console.log(this.state);
	}
	//移动到弹出框点击确定之后
	onOkMoveDialog(targetGroupID){
		let {groups,selectCardIDList} = this.state;
		let moveCardArr = [];
		let targetGroupIndex;
		_.forEach(groups,(g,i)=>{
			if(g.pk_app_group === targetGroupID){
				targetGroupIndex = i;
			}
			const tmpArr = _.remove(g.apps,(a)=>{
				return _.indexOf(selectCardIDList,a.pk_appregister) !== -1
			})
			moveCardArr = _.concat(moveCardArr,tmpArr);
		});
		groups[targetGroupIndex].apps = _.concat(groups[targetGroupIndex].apps,moveCardArr);
		selectCardIDList = [];
		this.setState({groups:groups,selectCardIDList:selectCardIDList});
	}
	//保存
	saveGroupItemAndCard() {
		let tmpData = [];
		_.forEach(this.state.groups, (g,i) => {

			let tmp = {
				"groupname": g.groupname,
				"apps": [],
				"position": i,
			}
			if (g.pk_app_group.indexOf("newGroupItem") === -1) {
				tmp.pk_app_group = g.pk_app_group
			}
			_.forEach(g.apps, (a) => {
				tmp.apps.push({
					'pk_appregister': a.pk_appregister,
					'gridx': a.gridx,
					'gridy': a.gridy
				})
			})
			tmpData.push(tmp);
		})
		const saveData = {
			'cuserid': '1A',
			'data': tmpData
		} 
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
		const { groups, apps } = this.state;
		return (
			<div className='nc-workbench-home-page'>
				<div className='nc-workbench-home-container'>
					{this.initGroupItem(groups)}
				</div>
				<Footer {...this.state} 
				saveGroupItemAndCard={this.saveGroupItemAndCard.bind(this)}
				onOkMoveDialog = {this.onOkMoveDialog.bind(this)}
				deleteSelectedCardArr = {this.deleteSelectedCardArr.bind(this)}
				/>
			</div>
		);
	}
}

export default DragDropContext(HTML5Backend)(connect(
	(state) => ({
		formData: state.formData,
		proData: state.proData
	}),
	{
		changeIntlData,
		saveImg,
		clearData
	}
)(Test))

	// componentDidMount() {
	// 	let { layout } = this.state;
	// 	const containerDom = document.querySelector("#card-container");
	// 	const clientWidth = containerDom.clientWidth;
	// 	this.state.layout.containerWidth = clientWidth;

	// 	const calWidth = this.calColWidth();

	// 	layout.calWidth = layout.rowHeight = calWidth;
	// 	layout.containerWidth = clientWidth;
	// 	this.setState({ layout: layout })
    // }
	