import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import { Icon, Checkbox } from 'antd';
import { connect } from 'react-redux';
import { updateShadowCard, updateGroupList,updateSelectCardInGroupObj } from 'Store/test/action';
import * as utilService from './utilService';
import _ from 'lodash';
const noteSource = {
	beginDrag(props, monitor, component) {
		//开始抓取时，将该卡片从selectCardInGroupObj删除
		let {selectCardInGroupObj} = props;
		selectCardInGroupObj = _.cloneDeep(selectCardInGroupObj);
		utilService.removeCardIDInSelectCardInGroupObj(selectCardInGroupObj,props.groupID,props.id)
		props.updateSelectCardInGroupObj(selectCardInGroupObj);
		//
		const dragCard = utilService.getCardByGroupIDAndCardID(props.groups, props.groupID,  props.id);
		dragCard.isShadow = true;
		props.updateShadowCard(dragCard);

		return {id: props.id, type: props.type} ;
	},
	endDrag(props, monitor, component) {
		// props.dragCardID = -1;
		let groups = props.groups;
		groups = _.cloneDeep(groups);
		utilService.setIsShadowForCards(groups, false);
		props.updateGroupList(groups);
		props.updateShadowCard({});
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
	//依靠前后props中shadowCard状态（前为空对象，后为有对象，）来判断是否为beginDrag状态，来阻止dom刷新，从而使dragLayer不会变化
	shouldComponentUpdate(nextProps, nextState) {
		if (_.isEmpty(this.props.shadowCard) && !_.isEmpty(nextProps.shadowCard)) {
			return false;
		}
		return true;
	}
	//依靠前后props的isOver来判断enter和leave，但是不好用，enter检测不精准
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
	//给予一个grid的位置，算出元素具体的在容器中位置在哪里，单位是px
	calGridItemPosition(gridx, gridy) {
		const { margin, rowHeight, calWidth } = this.props.layout;

		const x = Math.round(gridx * calWidth + margin[0] * (gridx + 1));
		const y = Math.round(gridy * rowHeight + margin[1] * (gridy + 1));

		return {
			x: x,
			y: y
		};
	}
	//宽和高计算成为px
	calWHtoPx(w, h) {
		const { margin, calWidth, rowHeight } = this.props.layout;
		const wPx = Math.round(w * calWidth + (w - 1) * margin[0]);
		const hPx = Math.round(h * rowHeight + (h - 1) * margin[1]);
		return { wPx, hPx };
	}
	//删除卡片
	deleteCard(cardID, groupID) {
		let {groups, selectCardInGroupObj} = this.props;
		groups = _.cloneDeep(groups);
		selectCardInGroupObj = _.cloneDeep(selectCardInGroupObj);

		utilService.removeCardByGroupIDAndCardID(groups, groupID, cardID)
		utilService.removeCardIDInSelectCardInGroupObj(selectCardInGroupObj,groupID,cardID)

		this.props.updateGroupList(groups);
		this.props.updateSelectCardInGroupObj(selectCardInGroupObj);
	}
	//
	onCheckboxChange(e, cardID) {
		const groupID = this.props.groupID;
		const checked = e.target.checked;
		let selectCardInGroupObj = this.props.selectCardInGroupObj;
		selectCardInGroupObj = _.cloneDeep(selectCardInGroupObj);
		if(checked){
			if(!selectCardInGroupObj[groupID]){
				selectCardInGroupObj[groupID]= [];
			}
			selectCardInGroupObj[groupID].push(cardID);
		}else{
			utilService.removeCardIDInSelectCardInGroupObj(selectCardInGroupObj,groupID,cardID)
		}
		this.props.updateSelectCardInGroupObj(selectCardInGroupObj);
	}
	isChecked(id) {
		const groupID = this.props.groupID;
		if (_.indexOf(this.props.selectCardInGroupObj[groupID], id) !== -1) {
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
		console.log('card')
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
		selectCardInGroupObj: state.templateDragData.selectCardInGroupObj,
		shadowCard: state.templateDragData.shadowCard,
        layout: state.templateDragData.layout,
	}),
	{
		updateShadowCard,
		updateGroupList,
		updateSelectCardInGroupObj
	}
)(dragDropItem))
