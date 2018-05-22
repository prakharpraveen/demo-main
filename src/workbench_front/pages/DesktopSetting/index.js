import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import './index.less';
// drag && drop
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
//自定义组件
import MySider from './sider';
import MyContent from './content';
import {GetQuery} from 'Pub/js/utils';
import { connect } from 'react-redux';
import * as utilService from './utilService';
import { updateGroupList } from 'Store/test/action';

@DragDropContext(HTML5Backend)
class Test extends Component {
	constructor(props) {
		super(props);
		const urlRequestObj = GetQuery(this.props.location.search);
		const relateidObj = utilService.getRelateidObj(urlRequestObj.pk_responsibility, this.props.userID)
		this.state = {
			relateidObj:relateidObj
		};
	}

	componentWillMount() {
		
	}

	componentDidMount() {
		
		Ajax({
			url: `/nccloud/platform/appregister/queryapp.do`,
			data: {
				relateid: this.state.relateidObj.data
			},
			success: (res) => {
				if (res) {
					let { data, success } = res.data;
					if (success && data ) {
						if(data.length > 0){
							_.forEach(data[0].groups, (g) => {
								g.type = "group";
								_.forEach(g.apps,(a)=>{
									a.isShadow = false;
									a.isChecked = false;
								})
							});
							this.props.updateGroupList(data[0].groups);
						}
					}
				}
			}
		});
	}

	render() {
		//header 80px, footer 48px, anchor 48px;
		return (
			<div className="nc-desktop-setting">
					<MySider relateidObj={this.state.relateidObj}/>
					
					<MyContent relateidObj={this.state.relateidObj}/>
					
			</div>
		);
	}
}

// const draDrop = DragDropContext(HTML5Backend)(Test);

export default connect(
	(state) => ({
		userID : state.appData.userID
	}),
	{
		updateGroupList
	}
)(Test);