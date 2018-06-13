import React, { Component } from 'react';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import { connect } from 'react-redux';
import { InputNumber, Icon, Modal, Button } from 'antd';
import * as utilService from './utilService';
import Notice from 'Components/Notice';
import {  updateAreaList } from 'Store/ZoneSetting/action';
import BatchSearchTable from './batchSearchTable';
import BatchNoSearchTable from './batchNoSearchTable';

export default  class MoneyModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initVal: this.props.initVal, 
			type:this.props.type,
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
				// if (initVal.indexOf('@') > -1) {
				// 	// 表示的是参数设置
				// 	this.setState({
				// 		paramScale: initArray && initArray[0].substr(1),
				// 		small: initArray && initArray[1],
				// 		big: initArray && initArray[2],
				// 	})
				// } else {
					this.setState({
						customScale: initArray && initArray[0],
						small: initArray && initArray[1],
						big: initArray && initArray[2],
					})
			//	}
			}
		})
	}
	showModalHidden = ()=>{
        this.props.setModalVisibel('money',false)
    }
    onOkDialog = ()=>{
		let { small, big, customScale,paramScale } = this.state;
		if (small >= big ){
			return Notice({ status: 'error', msg: '所选的最小值与最大值不匹配' });
		}
		let result;
		// 判断是否是精度 
		// if (paramScale){
		// 	result = `@${paramScale},${small},${big}`
		// }else{
			result = `${customScale},${small},${big}`
		//}
		this.props.handleSelectChange(result, 'dataval');
		this.showModalHidden();
	}
	saveValue = (val,type) =>{
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
		let { customScale, paramScale, small, big,type }  = this.state;
		return (
		<div className='myZoneModal'>
			<Modal
				title={`${type}类型设置`}
				mask={false}
				wrapClassName='zonesetting-moneyModal'
				visible={this.props.modalVisibel}
				onOk={this.onOkDialog}
				destroyOnClose = {true}
				onCancel={this.showModalHidden}
				footer={[
					<Button
						key='submit'
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
							<div><span className='money-label'>	自定义精度:</span><InputNumber value={customScale} onChange={(value) => { this.saveValue(value, 1) }} /></div>	
						    	
					</div>	
				</div>
			     <div>
					<div className='descrip_label'>取值设置 </div>
						<div className='mdcontent'>
							<div><span className='money-label'>最小值:</span><InputNumber value={small} onChange={(value) => { this.saveValue(value, 3) }} /></div>	
							<div><span className='money-label'>最大值:</span><InputNumber value={big} onChange={(value) => { this.saveValue(value, 4) }} /></div>	
				 </div>
					</div>
			</Modal>
		</div>	
		);
	}
}

 // export default MoneyModal   // connect((state) => ({}), {})(ZoneSetting);
// export default connect((state) => ({ 
//     areaList: state.zoneSettingData.areaList,
// }), {
//     updateAreaList,
// 	})(MoneyModal);
