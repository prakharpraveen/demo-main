import { DragSource, DropTarget } from 'react-dnd';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
/**
 * 工作桌面 配置模板区域
 */
const cardSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index
		};
	},
	isDragging(props, monitor) {
		// If your component gets unmounted while dragged
		// (like a card in Kanban board dragged between lists)
		// you can implement something like this to keep its
		// appearance dragged:
		return monitor.getItem().id === props.id;
	  },
};

const cardTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return;
		}

		// // Determine rectangle on screen
		// const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

		// // Get vertical middle
		// const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

		// // Determine mouse position
		// const clientOffset = monitor.getClientOffset();

		// // Get pixels to the top
		// const hoverClientY = clientOffset.y - hoverBoundingRect.top;

		// // Only perform the move when the mouse has crossed half of the items height
		// // When dragging downwards, only move when the cursor is below 50%
		// // When dragging upwards, only move when the cursor is above 50%

		// // Dragging downwards
		// if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
		// 	return;
		// }

		// // Dragging upwards
		// if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
		// 	return;
		// }

		// Time to actually perform the action
		props.moveCard(dragIndex, hoverIndex);

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex;
	}
};

@DropTarget('card', cardTarget, (connect) => ({
	connectDropTarget: connect.dropTarget()
}))
@DragSource('card', cardSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging()
}))
class MyCard extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	deleteCard = (e) => {
		e.stopPropagation();
		this.props.deleteCard(this.props.index);
	};

	selectThisCard=()=>{
		this.props.selectThisCard(this.props.index);
	}

	render() {
		const { index, name, id, key,selectCard, areaid, isDragging, connectDragSource, connectDropTarget } = this.props;
		const opacity = isDragging ? 0 : 1;
		return connectDragSource(
			connectDropTarget(
				<li className='property-item' style={{ opacity: opacity }} onClick={this.selectThisCard}>
					<div className={selectCard.pk_query_property=== id && selectCard.areaid === areaid ?'select-card':'normal-card'}>
						{name}
						<span className='delete-card' onClick={this.deleteCard}>
							x
						</span>
					</div>
				</li>
			)
		);
	}
}
export default connect((state) => ({
	selectCard: state.zoneSettingData.selectCard
}), {})(MyCard);
