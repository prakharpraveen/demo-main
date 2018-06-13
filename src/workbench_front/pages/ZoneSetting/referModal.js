import React, { Component } from 'react';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import { connect } from 'react-redux';
import { Input, Icon, Modal, Button, Select, Checkbox } from 'antd';
import * as utilService from './utilService';
import {  updateAreaList } from 'Store/ZoneSetting/action';
const Option = Select.Option;
class ReferModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initVal: this.props.initVal, 
			option:[],
			isCheck:false,
			optionKey:'',
		};
	}
	
	componentWillReceiveProps(nextProps) {
		let url, data;
		url = '/nccloud/platform/templet/queryrefinfo.do';
		data = {
			defdoc: nextProps.selectCard && nextProps.selectCard.metaid
		};
		Ajax({
			url: url,
			data: data,
			info: {
				name: '参照',
				action: '查询参照'
			},
			success: ({ data }) => {
				if (data.success && data.data) {
					this.setState({ option: data.data })
				} else {
					Notice({ status: 'error', msg: data.data.true });
				}
			}
		});
		this.setState({ initVal: nextProps.initVal },()=>{
			let { initVal } = this.state;
			if (initVal) {
			   let result = initVal.split(',');
				if (result && result[1].split('=')[1] ==='Y'){
					this.setState({ isCheck: true, optionKey: result[0]})
				}else{
					this.setState({ isCheck: false, optionKey: result && result[0] })
				}
			}
		})
	}

	showModalHidden = ()=>{
        this.props.setModalVisibel('refer',false)
    }
    onOkDialog = ()=>{
		let { optionKey, isCheck } = this.state;
		let initVal;
		if (isCheck){
			initVal = optionKey + `,dp=Y`;
		}else{
			initVal = optionKey + `,dp=N`;
		} 
		this.setState({ initVal});
		this.props.handleSelectChange(initVal, 'dataval');
		this.showModalHidden();
	}
	handleSelectChange = (val)=>{
		this.setState({ optionKey:val})
	}
	saveValue = (e,type) =>{
		let val;
		val = e.target.checked;
		this.setState({ isCheck: val})
	}
	render() {
		let { isCheck, option, optionKey }  = this.state;
		return (
		<div className='myZoneModal'>
			<Modal
				title='参照类型设置'
				mask={false}
				wrapClassName='zonesetting-referModal'
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
					<div className='descrip_label'>参照设置 </div>
					<div className='mdcontent'>
							<div><span className='refer_label'>参照选择:</span>
								<Select
									showSearch
									optionFilterProp="children"
									filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									value={optionKey}
									onChange={(value) => {
										this.handleSelectChange(value);
									}}
									style={{ width: 200 }}
								>
									{option.map((c, index) => {
										return (
											<Option key={index} value={c.pk_refinfo}>
												{c.name}
											</Option>
										);
									})}
								</Select>
							</div>	
								
					</div>	
				</div>
			     <div>
					<div className='descrip_label'>关联设置 </div>
						<div className='mdcontent'>
							<div><span className='refer_label'>焦点离开后参照显示名称:</span><Checkbox checked={isCheck}  onChange={(e) => { this.saveValue(e) }} /></div>	
							
				 </div>
					</div>
			</Modal>
		</div>	
		);
	}
}
export default connect((state) => ({ 
	selectCard: state.zoneSettingData.selectCard
}), {
	})(ReferModal);
