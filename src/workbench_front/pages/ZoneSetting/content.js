import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateSelectCard, updateAreaList } from 'Store/ZoneSetting/action';
import Ajax from 'Pub/js/ajax';
import './index.less';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import AreaItem from './areaItem';
import TreeModal from './treeModal';
import _ from 'lodash';
/**
 * 工作桌面 配置模板区域
 */
@DragDropContext(HTML5Backend)
class MyContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: true,
			metaTree: [],
			targetAreaID: '',
		};
	}

	componentDidMount() {
		Ajax({
			url: `/nccloud/platform/templet/querytempletpro.do`,
			info: {
				name: '单据模板设置',
				action: '配置模板区域-配置区域查询'
			},
			data: {
				templetid: '0001A41000000006CBX9'
			},
			success: (res) => {
				if (res) {
					let { data, success } = res.data;
					if (success && data && data.length > 0) {
						console.log(data);
						data[0].queryPropertyList.push({
							pk_query_property: '1009Z0100000000XXXX2',
							areaid: '1009Z0100000000WWWX8',
							label: '用户233',
							metapath: 'user_name',
							maxlength: '20',
							opersign: 'like',
							dr: '0',
							code: 'user_name',
							status: '0',
							m_isDirty: false
						});
						data[0].queryPropertyList.push({
							pk_query_property: '1009Z0100000000XXXX4',
							areaid: '1009Z0100000000WWWX8',
							label: '用户666',
							metapath: 'user_name',
							maxlength: '20',
							opersign: 'like',
							dr: '0',
							code: 'user_name',
							status: '0',
							m_isDirty: false
						});
						this.props.updateAreaList(data)
					}
				}
			}
		});
	}
	addMetaInArea = (metaid, targetAreaID) => {
		Ajax({
			url: `/nccloud/platform/templet/querymetaproperty.do`,
			info: {
				name: '单据模板设置',
				action: '元数据树结构查询'
			},
			data: {
				// metaid: metaid
				metaid: '286df5c2-da48-4e6d-b4e5-5e1c8c63977e'
			},
			success: (res) => {
				if (res) {
					let { data, success } = res.data;
					if (success && data && data.rows && data.rows.length > 0) {
						let metaTree = [];
						data.rows.map((r) => {
							metaTree.push({
								...r,
								title: r.refname,
								key: r.refpk,
								isShow: true
							});
						});
						this.setState({ metaTree: metaTree, targetAreaID: targetAreaID });
						this.setModalVisible(true);
					}
				}
			}
		});
	};

	updateAreaList = (areaList) => {
		this.props.updateAreaList(areaList)
	};

	addCard = (addCardList) => {
		let {targetAreaID } = this.state;
		let {areaList} = this.props;
        areaList = _.cloneDeep(areaList);
        let targetArea = {};
        _.forEach(areaList ,(a)=>{
            if(targetAreaID === a.pk_area){
                targetArea = a;
                return false;
            }
        })
        targetArea.queryPropertyList.connect(addCardList);
        this.props.updateAreaList(areaList)
    };

	moveCard = (dragIndex, hoverIndex, areaItemIndex) => {
		let { areaList } = this.props;
		areaList = _.cloneDeep(areaList);
		const cards = areaList[areaItemIndex].queryPropertyList;

		const dragCard = cards[dragIndex];
		cards.splice(dragIndex, 1);
		cards.splice(hoverIndex, 0, dragCard);
		this.props.updateAreaList(areaList)
		this.props.updateSelectCard({})
	};

	deleteCard = (cardIndex, areaItemIndex) => {
		let { areaList } = this.props;
		areaList = _.cloneDeep(areaList);

		const cards = areaList[areaItemIndex].queryPropertyList;

		cards.splice(cardIndex, 1);

		this.props.updateAreaList(areaList)
		this.props.updateSelectCard({})
	};

	setModalVisible = (modalVisible) => {
		this.setState({ modalVisible });
	};


	selectThisCard =(cardIndex, areaItemIndex)=>{
		let { areaList } = this.props;
		let card = areaList[areaItemIndex].queryPropertyList[cardIndex];
		// this.setState({ selectCard: card });
		this.props.updateSelectCard(card)
	};

	render() {
		return (
			<div className='template-setting-content'>
				{this.props.areaList.map((a, i) => {
					return (
						<AreaItem
							areaItem={a}
                            key={i}
                            id={a.pk_area}
							index={i}
							metaid={a.metaid}
							// selectCard = {this.props.selectCard}
							moveCard={this.moveCard}
							deleteCard={this.deleteCard}
							addMetaInArea={this.addMetaInArea}
							selectThisCard = {this.selectThisCard}
						/>
					);
				})}

				<TreeModal
                    metaTree={this.state.metaTree}
					modalVisible={this.state.modalVisible}
					setModalVisible={this.setModalVisible}
                    addCard = {this.addCard}
				/>
			</div>
		);
	}
}
export default connect((state) => ({
	areaList: state.zoneSettingData.areaList,
	// selectCard: state.zoneSettingData.selectCard
}), {
	updateAreaList,
	updateSelectCard
})(MyContent);
