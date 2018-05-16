import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import { Icon, Checkbox } from 'antd';
import { connect } from 'react-redux';
import { updateShadowCard, updateGroupList } from 'Store/test/action';
import * as utilService from './utilService';
import _ from 'lodash';
const noteSource = {
	beginDrag(props, monitor, component) {
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
		utilService.setPropertyValueForCards(groups, 'isShadow', false);
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

class Item extends PureComponent {
	constructor(props) {
		super(props);
	}
	//依靠前后props中shadowCard状态（前为空对象，后为有对象，）来判断是否为beginDrag状态，来阻止dom刷新，从而使dragLayer不会变化
	shouldComponentUpdate(nextProps, nextState) {
		const thisProps = this.props || {}, thisState = this.state || {};
		if (_.isEmpty(this.props.shadowCard) && !_.isEmpty(nextProps.shadowCard)) {
			return false;
		}
		if(this.props.isChecked !== nextProps.isChecked){
			return true;
		}
		if(this.props.layout !== nextProps.layout){
			return true
		}
		if(this.props.gridx !== nextProps.gridx || this.props.gridy !== nextProps.gridy){
			return true
		}
		if(this.props.isShadow !== nextProps.isShadow){
			return true
		}
		return false;
		// return true;
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
	deleteCard=()=> {
		let {groups, groupIndex} = this.props;
		groups = _.cloneDeep(groups);
		utilService.removeCardByGroupIndexAndCardID(groups, groupIndex, this.props.id)
		this.props.updateGroupList(groups);
	}
	//
	onCheckboxChange=(e) =>{
		console.log(e.target.checked);
		let {groups,groupIndex, index} = this.props;
		groups = _.cloneDeep(groups);
		const cardID = this.props.id;
		const checked = e.target.checked;
		groups[groupIndex].apps[index].isChecked = checked
		this.props.updateGroupList(groups);
	}
	render() {
		const { connectDragSource, isDragging, groupID, groupIndex, id,index, name, gridx, gridy, width, height, isShadow, isChecked} = this.props;
		const { x, y } = this.calGridItemPosition(gridx, gridy);
		const { wPx, hPx } = this.calWHtoPx(width, height);
		// console.log(name)
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
						transform: `translate(${x}px, ${y}px)`,
						
					}}
				>
					<div style={{ 'padding-left': '10px' }}>{id}</div>
					<div />
					<div className='card-footer'>
						<Checkbox
							checked={isChecked}
							onChange={this.onCheckboxChange}
						/>
						<Icon
							type='delete'
							className='card-delete'
							onClick={this.deleteCard}
						/>
					</div>
				</div>
			)
		}
		// return connectDragSource(
		// 	connectDropTarget(
		// 		cardDom
		// 	)
		// );
		return connectDragSource(
				cardDom
		);
	}
}

// const dragDropItem = DropTarget('item', noteTarget, collectTarget)(DragSource('item', noteSource, collectSource)(Item));
const dragDropItem = (DragSource('item', noteSource, collectSource)(Item));

export default (connect(
	(state) => ({
		groups: state.templateDragData.groups,
		shadowCard: state.templateDragData.shadowCard,
        layout: state.templateDragData.layout,
	}),
	{
		updateShadowCard,
		updateGroupList,
	}
)(dragDropItem))
