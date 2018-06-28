import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Ajax from 'Pub/js/ajax';
import Notice from 'Components/Notice';
import { withRouter } from 'react-router-dom';
import PreviewModal from './showPreview';
import { GetQuery } from 'Pub/js/utils';
/**
 * 工作桌面 配置模板区域
 */

class MyHeader extends Component {
	constructor(props) {
		super(props);
		this.state = { batchSettingModalVisibel: false };
	}
	showModal = () => {
		this.setState({ batchSettingModalVisibel: true });
	};
	setModalVisibel = (visibel) => {
		this.setState({ batchSettingModalVisibel: visibel });
	};
	saveData = () => {
		const { areaList } = this.props;
		let formPropertyList = [];
		let queryPropertyList = [];
		_.forEach(areaList, (a, index) => {
			if (a.areatype === '0') {
				queryPropertyList = queryPropertyList.concat(a.queryPropertyList);
			} else {
				formPropertyList = formPropertyList.concat(a.queryPropertyList);
			}
		});

		const saveData = {};
		if (formPropertyList.length !== 0) {
			saveData.formPropertyList = formPropertyList;
		}
		if (queryPropertyList.length !== 0) {
			saveData.queryPropertyList = queryPropertyList;
		}

		if (queryPropertyList.length === 0 && formPropertyList.length === 0) {
			return;
		}
		Ajax({
			url: `/nccloud/platform/templet/setareaproperty.do`,
			info: {
				name: '单据模板设置',
				action: '保存区域与属性'
			},
			data: saveData,
			success: (res) => {
				let param = GetQuery(this.props.location.search);
				const { data, success } = res.data;
				if (success) {
					Notice({ status: 'success', msg: data });
					if (this.props.status) {
						this.props.history.push(`/templateSetting`);
						return;
					}
					this.props.history.push(`/ZoneSettingComplete?templetid=${this.props.templetid}&pcode=${param.pcode}&pid=${param.pid}&appcode=${param.appcode}`);
				}else{
					Notice({ status: 'error', msg: data });
				}
			}
		});
	};
	render() {
		let { batchSettingModalVisibel } = this.state;
		return (
			<div className='template-setting-header'>
				<div className='header-name'>
					<span>配置模板区域</span>
				</div>
				<div className='button-list'>
					<Popconfirm
						title='确定返回上一个页面吗？'
						onConfirm={() => {
							let param = GetQuery(this.props.location.search);
							this.props.history.push(
								`/Zone?t=${this.props.templetid}&pcode=${param.pcode}&pid=${param.pid}&appcode=${param.appcode}`
							);
						}}
						placement='top'
						okText='确定'
						cancelText='取消'
					>
						<Button>上一步</Button>
					</Popconfirm>

					<Button onClick={this.saveData}>保存</Button>
					<Button onClick={this.showModal}>预览</Button>
					<Popconfirm
						title='确定取消配置？'
						onConfirm={() => {
							let param = GetQuery(this.props.location.search);
							this.props.history.push(`/ar?n=应用注册&c=102202APP&b1=动态建模平台&b2=开发配置&b3=应用管理`)
						}}
						placement='top'
						okText='确定'
						cancelText='取消'
					>
						<Button>取消</Button>
					</Popconfirm>
				</div>
				{batchSettingModalVisibel && (
					<PreviewModal
						batchSettingModalVisibel={batchSettingModalVisibel}
						setModalVisibel={this.setModalVisibel}
					/>
				)}
			</div>
		);
	}
}
export default connect(
	(state) => ({
		areaList: state.zoneSettingData.areaList
	}),
	{}
)(withRouter(MyHeader));
