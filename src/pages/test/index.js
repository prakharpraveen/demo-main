import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeIntlData, saveImg, clearData } from 'Store/home/action';
import _ from 'lodash';
import './index.less';
import { checkInContainer } from './correction';
// drag && drop
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import GroupItem from './groupItem.js';
import { Row, Col ,Icon,Input,Button } from 'antd';
import Ajax from 'Pub/js/ajax';

class Test extends Component {
	constructor(props) {
		super(props);
		this.state = {
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
			}, 
			groups:[
				{
					pk_app_group:"group1",
					groupname:"分组1",
					type: "group",
					cards: [
						{
							pk_appregister: 1,
							type:1,
							gridx:0,
							gridy:0,
							width:1,
							height:1,
							text: 'Write a cool JS library'
						},
						{
							pk_appregister: 2,
							type:1,
							gridx:1,
							gridy:0,
							width:2,
							height:2,
							text: 'Make it generic enough'
						},
						{
							pk_appregister: 3,
							type:1,
							gridx:3,
							gridy:0,
							width:1,
							height:1,
							text: 'Make it generic enough'
						},
						{
							pk_appregister: 4,
							type:1,
							gridx:0,
							gridy:1,
							width:1,
							height:1,
							text: 'Make it generic enough'
						},
						{
							pk_appregister: 5,
							type:1,
							gridx:4,
							gridy:0,
							width:1,
							height:1,
							text: 'Make it generic enough'
						},
						{
							pk_appregister:  10,
							type:1,
							gridx:5,
							gridy:0,
							width:1,
							height:1,
							text: 'Make it generic enough'
						},
						{
							pk_appregister:  11,
							type:1,
							gridx:0,
							gridy:2,
							width:1,
							height:1,
							text: 'Make it generic enough'
						},
						{
							pk_appregister:  12,
							type:1,
							gridx:0,
							gridy:3,
							width:1,
							height:1,
							text: 'Make it generic enough'
						}
					]
				},
				{
					pk_app_group:"group2",
					groupname:"分组2",
					type: "group",
					cards: [{
						pk_appregister: 6,
						type:1,
						gridx:0,
						gridy:0,
						width:1,
						height:1,
						text: 'Make it generic enough'
					},
					{
						pk_appregister: 7,
						type:1,
						gridx:1,
						gridy:0,
						width:1,
						height:1,
						text: 'Make it generic enough'
					}]
				},
				{
					pk_app_group:"group3",
					groupname:"分组3",
					type: "group",
					cards: [{
						pk_appregister: 8,
						type:1,
						gridx:0,
						gridy:0,
						width:1,
						height:1,
						text: 'Make it generic enough'
					},
					{
						pk_appregister: 9,
						type:1,
						gridx:1,
						gridy:0,
						width:1,
						height:1,
						text: 'Make it generic enough'
					}]
				}
			],
			
		 };
	}

	componentWillMount() {
		
	}


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
			for (let j = 0, len2 = groups[i].cards.length; j < len2; j++) {
				let cards = groups[i].cards;
				if (cards[j].pk_appregister === dragItem.id) {
					card = cards[j];
					dragCardIndex = j;
					dragCardFromGroupIndex = i;
				}
			}
		}
		groups[dragCardFromGroupIndex].cards.splice(dragCardIndex, 1);
		groups[dropGroupIndex].cards.push(card);
		this.setState({ groups: groups });

	}

	deleteCard(cardID) {
		let { groups } = this.state;
		let deleteCardIndex;
		_.forEach(groups, function (g, gIndex) {
			_.remove(g.cards, (c) => {
				return c.pk_appregister === cardID
			});
		});
		this.setState({ groups: groups });
	}

	changeGroupItemName(newGroupItemName, groupID) {
		let { groups } = this.state;
		_.forEach(groups, (g) => {
			if (g.pk_app_group === groupID) {
				g.groupname = newGroupItemName;
				return false;
			}
		})
		this.setState({ groups: groups });
	}

	editGroupItemName(groupID) {
		this.setState({ currEditID: groupID });
	}

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
			groupname: `分组(${this.geteAddedGroupItemCount() + 1})`,
			type: "group",
			cards: []
		}
		groups.splice(insertIndex + 1, 0, tmpItem);
		this.setState({ groups: groups });
	}

	geteAddedGroupItemCount() {
		let count = 0;
		_.forEach(this.state.groups, (g) => {
			if (g.pk_app_group.indexOf("newGroupItem") !== -1) {
				count++;
			}
		})
		return count;
	}

	deleteGroupItem(groupID) {
		let { groups } = this.state;
		let deleteIndex;
		_.forEach(groups, (g, i) => {
			if (g.pk_app_group === groupID) {
				deleteIndex = i;
				return false;
			}
		})
		groups.splice(deleteIndex, 1);
		this.setState({ groups: groups });
	}

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

	cancelGroupName() {
		this.setState({ currEditID: "" });
	}

	moveGroupItem(dragIndex, hoverIndex) {
		let { groups } = this.state;
		const dragCard = groups[dragIndex];
		groups.splice(dragIndex, 1);
		groups.splice(hoverIndex, 0, dragCard);
		this.setState({ groups: groups });
	}

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

	dragCardToGroupItem(dragItem,dropItem,x,y){
		const { GridX, GridY } = this.calGridXY(x, y,dragItem.width);
		const { groups } = this.state;

		let targetGropItemIndex;
		let dragCard;
		_.forEach(groups, (g, gIndex) => {
			if (g.pk_app_group === dropItem.id) {
				targetGropItemIndex = gIndex;
			}
		});
		_.forEach(groups, (g, gIndex)=>{
			
			dragCard = _.remove(g.cards, (c) => {
				return c.pk_appregister === dragItem.id;
			})
			if(dragCard.length !== 0){
				return false;
			}
		});
		dragCard[0].gridx = GridX;
		dragCard[0].gridy = GridY;
		// console.log(dragCard[0]);
		groups[targetGropItemIndex].cards.push(dragCard[0]);
		this.setState({ groups: groups });
	}

	createGroupItem(pk_app_group, groupname, type, index, cards) {
		return <GroupItem key={pk_app_group} id={pk_app_group} groupname={groupname} type={type} index={index}
			cards={cards}
			layout={this.state.layout}
			defaultLayout = {this.state.defaultLayout}
			currEditID={this.state.currEditID}
			changeGroupItemName={this.changeGroupItemName.bind(this)}
			onDrop={this.onDrop.bind(this)}
			addGroupItem={this.addGroupItem.bind(this)}
			deleteGroupItem={this.deleteGroupItem.bind(this)}
			editGroupItemName={this.editGroupItemName.bind(this)}
			moveGroupItem={this.moveGroupItem.bind(this)}
			deleteCard={this.deleteCard.bind(this)}
			changeGroupName={this.changeGroupName.bind(this)}
			cancelGroupName={this.cancelGroupName.bind(this)}
			dragCardToGroupItem={this.dragCardToGroupItem.bind(this)}
		/>
	}

	initGroupItem(groups) {
		let itemDoms = [];
		_.forEach(groups, (g, i) => {
			itemDoms.push(
				this.createGroupItem(g.pk_app_group, g.groupname, g.type, i, g.cards)
			);
		});
		return itemDoms;
	}

	/** 计算容器的每一个格子多大 */
	calColWidth() {
		const { containerWidth, col, containerPadding, margin } = this.state.layout;

		if (margin) {
			return (containerWidth - containerPadding[0] * 2 -  margin[0] * (col + 1)) / col
		}
		return (containerWidth - containerPadding[0] * 2 - 0 * (col + 1)) / col
	}

	saveGroupItemAndCard(){
		console.log(this.state);
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
						
		console.log(data);
					}
				}
			}
		});
						let { layout } = this.state;
						const containerDom = document.querySelector("#card-container");
						const clientWidth = containerDom.clientWidth;
						this.state.layout.containerWidth = clientWidth;

						const calWidth = this.calColWidth();

						layout.calWidth = layout.rowHeight = calWidth;
						layout.containerWidth = clientWidth;
						this.setState({ layout, layout })

	}

	render() {
		const { groups, cards } = this.state;
		return (
			<div className='nc-workbench-home-page'>
				<div className='nc-workbench-home-container'>
					{this.initGroupItem(groups)}
				</div>
				<div className="nc-workbench-home-footer">
					<div className="footer-container">
						<Row>
							<Col span={1} offset={20}>
							<Button onClick={this.saveGroupItemAndCard.bind(this)}>保存</Button>
								
							</Col>
							<Col span={1} >
							<Button>取消</Button>
							</Col>
						</Row>
					</div>
				</div>
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
