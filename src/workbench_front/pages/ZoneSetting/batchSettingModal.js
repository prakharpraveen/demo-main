import React, { Component } from 'react';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import { connect } from 'react-redux';
import { Input, Icon, Modal, Button } from 'antd';
import * as utilService from './utilService';
import {  updateAreaList } from 'Store/ZoneSetting/action';

class BatchSettingModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	showModalHidden = ()=>{
        this.props.setModalVisibel(false)
    }
    onOkDialog = ()=>{
        let {areaList, areaIndex}  = this.props;
        console.log(areaList[areaIndex], "修改的区域")
    }
	render() {
		return (
			<Modal
				title='批量设置-卡片区'
				mask={false}
				wrapClassName='vertical-center-modal'
				visible={this.props.batchSettingModalVisibel}
				onOk={this.onOkDialog}
				onCancel={this.showModalHidden}
				footer={[
					<Button
						key='submit'
						// disabled={}
						type='primary'
						onClick={this.onOkDialog}
					>
						确定
					</Button>,
					<Button key='back' onClick={this.showModalHidden}>
						取消
					</Button>
				]}
			>
            
			</Modal>
		);
	}
}
export default connect((state) => ({
    areaList: state.zoneSettingData.areaList,
}), {
    updateAreaList,
})(BatchSettingModal);
