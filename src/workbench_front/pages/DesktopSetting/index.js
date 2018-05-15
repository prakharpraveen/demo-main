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
import { updateGroupList, updateRelateID } from 'Store/test/action';

class Test extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillMount() {
		
	}

	componentDidMount() {
		const urlRequestObj = GetQuery(this.props.location.search);
		let relateid;
		if(urlRequestObj.pk_responsibility){
			relateid = urlRequestObj.pk_responsibility;
		}
		Ajax({
			url: `/nccloud/platform/appregister/queryapp.do`,
			data: {
				// 'cuserid': '0001Z5100000000396E0'
				relateid: relateid
			},
			success: (res) => {
				if (res) {
					
					let { data, success } = res.data;
					if (success && data && data.length > 0) {
						_.forEach(data[0].groups, (g) => {
							g.type = "group";
							_.forEach(g.apps,(a)=>{
								a.isShadow = false;
							})
						});
						this.props.updateGroupList(data[0].groups);
						this.props.updateRelateID(relateid)
					}
				}
			}
		});
	}

	render() {
		console.log("全部");
		//header 48px,breadcrumb 20px, footer 48px, anchor 48px;
		const anchorHeight = '48px';
		const contentHeight = 'calc(100vh - 164px)';
		const siderHeight = 'calc(100vh - 68px)';
		return (
			<Layout>
				{/* Header占位符 */}
				<Header style={{ height: '48px' }}></Header>

				<div className="bread-crumb" style={{height:'20px'}}>
				面包屑
				</div>

				<MyContentAnchor />
			
				<Layout>
					<MySider contentHeight={siderHeight}/>
					<MyContent contentHeight = {contentHeight}  anchorHeight={anchorHeight}/>
				</Layout>

				<MyFooter />
			</Layout>
		);
	}
}

const draDrop = DragDropContext(HTML5Backend)(Test);

export default connect(
	(state) => ({
	}),
	{
		updateGroupList,
		updateRelateID
	}
)(draDrop);