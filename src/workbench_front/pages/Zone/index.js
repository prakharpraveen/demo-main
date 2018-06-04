import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Layout } from 'antd';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { setZoneData, setZoneTempletid } from 'Store/Zone/action';
import Ajax from 'Pub/js/ajax';
import ModuleFromCard from './ModuleFromCard';
import { PageLayout } from 'Components/PageLayout';
import Notice from 'Components/Notice';
import ZoneTable from './ZoneTable';
import MyBtns from './MyBtns';
import Myhead from './Myhead';
import { GetQuery } from 'Pub/js/utils';
import './index.less';
const { Header, Footer, Sider, Content } = Layout;

/**
 * 区域配置页面 
 */
class ZoneRegister extends Component {
	constructor(props) {
		super(props);
	}

	/** 
	* 获取页面具体数据 
	*/
	componentDidMount() {
		let param = GetQuery(this.props.location.search);
		this.props.setZoneTempletid(param.t);
		let url, data;
		url = '/nccloud/platform/templet/queryallarea.do';
		data = {
			templetid: param && param.t
		};
		Ajax({
			url: url,
			data: data,
			info: {
				name: '区域设置',
				action: '传递区域数值'
			},
			success: ({ data }) => {
				if (data.success && data.data) {
					this.props.setZoneData(data.data[0]);
				} else {
					Notice({ status: 'error', msg: data.data.true });
				}
			}
		});
	}

	render() {
		return (
			<PageLayout className="nc-workbench-ZoneRegister">
				<Layout>
					<Myhead />
					<Layout>
						<MyBtns />
						<Layout height={'100%'}>
							<Content style={{ padding: '20px', minHeight: 280 }}>
								<ModuleFromCard />
								<div className="gap" />
								<ZoneTable />
							</Content>
						</Layout>
					</Layout>
				</Layout>
			</PageLayout>
		);
	}
}
export default connect((state) => ({}), {
	setZoneData,
	setZoneTempletid
})(ZoneRegister);
