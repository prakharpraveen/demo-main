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
	render() {
		let { isOpen } = this.props;
		return (
			<Drawer className='nc-workbench-drawer' open={isOpen} onChange={this.handleDrawerChange}>
				<div className='drawer-top'>
					<div className='drawer-logo'>
						<img src='http://www.qqzhi.com/uploadpic/2014-09-23/000247589.jpg' alt='logo' />
					</div>
				</div>
				<div className='drawer-buttom'>
					{/* <ul>
                    <li>
                        <Link to='/ar'>添加应用</Link>
                    </li>
                </ul> */}
				</div>
			</Drawer>
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
