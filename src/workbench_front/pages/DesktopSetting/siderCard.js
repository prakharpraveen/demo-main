import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import { Checkbox } from 'antd';
import { connect } from 'react-redux';
import { updateGroupList } from 'Store/test/action';
import * as utilService from './utilService';
const noteSource = {
	beginDrag(props, monitor, component) {
		let cardList = [
			{
				pk_appregister: props.id,
				width: props.width,
				height: props.height,
				name: props.name,
				isShadow: false,
				isChecked: false,
				gridx: 999,
				gridy: 999
			}
		];
		let { appGroupArr } = props;
		let checkedAppList = [];
		_.forEach(appGroupArr, (a) => {
			_.forEach(a.children, (c) => {
				if (c.checked) {
					checkedAppList.push({
						pk_appregister: c.value,
						width: c.width,
						height: c.height,
						name: c.label,
						isShadow: false,
						isChecked: false,
						gridx: 999,
						gridy: 999
					});
				}
			});
		});
		cardList = cardList.concat(checkedAppList);
		return { type: 'cardlist', cardList: cardList };
	},
	endDrag(props, monitor, component) {
		//Drop成功
		if (monitor.didDrop()) {
			let { appGroupArr } = props;
			appGroupArr = _.cloneDeep(appGroupArr);
			let checkedAppList = [];
			_.forEach(appGroupArr, (a) => {
				_.forEach(a.children, (c) => {
					if (c.checked) {
						c.checked = false;
					}
				});
				a.checkedAll = false;
				a.indeterminate = false;
			});
			props.updateAppGroupArr(appGroupArr);
		}
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

	shouldComponentUpdate(nextProps, nextState) {
		const thisProps = this.props || {},
			thisState = this.state || {};
		if (this.props.checked !== nextProps.checked) {
			return true;
		}
		return false;
	}

	onChangeChecked = (e) => {
		const checked = e.target.checked;
		const { index, parentIndex } = this.props;
		this.props.onChangeChecked(checked, parentIndex, index);
	};

	render() {
		const { connectDragSource } = this.props;
		const { id, index, name, checked, parentIndex } = this.props;
		return connectDragSource(
			<div className='list-item-content'>
				<div className='title'>
					<span className='title-name'>{name}</span>
					<Checkbox checked={checked} onChange={this.onChangeChecked} />
				</div>
			</div>
		);
	}
}

const dragDropItem = DragSource('item', noteSource, collectSource)(Item);

export default connect(
	(state) => ({
		groups: state.templateDragData.groups
	}),
	{
		updateGroupList
	}
)(dragDropItem);
