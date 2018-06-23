import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import CardListDragPreview from './cardListDragPreview'
function getItemStyles(props) {
	const { clientOffset } = props;
	if (!clientOffset) {
		return {
			display: 'none'
		};
	}

	let { x, y } = clientOffset;

	const transform = `translate(${x}px, ${y}px)`;
	return {
		transform,
		WebkitTransform: transform
	};
}

@DragLayer((monitor) => ({
	item: monitor.getItem(),
	itemType: monitor.getItemType(),
	currentOffset: monitor.getSourceClientOffset(),
	clientOffset: monitor.getClientOffset(),
	isDragging: monitor.isDragging()
}))
export default class CustomDragLayer extends Component {
    constructor(props) {
		super(props);
	}
	renderItem(type, item) {
		switch (type) {
			case 'item':
				if (item.cardList) {
                    return <CardListDragPreview  cardListLength = {item.cardList.length}/>
				} else {
					return null;
				}
                
			default:
				return null;
		}
	}
	// shouldComponentUpdate(nextProps, nextState) {
	// 	const thisProps = this.props || {},
    //         thisState = this.state || {};
	// 	if (this.props.isDragging !== nextProps.isDragging) {
	// 		return true;
	// 	}
	// 	if (this.props.currentOffset !== nextProps.currentOffset) {
	// 		return true;
	// 	}
	// 	return false;
	// }
	render() {
		const { item, itemType, isDragging } = this.props;
		if (!isDragging || item.type !== 'cardlist') {
			return null;
		}
        console.log("render")
		return (
			<div className='desk-setting-layer'>
				<div style={getItemStyles(this.props)}>{this.renderItem(itemType, item)}</div>
			</div>
		);
	}
}
