import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource ,DropTarget} from 'react-dnd';
import { findDOMNode } from 'react-dom'
import { Card,Icon } from 'antd';

const defaultWidth = 175;
const LAYOUTARG = {
	cols: 6,
	rowWidth:  defaultWidth,
	rowHeight: defaultWidth,
	marginPx: 10
};

const noteSource = {
  	beginDrag(props, monitor, component) {
    	return {id:props.id, type:props.type};
	},
	endDrag(props, monitor, component){
		// console.log('getInitialClientOffset',monitor.getInitialClientOffset());
		// console.log('getInitialSourceClientOffset',monitor.getInitialSourceClientOffset());
		// console.log('getClientOffset',monitor.getClientOffset());
		// console.log('getDifferenceFromInitialOffset',monitor.getDifferenceFromInitialOffset());
		// console.log('getSourceClientOffset',monitor.getSourceClientOffset());
		
	}
};

const noteTarget = {
  hover(targetProps, monitor,component) {
		const sourceProps = monitor.getItem();
		const sourceID = sourceProps.id;
		const targetID = targetProps.id;
		if(sourceID == targetID){
			return;

		}
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

		// Determine mouse position
		const clientOffset = monitor.getClientOffset()

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top
		const xGap = hoverBoundingRect.left-clientOffset.x;
		console.log(xGap);
		// console.log('sourceProps',sourceProps);
		// console.log('targetProps',targetProps);
		// console.log(sourceProps.id);

    // console.log('dragging note', sourceProps, targetProps,monitor,component);
  }
};

function collectSource(connect,monitor){
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	} 
}

function collectTarget(connect,monitor){
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver()
	}
}

class Item extends Component {
	componentWillReceiveProps(nextProps) {
    if (!this.props.isOver && nextProps.isOver) {
			// You can use this as enter handler
			console.log("enter");
    }

    if (this.props.isOver && !nextProps.isOver) {
			// You can use this as leave handler
			console.log("leave");
    }
  }

//   deleteCard(cardID){
// 	  this.props.deleteCard(cardID);
//   }


  render() {
		const {
			connectDragSource,
			connectDropTarget,
			isDragging,
			isOver
	} = this.props;
		const {id,GridX,GridY,w,h}=this.props;
		const {deleteCard} = this.props;
		return connectDragSource(connectDropTarget(
			<div style={{
				width: w * LAYOUTARG.rowWidth + (w - 1)*LAYOUTARG.marginPx,
				height: h * LAYOUTARG.rowHeight + (h - 1)*LAYOUTARG.marginPx,
				background: isOver ? '#000' : '#fff',
				position: 'absolute',
				border: '1px solid #f1f1f1',
				'border-radius': '3px',
				transform: `translate(${GridX * LAYOUTARG.rowWidth +  (GridX + 1) *LAYOUTARG.marginPx}px, ${GridY * LAYOUTARG.rowHeight + (GridY + 1) *LAYOUTARG.marginPx}px)`,
				opacity: isDragging ? 0 : 1,
			}}>
			<div style={{'padding-left':'10px'}}>{id}</div>
			<div></div>
			<div style={{position:'absolute',height: '35px',width: '100%',padding:'7px 8px',bottom:'0',background:'#f2f2f2'}}>
			<Icon type="delete" style={{fontSize:19, float:'right','line-height':21, cursor:'pointer'}} onClick={()=>{this.props.deleteCard(id)}} />
			</div>
			</div>
			
		)
			
		)
  }
}

export default DropTarget('item',noteTarget,collectTarget)(DragSource('item',noteSource,collectSource)(Item));