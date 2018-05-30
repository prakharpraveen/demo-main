import React, { Component } from 'react';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import { connect } from 'react-redux';
import { Input, Icon, Modal, Button } from 'antd';
import * as utilService from './utilService';
import {  updateAreaList } from 'Store/ZoneSetting/action';
import { createPage } from 'nc-lightapp-front';
import  initTemplate  from './events';

class PreviewModal extends Component {
	constructor(props) {
		super(props);
		let { form, button, table, insertTable, search } = this.props;
		let { setSearchValue, setSearchValByField, getAllSearchData } = search;
		this.setSearchValByField = setSearchValByField;//设置查询区某个字段值
		this.getAllSearchData = getAllSearchData;//获取查询区所有字段数据

		this.state = {
			newSource:{}
		};
		
	}
	showModalHidden = ()=>{
        this.props.setModalVisibel(false)
    }
    onOkDialog = ()=>{
	
	}
	saveState = (newSource) =>{
	
		/* this.setState({newSource}) */
	}

	getMeta = (data) =>{

	}

	
	componentDidMount(){
		//let param = getUrlParam('t');
	//	this.props.setZoneTempletid(param);
	
	}
	render() {
		let { table, button, search } = this.props;
		let { NCCreateSearch } = search;

		return (
			<Modal
				title='批量设置-卡片区'
				mask={false}
				wrapClassName='myModal'
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
					<div className="nc-bill-search-area">
						{NCCreateSearch('data', {
						//	onAfterEvent: afterEvent.bind(this),
						//	clickSearchBtn: searchBtnClick.bind(this)
						})}
					</div>
			</Modal>

		);
	}
}

PreviewModal = createPage({
	initTemplate: initTemplate
})(PreviewModal);

export default connect((state) => ({ 
    areaList: state.zoneSettingData.areaList,
}), {
    updateAreaList,
	})(PreviewModal);
