import React, { Component } from 'react';
import _ from 'lodash';
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
			code: this.state.notMetaDataName,
			metapath: "",
			position: `${queryPropertyList.length + 1}`,
			datatype: '1',
			color:'1',
			componenttype: '0',
			refcode: this.state.notMetaDataName,
			options: '1',
			visible: true,
			disabled: true,
			required: true,
			isenable: true,
			mustuse: true,
			ischeck: true,
			usefunc: true,
			scale: '0',
			maxlength: '20',
			unit: '10',
			ratio: '0',
			formattype: '0',
			width: '11',
			opersign: 'like',
			defaultvalue: '1',
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
	componentWillUpdate =(nextProps, nextState)=>{
		if(!this.props.addDataModalVisibel && nextProps.addDataModalVisibel){
			setTimeout(() => {
				this.refs.addNotMetaDataInputDom.focus();
			  }, 0);
		}
	}
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
					ref="addNotMetaDataInputDom"
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
