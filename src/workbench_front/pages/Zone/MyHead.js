import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Layout } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setZoneState } from 'Store/AppRegister/action';
import Ajax from 'Pub/js/ajax';
import Notice from 'Components/Notice';
const { Header } = Layout;
/**
 * 工作桌面 完成步骤 
 */

class MyHead extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siderHeight: '280',
			state:'browse'
		};
	}
	// 初始化设置按钮的状态 
	componentDidMount(){
		
	//	this.props.setZoneState('browse');
	}


	render() {
		return ( 
		<Header>
				<div className='step'>
					<div>
						第一步
					</div>
					<div>
						第二步
					</div>
					<div>
						第三步
					</div>
				</div>			
	   </Header>
			   );
	     }
}

export default connect(
	(state) => ({
		zoneState: state.AppRegisterData.zoneState,
		getFromData: state.AppRegisterData.getFromData,
	}),
	{
		setZoneState
	}
)(MyHead);
