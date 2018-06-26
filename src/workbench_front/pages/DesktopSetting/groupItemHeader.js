import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { Icon, Input, Checkbox, Popconfirm } from 'antd';
import { updateCurrEditID } from 'Store/test/action';

class GroupItemHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			groupName: props.groupname
		};
	}
	//向上移动组
	upGroupItem = () => {
		this.props.upGroupItem(this.props.index);
	};
	//向下移动组
	downGroupItem = () => {
		this.props.downGroupItem(this.props.index);
	};
	//删除组
	deleteGroupItem = () => {
		this.props.deleteGroupItem(this.props.id);
	};
	//获得组名
	getGroupName = (e) => {
		let _groupName = e.target.value;
		// console.log(_groupName);
		this.setState({ groupName: _groupName });
	};
	//组名进入编辑状态
	editGroupItemName = () => {
		this.props.updateCurrEditID(this.props.id);
		setTimeout(() => {
			this.refs.editInputDom.focus();
		}, 0);
	};
	//改变组名
	changeGroupName = () => {
		let index = this.props.index;
		let groupname = this.state.groupName;
		this.props.changeGroupName(index, groupname);
	};
	//取消编辑组名
	cancelGroupName = () => {
		this.props.updateCurrEditID('');
	};

	render() {
		console.log('group')
		const {
			groupname,
			id,
			index,
			length,
			currEditID
		} = this.props;
		let groupItemTitle;
		if (currEditID === id) {
			groupItemTitle = (
				<div className='group-item-title-container-no-edit'>
					<div className='title-left'>
						<Input
							ref='editInputDom'
							size='small'
							placeholder='分组名称，回车确定'
							defaultValue={groupname}
							onPressEnter={this.changeGroupName}
							onChange={this.getGroupName}
						/>
						<Icon
							type='check-square-o'
							className='group-item-icon'
							title='确定'
							onClick={this.changeGroupName}
						/>
						<Icon
							type='close-square-o'
							className='group-item-icon'
							title='取消'
							onClick={this.cancelGroupName}
						/>
					</div>
				</div>
			);
		} else {
			groupItemTitle = (
				<div className='group-item-title-container-no-edit'>
					<div className='title-left'>
						{/* <Checkbox checked={}></Checkbox> */}
						<span className="group-item-title" onClick={this.editGroupItemName}>{groupname}</span>
						<div className='group-item-title-edit'>
							<Icon
								type='edit'
								title='分组重命名'
								className='group-item-icon'
								onClick={this.editGroupItemName}
							/>
						</div>
					</div>
					<div className='title-right'>
						<div className={index === 0 ? 'group-item-title-not-edit' : 'group-item-title-edit'}>
							<Icon
								type='up-square-o'
								title='分组上移'
								className='group-item-icon'
								onClick={this.upGroupItem}
							/>
						</div>
						<div className={index === length - 1 ? 'group-item-title-not-edit' : 'group-item-title-edit'}>
							<Icon
								type='down-square-o'
								title='分组下移'
								className='group-item-icon'
								onClick={this.downGroupItem}
							/>
						</div>
						<div className='group-item-title-edit'>
							<Popconfirm
								title='确定删除该分组？'
								onConfirm={this.deleteGroupItem}
								placement="topRight"
								okText='确定'
								cancelText='取消'
							>
								<Icon
									type='close-square-o'
									title='分组删除'
									className='group-item-icon'
								/>
							</Popconfirm>
						</div>
					</div>
				</div>
			);
		}

		return (
            groupItemTitle
        )
	}
}

export default connect(
	(state) => ({
		currEditID: state.templateDragData.currEditID
	}),
	{
		updateCurrEditID
	}
)(GroupItemHeader);
