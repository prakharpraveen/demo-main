import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import { Icon, Checkbox } from 'antd';

const noteSource = {
	beginDrag(props, monitor, component) {
		return {id: props.id, isNewCard: true} ;
	}
};

function collectSource(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	};
}

class Item extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { connectDragSource } = this.props;
		const { id, name } = this.props;
		return connectDragSource(
				<div className='list-item-content' >
					<div style={{ 'padding-left': '10px' }}>{name}</div>
					<div />
					<div className='card-footer'>
						<Checkbox
						/>
					</div>
				</div>
		);
	}
}

export default (DragSource('item', noteSource, collectSource)(Item));
