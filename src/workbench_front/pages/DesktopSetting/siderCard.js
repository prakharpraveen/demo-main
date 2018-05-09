import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import { Checkbox } from 'antd';
import image_src from '../../assets/images/img1.png';
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
		};
		props.updateShadowCard({  ...dragCard,"isShadow": true, })
		return { id: dragCard.pk_appregister,};
	},
	endDrag(props, monitor, component) {

		let groups = props.groups;
		utilService.setIsShadowForCards(groups, false);
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

	render() {
		const { connectDragSource } = this.props;
        const { id,index, name, checked, parentIndex } = this.props;
		return connectDragSource(
			<div className='list-item-content' >
				<div className='title'>
					<span>{name}</span>
                    <Checkbox checked={checked}  onChange={(e)=>{this.props.onChangeChecked(e,parentIndex,index)}}/>
				</div>
                <div className="img" style={{ background: `url(${image_src}) no-repeat 0px 0px`, 'background-size': 'contain' }}>
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
