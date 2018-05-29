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
			modalVisible: false,
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
						this.props.updateAreaList(data)
					}
				}
			}
		});
	}
	addMetaInArea = (metaid, targetAreaID) => {
		Ajax({
			url: `/nccloud/platform/templet/querymetapro.do`,
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
						data.rows.map((r,index) => {
							metaTree.push({
								...r,
								title: r.refname,
								key: `${r.refcode}`,
								myUniqID: `${r.refcode}`,
								isLeaf:r.isleaf
							});
						});
						this.setState({ metaTree: metaTree, targetAreaID: targetAreaID});
						this.setModalVisible(true);
					}
				}
			}
		});
	};

	updateMetaTreeData = (metaTree)=>{
		this.setState({metaTree:metaTree});
	}

	addCard = (addCardList) => {
		let {targetAreaID } = this.state;
		let {areaList} = this.props;
        areaList = _.cloneDeep(areaList);
        let targetAreaIndex = -1;
        _.forEach(areaList ,(a,i)=>{
            if(targetAreaID === a.pk_area){
                targetAreaIndex = i;
                return false;
            }
        })
		areaList[targetAreaIndex].queryPropertyList = _.uniqBy(areaList[targetAreaIndex].queryPropertyList.concat(addCardList),'pk_query_property');

		_.forEach(areaList[targetAreaIndex].queryPropertyList,(q,i)=>{
			q.position = i+1;
		});
        this.props.updateAreaList(areaList)
    };

	moveCard = (dragIndex, hoverIndex, areaItemIndex) => {
		let { areaList } = this.props;
		areaList = _.cloneDeep(areaList);
		const cards = areaList[areaItemIndex].queryPropertyList;

		const dragCard = cards[dragIndex];
		cards.splice(dragIndex, 1);
		cards.splice(hoverIndex, 0, dragCard);
		_.forEach(cards,(q,i)=>{
			q.position = i+1;
		});
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
					targetAreaID = {this.state.targetAreaID}
					targetAreaCardLength = {this.state.targetAreaCardLength}
					setModalVisible={this.setModalVisible}
					addCard = {this.addCard}
					updateMetaTreeData = {this.updateMetaTreeData}
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
