import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { setNodeData, setBillStatus, setOpType, setAppParamData, setPageButtonData,
// 	setPageTemplateData,
// 	setPrintTemplateData,setParentData } from 'Store/AppRegister/action';
import Ajax from 'Pub/js/ajax';
import './index.less';
import BasicProperty from  './basicProperty';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

class MyRightSider extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {}

	render() {
		return (
			<div className='template-setting-right-sider template-setting-sider'>
				<div className="sider-content">
                <div className="sider-tab">
                <Tabs defaultActiveKey='1' >
					<TabPane tab='显示属性' key='1'>
                    <BasicProperty />
					</TabPane>
					<TabPane tab='高级属性' key='2'>
						Content of Tab Pane 2
					</TabPane>
				</Tabs>
                </div>
                
                </div>
			</div>
		);
	}
}
export default connect((state) => ({}), {})(MyRightSider);
