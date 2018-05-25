import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Ajax from 'Pub/js/ajax';
import './index.less';
import { Input,Checkbox } from 'antd';
import { updateSelectCard,updateAreaList  } from 'Store/ZoneSetting/action';
class BasicProperty extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {}
	changeValue = (e, propertyKey)=>{
		let {selectCard} = this.props;
		console.log(e.target.value, propertyKey)
		selectCard = {...selectCard}
		selectCard[propertyKey] = e.target.value
		this.props.updateSelectCard(selectCard)
	}
	updateCardInArea = (e, propertyKey)=>{
		let {areaList, selectCard} = this.props;
		let targetAreaIndex = 0;
		let targetCardIndex = 0;
		areaList = _.cloneDeep(areaList);
		_.forEach(areaList,(a,i)=>{
			_.forEach(a.queryPropertyList,(q,index)=>{
				if(q.areaid === selectCard.areaid && q.pk_query_property === selectCard.pk_query_property){
					targetAreaIndex = i;
					targetCardIndex =index;
					return false;
				}
			})
		});
		areaList[targetAreaIndex].queryPropertyList[targetCardIndex][propertyKey] = selectCard[propertyKey]
		this.props.updateAreaList(areaList);
	}
	getMyInput(placeholder, property){
		return (
			<Input placeholder={placeholder} 
				value={this.props.selectCard[property]} 
				onChange={(e)=>{this.changeValue(e,property)}}
				onBlur = {(e)=>{this.updateCardInArea(e,property)}}
				/>
		)
	}
	getMyCheckbox=(property)=>{
		return (
			<Checkbox checked={Boolean(Number(this.props.selectCard[property])) } onChange={(e)=>{this.changeCheckboxValue(e,property)}} />
		)
	}
	changeCheckboxValue=(e,property)=>{
		let {selectCard} = this.props;
		selectCard = {...selectCard};
		let targetValue = -1;
		if(e.target.checked){
			targetValue = '1'
		}else{
			targetValue = '0'
		}
		selectCard[property] = targetValue;
		this.asyncUpdateSelectCard(selectCard).then(()=>{
			this.updateCardInArea(e,property)
		});
	}
	async asyncUpdateSelectCard (selectCard){
		let user = await this.props.updateSelectCard(selectCard);
		return user;
	}
	render() {
		const {selectCard} = this.props;
		return (
			<ul className='basic-property'>
				<li>显示名称</li>
				<li>{this.getMyInput("显示名称",'label')}</li>
				<li>组件类型</li>
				<li>233</li>
				<li>是否可修改</li>
				<li>233</li>
				<li>是否可见</li>
				<li>{this.getMyCheckbox("visible")}</li>
				<li>精度</li>
				<li>233</li>
				<li>是否必输</li>
				<li>233</li>
				<li>最大长度</li>
				<li>233</li>
				<li>单位</li>
				<li>233</li>
				<li>计算比率</li>
				<li>233</li>
				<li>格式化类型</li>
				<li>233</li>
				<li>是否可用</li>
				<li>233</li>
				<li>必须启用</li>
				<li>233</li>
				<li>位置</li>
				<li>233</li>
				<li>操作符</li>
				<li>233</li>
			</ul>
		);
	}
}
export default connect((state) => ({
	areaList: state.zoneSettingData.areaList,
	selectCard: state.zoneSettingData.selectCard
}), {
	updateAreaList,
	updateSelectCard
})(BasicProperty);
