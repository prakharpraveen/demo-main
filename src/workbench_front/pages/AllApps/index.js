import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import './index.less';
import MyContent from './content.js';
import { connect } from 'react-redux';

class AllApps extends Component {
	constructor(props) {
		super(props);
		this.state = {
			appGroupArr: [],
			contentData:[],
			isSelectModuleID:0
		};
	}

	componentDidMount() {
		Ajax({
			url: `/nccloud/platform/appregister/queryapplazy.do`,
			data: {
				userid: this.props.userID
			},
			success: (res) => {
				const { data, success } = res.data;
				if (success && data && data.length > 0) {
					this.setState({ appGroupArr: data });
				}
			}
		});
	}

	setModuleSelect=(moduleID)=>{
		this.setState({isSelectModuleID:moduleID});
		Ajax({
			url: `/nccloud/platform/appregister/queryapplazy.do`,
			data: {
				own_module: moduleID,
				userid: this.props.userID
			},
			success: (res) => {
				const { data, success } = res.data;
				if (success && data && data.length > 0) {
					console.log(data);
					this.setState({ contentData: data});
				}
			}
		});
	}

	siderGroup = () => {
		return	this.state.appGroupArr.map((item,index) => {
			return (
				<div className='result-group-list' key={index}>
					<h4 className='result-header'>
						<strong
							className='result-header-name'
						>
							&bull; {item.label}
						</strong>
					</h4>
					<div className='result-app-list' >
						{item.children.map((child, i) => {
							return (
								<div className='app-col' key={i}>
									<div className='list-item'>
										<div className={this.state.isSelectModuleID===child.value? 'list-item-content active':'list-item-content'}
										onClick={()=>{this.setModuleSelect(child.value)}}
										>
											<div className='title'>
												<span>{child.label}</span>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			);
		});
	};

	render() {
		const siderGroup = this.siderGroup();
		return (
			<div className='my-layout'>
				<div className='sider' >
					{siderGroup}
				</div>
				<MyContent contentData={this.state.contentData}/>
			</div>
		);
	}
}
export default connect(
	(state) => ({
		userID : state.appData.userID
	}),
	{
		
	}
)(AllApps);
