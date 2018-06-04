import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Ajax from 'Pub/js/ajax';
import './index.less';
import { Input, Checkbox } from 'antd';
import { updateSelectCard, updateAreaList } from 'Store/ZoneSetting/action';
class BasicProperty extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {}
	changeValue = (e, propertyKey) => {
		let { selectCard } = this.props;
		if (_.isEmpty(selectCard)) {
			console.log('empty');
			return;
		}
		console.log(e.target.value, propertyKey);
		selectCard = { ...selectCard };
		selectCard[propertyKey] = e.target.value;
		this.props.updateSelectCard(selectCard);
	};
	updateCardInArea = (e, propertyKey) => {
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
	changeCheckboxValue = (e, property) => {
		let { selectCard } = this.props;
		if (_.isEmpty(selectCard)) {
			console.log('empty');
			return;
		}
		selectCard = { ...selectCard };
		let targetValue = -1;
		if (e.target.checked) {
			targetValue = '1';
		} else {
			targetValue = '0';
		}
		selectCard[property] = targetValue;
		this.asyncUpdateSelectCard(selectCard).then(() => {
			this.updateCardInArea(e, property);
		});
	};
	onPressEnter = (e, property) => {
		this[`${property}input`].blur();
	};
	getMyInput(placeholder, property) {
		return (
			<Input
				placeholder={placeholder}
				value={this.props.selectCard[property]}
				onChange={(e) => {
					this.changeValue(e, property);
				}}
				onBlur={(e) => {
					this.updateCardInArea(e, property);
				}}
				ref={(input) => (this[`${property}input`] = input)}
				onPressEnter={(e) => {
					this.onPressEnter(e, property);
				}}
			/>
		);
	}
	getMyCheckbox = (property) => {
		return (
			<Checkbox
				checked={Boolean(Number(this.props.selectCard[property]))}
				onChange={(e) => {
					this.changeCheckboxValue(e, property);
				}}
			/>
		);
	};
	async asyncUpdateSelectCard(selectCard) {
		let user = await this.props.updateSelectCard(selectCard);
		return user;
	}
	// 
	getMetaType = (selectCard) =>{
		if ( !!selectCard.metapath) return true; // 是元数据 
		return false;  // 不是元数据 默认没选的情况是false 
	}
	// 
	getAreaType = (areaList, selectCard) => {
		let result;
		_.forEach(areaList,(val,index)=>{
			_.forEach(val.queryPropertyList,(v,i) =>{
				if (selectCard.areaid === v.areaid) {
					result = val.areatype;
				//	return ; 
				}
			})
		})
      return result ==='0'? true:false;
	}
	render() {
		const { selectCard, areaList } = this.props;
		// 1 判断是否是元数据 2 判断所属的类型是否是查询区  默认是 不是元数据 不是查询区 
		let isMetaData = this.getMetaType(selectCard), isSearch = this.getAreaType(areaList, selectCard);
		let result_div;
		if (isMetaData){
			if (isSearch){
				result_div = (<div>1</div>)
			}else{
				result_div = (<div>2</div>)
			}
		}else{
			if (isSearch) {
				result_div = (<div>3</div>)
			} else {
				result_div = (<div>4</div>)
			}
		}
		/* (<div>
			11
		</div>	) */
	//	return result_div;
	
		return	(<ul className='basic-property'>
				<li>项目主键</li>
				<li>{selectCard.metapath}</li>
				<li>显示名称</li>
				<li>{this.getMyInput('显示名称', 'label')}</li>
				<li>显示顺序</li>
				<li>{selectCard.position}</li>
				<li>控件宽度</li>
				<li>{this.getMyInput('控件宽度', 'width')}</li>
				<li>录入长度</li>
				<li>{this.getMyInput('录入长度', 'maxlength')}</li>
				<li>是否可见</li>
				<li>{this.getMyCheckbox('visible')}</li>
				<li>是否必输项</li>
				<li>{this.getMyCheckbox('required')}</li>
				<li>能否编辑</li>
				<li>{this.getMyCheckbox('disabled')}</li>
				<li>是否可用</li>
				<li>{this.getMyCheckbox('isenable')}</li>
			</ul>); 
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
)(BasicProperty);
