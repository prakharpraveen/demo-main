import React, { Component } from 'react';
import _ from 'lodash';
import { Row, Col, Button, Modal, Radio } from 'antd';
import Ajax from 'Pub/js/ajax';
const RadioGroup = Radio.Group;

class Footer extends Component {
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
	onChangeRadio(e) {
		this.setState({ selectedValue: e.target.value });
	}
	//移动到的弹出框中，点击确认
	onOkMoveDialog(modalVisible) {
		if(this.state.selectedValue === 0){
			return;
		}
		this.setModalVisible(modalVisible)
        this.props.onOkMoveDialog(this.state.selectedValue);
	}
	saveGroupItemAndCard() {
		this.props.saveGroupItemAndCard();
	}
	cancleSave(){
		location.reload();
	}
	//抽象方法，参数为显示的button文本和方法体，注意方法提前bind
    getMoveCardButton = (text,fn)=>{
        let tmpDom;
            if(this.props.selectCardIDList.length===0){
                tmpDom =(<Button disabled>
                     {text}
                </Button>) 
            }else{
                tmpDom=( <Button
                    onClick={() => {
                        fn(true);
                    }}
                >
                    {text}
                </Button>)
            }
        return tmpDom;
    }
	render() {
		const { groups, moveModal,selectCardIDList } = this.props;
		const groupNameRadioGroup = this.getGroupItemNameRadio(groups);
		return (
			<div className='nc-workbench-home-footer'>
				<div className='footer-container'>
					<Row>
						<Col span={1}>
						{this.getMoveCardButton("删除",this.props.deleteSelectedCardArr)}
						</Col>
						<Col span={1}>
                       {this.getMoveCardButton("移动到",this.setModalVisible.bind(this))}
						</Col>
						<Col span={1}  offset={18}>
							<Button onClick={this.cancleSave.bind(this)}>取消</Button>
						</Col>
						<Col span={1}>
							<Button onClick={this.saveGroupItemAndCard.bind(this)}>保存</Button>
						</Col>
						
					</Row>
				</div>

				<Modal
					title='移动到'
					wrapClassName='vertical-center-modal'
					visible={this.state.modalVisible}
					onOk={() => this.onOkMoveDialog(false)}
					onCancel={() => this.setModalVisible(false)}
				>
					{groupNameRadioGroup}
				</Modal>
			</div>
		);
	}
}

export default Footer;
