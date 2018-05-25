import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Layout } from 'antd';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { setZoneState } from 'Store/AppRegister/action';
import Ajax from 'Pub/js/ajax';
import Notice from 'Components/Notice';


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
class MyBtns extends Component {
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
	// 根据不同的状态 生成不同的按钮 
	creatBtns(Btns){
	return	Btns && Btns.map((item,index) =>{
			return (<Button key={index} className='margin-left-10' type={item.type} onClick={this.handleClick.bind(this, item.name)}>
				{item.name}
			</Button>)
		})
	
	}
	// 保存 区域数据 
	saveZoneData(list,form){
		let url, data;
		url = '/nccloud/platform/templet/settempletarea.do';
		let { zoneDatas } = this.props;
		//if (zoneDatas && zoneDatas.pk_page_templet){
			// 修改 
			data = { 
				pk_page_templet: zoneDatas.pk_page_templet,
				pageid: zoneDatas.pageid,
				areaList:list,
				...form,
			}
	//	}
		
		Ajax({
			url: url,
			data: data,
			info: {
				name: '保存区域',
				action: '保存区域设置'
			},
			success: ({ data }) => {
				if (data.success && data.data) {
					//this.props.setZoneData(data.data);
					// 下一步 
				} else {
					Notice({ status: 'error', msg: data.data.true });
				}
			}
		});
	} 

	// 处理按钮的事件  
	handleClick(name){
		switch (name){
			case '保存': 
				let fromData = this.props.zoneFormData();
				console.log(fromData);
				if (!fromData) {
					return;
				}
				console.log(fromData,'result');
				// 保存 操作 
				let { newListData } = this.props;
				console.log(newListData, fromData);
				this.saveZoneData(newListData, fromData);
				debugger;

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
	   </Header> );
   }
}

export default connect(
	(state) => {
		let { zoneFormData, newListData, zoneDatas } = state.zoneRegisterData;

		return {
			zoneFormData, newListData, zoneDatas
		}
		
	},
	{
		setZoneState
	}
)(MyBtns);
