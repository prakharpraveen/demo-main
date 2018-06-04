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
import { Tabs, Input, Checkbox, InputNumber, Select } from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import * as utilService from './utilService';
import { updateSelectCard, updateAreaList } from 'Store/ZoneSetting/action';
import InterModal from './interModal';
import MoneyModal from './moneyModal';
class MyRightSider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			interModalVal: false,
			moneyModalVisibel:false,
		};
	}

	componentDidMount() {}

	changeValue = (value, propertyKey) => {
		let { selectCard } = this.props;
		if (_.isEmpty(selectCard)) {
			console.log('empty');
			return;
		}

		selectCard = { ...selectCard };
		selectCard[propertyKey] = value;
		this.props.updateSelectCard(selectCard);
	};
	updateCardInArea = (propertyKey) => {
		let { areaList, selectCard } = this.props;
		if (_.isEmpty(selectCard)) {
			console.log('empty');
			return;
		}
		let targetAreaIndex = 0;
		let targetCardIndex = 0;
		areaList = _.cloneDeep(areaList);
		_.forEach(areaList, (a, i) => {
			_.forEach(a.queryPropertyList, (q, index) => {
				if (q.areaid === selectCard.areaid && q.pk_query_property === selectCard.pk_query_property) {
					targetAreaIndex = i;
					targetCardIndex = index;
					return false;
				}
			});
		});
		areaList[targetAreaIndex].queryPropertyList[targetCardIndex][propertyKey] = selectCard[propertyKey];
		this.props.updateAreaList(areaList);
	};
	changeCheckboxValue = (value, property) => {
		let { selectCard } = this.props;
		if (_.isEmpty(selectCard)) {
			return;
		}
		selectCard = { ...selectCard };
		let targetValue = -1;
		if (value) {
			targetValue = '1';
		} else {
			targetValue = '0';
		}
		selectCard[property] = targetValue;
		this.asyncUpdateSelectCard(selectCard).then(() => {
			this.updateCardInArea(property);
		});
	};
	onPressEnter = (value, property) => {
		this[`${property}input`].blur();
	};

	getMyNumberInput = (placeholder, property) => {
		return (
			<InputNumber
				min={1}
				value={this.props.selectCard[property]}
				onChange={(value) => {
					this.changeValue(value, property);
				}}
				onBlur={(e) => {
					this.updateCardInArea(property);
				}}
				ref={(input) => (this[`${property}input`] = input)}
				onPressEnter={(e) => {
					this.onPressEnter(e.target.value, property);
				}}
			/>
		);
	};

	getMyInput(placeholder, property) {
		return (
			<Input
				placeholder={placeholder}
				value={this.props.selectCard[property]}
				onChange={(e) => {
					this.changeValue(e.target.value, property);
				}}
				onBlur={(e) => {
					this.updateCardInArea(property);
				}}
				ref={(input) => (this[`${property}input`] = input)}
				onPressEnter={(e) => {
					this.onPressEnter(e.target.value, property);
				}}
			/>
		);
	}

	getMyCheckbox = (property) => {
		return (
			<Checkbox
				checked={Boolean(this.props.selectCard[property])}
				onChange={(e) => {
					this.changeCheckboxValue(e.target.checked, property);
				}}
			/>
		);
	};
	//下拉选择的事件处理
	handleSelectChange = (value, property) => {
		let { selectCard } = this.props;
		if (_.isEmpty(selectCard)) {
			return;
		}
		selectCard = { ...selectCard };
		selectCard[property] = value;
		this.asyncUpdateSelectCard(selectCard).then(() => {
			this.updateCardInArea(property);
		});
	};
	//获取下拉选择Dom
	getMySelect = (mySelectObj, property) => {
		return (
			<Select
				value={
					_.isEmpty(this.props.selectCard[property]) ? mySelectObj[0].value : this.props.selectCard[property]
				}
				onChange={(value) => {
					this.handleSelectChange(value, property);
				}}
				style={{ width: 139 }}
			>
				{mySelectObj.map((c, index) => {
					return (
						<Option key={index} value={c.value}>
							{c.name}
						</Option>
					);
				})}
			</Select>
		);
	};
	async asyncUpdateSelectCard(selectCard) {
		let user = await this.props.updateSelectCard(selectCard);
		return user;
	}

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
	//查询区，元数据属性
	getDom1 = () => {
		const { selectCard } = this.props;
		return (
			<Tabs defaultActiveKey='1'>
				<TabPane tab='显示属性' key='1'>
					<ul className='basic-property'>
						{/* <li>项目主键</li>
				<li>{selectCard.metapath}</li> */}
						<li>显示名称</li>
						<li>{this.getMyInput('显示名称', 'label')}</li>
						<li>编码</li>
						<li>{selectCard.code}</li>
						<li>元数据路径</li>
						<li className='metapath'>{selectCard.metapath}</li>
						<li>参照编码</li>
						<li>{selectCard.refcode}</li>
						{/* <li>参照名称</li>
						<li>{selectCard.refname}</li> */}
						<li>显示顺序</li>
						<li>{selectCard.position}</li>
						<li>控件宽度</li>
						<li>{this.getMyInput('控件宽度', 'width')}</li>
						<li>录入长度</li>
						<li>{this.getMyInput('录入长度', 'maxlength')}</li>
						<li>下拉选项</li>
						<li>待定</li>
						<li>是否可见</li>
						<li>{this.getMyCheckbox('visible')}</li>
						<li>是否必输项</li>
						<li>{this.getMyCheckbox('required')}</li>
						<li>能否编辑</li>
						<li>{this.getMyCheckbox('disabled')}</li>
						<li>是否可用</li>
						<li>{this.getMyCheckbox('isenable')}</li>
						<li>必须启用</li>
						<li>{this.getMyCheckbox('mustuse')}</li>
						<li>是否自动检查</li>
						<li>{this.getMyCheckbox('ischeck')}</li>
						<li>是否使用函数</li>
						<li>{this.getMyCheckbox('usefunc')}</li>
						<li>精度</li>
						<li>{this.getMyInput('精度', 'scale')}</li>
						<li>单位</li>
						<li>{this.getMyInput('单位', 'unit')}</li>
						<li>计算比率</li>
						<li>{this.getMyInput('计算比率', 'ratio')}</li>
						<li>格式化类型</li>
						<li>{this.getMyInput('格式化类型', 'formattype')}</li>
						<li>操作符</li>
						<li>{this.getMyInput('操作符', 'opersign')}</li>
						<li>默认取值</li>
						<li>{this.getMyInput('默认取值', 'defaultvalue')}</li>
						<li>组件类型</li>
						<li>{this.getMySelect(utilService.componentTypeObj, 'componenttype')}</li>
						<li>显示颜色</li>
						<li>{this.getMySelect(utilService.colorObj, 'color')}</li>
						<li>数据类型</li>
						<li>{utilService.getDatatypeName(selectCard.datatype)}</li>
					</ul>
				</TabPane>
			</Tabs>
		);
	};
	//查询区，非元数据属性
	getDom2 = () => {
		const { selectCard } = this.props;
		return (
			<Tabs defaultActiveKey='1'>
				<TabPane tab='显示属性' key='1'>
					<ul className='basic-property'>
						{/* <li>项目主键</li>
				<li>{selectCard.metapath}</li> */}
						<li>显示名称</li>
						<li>{this.getMyInput('显示名称', 'label')}</li>
						<li>编码</li>
						<li>{selectCard.code}</li>
						<li>元数据路径</li>
						<li className='metapath'>{selectCard.metapath}</li>
						<li>参照编码</li>
						<li>{selectCard.refcode}</li>
						{/* <li>参照名称</li>
						<li>{selectCard.refname}</li> */}
						<li>显示顺序</li>
						<li>{selectCard.position}</li>
						<li>控件宽度</li>
						<li>{this.getMyInput('控件宽度', 'width')}</li>
						<li>录入长度</li>
						<li>{this.getMyInput('录入长度', 'maxlength')}</li>
						<li>下拉选项</li>
						<li>待定</li>
						<li>是否可见</li>
						<li>{this.getMyCheckbox('visible')}</li>
						<li>是否必输项</li>
						<li>{this.getMyCheckbox('required')}</li>
						<li>能否编辑</li>
						<li>{this.getMyCheckbox('disabled')}</li>
						<li>是否可用</li>
						<li>{this.getMyCheckbox('isenable')}</li>
						<li>必须启用</li>
						<li>{this.getMyCheckbox('mustuse')}</li>
						<li>是否自动检查</li>
						<li>{this.getMyCheckbox('ischeck')}</li>
						<li>是否使用函数</li>
						<li>{this.getMyCheckbox('usefunc')}</li>
						<li>精度</li>
						<li>{this.getMyInput('精度', 'scale')}</li>
						<li>单位</li>
						<li>{this.getMyInput('单位', 'unit')}</li>
						<li>计算比率</li>
						<li>{this.getMyInput('计算比率', 'ratio')}</li>
						<li>格式化类型</li>
						<li>{this.getMyInput('格式化类型', 'formattype')}</li>
						<li>操作符</li>
						<li>{this.getMyInput('操作符', 'opersign')}</li>
						<li>默认取值</li>
						<li>{this.getMyInput('默认取值', 'defaultvalue')}</li>
						<li>组件类型</li>
						<li>{this.getMySelect(utilService.componentTypeObj, 'componenttype')}</li>
						<li>显示颜色</li>
						<li>{this.getMySelect(utilService.colorObj, 'color')}</li>
					</ul>
				</TabPane>
				<TabPane tab='高级属性' key='2'>
					<ul className='basic-property'>
						<li>数据类型</li>
						<li>{this.getMySelect(utilService.dataTypeObj, 'datatype')}</li>
						<li>类型设置</li>
						<li>{this.getMyInput('类型设置', 'dataval')}</li>
					</ul>
				</TabPane>
			</Tabs>
		);
	};
	// 设置不同弹框的显示和隐藏 
	    setModalVisibel = (type,val) =>{
		        switch (type) {
		            case 'inter':
		                this.setState({ interModalVisibel: val})
		                break;
		            case 'money':
		                this.setState({ moneyModalVisibel: val })
		                break;
		            default:
		                break;
		        }
		    }
	    // 更新当前组件的类型设置值 
//     updateVal = (type,val) =>{
//         switch (type) {
//             case 'inter':
//                 this.setState({ interModalVal: val })
//                 break;
//             case 'money':
//                 this.setState({ moneyModalVal: val })
//                 break;
//             default:
//                 break;
//         }
//     }
	//非查询区，元数据属性
	getDom3 = () => {
		// <Tabs defaultActiveKey='1'>
		// 		<TabPane tab='显示属性' key='1'>
		// 			<ul className='basic-property'>
		// 				{/* <li>项目主键</li>
		// 		<li>{selectCard.metapath}</li> */}
		// 				<li>显示名称</li>
		// 				<li>{this.getMyInput('显示名称', 'label')}</li>
		// 			</ul>
		// 		</TabPane>
		// 		<TabPane tab='高级属性' key='2'>
		// 		<ul className='basic-property'>
		// 				<li>数据类型</li>
		// 				<li>{this.getMySelect(utilService.dataTypeObj, 'datatype')}</li>
		// 				<li>类型设置</li>
		// 				<li>{this.getMyInput('类型设置', 'dataval')}</li>
		// 			</ul>
		// 		</TabPane>
		// 	</Tabs>
	};
	//非查询区，非元数据属性
	getDom4 = () => {
		const { selectCard } = this.props;
		return (
			<Tabs defaultActiveKey='1'>
				<TabPane tab='显示属性' key='1'>
					<ul className='basic-property'>
						{/* <li>项目主键</li>
				<li>{selectCard.metapath}</li> */}
						<li>显示名称</li>
						<li>{this.getMyInput('显示名称', 'label')}</li>
					</ul>
				</TabPane>
				<TabPane tab='高级属性' key='2'>
					<ul className='basic-property'>
						<li>数据类型</li>
						<li>{this.getMySelect(utilService.dataTypeObj, 'datatype')}</li>
						<li>类型设置</li>
						<li>
							<Input
								value={selectCard.dataval}
								onFocus={() => {
								//	this.setState({ interModalVisibel: true });
									this.setState({ moneyModalVisibel: true });
								}}
							/>
							<InterModal
								handleSelectChange={this.handleSelectChange}
								initVal={selectCard.dataval}
								modalVisibel={this.state.interModalVisibel}
								setModalVisibel={this.setModalVisibel}
							/>
							<MoneyModal
								handleSelectChange={this.handleSelectChange}
								initVal={selectCard.dataval}
								modalVisibel={this.state.moneyModalVisibel}
								setModalVisibel={this.setModalVisibel}
							/>
						</li>
					</ul>
				</TabPane>
			</Tabs>
		);
	};
	render() {
		const { selectCard, areaList } = this.props;
		// 1 判断是否是元数据 2 判断所属的类型是否是查询区  默认是 不是元数据 不是查询区
		
		let result_div;
		if(_.isEmpty(selectCard)){
			result_div = (
				<div></div>	
			);
		}else{
			let isMetaData = this.getMetaType(selectCard),
			isSearch = this.getAreaType(areaList, selectCard);
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
