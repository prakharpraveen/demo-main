import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import { Icon, Checkbox } from 'antd';
import { connect } from 'react-redux';
import { updateShadowCard, updateGroupList, updateSelectCardIDList } from 'Store/test/action';
import * as utilService from './utilService';
import _ from 'lodash';
const noteSource = {
	beginDrag(props, monitor, component) {
		
		// let dragCard = utilService.getCardByGroupIDAndCardID(props.groups, props.groupID,  props.id);
		// dragCard.isShadow = true;
		// groups[sourceGroupIndex].apps.push(shadowCard);
		// props.updateShadowCard(dragCard)
		// props.updateGroupList(groups)


		// let groups =  _.cloneDeep(props.groups) ;
		const dragCard = utilService.getCardByGroupIDAndCardID(props.groups, props.groupID,  props.id);
		dragCard.isShadow = true;
		props.updateShadowCard(dragCard);
		return {id: props.id, type: props.type} ;
	},
	endDrag(props, monitor, component) {
		// props.dragCardID = -1;
		let groups = props.groups;
		utilService.setIsShadowForCards(groups, false);
		props.updateShadowCard({})
	},
	isDragging(props, monitor) {
		// return props.dragCardID = monitor.getItem().id;
	}
};

const noteTarget = {
	hover(targetProps, monitor, component) {
		return;
	},
	drop(props, monitor, component) {
		//获取结果来判断是否冒泡,有结果时为冒泡
		if (!_.isNull(monitor.getDropResult())) {
			return;
		}
		const dragItem = monitor.getItem();
		const dropItem = props;
		if (dragItem.type === 'group') {
			// console.log('group in dropCard');
		} else {
			// console.log('card in dropCard');
		}
	}
};

function collectSource(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	};
}

function collectTarget(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver()
	};
}

class Item extends Component {
	constructor(props) {
		super(props);
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.isOver && nextProps.isOver) {
			// You can use this as enter handler
			// console.log('card enter');
		}

		if (this.props.isOver && !nextProps.isOver) {
			// You can use this as leave handler
			// console.log('card leave');

		}
	}
	//删除卡片
	deleteCard(cardID, groupID) {
		let {groups, selectCardIDList} = this.props;
		groups = _.cloneDeep(groups);
		selectCardIDList = _.cloneDeep(groups);

		utilService.removeCardByGroupIDAndCardID(groups, groupID, cardID)
		_.remove(selectCardIDList,(d)=>{
			return d === cardID;
		});
		this.props.updateGroupList(groups);
		this.props.updateSelectCardIDList(selectCardIDList);
	}
	/**给予一个grid的位置，算出元素具体的在容器中位置在哪里，单位是px */
	calGridItemPosition(gridx, gridy) {
		var { margin, rowHeight, calWidth } = this.props;

		if (!margin) margin = [ 0, 0 ];

		let x = Math.round(gridx * calWidth + margin[0] * (gridx + 1));
		let y = Math.round(gridy * rowHeight + margin[1] * (gridy + 1));

		return {
			x: x,
			y: y
		};
	}
	/**宽和高计算成为px */
	calWHtoPx(w, h) {
		const { margin, calWidth, rowHeight } = this.props;
		const wPx = Math.round(w * calWidth + (w - 1) * margin[0]);
		const hPx = Math.round(h * rowHeight + (h - 1) * margin[1]);
		return { wPx, hPx };
	}
	//
	onCheckboxChange(e, cardID) {
		const checked = e.target.checked;
		let selectCardIDList = this.props.selectCardIDList;
		selectCardIDList = _.cloneDeep(selectCardIDList);
		if (checked) {
			selectCardIDList.push(cardID)
		} else {
			_.remove(selectCardIDList, (s) => {
				return s === cardID;
			})
		}
		this.props.updateSelectCardIDList(selectCardIDList);
	}
	isChecked(id) {
		if (_.indexOf(this.props.selectCardIDList, id) !== -1) {
			return true;
		} else {
			return false;
		}
	}

	render() {
		const { connectDragSource, connectDropTarget, isDragging, isOver, groupID } = this.props;
		const { id, name, gridx, gridy, width, height, isShadow } = this.props;
		const { x, y } = this.calGridItemPosition(gridx, gridy);
		const { wPx, hPx } = this.calWHtoPx(width, height);
		let cardDom;

		// if (isDragging && this.props.dragCardID === id) {
		// 	return null;
		// }

		if(isShadow){
			cardDom = (	<div
					className='card-shadow'
					style={{
						width: wPx,
						height: hPx,
						transform: `translate(${x}px, ${y}px)`,
						
					}}
				>
				</div>
			)
		}else{
			cardDom = (
				<div
					className='card'
					style={{
						width: wPx,
						height: hPx,
						background: '#fff',
						transform: `translate(${x}px, ${y}px)`,
						
					}}
				>
					<div style={{ 'padding-left': '10px' }}>{id}</div>
					<div />
					<div className='card-footer'>
						<Checkbox
							checked={this.isChecked(id)}
							onChange={(e) => {
								this.onCheckboxChange(e, id);
							}}
						/>
						<Icon
							type='delete'
							className='card-delete'
							onClick={() => {
								this.deleteCard(id, groupID);
							}}
						/>
					</div>
				</div>
			)
		}
		return connectDragSource(
			connectDropTarget(
				cardDom
			)
		);
	}
}

const dragDropItem = DropTarget('item', noteTarget, collectTarget)(DragSource('item', noteSource, collectSource)(Item));

export default (connect(
	(state) => ({
		groups: state.templateDragData.groups,
		selectCardIDList: state.templateDragData.selectCardIDList
	}),
	{
		updateShadowCard,
		updateGroupList,
		updateSelectCardIDList
	}
)(dragDropItem))
