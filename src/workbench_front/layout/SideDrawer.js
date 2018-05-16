import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Drawer from 'react-motion-drawer';
import { changeDrawer } from 'Store/appStore/action';
class SideDrawer extends Component {
	constructor(props) {
		super(props);
	}
	handleDrawerChange = (isOpen) => {
		this.props.changeDrawer(isOpen);
	};
	handleExit = ()=>{
		console.log("退出");
	}
	render() {
		let { isOpen } = this.props;
		return (
			<div className='nc-workbench-drawer'>
				<Drawer className='drawer-content' width={430} overlayColor={'none'} drawerStyle={{top:"48px","box-shadow": "3px 6px 8px 0px rgba(74,81,93,0.25)", 
				"border-radius": "2px 3px 3px 0px" }} open={isOpen} onChange={this.handleDrawerChange}>
					<div className='drawer-exit'>
						<i className='iconfont icon-zhuxiao' onClick={this.handleExit}></i>
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
							<div className='setting-btn'>
								<i className="iconfont icon-bianji"></i>
								<span>个人设置</span>
							</div>
							<div className='setting-btn'>
								<i className="iconfont icon-shezhi"></i>
								<span>账户设置</span>
							</div>
							<div className='setting-btn'>
								<i className="iconfont icon-shezhi"></i>
								<span>个性化设置</span>
							</div>
						</div>
					</div>
					<div className='drawer-link'>
						<ul className='link'>
							<li>
								<span>帮助</span>
							</li>
							<li>
								<span>联系用友服务人员</span>
							</li>
							<li>
								<span>云注册链接</span>
							</li>
							<li>
								<span>日志</span>
							</li>
						</ul>
					</div>
				</Drawer>
			</div>
		);
	}
}
SideDrawer.PropTypes = {
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
)(SideDrawer);
