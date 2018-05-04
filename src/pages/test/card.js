import React, { Component } from 'react';
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
		console.log(props.groups)
		const dragCard = utilService.getCardByCardID(props.groups, props.id);
		props.updateShadowCard({  ...dragCard, isShadow: true, })
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
	onCheckboxChange(e, id) {
		this.props.onCheckboxChange(e.target.checked, id);
	}
	isChecked(id) {
		if (_.indexOf(this.props.selectCardIDList, id) !== -1) {
			return true;
		} else {
			return false;
		}
	}

	render() {
		const { connectDragSource, connectDropTarget, isDragging, isOver } = this.props;
		const { id, name, gridx, gridy, width, height, isShadow } = this.props;
		const { deleteCard } = this.props;
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
								this.props.deleteCard(id);
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
		groups: state.templateDragData.groups
	}),
	{
		updateShadowCard
	}
)(dragDropItem))
