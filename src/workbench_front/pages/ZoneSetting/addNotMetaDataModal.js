import React, { Component } from 'react';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import { connect } from 'react-redux';
import { Input, Icon, Modal, Button } from 'antd';
import * as utilService from './utilService';
import { updateAreaList } from 'Store/ZoneSetting/action';

class AddNotMetaDataModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			notMetaDataName: ''
		};
	}
	showModalHidden = () => {
		this.props.setAddDataModalVisibel(false);
	};
	onOkDialog = () => {
		let { areaList, areaIndex } = this.props;
		let queryPropertyList = areaList[areaIndex].queryPropertyList;
		// areaList[areaIndex].queryPropertyList = _.cloneDeep(areaList[areaIndex].queryPropertyList);
		areaList[areaIndex].queryPropertyList = queryPropertyList.concat({
			pk_query_property: 'newNotMetaData' + new Date().getTime(),
			areaid: areaList[areaIndex].pk_area,
			label: this.state.notMetaDataName,
			code: 'user_code',
			metapath: 'user_code',
			componenttype: '0',
			refcode: '1',
			options: '1',
			disabled: '0',
			visible: '0',
			scale: '0',
			required: '0',
			maxlength: '20',
			unit: '10',
			ratio: '0',
			formattype: '0',
			width: '11',
			isenable: '0',
			mustuse: '0',
			position: '236',
			opersign: 'like',
			defaultvalue: '1',
			iscondition: '0',
			datatype: '0',
			ischeck: '0',
			usefunc: '0',
			showtype: '0',
			returntype: '0',
			dr: '0',
			status: '0',
			m_isDirty: false
		});
		this.setState({ notMetaDataName: '' });
		this.props.updateAreaList(areaList);
		this.showModalHidden();
	};
	onPressEnter = () => {
		if (this.state.notMetaDataName === '') {
			return;
		}
		this.onOkDialog();
	};
	changeNotMetaDataName = (e) => {
		this.setState({ notMetaDataName: e.target.value });
	};
	render() {
		return (
			<Modal
				title='新增'
				mask={false}
				wrapClassName='vertical-center-modal add-not-meta-data'
				visible={this.props.addDataModalVisibel}
				onOk={this.onOkDialog}
				onCancel={this.showModalHidden}
				footer={[
					<Button
						key='submit'
						disabled={this.state.notMetaDataName === ''}
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
				<span>非元数据名称：</span>
				<Input
					placeholder='请输入非元数据名称'
					value={this.state.notMetaDataName}
					onChange={this.changeNotMetaDataName}
					onPressEnter={this.onPressEnter}
				/>
			</Modal>
		);
	}
}
export default connect(
	(state) => ({
		areaList: state.zoneSettingData.areaList
	}),
	{
		updateAreaList
	}
)(AddNotMetaDataModal);
