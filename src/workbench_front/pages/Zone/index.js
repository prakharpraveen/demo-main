import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Layout } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setNodeData, setBillStatus, setOpType, setAppParamData, setPageButtonData,
	setPageTemplateData,
	setPrintTemplateData,setParentData } from 'Store/AppRegister/action';
import Ajax from 'Pub/js/ajax';
import ModuleFromCard from './ModuleFromCard';
import PageLayout from 'Components/PageLayout';
import Notice from 'Components/Notice';
import AppTable from './AppTable';
import Myheight from './Myheight';
import Myhead from './Myhead';
import './index.less';
const { Header, Footer, Sider, Content } = Layout;
/**
 * 区域配置页面 
 */
class ZoneRegister extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<PageLayout className='nc-workbench-appRegister'>
				<Layout>
					<Myhead/>
					<Layout>
						<Myheight />
					<Layout height={'100%'}>
						<Content style={{ padding: '20px', minHeight: 280 }}>
							<ModuleFromCard/>
							<div className='gap'></div>	
								<AppTable  />
						</Content>
					</Layout> 
				</Layout>
			</Layout>
			</PageLayout>
		);
	}
}
export default connect(
	(state) => ({
	}),
	{

	}
)(ZoneRegister);
