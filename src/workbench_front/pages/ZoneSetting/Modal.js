import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { InputNumber , Icon, Modal, Button } from 'antd';
import Notice from 'Components/Notice';

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
		this.setState({ initVal: nextProps.initVal},() =>{
			let { initVal } = this.state;
			if (initVal) {
				let initArray = initVal.split(',');
				this.setState({ small: initArray && initArray[0], big: initArray && initArray[1] })
			}
		})
	}
	showModalHidden = ()=>{
		this.props.setModalVisibel('inter', false)
    }
    onOkDialog = ()=>{
		let {small,big } = this.state;
		if (small >= big){
			return Notice({ status: 'error', msg: '所选的最小值与最大值不匹配' });
		}
		this.props.handleSelectChange(`${small},${big}`,'dataval',);
		this.showModalHidden();
	}
	
	saveValue = (val,type) =>{
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
					最小值:<InputNumber value={small} onChange={(val) => { this.saveValue(val,1)}}/>
					最大值:<InputNumber value={big} onChange={(val) => { this.saveValue(val,2)}} />
				 </div>
			</Modal>	
		);
	}
}
export default connect((state) => ({ 
}), {
	})(InterModal);
