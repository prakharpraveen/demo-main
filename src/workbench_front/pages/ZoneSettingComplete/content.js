import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Icon } from 'antd';
import { withRouter } from 'react-router-dom';
class MyContent extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className='template-setting-content'>
				<div className='content'>
					<Icon className='complete-icon' type='check-circle' />
					
					<div>
						<p className="first-text">应用页面配置完成</p>
						<a onClick={()=>{
							this.props.history.push(`/Zone?t=${this.props.templetid}`)
						}}>继续新增</a>
						<a onClick={()=>{
							this.props.history.push(`/ar?n=应用注册&c=102202APP`)
						}}>返回页面配置</a>
					</div>
				</div>
			</div>
		);
	}
}
export default  withRouter(MyContent);
