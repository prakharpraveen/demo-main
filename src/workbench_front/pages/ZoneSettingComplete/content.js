import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import { GetQuery } from 'Pub/js/utils';
// let param = GetQuery(this.props.location.search);
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
							let param = GetQuery(this.props.location.search);
							this.props.history.push(`/Zone?pcode=${param.pcode}&pid=${param.pid}`)
						}}>继续新增模板</a>
						<a onClick={()=>{
							let param = GetQuery(this.props.location.search);
							this.props.history.push(`/ar?n=应用注册&c=102202APP&pcode=${param.pcode}&pid=${param.pid}`)
						}}>返回页面配置</a>
					</div>
				</div>
			</div>
		);
	}
}
export default  withRouter(MyContent);
