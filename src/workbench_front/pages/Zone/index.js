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
import './index.less';
const { Header, Footer, Sider, Content } = Layout;
/**
 * 工作桌面 配置模板区域
 */
class AppRegister extends Component {
	constructor(props) {
		super(props);
		this.state = {
			siderHeight: '280'
		};
	}

	render() {
		return (
			<PageLayout className='nc-workbench-appRegister'>
				<Layout>
					<Myheight/>
					<Layout height={'100%'}>
						<Content style={{ padding: '20px', minHeight: 280 }}>
							<ModuleFromCard/>
							<div class='gap'></div>	
								<AppTable />
						</Content>
					</Layout> 
				</Layout>
			</PageLayout>
		);
	}
}
/* AppRegister.PropTypes = {
	setTreeData: PropTypes.func.isRequired,
	optype: PropTypes.string.isRequired,
	billStatus: PropTypes.object.isRequired,
	setBillStatus: PropTypes.object.isRequired,
	parentData: PropTypes.string.isRequired,
	setOpType: PropTypes.func.isRequired,
	nodeData: PropTypes.object.isRequired,
	setAppParamData: PropTypes.func.isRequired,
	setPageButtonData: PropTypes.func.isRequired,
	setPageTemplateData: PropTypes.func.isRequired,
	setPrintTemplateData: PropTypes.func.isRequired,
	getFromData: PropTypes.func.isRequired,
	addTreeData: PropTypes.func.isRequired,
	delTreeData: PropTypes.func.isRequired,
	updateTreeData: PropTypes.func.isRequired,
	setParentData: PropTypes.func.isRequired,
	reqTreeData: PropTypes.func.isRequired,
}; */
export default connect(
	(state) => ({
		optype: state.AppRegisterData.optype,
		billStatus: state.AppRegisterData.billStatus,
		parentData: state.AppRegisterData.parentData,
		nodeData: state.AppRegisterData.nodeData,
		getFromData: state.AppRegisterData.getFromData,
		addTreeData: state.AppRegisterData.addTreeData,
		delTreeData: state.AppRegisterData.delTreeData,
		updateTreeData: state.AppRegisterData.updateTreeData,
		reqTreeData: state.AppRegisterData.reqTreeData
	}),
	{
		setNodeData,
		setBillStatus,
		setOpType,
		setAppParamData,
		setPageButtonData,
		setPageTemplateData,
		setPrintTemplateData,
		setParentData
	}
)(AppRegister);
