import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Layout } from 'antd';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { setZoneState } from 'Store/AppRegister/action';
import Ajax from 'Pub/js/ajax';
import { GetQuery } from 'Pub/js/utils';
import Notice from 'Components/Notice';
import { withRouter } from 'react-router-dom';

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
	saveZoneData(list,form,type){
		let param = GetQuery(this.props.location.search);
		let url, data;
		url = '/nccloud/platform/templet/settempletarea.do';
		let { zoneDatas } = this.props;
			data = { 
				pk_page_templet: zoneDatas.pk_page_templet,
				pageid: zoneDatas.pageid || param.pid ,
				areaList:list,
				...form,
			}
		
		Ajax({
			url: url,
			data: data,
			info: {
				name: '保存区域',
				action: '保存区域设置'
			},
			success: ({ data }) => {
				if (data.success && data.data) { 
					// type =1 代表保存  type =2 表示下一步  保存binqie
					type === 1 ? (location.hash = '/ar') : (location.hash = `/ZoneSetting?templetid=${data.data.templetid}`);
					Notice({ status: 'success', msg: data.data.true });
				} else {
					Notice({ status: 'error', msg: data.data.true });
				}
			}
		});
	} 

	// 处理按钮的事件  
	handleClick(name){
		let fromData = this.props.zoneFormData();
		let { newListData } = this.props;
		switch (name){
			case '保存': 
				console.log(fromData);
				if (!fromData) {
					return;
				}
				console.log(newListData, fromData);
				this.saveZoneData(newListData, fromData,1);
			break;
			case '下一步':
				console.log(fromData);
				if (!fromData) {
					return;
				}
				console.log(newListData, fromData);
				this.saveZoneData(newListData, fromData, 2);
				break; 
			case '取消':
				location.hash = '/ar';
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
MyBtns = withRouter(MyBtns);
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
