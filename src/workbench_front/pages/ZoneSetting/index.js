import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { setNodeData, setBillStatus, setOpType, setAppParamData, setPageButtonData,
// 	setPageTemplateData,
// 	setPrintTemplateData,setParentData } from 'Store/AppRegister/action';
import Ajax from 'Pub/js/ajax';

import './index.less';
import MyHeader from './header';
import MyContent from './content';
import MyRightSider from './rightSider';
import { Steps } from 'antd';

import {GetQuery} from 'Pub/js/utils';
const Step = Steps.Step;
/**
 * 工作桌面 配置模板区域
 */
class ZoneSetting extends Component {
	constructor(props) {
		super(props);
		const urlRequestObj = GetQuery(this.props.location.search);
		
		this.state = {
			templetid :urlRequestObj.templetid
		};
	}

	componentDidMount() {}

	render() {
		return (
			<div className='template-setting-page'>
				<div className='template-setting-steps'>
					<Steps size='small' current={1}>
						<Step title='设置页面基本信息' description='完成' />
						<Step title='配置模板区域' description='进行中' />
						<Step title='配置完成' description='' />
					</Steps>
				</div>
				<MyHeader templetid ={this.state.templetid}/>
				<div className='template-setting-container'>
					<MyContent templetid={this.state.templetid}/>
					<MyRightSider />
				</div>
			</div>
		);
	}
}
export default connect((state) => ({}), {})(ZoneSetting);
