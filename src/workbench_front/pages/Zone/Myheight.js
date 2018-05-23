import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Layout } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setZoneState } from 'Store/AppRegister/action';
import Ajax from 'Pub/js/ajax';

import Notice from 'Components/Notice';
 //import { window } from '_rxjs@5.5.10@rxjs/operator/window';

const { Header } = Layout;
/**
 * 工作桌面 配置模板区域
 */
const Btns = [	
	{
		name: '取消',
	//	type: 'primary'
	},
	{
		name: '保存',
		//	type: 'primary'
	},
	{
		name: '下一步',
		type: 'primary'
	}
];
class Myheight extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siderHeight: '280',
			state:'browse'
		};
	}
	// 初始化设置按钮的状态 
	componentDidMount(){
		console.log('ddd');
	//	this.props.setZoneState('browse');
	}
	// 根据不同的状态 生成不同的按钮 
	creatBtns(Btns){
	return	Btns && Btns.map((item,index) =>{
			return (<Button key={index} className='margin-left-10' type={item.type} onClick={this.handleClick.bind(this, item.name)}>
				{item.name}
			</Button>)
		})
	
	}
	// 处理按钮的事件  
	handleClick(name){
		switch (name){
			case '保存': 
				let fromData = this.props.getFromData();
				console.log(fromData);
				if (!fromData) {
					return;
				}
				console.log(fromData,'result')
			break;
			case '下一步':
				break; 
			case '取消':
				break;
			case '返回':
				history.back();
				console.log(this);
				break;
		}
	}
	render() {
		return ( 
		<Header>
			    <div className='myHead'>
					<div>
						<span className='btn_span' onClick={this.handleClick.bind(this,'返回')}> 返回</span>
						<span>基本信息</span>
					</div>
					<div>{this.creatBtns(Btns)}</div>
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
)(Myheight);