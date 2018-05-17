import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
		sprType = sprLog(sprType);
		console.log(sprType);
		this.setState({ sprType });
	}
	render() {
		let { isOpen } = this.props;
		let { sprType } = this.state;
		return (
			<div className='nc-workbench-drawer'>
				<Drawer className='drawer-content' width={430} overlayColor={'none'} drawerStyle={{top:"48px","boxShadow": "3px 6px 8px 0px rgba(74,81,93,0.25)", 
				"borderRadius": "2px 3px 3px 0px" }} open={isOpen} onChange={this.handleDrawerChange}>
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
								<span onClick={this.handleSprClick}>{sprType?`开始录制SPR`:`结束录制SPR`}</span>
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
)(SideDrawer);
