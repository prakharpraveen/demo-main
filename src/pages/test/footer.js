import React, { Component } from 'react';
import _ from 'lodash';
import { Button, Modal, Radio } from 'antd';
import Ajax from 'Pub/js/ajax';
const RadioGroup = Radio.Group;

class MyFooter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			selectedValue: 0
		};
	}
	getGroupItemNameRadio(groups) {
		let itemDoms = [];
		_.forEach(groups, (g, i) => {
			itemDoms.push(
				<Radio className='modal-radio' key={g.pk_app_group} value={g.pk_app_group}>
					{g.groupname}
				</Radio>
			);
		});
		const resultDom = (
			<RadioGroup
				className='modal-radio-group'
				value={this.state.selectedValue}
				onChange={this.onChangeRadio.bind(this)}
			>
				{itemDoms}
			</RadioGroup>
		);
		return resultDom;
	}
	setModalVisible(modalVisible) {
		this.setState({ modalVisible });
	}
	//移动到的弹出框中，组名选择
	onChangeRadio(e) {
		this.setState({ selectedValue: e.target.value });
	}
	//移动到的弹出框中，点击确认
	onOkMoveDialog(modalVisible) {
		if (this.state.selectedValue === 0) {
			return;
		}
		this.setModalVisible(modalVisible);
		this.props.onOkMoveDialog(this.state.selectedValue);
	}
	//点击保存
	saveGroupItemAndCard() {
		this.props.saveGroupItemAndCard();
	}
	cancleSave() {
		location.reload();
	}
	//抽象方法，参数为显示的button文本和方法体，注意方法提前bind
	getMoveCardButton = (text, fn) => {
		let tmpDom;
		const selectCardIDList = this.props.selectCardIDList;
		tmpDom = (
			<Button
				disabled={selectCardIDList.length === 0}
				onClick={() => {
					fn(true);
				}}
			>
				{text}
			</Button>
		);
		return tmpDom;
	};
	render() {
		const { groups, moveModal, selectCardIDList } = this.props;
		const groupNameRadioGroup = this.getGroupItemNameRadio(groups);
		return (
			<div className='nc-workbench-home-footer'>
				<div className="footer-left">
					{this.getMoveCardButton('删除', this.props.deleteSelectedCardArr)}
					{this.getMoveCardButton('移动', this.setModalVisible.bind(this))}
				</div>
				<div className="footer-right">
					<Button className="right-button" type="primary" onClick={this.saveGroupItemAndCard.bind(this)}>保存</Button>
					<Button className="right-button" onClick={this.cancleSave.bind(this)}>取消</Button>
				</div>
				<Modal
					title='移动到'
					wrapClassName='vertical-center-modal'
					visible={this.state.modalVisible}
					onOk={() => this.onOkMoveDialog(false)}
					onCancel={() => this.setModalVisible(false)}
					footer={[
						<Button key="submit" type="primary" onClick={() => this.onOkMoveDialog(false)}>确定</Button>,
						<Button key="back" onClick={() => this.setModalVisible(false)}>
						  取消
						</Button>,
					  ]}
				>
					{groupNameRadioGroup}
				</Modal>
			</div>
		);
	}
}

export default MyFooter;
