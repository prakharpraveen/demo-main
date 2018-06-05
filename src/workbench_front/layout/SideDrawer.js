import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link,withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Drawer from 'react-motion-drawer';
import { changeDrawer } from 'Store/appStore/action';
import { sprLog } from './spr';
class SideDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sprType: true
		}
	}
	handleDrawerChange = (isOpen) => {
		this.props.changeDrawer(isOpen);
	};
	/**
	 * 侧边栏当前页跳转页面
	 * 采用单页路由方式
	 * @param {String} target 跳转目标页面路由
	 */
	handeleSkipPage = (target) =>{
		let {isOpen} = this.props;
		this.props.history.push(target);
		this.props.changeDrawer(!isOpen);
	}
	/**
	 * 注销操作
	 */
	handleExit = ()=>{
		console.log("退出");
	}
	/**
	 * spr录制
	 */
	handleSprClick = ()=>{
		let { sprType } = this.state;
		sprType = sprLog(sprType,(sprType)=>{this.setState({ sprType })});
	}
	render() {
		let { isOpen } = this.props;
		let { sprType } = this.state;
		return (
			<div className='nc-workbench-drawer'>
				<Drawer className='drawer-content' width={430} overlayColor={'none'} drawerStyle={{top:"48px","border":"1px solid rgba(78, 89, 104, 0.19)","boxShadow": "3px 6px 8px 0px rgba(74,81,93,0.25)", 
				"borderRadius": "2px 3px 3px 0px" }} open={isOpen} onChange={this.handleDrawerChange}>
					<div className='drawer-exit'>
						<i field="logout" fieldname="注销" className='iconfont icon-zhuxiao' onClick={this.handleExit}></i>
					</div>
					<div className='drawer-info'>
						<div className='info'>
							<div className='drawer-logo'>
									<img src='http://www.qqzhi.com/uploadpic/2014-09-23/000247589.jpg' alt='logo' />
							</div>
							<span className='name'>
								用户名称
							</span>
						</div>
					</div>
					<div className='drawer-setting'>
						<div className='setting-content'>
							<div onClick={()=>{this.handeleSkipPage('/ds?n=个人配置')}} className='setting-btn' >
								<i className="iconfont icon-bianji"></i>
								<span field="setting" fieldname="个人配置">个人配置</span>
							</div>
							<div  className='setting-btn'>
								<i className="iconfont icon-shezhi"></i>
								<span field="account" fieldname="账户设置">账户设置</span>
							</div>
							<div  onClick={()=>{this.handeleSkipPage('/c?n=个性化设置')}} className='setting-btn'>
								<i field="logout" fieldname="注销" className="iconfont icon-shezhi"></i>
								<span field="customize" fieldname="个性化设置">个性化设置</span>
							</div>
						</div>
					</div>
					<div className='drawer-link'>
						<ul className='link'>
							<li>
								<span  field="help" fieldname="帮助">帮助</span>
							</li>
							<li>
								<span  field="contact" fieldname="联系用友服务人员">联系用友服务人员</span>
							</li>
							<li>
								<span  field="register" fieldname="云注册链接">云注册链接</span>
							</li>
							<li>
								<span  field="spr" fieldname="录制SPR" onClick={this.handleSprClick}>{sprType?`开始录制SPR`:`结束录制SPR`}</span>
							</li>
							<li>
								<span  field="log" fieldname="日志">日志</span>
							</li>
						</ul>
					</div>
				</Drawer>
			</div>
		);
	}
}
SideDrawer.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	changeDrawer: PropTypes.func.isRequired
};
export default connect(
	(state) => ({
		isOpen: state.appData.isOpen
	}),
	{
		changeDrawer
	}
)(withRouter(SideDrawer));
