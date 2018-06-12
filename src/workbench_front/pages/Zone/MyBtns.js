import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Layout } from 'antd';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { setZoneData, setZoneTempletid } from 'Store/Zone/action';
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
	},
	{
		name: '保存',
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
		let url, datas;
		url = '/nccloud/platform/templet/settempletarea.do';
		let { zoneDatas } = this.props;
			datas = { 
				pk_page_templet: zoneDatas.pk_page_templet,
				pagecode: zoneDatas.pagecode || param.pcode, 
				pageid: zoneDatas.pageid || param.pid ,
				areaList:list,
				...form,
			}
		
		Ajax({
			url: url,
			data: datas,
			info: {
				name: '保存区域',
				action: '保存区域设置'
			},
			success: ({ data }) => {
				if (data.success && data.data) { 
					this.props.setZoneData({});
					// type =1 代表保存  type =2 表示下一步 
					type === 1 ? (this.props.history.push(`/ar?n=应用注册&c=102202APP&pcode=${datas.code}&pid=${datas.pageid}`)) : (this.props.history.push(`/ZoneSetting?templetid=${data.data.templetid}&pcode=${datas.pagecode}&pid=${datas.pageid}`));
					//Notice({ status: 'success', msg: data.data.true });
				}
			}
		});
	} 

	// 处理按钮的事件  
	handleClick(name){
		let { zoneDatas } = this.props;
		let param = GetQuery(this.props.location.search);
		let  datas = {
			pagecode: zoneDatas.pagecode || param.pcode,
			pageid: zoneDatas.pageid || param.pid,
		}
		let fromData = this.props.zoneFormData();
		let { newListData } = this.props;
		switch (name){
			case '保存': 
				if (!fromData) {
					return;
				}
				this.saveZoneData(newListData, fromData,1);
			break;
			case '下一步':
				if (!fromData) {
					return;
				}
				this.saveZoneData(newListData, fromData, 2);
				break; 
			case '取消':
			debugger;
				this.props.history.push(`/ar?n=应用注册&c=102202APP&pcode=${datas.code}&pid=${datas.pageid}`)
			//	location.hash = '/ar';
				break;
			case '返回':
				history.back();
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
		setZoneData
	}
)(MyBtns);
