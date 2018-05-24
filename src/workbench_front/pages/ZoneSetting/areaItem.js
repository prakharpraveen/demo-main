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
import MyCard from './card.js';
/**
 * 工作桌面 配置模板区域
 */
class AreaItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
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
	render() {
        console.log("areaItem")
        const {areaItem} = this.props;
		return (
            <div className='area-item' >
					<div className='area-item-header'>
                        <span className='area-item-name'>
                        <span> ▼ </span>
                        {areaItem.name}
                        </span>
						<span className='area-item-button'>
							<Button onClick={this.addMetaInArea}>添加元数据</Button>
							<Button>批量修改</Button>
							<Button>新增非元数据</Button>
						</span>
					</div>
					<ul className='area-item-content'>
						{areaItem.queryPropertyList.map((q,index) => {
							return (
								<MyCard index={index} key={index} id={q.pk_query_property} name={q.label} moveCard={this.moveCard} deleteCard={this.deleteCard}/>  
							);
						})}
					</ul>
		    </div>
        )
	}
}
export default connect((state) => ({}), {})(AreaItem);
