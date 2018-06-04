import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { setNodeData, setBillStatus, setOpType, setAppParamData, setPageButtonData,
// 	setPageTemplateData,
// 	setPrintTemplateData,setParentData } from 'Store/AppRegister/action';
import Ajax from 'Pub/js/ajax';
import './index.less';
import BasicProperty from './basicProperty';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import { updateSelectCard, updateAreaList } from 'Store/ZoneSetting/action';

class MyRightSider extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {}

	//
	getMetaType = (selectCard) => {
		if (!!selectCard.metapath) return true; // 是元数据
		return false; // 不是元数据 默认没选的情况是false
	};
	//
	getAreaType = (areaList, selectCard) => {
		let result;
		_.forEach(areaList, (val, index) => {
			_.forEach(val.queryPropertyList, (v, i) => {
				if (selectCard.areaid === v.areaid) {
					result = val.areatype;
					//	return ;
				}
			});
		});
		return result === '0' ? true : false;
	};

	getDom1 = () => {
		return (
			<Tabs defaultActiveKey='1'>
				<TabPane tab='显示属性' key='1' />
				<TabPane tab='高级属性' key='2' />
			</Tabs>
		);
	};
	getDom2 = (datype) => {
		return (
			<Tabs defaultActiveKey='1'>
				<TabPane tab='显示属性' key='1'>
					```
				</TabPane>
				<TabPane tab='高级属性' key='2'>
					22
				</TabPane>
			</Tabs>
		);
	};

	getDom3 = () => {};

	getDom4 = () => {};
	render() {
		const { selectCard, areaList } = this.props;
		// 1 判断是否是元数据 2 判断所属的类型是否是查询区  默认是 不是元数据 不是查询区
		let isMetaData = this.getMetaType(selectCard),
			isSearch = this.getAreaType(areaList, selectCard);
		let result_div;

		if (isSearch) {
			//不区分显示属性和高级属性
			if (isMetaData) {
				//元数据中metapath 和datatype和类型设置 为只读
				result_div = this.getDom1();
			} else {
				//非元数据metapath为空且只读，datatype和类型设置 为可以设置
				result_div = this.getDom2();
			}
		} else {
			//
			if (isMetaData) {
				//非查询区，元数据
				result_div = this.getDom3();
			} else {
				//非查询区，非元数据
				result_div = this.getDom4();
			}
		}

		return (
			<div className='template-setting-right-sider template-setting-sider'>
				<div className='sider-content'>
					<div className='sider-tab'>{result_div}</div>
				</div>
			</div>
		);
	}
}
export default connect(
	(state) => ({
		areaList: state.zoneSettingData.areaList,
		selectCard: state.zoneSettingData.selectCard
	}),
	{
		updateAreaList,
		updateSelectCard
	}
)(MyRightSider);
