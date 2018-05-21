import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import { Checkbox } from 'antd';
import { connect } from 'react-redux';
import { updateShadowCard } from 'Store/test/action';
import * as utilService from './utilService';
const noteSource = {
	beginDrag(props, monitor, component) {
		console.log(props);
		const dragCard = {
			pk_appregister: props.id,
			width: props.width,
			height: props.height,
			name: props.id,
			isShadow: true,
			isChecked:false
		};
		props.updateShadowCard(dragCard)
		return { id: dragCard.pk_appregister,};
	},
	endDrag(props, monitor, component) {

		let groups = props.groups;
		utilService.setPropertyValueForCards(groups, 'isShadow', false);
		props.updateShadowCard({})
	},
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

	onChangeChecked=(e)=>{
		const { index, parentIndex } = this.props;
		this.props.onChangeChecked(e,parentIndex,index);
	}

	render() {
		const { connectDragSource } = this.props;
        const { id,index, name, checked, parentIndex } = this.props;
		return connectDragSource(
			<div className='list-item-content' >
				<div className='title'>
					<span>{name}</span>
                    <Checkbox checked={checked}  onChange={this.onChangeChecked}/>
				</div>
			</div>
		);
	}
}

const dragDropItem = DragSource('item', noteSource, collectSource)(Item);

export default (connect(
	(state) => ({
		groups: state.templateDragData.groups
	}),
	{
		updateShadowCard
	}
)(dragDropItem))
