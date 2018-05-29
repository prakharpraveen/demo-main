import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { setNodeData, setBillStatus, setOpType, setAppParamData, setPageButtonData,
// 	setPageTemplateData,
// 	setPrintTemplateData,setParentData } from 'Store/AppRegister/action';
import Ajax from 'Pub/js/ajax';
import './index.less';
import MyCard from './card';
import BatchSettingModal from './batchSettingModal';
import AddNotMetaDataModal from './addNotMetaDataModal';
/**
 * 工作桌面 配置模板区域
 */
class AreaItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			batchSettingModalVisibel : false,
			addDataModalVisibel:false
		};
    }
    
    moveCard =(dragIndex, hoverIndex)=> {
        this.props.moveCard(dragIndex, hoverIndex, this.props.index);
    }
    deleteCard = (cardIndex)=>{
        this.props.deleteCard(cardIndex,this.props.index);
    }
    addMetaInArea = ()=>{
        this.props.addMetaInArea(this.props.metaid, this.props.id)
	}
	selectThisCard = (cardIndex)=>{
		this.props.selectThisCard(cardIndex, this.props.index)
	}
	openBatchSetting = ()=>{
		this.setModalVisibel(true);
	}
	setModalVisibel = (visibel)=>{
		this.setState({batchSettingModalVisibel:visibel})
	}
	openAddNotMetaInArea = ()=>{
		this.setAddDataModalVisibel(true);
	}
	setAddDataModalVisibel = (visibel)=>{
		this.setState({addDataModalVisibel:visibel})
	}
	render() {
        console.log("areaItem")
        const {areaItem, selectCard} = this.props;
		return (
            <div className='area-item' >
					<div className='area-item-header'>
                        <span className='area-item-name'>
                        <span> ▼ </span>
                        {areaItem.name}
                        </span>
						<span className='area-item-button'>
							<Button onClick={this.addMetaInArea}>新增元数据</Button>
							<Button onClick={this.openAddNotMetaInArea}>新增非元数据</Button>
							<Button onClick={this.openBatchSetting}>批量设置</Button>
						</span>
					</div>
					<ul className='area-item-content'>
						{areaItem.queryPropertyList.map((q,index) => {
							return (
								<MyCard index={index} 
								key={index} 
								id={q.pk_query_property} 
								name={q.label} 
								selectThisCard = {this.selectThisCard}
								moveCard={this.moveCard}
								 deleteCard={this.deleteCard}/>  
							);
						})}
					</ul>
					<BatchSettingModal 
					batchSettingModalVisibel={this.state.batchSettingModalVisibel} 
					areaIndex = { this.props.index}
					setModalVisibel = {this.setModalVisibel}
					/>
					<AddNotMetaDataModal 
					addDataModalVisibel= {this.state.addDataModalVisibel}
					areaIndex = { this.props.index}
					setAddDataModalVisibel = {this.setAddDataModalVisibel} />
		    </div>
        )
	}
}
export default connect((state) => ({}), {})(AreaItem);
