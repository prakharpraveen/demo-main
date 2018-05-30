import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { setNodeData, setBillStatus, setOpType, setAppParamData, setPageButtonData,
// 	setPageTemplateData,
// 	setPrintTemplateData,setParentData } from 'Store/AppRegister/action';
import Ajax from 'Pub/js/ajax';
import './index.less';
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
	render() {
		return (
			<div className='template-setting-header'>
				<div className='header-name'>
					<span>配置模板区域</span>
				</div>
				<div className='button-list'>
					<Button>上一步</Button>
					<Button>保存</Button>
					<Button onClick={this.showModal}>预览</Button>
					<Button>取消</Button>
				</div>
				<PreviewModal
					batchSettingModalVisibel={this.state.batchSettingModalVisibel}
					setModalVisibel={this.setModalVisibel}
				/>
			</div>
		);
	}
}
export default connect((state) => ({}), {})(MyHeader);
