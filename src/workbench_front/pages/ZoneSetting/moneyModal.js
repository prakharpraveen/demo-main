import React, { Component } from 'react';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import { connect } from 'react-redux';
import { Input, Icon, Modal, Button } from 'antd';
import * as utilService from './utilService';
import {  updateAreaList } from 'Store/ZoneSetting/action';
import BatchSearchTable from './batchSearchTable';
import BatchNoSearchTable from './batchNoSearchTable';

class InterModal extends Component {
	constructor(props) {
		super(props);
		let {areaList, areaIndex}  = this.props;
		this.state = {
			newSource:areaList[areaIndex]
		};	
	}
	showModalHidden = ()=>{
        this.props.setModalVisibel(false)
    }
    onOkDialog = ()=>{
		let {areaList, areaIndex}  = this.props;
		areaList[areaIndex]  = this.state.newSource;
		// 更新redux全局属性列表 
        this.props.updateAreaList(areaList);
		console.log(areaList[areaIndex], "修改的区域");
		this.showModalHidden();
	}
	saveState = (newSource) =>{
		this.setState({newSource})
	}
	saveValue = (type) =>{

	}
	render() {
		let {areaIndex}  = this.props;
		let {newSource}  = this.state;
		return (
		<div className='myZoneModal'>
			<Modal
				title='批量设置-卡片区'
				mask={false}
				wrapClassName='interModal'
				visible={true}
				onOk={this.onOkDialog}
				destroyOnClose = {true}
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
			     <div>
						最小值:<Input onChange={this.saveValue.bind(this,1)}/>
						最大值:<Input onChange={this.saveValue.bind(this, 2)} />
				 </div>
			</Modal>
		</div>	
		);
	}
}
export default connect((state) => ({ 
    areaList: state.zoneSettingData.areaList,
}), {
    updateAreaList,
	})(InterModal);
