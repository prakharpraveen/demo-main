import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource ,DropTarget} from 'react-dnd';
import { findDOMNode } from 'react-dom'
import { Card,Icon } from 'antd';

const noteSource = {
  	beginDrag(props, monitor, component) {
    	return {id:props.id, type:props.type, width:props.w};
	},
	endDrag(props, monitor, component){
		// console.log('getInitialClientOffset',monitor.getInitialClientOffset());
		// console.log('getInitialSourceClientOffset',monitor.getInitialSourceClientOffset());
		// console.log('getClientOffset',monitor.getClientOffset());
		// console.log('getDifferenceFromInitialOffset',monitor.getDifferenceFromInitialOffset());
		// console.log('getSourceClientOffset',monitor.getSourceClientOffset());
		
	},
    isDragging(props, monitor){
		props.drag233 = monitor.getItem().id;
        // console.log(monitor.getItem(),new Date())
	},
	endDrag(props, monitor, component){
		
	}
};

const noteTarget = {
  hover(targetProps, monitor,component) {
	//   console.log("hoverCard");
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
		// console.log(xGap);
		// console.log('sourceProps',sourceProps);
		// console.log('targetProps',targetProps);
		// console.log(sourceProps.id);

    // console.log('dragging note', sourceProps, targetProps,monitor,component);
  },
  drop(props, monitor, component){
	//获取结果来判断是否冒泡,有结果时为冒泡
	if(!_.isNull(monitor.getDropResult())){
		return;
	}
	const dragItem = monitor.getItem();
	const dropItem = props;
	if(dragItem.type==="group"){
		console.log("group in dropCard");
	}else{
		console.log("card in dropCard");
	}
	
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
	constructor(props) {
		super(props);
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.isOver && nextProps.isOver) {
			// You can use this as enter handler
			console.log("card enter");
		}

		if (this.props.isOver && !nextProps.isOver) {
			// You can use this as leave handler
			console.log("card leave");
		}
	}
	// /** 计算容器的每一个格子多大 */
	// calColWidth() {
	// 	const { containerWidth, col, containerPadding, margin } = this.props;

	// 	if (margin) {
	// 		return (containerWidth - containerPadding[0] * 2 -  margin[0] * (col + 1)) / col
	// 	}
	// 	return (containerWidth - containerPadding[0] * 2 - 0 * (col + 1)) / col
	// }

	/**给予一个grid的位置，算出元素具体的在容器中位置在哪里，单位是px */
    calGridItemPosition(gridx, gridy) {
        var { margin, rowHeight,calWidth } = this.props;

        if (!margin) margin = [0, 0];

        let x = Math.round(gridx * calWidth + margin[0] *(gridx + 1) )
        let y = Math.round(gridy * rowHeight + margin[1] * (gridy + 1))

        return {
            x: x,
            y: y
        }
	}
	
	/**宽和高计算成为px */
	calWHtoPx(w,h) {
		const { margin,calWidth } = this.props;
		const wPx = Math.round(w * calWidth + (w - 1) * margin[0]);
		// const hPx = Math.round(h * this.props.rowHeight + (h - 1) * margin[1])
		const hPx = wPx;
		return { wPx, hPx }
	}

  render() {
	  const { connectDragSource, connectDropTarget, isDragging, isOver } = this.props;
	  const { id, gridx, gridy, w, h } = this.props;
	  const { deleteCard } = this.props;
	  const { x, y } = this.calGridItemPosition(gridx, gridy);
	  const { wPx, hPx } = this.calWHtoPx(w, h);
	//   console.log(isOver);
	// console.log(x,y,wPx, hPx,this.props);
	// console.log(tmpContainer);
	  return connectDragSource(connectDropTarget(
		  <div className="card" style={{
			  width: wPx,
			  height: hPx,
			  background: isOver ? '#ccc' : '#fff',
			  position: 'absolute',
			  border: '1px solid #f1f1f1',
			  'border-radius': '3px',
			  transform: `translate(${x}px, ${y}px)`,
			  opacity: this.props.drag233 === id ? 0 : 1,
		  }}>
			  <div style={{ 'padding-left': '10px' }}>{id}</div>
			  <div></div>
			  <div className="card-footer">
				  <Icon type="delete" className="card-delete" onClick={() => { this.props.deleteCard(id) }} />
			  </div>
		  </div>
			
		)
			
		)
  }
}

export default DropTarget('item',noteTarget,collectTarget)(DragSource('item',noteSource,collectSource)(Item));