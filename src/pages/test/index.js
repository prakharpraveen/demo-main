import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeIntlData, saveImg, clearData } from 'Store/home/action';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import './index.less';
// drag && drop
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
//ant
import { Layout  } from 'antd';
const { Header, Content } = Layout;
//自定义组件
import {collision,layoutCheck} from './collision';
import {compactLayout} from './compact.js';
import { checkInContainer } from './correction';
import MySider from './sider';
import MyFooter from './footer'
import GroupItem from './groupItem.js';

function getGroupIndexByGroupID(groups, groupID){
	let groupIndex;
	_.forEach(groups,(g, index)=>{
		if(g.pk_app_group === groupID){
			groupIndex = index;
			return false;
		}
	});
	return groupIndex;
}

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
				'cuserid': '0001Z5100000000396E0'
			},
			success: (res) => {
				if (res) {
					let { data, success } = res.data;
					if (success && data && data.length > 0) {
						_.forEach(data, (d) => {
							d.type = "group";
						})
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
	//计算container中可以放多少个格子
	calColNum(){
		const { containerWidth, col, containerPadding, margin } = this.state.layout;
	}
	//通过坐标x，y计算所在的单元格
	calGridXY(x, y,width) {
		const { margin, containerWidth, col, rowHeight } = this.state.layout;

		/**坐标转换成格子的时候，无须计算margin */
		//向下取整
		let GridX = Math.floor(x / containerWidth * col)
		let GridY = Math.floor(y / (rowHeight + (margin ? margin[1] : 0)))

		// /**防止元素出container */
		return checkInContainer(GridX, GridY, col, width);
	}
	//拖拽中卡片在组上移动
	moveCardInGroupItem(dragItem, hoverItem, x, y) {
		let { groups } = this.state;
		let groupIndex;
		let removeCardArr = [];
		const tmpCard = {};

		_.forEach(groups, (g, index) => {
			if (g.pk_app_group === hoverItem.id) {
				groupIndex = index;
			}
			const tmpCard = _.remove(g.apps, (a) => {
				return a.pk_appregister === dragItem.id;
			})
			removeCardArr = _.concat(removeCardArr, tmpCard);
		});

		let removeCard;
		if(removeCardArr.length === 0){
			removeCard = {
				pk_appregister: dragItem.id,
				height: 2,
				width: 2,
				name: dragItem.id
			};
		}else{
			removeCard = removeCardArr[0];
		}
		 
		const { GridX, GridY } = this.calGridXY(x, y, removeCard.width);
		removeCard = { ...removeCard, gridx: GridX, gridy: GridY };
		groups[groupIndex].apps.push(removeCard);
		const newlayout = layoutCheck(groups[groupIndex].apps, removeCard, removeCard.pk_appregister, removeCard.pk_appregister);

		const compactedLayout = compactLayout(newlayout, removeCard);
		groups[groupIndex].apps = compactedLayout;
		this.setState({ groups });
	}
	//释放卡片到组
	dropCardToGroupItem(dragItem,dropItem,x,y){
		
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
	//向上移动组
	upGroupItem(groupID){
		let { groups } = this.state;
		const groupIndex = getGroupIndexByGroupID(groups, groupID)
		if(groupIndex === 0){
			return;
		}
		const preGroup = groups[groupIndex-1]; 
		groups[groupIndex-1] = groups[groupIndex];
		groups[groupIndex] = preGroup;
		this.setState({ groups });
	}
	//向下移动组
	downGroupItem(groupID){
		let { groups } = this.state;
		const groupIndex = getGroupIndexByGroupID(groups, groupID)
		if(groupIndex === groups.length-1){
			return;
		}
		const nextGroup = groups[groupIndex + 1]; 
		groups[groupIndex+1] = groups[groupIndex];
		groups[groupIndex] = nextGroup;
		this.setState({ groups });
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
	createGroupItem(pk_app_group, groupname, type, index, length, cards) {
		return <GroupItem key={pk_app_group} id={pk_app_group} groupname={groupname} type={type} index={index} length={length} {...this.state}
			cards={cards}
			layout={this.state.layout}
			defaultLayout = {this.state.defaultLayout}
			currEditID={this.state.currEditID}
			
			resetContainer={this.resetContainer.bind(this)}
			deleteCard={this.deleteCard.bind(this)}
			dropCardToGroupItem={this.dropCardToGroupItem.bind(this)}
			moveCardInGroupItem = {this.moveCardInGroupItem.bind(this)}
			onCheckboxChange = {this.onCheckboxChange.bind(this)}
			
			onDrop={this.onDrop.bind(this)}
			addGroupItem={this.addGroupItem.bind(this)}
			moveGroupItem={this.moveGroupItem.bind(this)}
			changeGroupName={this.changeGroupName.bind(this)}
			cancelGroupName={this.cancelGroupName.bind(this)}
			editGroupItemName={this.editGroupItemName.bind(this)}
			deleteGroupItem={this.deleteGroupItem.bind(this)}
			upGroupItem = {this.upGroupItem.bind(this)}
			downGroupItem = {this.downGroupItem.bind(this)}
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
		// console.log(this.state);
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
			'cuserid': '0001Z5100000000396E0',
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

				<MyFooter {...this.state}
					saveGroupItemAndCard={this.saveGroupItemAndCard.bind(this)}
					onOkMoveDialog={this.onOkMoveDialog.bind(this)}
					deleteSelectedCardArr={this.deleteSelectedCardArr.bind(this)}
				/>
			</Layout>
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
	