// import React, { Component } from 'react';
// import _ from 'lodash';
// import Ajax from 'Pub/js/ajax';
// import { connect } from 'react-redux';
// import { Input, Icon, Modal, Button } from 'antd';
// import * as utilService from './utilService';
// import {  updateAreaList } from 'Store/ZoneSetting/action';

// class AddNotMetaDataModal extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
//             notMetaDataName = ''
// 		};
// 	}
// 	showModalHidden = ()=>{
//         this.props.setAddDataModalVisibel(false)
//     }
//     onOkDialog = ()=>{
//         let {areaList, areaIndex}  = this.props;
//         console.log(this.state.notMetaDataName);
//         console.log(areaList[areaIndex], "修改的区域")
//     }
//     changeNotMetaDataName = (e)=>{
//         console.log(e.target.value, propertyKey)
//     }
// 	render() {
// 		return (
// 			<Modal
// 				title='新增'
// 				mask={false}
// 				wrapClassName='vertical-center-modal'
// 				visible={this.props.addDataModalVisibel}
// 				onOk={this.onOkDialog}
// 				onCancel={this.showModalHidden}
// 				footer={[
// 					<Button
// 						key='submit'
// 						disabled={this.state.notMetaDataName === ''}
// 						type='primary'
// 						onClick={this.onOkDialog}
// 					>
// 						确定
// 					</Button>,
// 					<Button key='back' onClick={this.showModalHidden}>
// 						取消
// 					</Button>
// 				]}
// 			>
//             <span>
//             非元数据名称：
//             </span>
//             <Input placeholder='请输入非元数据名称' value={this.state.notMetaDataName} onChange={this.changeNotMetaDataName}/>
// 			</Modal>
// 		);
// 	}
// }
// export default connect((state) => ({
//     areaList: state.zoneSettingData.areaList,
// }), {
//     updateAreaList,
// })(AddNotMetaDataModal);
