import React, { Component } from 'react';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import { connect } from 'react-redux';
import { Input, Icon, Modal, Button, Select, Checkbox } from 'antd';
import * as utilService from './utilService';
import { updateAreaList } from 'Store/ZoneSetting/action';
const Option = Select.Option;
// sunlei
class ReferModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initVal: this.props.initVal,
			isCheck: this.props.iscode,
			option: []
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.modalVisibel !== true) {
			return;
		} else {
			this.setState({ initVal: nextProps.initVal, isCheck: nextProps.iscode });
			let url, data;
			url = '/nccloud/platform/templet/queryrefinfo.do';
			data = {
				defdoc: nextProps.selectCard && nextProps.selectCard.metaid
			};
			Ajax({
				url: url,
				data: data,
				info: {
					name: '参照',
					action: '查询参照'
				},
				success: ({ data }) => {
					if (data.success && data.data) {
						this.setState({ option: data.data });
					} else {
						Notice({ status: 'error', msg: data.data.true });
					}
				}
			});
		}
	}

	showModalHidden = () => {
		this.props.setModalVisibel('refer', false);
	};
	onOkDialog = () => {
		let { initVal, isCheck } = this.state;
		Ajax({
			url: `/nccloud/platform/templet/getMetaByRefName.do`,
			info: {
				scode: '关联元数据',
				action: '获取元数据数据'
			},
			data: {
				iscode: isCheck ? 'N' : 'Y',
				refname: initVal
			},
			success: (res) => {
				if (res) {
					let { data, success } = res.data;
					if (success && data) {
						// 设置元数据属性
						this.props.handleSelectChange(data, 'metadataproperty');
						//设置参照refname
						this.props.handleSelectChange(initVal, 'refname');
						// 设置参照名称
						this.props.handleSelectChange(initVal, 'dataval');
						// 设置iscode
						this.props.handleSelectChange(isCheck, 'iscode');
					}
				}
			}
		});
		this.showModalHidden();
	};
	handleSelectChange = (val) => {
		this.setState({ initVal: val });
	};
	saveValue = (e, type) => {
		let val;
		val = e.target.checked;
		this.setState({ isCheck: val });
	};
	render() {
		let { isCheck, option, initVal } = this.state;
		console.log(initVal, isCheck, this.props.selectCard);
		return (
			<div className='myZoneModal'>
				<Modal
					title='参照类型设置'
					mask={false}
					wrapClassName='zonesetting-referModal'
					visible={this.props.modalVisibel}
					onOk={this.onOkDialog}
					destroyOnClose={true}
					onCancel={this.showModalHidden}
					footer={[
						<Button
							key='submit'
							// disabled={}
							type='primary'
							onClick={this.onOkDialog}
						>
							确定
						</Button>,
						<Button key='back' onClick={this.showModalHidden}>
							取消
						</Button>
					]}
				>
					<div>
						<div className='descrip_label'>参照设置 </div>
						<div className='mdcontent'>
							<div>
								<span className='refer_label'>参照选择:</span>
								<Select
									showSearch
									optionFilterProp='children'
									filterOption={(input, option) =>
										option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
									value={initVal}
									onChange={(value) => {
										this.handleSelectChange(value);
									}}
									style={{ width: 200 }}
								>
									{option.map((c, index) => {
										return (
											<Option key={index} value={c.name}>
												{c.name}
											</Option>
										);
									})}
								</Select>
							</div>
						</div>
					</div>
					<div>
						<div className='descrip_label'>关联设置 </div>
						<div className='mdcontent'>
							<div>
								<span className='refer_label'>焦点离开后参照显示名称:</span>
								<Checkbox
									checked={isCheck}
									onChange={(e) => {
										this.saveValue(e);
									}}
								/>
							</div>
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}
export default connect(
	(state) => ({
		selectCard: state.zoneSettingData.selectCard
	}),
	{}
)(ReferModal);
