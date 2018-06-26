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
		let cardObj = {};
		if(this.props.areatype === '0'){
			//查询区
			cardObj = {
				pk_query_property: 'newNotMetaData' + new Date().getTime(),
				areaid: areaList[areaIndex].pk_area,
				label: this.state.notMetaDataName,
				code: this.state.notMetaDataName,
				metapath: "",
				position: `${queryPropertyList.length + 1}`,
				opersign:'=@>@>=@<@<=@like@',
				opersignname:'等于@大于@大于等于@小于@小于等于@相似@',
				defaultvalue:'',
				isfixedcondition:false,
				required:false,
				visible:true,
				isquerycondition:false,
				datatype: '1',
				refname: '-99',
				containlower:false,
				ischeck:false,
				isbeyondorg: false,
				usefunc: false,
				showtype: '1',
				returntype: '1',
				define1: "",
				define2: "",
				define3: "",
				define4: "",
				define5: "",
				itemtype:'input'
			}
		}else{//非查询区
			cardObj = {
				pk_query_property: 'newNotMetaData' + new Date().getTime(),
				areaid: areaList[areaIndex].pk_area,
				code: this.state.notMetaDataName,
				datatype: '1',
				label: this.state.notMetaDataName,
				position: `${queryPropertyList.length + 1}`,
				metapath: '',
				color: '#6E6E77',
				width: '6',
				isrevise:false,
				istotal:false,
				required:false,
				disabled: false,
				visible: true,
				maxlength: '20',
				textrows: '1',
				leftspace: '0',
				rightspace: '0',
				defaultvar: '',
				define1: "",
				define2: "",
				define3: "",
				itemtype:'input'
			}
		}
		if(this.props.targetAreaType === '2'){
			cardObj.width = '';
		}
		areaList[areaIndex].queryPropertyList = queryPropertyList.concat(cardObj);
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
