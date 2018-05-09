import React, { Component } from 'react';
import _ from 'lodash';
import { Button, Modal, Radio } from 'antd';
import Ajax from 'Pub/js/ajax';
//自定义组件
import {collision,layoutCheck} from './collision';
import {compactLayout} from './compact.js';
import { connect } from 'react-redux';
import { updateGroupList, updateSelectCardInGroupObj  } from 'Store/test/action';
import * as utilService from './utilService';
const RadioGroup = Radio.Group;

class MyFooter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			selectedValue: 0
		};
	}
	//点击删除按钮
	deleteSelectedCardArr(){
		let {groups, selectCardInGroupObj} = this.props;
		groups = _.cloneDeep(groups);
		selectCardInGroupObj = _.cloneDeep(selectCardInGroupObj);

		_.forEach(selectCardInGroupObj,(value, key)=>{
			_.forEach(value,(a)=>{
				utilService.removeCardByGroupIDAndCardID(groups, key, a)
			})
		})
		//todo 自动排版

		this.props.updateGroupList(groups);
		this.props.updateSelectCardInGroupObj({});
	}
	getGroupItemNameRadio(groups) {
		if (!groups) return;
		return (
			<RadioGroup
				className='modal-radio-group'
				value={this.state.selectedValue}
				onChange={this.onChangeRadio.bind(this)}
			>
				{
					groups.map((g, i) => {
						return (
							<Radio className='modal-radio' key={g.pk_app_group} value={g.pk_app_group}>
								{g.groupname}
							</Radio>
						)

					})
				}
			</RadioGroup>
		);
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
		const targetGroupID = this.state.selectedValue;
		if (targetGroupID === 0) {
			return;
		}
		let {groups,selectCardInGroupObj} = this.props;
		selectCardInGroupObj = _.cloneDeep(selectCardInGroupObj);
		groups = _.cloneDeep(groups);
		//需要重新布局的组，需要把目标组也加进来
		let sourceGroupIDArr = _.keys(selectCardInGroupObj);
		if(sourceGroupIDArr.indexOf(targetGroupID) === -1){
			sourceGroupIDArr.push(targetGroupID)
		}
		//删掉所有被勾选的卡片，合并到目标组中，并且目标组内去重
		let moveCardArr = [];
		let targetGroupIndex = -1;
		_.forEach(groups,(g,i)=>{
			if (g.pk_app_group === targetGroupID) {
				targetGroupIndex = i;
				return;
			}
			const tmpArr = _.remove(g.apps, (a) => {
				return _.indexOf(selectCardInGroupObj[g.pk_app_group], a.pk_appregister) !== -1
			})
			moveCardArr = _.concat(moveCardArr, tmpArr);
		})

		utilService.setGridXGridYMaxInCards(moveCardArr);
		
		groups[targetGroupIndex].apps = _.concat(groups[targetGroupIndex].apps,moveCardArr);
		groups[targetGroupIndex].apps = _.uniqBy(groups[targetGroupIndex].apps, 'pk_appregister');
		//循环所有改变的组，进行重新布局
		_.forEach(groups,(g)=>{
			if(sourceGroupIDArr.indexOf(g.pk_app_group) === -1){
				return;
			}
			if(g.apps.length === 0){
				return;
			}
			const firstCard = g.apps[0];
			const newlayout = layoutCheck(g.apps, firstCard, firstCard.pk_appregister, firstCard.pk_appregister);
			
			const compactedLayout = compactLayout(newlayout);
			g.apps = compactedLayout;
		})
		this.props.updateSelectCardInGroupObj({});
		this.props.updateGroupList(groups);
		this.setModalVisible(modalVisible);
	}
	//点击保存
	saveGroupItemAndCard() {
		this.props.saveGroupItemAndCard();
	}
	cancleSave() {
		location.reload();
	}
	checkInSelectCardInGroupObj(){
		const selectCardInGroupObj = this.props.selectCardInGroupObj;
		let flag = true;
		_.forEach(selectCardInGroupObj,(c)=>{
			if(c.length>0){
				flag = false;
				return false;
			}
		})
		return flag;
	}
	//抽象方法，参数为显示的button文本和方法体，注意方法提前bind
	getMoveCardButton = (text, fn) => {
		let tmpDom;
		const checked = this.checkInSelectCardInGroupObj();
		tmpDom = (
			<Button
				disabled={checked}
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
		const { groups } = this.props;
		const groupNameRadioGroup = this.getGroupItemNameRadio(groups);
		return (
			<div className='nc-workbench-home-footer'>
				<div className="footer-left">
					{this.getMoveCardButton('删除', this.deleteSelectedCardArr.bind(this))}
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
export default (connect(
	(state) => ({
		groups: state.templateDragData.groups,
		shadowCard: state.templateDragData.shadowCard,
		selectCardInGroupObj: state.templateDragData.selectCardInGroupObj,
		layout: state.templateDragData.layout,
	}),
	{
		updateSelectCardInGroupObj,
		updateGroupList,
	}
)(MyFooter))
