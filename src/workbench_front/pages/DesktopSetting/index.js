import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import './index.less';
// drag && drop
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
//ant
import { Layout } from 'antd';
const { Header } = Layout;
//自定义组件
import MyContentAnchor from './anchor';
import MySider from './sider';
import MyFooter from './footer';
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
		console.log("全部");
		//header 80px, footer 48px, anchor 48px;
		const contentHeight = 'calc(100vh - 176px)';
		const siderHeight = 'calc(100vh - 80px)';
		const anchorHeight = '48px';
		return (
			<Layout>
				{/* Header占位符 */}
				<Header style={{ height: '80px' }}></Header>

				<MyContentAnchor />
			
				<Layout>
					<MySider contentHeight={siderHeight} relateidObj={this.state.relateidObj}/>
					<MyContent contentHeight = {contentHeight}  anchorHeight={anchorHeight}/>
				</Layout>

				<MyFooter relateidObj={this.state.relateidObj}/>
			</Layout>
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