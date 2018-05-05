import React, { Component } from 'react';
import _ from 'lodash';
import { Button, Modal, Radio } from 'antd';
import Ajax from 'Pub/js/ajax';
//自定义组件
import {collision,layoutCheck} from './collision';
import {compactLayout} from './compact.js';
import { connect } from 'react-redux';
import { updateSelectCardIDList, updateGroupList } from 'Store/test/action';
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
		let {selectCardIDList,groups} = this.props;
		selectCardIDList = _.cloneDeep(selectCardIDList);
		groups = _.cloneDeep(groups);
		_.forEach(groups,(g,i)=>{
			_.remove(g.apps,(a)=>{
				return _.indexOf(selectCardIDList,a.pk_appregister) !== -1
			})
		});
		selectCardIDList = [];
		this.props.updateSelectCardIDList(selectCardIDList);
		this.props.updateGroupList(groups);
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
		this.setModalVisible(modalVisible);
		let {groups,selectCardIDList} = this.props;
		selectCardIDList = _.cloneDeep(selectCardIDList);
		groups = _.cloneDeep(groups);

		let moveCardArr = [];
		let targetGroupIndex = -1;
		let souceGroupIndexArr = [];
		_.forEach(groups,(g,i)=>{
			if(g.pk_app_group === targetGroupID){
				targetGroupIndex = i;
			}
			const tmpArr = _.remove(g.apps,(a)=>{
				if(targetGroupIndex !==i  && souceGroupIndexArr.indexOf(i) === -1 && selectCardIDList.indexOf(a.pk_appregister)!== -1 ){
					souceGroupIndexArr.push(i);
				}
				return _.indexOf(selectCardIDList,a.pk_appregister) !== -1
			})
			moveCardArr = _.concat(moveCardArr,tmpArr);
		});
		groups[targetGroupIndex].apps = _.concat(groups[targetGroupIndex].apps,moveCardArr);
		selectCardIDList = [];

		souceGroupIndexArr.push(targetGroupIndex);
		//循环所有改变的组，进行重新布局
		_.forEach(souceGroupIndexArr,(i)=>{
			if(groups[i].apps.length === 0){
				return;
			}
			const removeCard = groups[i].apps[0];
			const newlayout = layoutCheck(groups[i].apps, removeCard, removeCard.pk_appregister, removeCard.pk_appregister);
			
			const compactedLayout = compactLayout(newlayout);
			groups[i].apps = compactedLayout;
		});
		this.props.updateSelectCardIDList(selectCardIDList);
		this.props.updateGroupList(groups);
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
		const { groups, selectCardIDList } = this.props;
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
		selectCardIDList: state.templateDragData.selectCardIDList,
		layout: state.templateDragData.layout,
	}),
	{
		updateSelectCardIDList,
		updateGroupList,
	}
)(MyFooter))
