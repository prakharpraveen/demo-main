import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { setNodeData, setBillStatus, setOpType, setAppParamData, setPageButtonData,
// 	setPageTemplateData,
// 	setPrintTemplateData,setParentData } from 'Store/AppRegister/action';
import Ajax from 'Pub/js/ajax';
import { withRouter } from 'react-router-dom';
import PreviewModal from './showPreview';
import 'nc-lightapp-front/dist/platform/nc-lightapp-front/index.css';
/**
 * 工作桌面 配置模板区域
 */
class MyHeader extends Component {
	constructor(props) {
		super(props);
		this.state = { batchSettingModalVisibel:false};
	}
	showModal = ()=>{
		this.setState({ batchSettingModalVisibel:true})
	}
	setModalVisibel = (visibel) => {
		this.setState({ batchSettingModalVisibel: visibel })
	}
	saveData = ()=>{
		const {areaList} = this.props;
		let formPropertyList = [];
		let queryPropertyList = [];
		_.forEach(areaList,(a,index)=>{
			if(a.areatype === '0'){
				queryPropertyList = queryPropertyList.concat(a.queryPropertyList)
			}else{
				formPropertyList = formPropertyList.concat(a.queryPropertyList)
			}
		})
		
		const saveData = {};
		if(formPropertyList.length !==0){
			saveData.formPropertyList = formPropertyList;
		}
		if(queryPropertyList.length !== 0){
			saveData.queryPropertyList = queryPropertyList;
		}

		if(queryPropertyList.length  === 0 && formPropertyList.length === 0){
			return;
		}
		Ajax({
			url: `/nccloud/platform/templet/setareaproperty.do`,
			info: {
				name:'单据模板设置',
				action:'保存区域与属性'
			},
			data: saveData,
			success: (res) => {
				const { data, success } = res.data;
				if (success) {
					this.props.history.push(`/ZoneSettingComplete?templetid=${this.props.templetid}`);
				}
			}
		});
	}
	render() {
		let { batchSettingModalVisibel} = this.state;
		return (
			<div className='template-setting-header'>
				<div className='header-name'>
					<span>配置模板区域</span>
				</div>
				<div className='button-list'>
					<Button onClick={()=>{
							this.props.history.push(`/Zone?t=${this.props.templetid}`)
						}}>上一步</Button>
					<Button onClick={this.saveData}>保存</Button>
					<Button onClick={this.showModal}>预览</Button>
					<Button>取消</Button>
				</div>
				{batchSettingModalVisibel && <PreviewModal
					batchSettingModalVisibel={batchSettingModalVisibel}
					setModalVisibel={this.setModalVisibel}
				/>} 
			</div>
		);
	}
}
export default connect((state) => ({
	areaList: state.zoneSettingData.areaList,
}), {})(withRouter(MyHeader) );
