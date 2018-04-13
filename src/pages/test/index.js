import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeIntlData, saveImg, clearData } from 'Store/home/action';
// 工作桌面单页通用布局
import PageLayout from 'Components/PageLayout';
import TabsLink from 'Components/TabsLink';
import './index.less';
// drag && drop
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import GroupItem from './groupItem.js';
import _ from 'lodash';

// ReactDOM.render(<DatePicker />, mountNode);
class Test extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currEditID: "", 
			groups:[
				{
					pk_app_group:"group1",
					groupname:"分组1",
					type: "group",
					cards: [
						{
							pk_appregister: 1,
							type:1,
							GridX:0,
							GridY:0,
							w:1,
							h:1,
							text: 'Write a cool JS library'
						},
						{
							pk_appregister: 2,
							type:1,
							GridX:1,
							GridY:0,
							w:2,
							h:2,
							text: 'Make it generic enough'
						},
						{
							pk_appregister: 3,
							type:1,
							GridX:3,
							GridY:0,
							w:1,
							h:1,
							text: 'Make it generic enough'
						},
						{
							pk_appregister: 4,
							type:1,
							GridX:0,
							GridY:1,
							w:1,
							h:1,
							text: 'Make it generic enough'
						},
						{
							pk_appregister: 5,
							type:1,
							GridX:4,
							GridY:0,
							w:1,
							h:1,
							text: 'Make it generic enough'
						},
					]
				},
				{
					pk_app_group:"group2",
					groupname:"分组2",
					type: "group",
					cards: [{
						pk_appregister: 6,
						type:1,
						GridX:0,
						GridY:0,
						w:1,
						h:1,
						text: 'Make it generic enough'
					},
					{
						pk_appregister: 7,
						type:1,
						GridX:1,
						GridY:0,
						w:1,
						h:1,
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
						GridX:0,
						GridY:0,
						w:1,
						h:1,
						text: 'Make it generic enough'
					},
					{
						pk_appregister: 9,
						type:1,
						GridX:1,
						GridY:0,
						w:1,
						h:1,
						text: 'Make it generic enough'
					}]
				}
			],
			
		 };
	}

	onDrop(dragItem, dropItem){
		if(dragItem.type === dropItem.type){
			return;
		}
		let { groups } = this.state;
		let card;
		let dropGroupIndex,dragCardIndex,dragCardFromGroupIndex;
		for(let i = 0, len = groups.length; i< len; i++){
			if(groups[i].pk_app_group === dropItem.id){
				dropGroupIndex = i;
			}
			for(let j=0, len2 =groups[i].cards.length; j<len2;j++){
				let cards = groups[i].cards;
				if(cards[j].pk_appregister === dragItem.id){
					card = cards[j];
					dragCardIndex = j;
					dragCardFromGroupIndex = i;
				}
			}
		}
		groups[dragCardFromGroupIndex].cards.splice(dragCardIndex,1);
		groups[dropGroupIndex].cards.push(card);
		this.setState({groups: groups});

	}
	
	deleteCard(cardID){
		console.log(this);
		let { groups } = this.state;
		let deleteCardIndex;
		_.forEach(groups,function(g,gIndex){
			_.remove(g.cards,(c)=>{
				return c.pk_appregister === cardID
			});
		});
		this.setState({groups: groups});
	}

	changeGroupItemName(newGroupItemName, groupID){
		let { groups } = this.state;
		_.forEach(groups, (g)=>{
			if(g.pk_app_group === groupID){
				g.groupname = newGroupItemName;
				return false;
			}
		})
		this.setState({groups: groups});
	}

	editGroupItemName(groupID){
		this.setState({currEditID: groupID});
	}

	addGroupItem(groupID){
		let { groups } = this.state;
		let insertIndex;
		_.forEach(groups,(g,i)=>{
			if(g.pk_app_group === groupID){
				insertIndex = i;
				return false;
			}
		})
		const tmpItem ={
			pk_app_group:"newGroupItem"+ new Date().getTime(),
			groupname: `分组(${insertIndex+1})`,
		    type: "group",
		}
		groups.splice(insertIndex+1,0,tmpItem);
		this.setState({groups: groups});
	}

	deleteGroupItem(groupID){
		let { groups } = this.state;
		let deleteIndex;
		_.forEach(groups, (g,i)=>{
			if(g.pk_app_group === groupID){
				deleteIndex = i;
				return false;
			}
		})
		groups.splice(deleteIndex,1);
		this.setState({groups: groups});
	}

	changeGroupName(groupID, groupName){
		let { groups } = this.state;
		_.forEach(groups,(g,i)=>{
			if(g.pk_app_group === groupID){
				g.groupname = groupName;
				return false;
			}
		});
		this.setState({groups: groups,currEditID:""});
		console.log(this.state);
	}

	cancelGroupName(){
		this.setState({currEditID: ""});
	}

	moveGroupItem(dragIndex, hoverIndex) {
		let { groups } = this.state;
		const dragCard = groups[dragIndex];
		groups.splice(dragIndex,1);
		groups.splice(hoverIndex,0,dragCard);
		this.setState({groups: groups});
	}

	createGroupItem(pk_app_group,groupname,type,index,cards){
		return <GroupItem  key={pk_app_group} id={pk_app_group} groupname={groupname} type={type} index={index}
			cards={cards}
			 currEditID={this.state.currEditID}   
			 changeGroupItemName = {this.changeGroupItemName.bind(this)}
			 onDrop={this.onDrop.bind(this)}
			 addGroupItem={this.addGroupItem.bind(this)}
			 deleteGroupItem = {this.deleteGroupItem.bind(this)}
			 editGroupItemName = {this.editGroupItemName.bind(this)}
			  moveGroupItem ={this.moveGroupItem.bind(this)} 
			  deleteCard={this.deleteCard.bind(this)}
			  changeGroupName={this.changeGroupName.bind(this)}
			  cancelGroupName={this.cancelGroupName.bind(this)}
			  />
	}

	initGroupItem(groups){
		let itemDoms = [];
		_.forEach(groups,(g,i)=>{
		 itemDoms.push(
			this.createGroupItem(g.pk_app_group,g.groupname,g.type,i,g.cards)
			//  <GroupItem  key={g.pk_app_group} id={g.pk_app_group} groupname={g.groupname} type={g.type} index={i} currEditID={this.state.currEditID}  cards={g.cards} 
			//  changeGroupItemName = {this.changeGroupItemName.bind(this)}
			//  onDrop={this.onDrop.bind(this)}
			//  addGroupItem={this.addGroupItem.bind(this)}
			//  deleteGroupItem = {this.deleteGroupItem.bind(this)}
			//  editGroupItemName = {this.editGroupItemName.bind(this)}
			//   moveGroupItem ={this.moveGroupItem.bind(this)} 
			//   deleteCard={this.deleteCard.bind(this)}
			//   changeGroupName={this.changeGroupName.bind(this)}
			//   cancelGroupName={this.cancelGroupName.bind(this)}
			//   />
		 );
		});
		return itemDoms;
	}

	render() {
		const {groups,cards} = this.state;
		return (
			<div className='nc-workbench-home-page'>
				<div className='nc-workbench-home-container'>
			 {this.initGroupItem(groups)}
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
