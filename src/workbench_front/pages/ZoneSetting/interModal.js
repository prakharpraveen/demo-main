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
			initVal: this.props.initVal,
			small: '',
			big: ''
		};	
	}
	componentWillReceiveProps(nextProps){
		this.setState({ initVal: nextProps.initVal})
	}
	componentDidMount() {
		// 解析 内置val 
		let { initVal } = this.state;
		if (initVal) {
			let initArray = initVal.split(',');
			this.setState({ small: initArray && initArray[0], big: initArray && initArray[1]})
		}
	}
	showModalHidden = ()=>{
		this.props.setModalVisibel('inter', false)
    }
    onOkDialog = ()=>{
	    let {small,big } = this.state;
		this.props.handleSelectChange(`${small},${big}`,'dataval',);
	//	console.log(areaList[areaIndex], "修改的区域");
		this.showModalHidden();
	}
	
	saveValue = (e,type) =>{
		let val = e.target.value;
		if(type==1){
			this.setState({ small: val })
			return;
		}
		this.setState({ big: val })
	}
	render() {
		let { big, small } = this.state;
		return (
			<Modal
				title='整数-设置'
				mask={false}
				wrapClassName='interModal'
				visible={this.props.modalVisibel}
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
					最小值:<Input  value={small} onChange={(e)=>{this.saveValue(e,1)}}/>
					最大值:<Input  value={big} onChange={(e)=>{this.saveValue(e,2)}} />
				 </div>
			</Modal>	
		);
	}
}
export default connect((state) => ({ 
    areaList: state.zoneSettingData.areaList,
}), {
    updateAreaList,
	})(InterModal);
