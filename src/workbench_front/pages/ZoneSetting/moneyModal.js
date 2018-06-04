import React, { Component } from 'react';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import { connect } from 'react-redux';
import { Input, Icon, Modal, Button } from 'antd';
import * as utilService from './utilService';
import {  updateAreaList } from 'Store/ZoneSetting/action';
import BatchSearchTable from './batchSearchTable';
import BatchNoSearchTable from './batchNoSearchTable';

class MoneyModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initVal: this.props.initVal, 
			small:'',
			big:'',
			customScale:'',
			paramScale:''
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ initVal: nextProps.initVal },()=>{
			let { initVal } = this.state;
			if (initVal) {
				let initArray = initVal.split(',');
				if (initVal.indexOf('@') > -1) {
					// 表示的是参数设置
					this.setState({
						paramScale: initArray && initArray[0].substr(1),
						small: initArray && initArray[1],
						big: initArray && initArray[2],
					})
				} else {
					this.setState({
						customScale: initArray && initArray[0],
						small: initArray && initArray[1],
						big: initArray && initArray[2],
					})
				}
			}
		})
	}
	showModalHidden = ()=>{
        this.props.setModalVisibel('money',false)
    }
    onOkDialog = ()=>{
		let { small, big, customScale,paramScale } = this.state;
		let result;
		// 判断是否是精度 
		if (paramScale){
			result = `@${paramScale},${small},${big}`
		}else{
			result = `${customScale},${small},${big}`
		}
		this.props.handleSelectChange(result, 'dataval');
		this.showModalHidden();
	}
	saveValue = (e,type) =>{
		let val;
		val = e.target.value;
		switch (type) {
			case 1:
				this.setState({ customScale: val, paramScale:''})
				break;
			case 2:
				this.setState({ paramScale: val, customScale:''})
				break;
			case 3:
				this.setState({ small: val })
				break;
			case 4:
				this.setState({ big: val })
				break;
		
			default:
				break;
		}
	}
	render() {
		let { customScale, paramScale, small, big }  = this.state;
		return (
		<div className='myZoneModal'>
			<Modal
				title='批量设置-卡片区'
				mask={false}
				wrapClassName='moneyModal'
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
					<div className='descrip_label'>精度设置 </div>
					<div className='mdcontent'>
							<div><span>	自定义精度:</span><Input value={customScale} onChange={(e) => { this.saveValue(e, 1) }} /></div>	
							<div><span>	参数精度:</span><Input value={paramScale} onChange={(e) => { this.saveValue(e, 2) }} /></div>	
					</div>	
				</div>
			     <div>
					<div className='descrip_label'>取值设置 </div>
						<div className='mdcontent'>
							<div><span>最小值:</span><Input value={small} onChange={(e) => { this.saveValue(e, 3) }} /></div>	
							<div><span>最大值:</span><Input value={big} onChange={(e) => { this.saveValue(e, 4) }} /></div>	
				 </div>
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
	})(MoneyModal);
