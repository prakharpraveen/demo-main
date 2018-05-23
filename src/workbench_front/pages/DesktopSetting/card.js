import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import { Icon, Checkbox } from 'antd';
import { connect } from 'react-redux';
import { compactLayout,compactLayoutHorizontal } from './compact.js';
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
		let {groups, groupIndex} = props;
		groups = _.cloneDeep(groups);
		utilService.setPropertyValueForCards(groups, 'isShadow', false);

		// let compactedLayout = compactLayoutHorizontal( groups[groupIndex].apps, props.layout.col);
		// groups[groupIndex].apps = compactedLayout;

		props.updateShadowCard({});
	    props.updateGroupList(groups);
	},
	// isDragging(props, monitor) {
	// 	return props.dragCardID = monitor.getItem().id;
	// }
};

// const noteTarget = {
// 	hover(targetProps, monitor, component) {
// 		return;
// 	},
// 	drop(props, monitor, component) {
// 		//获取结果来判断是否冒泡,有结果时为冒泡
// 		if (!_.isNull(monitor.getDropResult())) {
// 			return;
// 		}
// 		const dragItem = monitor.getItem();
// 		const dropItem = props;
// 		if (dragItem.type === 'group') {
// 			// console.log('group in dropCard');
// 		} else {
// 			// console.log('card in dropCard');
// 		}
// 	}
// };

@DragSource('item', noteSource, (connect)=>({
	connectDragSource: connect.dragSource()
}))

class Item extends Component {
	constructor(props) {
		super(props);
	}
	//依靠前后props中shadowCard状态（前为空对象，后为有对象，）来判断是否为beginDrag状态，来阻止dom刷新，从而使dragLayer不会变化
	shouldComponentUpdate(nextProps, nextState) {
		const thisProps = this.props || {}, thisState = this.state || {};
		// if (_.isEmpty(this.props.shadowCard) && !_.isEmpty(nextProps.shadowCard)) {
		// 	return false;
		// }
		// //拖拽结束
		// if (!_.isEmpty(this.props.shadowCard) && _.isEmpty(nextProps.shadowCard)&& this.props.shadowCard.id === this.props.id) {
		// 	console.log("true")
		// 	return true;
		// }
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
	//删除卡片
	deleteCard=()=> {
		let {groups, groupIndex} = this.props;
		groups = _.cloneDeep(groups);
		utilService.removeCardByGroupIndexAndCardID(groups, groupIndex, this.props.id)

		let compactedLayout = compactLayoutHorizontal( groups[groupIndex].apps,this.props.layout.col);
		// const firstCard = compactedLayout[0];
		// compactedLayout = compactLayout(compactedLayout, firstCard);

		groups[groupIndex].apps = compactedLayout;
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
		const { connectDragSource, groupID, groupIndex, id,index, name, gridx, gridy, width, height, isShadow, isChecked, haspower} = this.props;
		
		const { margin, rowHeight, calWidth } = this.props.layout;
		const { x, y } = utilService.calGridItemPosition(gridx, gridy,margin, rowHeight, calWidth);
		const { wPx, hPx } = utilService.calWHtoPx(width, height,margin, rowHeight, calWidth);
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
			
			const opacity = haspower === false ? 0.6: 1;
			cardDom = (
				<div
					className='card'
					style={{
						width: wPx,
						height: hPx,
						opacity : opacity,
						transform: `translate(${x}px, ${y}px)`,
					}}
				>
					<div style={{ 'paddingLeft': '10px' }}>{name}</div>
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
const dragDropItem = ((Item));

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
)(Item))
