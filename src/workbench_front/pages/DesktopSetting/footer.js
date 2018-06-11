import React, { Component } from 'react';
import _ from 'lodash';
import { Button, Modal, Radio } from 'antd';
import Ajax from 'Pub/js/ajax';
//自定义组件
import { layoutCheck } from './collision';
import { compactLayout,compactLayoutHorizontal } from './compact.js';
import { connect } from 'react-redux';
import { updateGroupList, updateSelectCardInGroupObj } from 'Store/test/action';
import * as utilService from './utilService';
import Notice from 'Components/Notice';
import { withRouter } from 'react-router-dom';
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
	deleteSelectedCardArr = () => {
		let { groups } = this.props;
		groups = _.cloneDeep(groups);
		utilService.removeCheckedCardsInGroups(groups);
		_.forEach(groups,(g)=>{
			let compactedLayout = compactLayoutHorizontal( g.apps,this.props.col);

			g.apps = compactedLayout;
		})
		
		this.props.updateGroupList(groups);
	};
	getGroupItemNameRadio = (groups) => {
		if (!groups) return;
		return (
			<RadioGroup
				className='modal-radio-group'
				value={this.state.selectedValue}
				onChange={this.onChangeRadio.bind(this)}
			>
				{groups.map((g, i) => {
					return (
						<Radio className='modal-radio' key={g.pk_app_group} value={g.pk_app_group}>
							{g.groupname}
						</Radio>
					);
				})}
			</RadioGroup>
		);
	};
	//移动到的弹出框中，组名选择
	onChangeRadio = (e) => {
		this.setState({ selectedValue: e.target.value });
	};
	showModalVisible = () => {
		this.setModalVisible(true);
	};
	showModalHidden = ()=>{
		this.setModalVisible(false);
	};
	setModalVisible = (modalVisible) => {
		this.setState({ modalVisible, selectedValue: 0 });
	};
	//移动到的弹出框中，点击确认
	onOkMoveDialog = () => {
		const modalVisible = false;
		const targetGroupID = this.state.selectedValue;
		if (targetGroupID === 0) {
			return;
		}
		let { groups} = this.props;
		groups = _.cloneDeep(groups);
		//需要重新布局的组，需要把目标组也加进来
		let sourceGroupIDArr = [];
		//删掉所有被勾选的卡片，合并到目标组中，并且目标组内去重
		let moveCardArr = [];
		let targetGroupIndex = -1;

		_.forEach(groups, (g, i) => {
			let flag = false;
			if (g.pk_app_group === targetGroupID) {
				targetGroupIndex = i;
				sourceGroupIDArr.push(g.pk_app_group)
				return;
			}
			const tmpArr = _.remove(g.apps, (a) => {
				if(a.isChecked){
					flag = true;
				}
				return a.isChecked;
			});
			if(flag && sourceGroupIDArr.indexOf(g.pk_app_group) === -1){
				sourceGroupIDArr.push(g.pk_app_group);
			}
			moveCardArr = _.concat(moveCardArr, tmpArr);
		});

		utilService.setPropertyValueForCardsInCards(moveCardArr, 'isChecked', false);
		utilService.setPropertyValueForCardsInCards(groups[targetGroupIndex].apps, 'isChecked', false);
		//set moveCard grix gridy Max防止放置的元素对目标原卡片组位置影响
		utilService.setGridXGridYMaxInCards(moveCardArr);

		groups[targetGroupIndex].apps = _.concat(groups[targetGroupIndex].apps, moveCardArr);
		groups[targetGroupIndex].apps = _.uniqBy(groups[targetGroupIndex].apps, 'pk_appregister');
		//循环所有改变的组，进行重新布局
		_.forEach(groups, (g) => {
			if (sourceGroupIDArr.indexOf(g.pk_app_group) === -1) {
				return;
			}
			if (g.apps.length === 0) {
				return;
			}
			let compactedLayout = compactLayoutHorizontal( g.apps,this.props.col);

			// const firstCard = compactedLayout[0];

			// compactedLayout = compactLayout(compactedLayout, firstCard);

			g.apps = compactedLayout;
		});
		this.props.updateGroupList(groups);
		this.setModalVisible(modalVisible);
	};
	cancleSave = () => {
		if(this.props.relateidObj.type === 'userID'){
			this.props.history.push(`/`)
		}else{
			self.opener=null;
            self.close();
		}
	};
	hasCheckedCardInGroups = () => {};
	//抽象方法，参数为显示的button文本和方法体，注意方法提前bind
	getMoveCardButton = (text, fn) => {
		let tmpDom;
		const { groups } = this.props;
		const isDisabled = utilService.hasCheckedCardInGroups(groups);
		tmpDom = (
			<Button className="footer-button" disabled={!isDisabled} onClick={fn}>
				{text}
			</Button>
		);
		return tmpDom;
	};
	//保存
	saveGroupItemAndCard = () => {
		let tmpData = [];
		_.forEach(this.props.groups, (g, i) => {
			let tmp = {
				groupname: g.groupname,
				apps: [],
				position: i
			};
			if (g.pk_app_group.indexOf('newGroupItem') === -1) {
				tmp.pk_app_group = g.pk_app_group;
			}
			_.forEach(g.apps, (a) => {
				if (a.pk_appregister.indexOf('_') !== -1) {
					const tmpIDArr = a.pk_appregister.split('_');
					a.pk_appregister = tmpIDArr[0];
				}
				tmp.apps.push({
					pk_appregister: a.pk_appregister,
					gridx: a.gridx,
					gridy: a.gridy
				});
			});
			tmpData.push(tmp);
		});
		const saveData = {
			relateid: this.props.relateidObj.data,
			isuser: this.props.relateidObj.type === 'userID'?'1':'0', //1用户 0职责，
			data: tmpData
		};
		Ajax({
			url: `/nccloud/platform/appregister/setapp.do`,
			info: {
				name:'工作桌面配置',
				action:'保存'
			},
			data: saveData,
			success: (res) => {
				const { data, success } = res.data;
				if (success) {
					setTimeout(() => {
						if(this.props.relateidObj.type === 'userID'){
							this.props.history.push(`/`)
						}else{
							self.opener=null;
							self.close();
						}
					}, 1000);
					
					Notice({ status: 'success', msg:data });
				}else{
					Notice({ status: 'error', msg: data });
				}
			}
		});
	};
	toBeDefault = ()=>{
		Ajax({
			url: `/nccloud/platform/appregister/resetworkbench.do`,
			info: {
				name:'工作桌面配置',
				action:'恢复默认'
			},
			data: {
				relateid: this.props.relateidObj.data
			},
			success: (res) => {
				const { data, success } = res.data;
				if (success) {
					Notice({ status: 'success', msg:'恢复默认成功' });
					setTimeout(() => {
						location.reload();
					}, 500);
				}else{
					Notice({ status: 'error', msg: data });
				}
			}
		});
	}
	render() {
		const { groups } = this.props;
		const groupNameRadioGroup = this.getGroupItemNameRadio(groups);
		return (
			<div className='nc-workbench-home-footer'>
				<div className='footer-left'>
					{this.getMoveCardButton('删除', this.deleteSelectedCardArr)}
					{this.getMoveCardButton('移动', this.showModalVisible)}
				</div>
				<div className='footer-right'>
					<Button className='right-button' type='primary' onClick={this.saveGroupItemAndCard}>
						保存
					</Button>
					{/* <Button className='right-button'>预览</Button> */}
					<Button className='right-button footer-button' onClick={this.toBeDefault}>恢复默认</Button>
					<Button className='right-button footer-button' onClick={this.cancleSave}>
						取消
					</Button>
				</div>
				<Modal
					title='移动到'
					mask={false}
					wrapClassName='desk-setting-vertical-center-modal'
					visible={this.state.modalVisible}
					onOk={this.onOkMoveDialog}
					onCancel={this.showModalHidden}
					footer={[
						<Button
							key='submit'
							disabled={this.state.selectedValue === 0}
							type='primary'
							onClick={this.onOkMoveDialog}
						>
							确定
						</Button>,
						<Button key='back' onClick={this.showModalHidden}>
							取消
						</Button>
					]}
				>
					{groupNameRadioGroup}
				</Modal>
			</div>
		);
	}
}
export default connect(
	(state) => ({
		groups: state.templateDragData.groups,
		col: state.templateDragData.layout.col
	}),
	{
		updateGroupList
	}
)(withRouter(MyFooter));
