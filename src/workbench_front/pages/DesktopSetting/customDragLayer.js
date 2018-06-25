import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import CardListDragPreview from './cardListDragPreview';
let resizeWaiter = false;

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
					return <CardListDragPreview cardListLength={item.cardList.length} />;
				} else {
					return null;
				}

			default:
				return null;
		}
	}

	componentWillUnmount() {
		cancelAnimationFrame(this.requestedFrame);
	}

	getMyItemStyles() {
		requestAnimationFrame(this.getItemStyles);
	}

	getItemStyles = () => {
		const { clientOffset } = this.props;

		if (!clientOffset) {
			return {
				display: 'none'
			};
		}
		let { x, y } = clientOffset;
		// console.log(clientOffset);
		const transform = `translate(${x}px, ${y}px)`;
		// this.requestedFrame = null
		return {
			transform,
			WebkitTransform: transform
		};
	};

	shouldComponentUpdate(nextProps, nextState) {
		const thisProps = this.props || {},
			thisState = this.state || {};
		if (this.props.isDragging !== nextProps.isDragging) {
			return true;
		}
		if (this.props.clientOffset !== nextProps.clientOffset) {
			return true;
		}
		return false;
	}
	render() {
		const { item, itemType, isDragging } = this.props;
		if (!isDragging || item.type !== 'cardlist') {
			return null;
		}
		// console.log('render');
		return (
			<div className='desk-setting-layer'>
				<div style={this.getItemStyles()}>{this.renderItem(itemType, item)}</div>
			</div>
		);
	}
}
