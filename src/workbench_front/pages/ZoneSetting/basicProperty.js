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
	
	render() {
		const { selectCard, areaList } = this.props;
		// 1 判断是否是元数据 2 判断所属的类型是否是查询区  默认是 不是元数据 不是查询区 
		let isMetaData = this.getMetaType(selectCard), isSearch = this.getAreaType(areaList, selectCard);
		let result_div;


		if(isSearch){
			//不区分显示属性和高级属性
			if (isMetaData){
				//元数据中metapath 和datatype和类型设置 为只读
				this.getDom1();
			}else{
				//非元数据metapath为空且只读，datatype和类型设置 为可以设置
				this.getDom2();
			}
		}else{
			//
			if (isMetaData){
				//非查询区，元数据
				this.getDom3();
			}else{
				//非查询区，非元数据
				this.getDom4();
			}

		}

		/* (<div>
			11
		</div>	) */
	//	return result_div;
	
		return	(<ul className='basic-property'>
				{/* <li>项目主键</li>
				<li>{selectCard.metapath}</li> */}
				<li>显示名称</li>
				<li>{this.getMyInput('显示名称', 'label')}</li>
				<li>编码</li>
				<li>{selectCard.code}</li>
				<li>元数据路径</li>
				<li>{selectCard.metapath}</li>
				<li>参照编码</li>
				<li>{selectCard.refcode}</li>
				<li>参照名称</li>
				<li>{selectCard.refname}</li>
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
