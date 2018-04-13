import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeIntlData, saveImg, clearData } from 'Store/home/action';
// 工作桌面单页通用布局
import PageLayout from 'Components/PageLayout';
import TabsLink from 'Components/TabsLink';
import './index.less';
// drag && drop
import { Dragact } from 'dragact';

const fakeData = [
    { GridX: 0, GridY: 0, w: 4, h: 2, key: '0' },
    { GridX: 0, GridY: 0, w: 4, h: 2, key: '1' },
    { GridX: 0, GridY: 0, w: 4, h: 2, key: '2' }
]

const getblockStyle = (isDragging) => {
    return {
        background: isDragging ? '#1890ff' : 'white',
    }
};



import Items from './card.js';
import _ from 'lodash';

// ReactDOM.render(<DatePicker />, mountNode);
class Test extends Component {
	constructor(props) {
		super(props);
		this.state = { cards: [
			{
				id: 1,
				GridX:0,
				GridY:0,
				w:1,
				h:1,
				text: 'Write a cool JS library'
			},
			{
				id: 2,
				GridX:1,
				GridY:0,
				w:2,
				h:2,
				text: 'Make it generic enough'
			},
			{
				id: 3,
				GridX:3,
				GridY:0,
				w:1,
				h:1,
				text: 'Make it generic enough'
			},
			{
				id: 4,
				GridX:0,
				GridY:1,
				w:1,
				h:1,
				text: 'Make it generic enough'
			},
			{
				id: 5,
				GridX:4,
				GridY:0,
				w:1,
				h:1,
				text: 'Make it generic enough'
			},
		]
		 };
	}

	createItems(cards){
		let itemDoms = [];
	   _.forEach(cards,(c)=>{
		itemDoms.push(
			<Items GridX={c.GridX} GridY={c.GridY} w={c.w} h={c.h} id={c.id}/>
		);
	   });
	   return itemDoms;
	}

	render() {
		let aaa;
		return (
			<div className='nc-workbench-home-page'>
				<div className='nc-workbench-home-container'>
				<Dragact
        layout={fakeData}//必填项
        col={16}//必填项
        width={800}//必填项
        rowHeight={40}//必填项
        margin={[5, 5]}//必填项
        className='plant-layout'//必填项
        style={{ background: '#333' }}//非必填项
        placeholder={true}//非必填项
    >
        {(item, provided) => {
            return (
                <div
                    {...provided.props}
                    {...provided.dragHandle}
                    style={{
                        ...provided.props.style,
                        ...getblockStyle(provided.isDragging)
                    }}
                >
                    {provided.isDragging ? '正在抓取' : '停放'}
                </div>
            )
        }}
    </Dragact>
	<Dragact
        layout={fakeData}//必填项
        col={16}//必填项
        width={800}//必填项
        rowHeight={40}//必填项
        margin={[5, 5]}//必填项
        className='plant-layout'//必填项
        style={{ background: '#333' }}//非必填项
        placeholder={true}//非必填项
    >
        {(item, provided) => {
            return (
                <div
                    {...provided.props}
                    {...provided.dragHandle}
                    style={{
                        ...provided.props.style,
                        ...getblockStyle(provided.isDragging)
                    }}
                >
                    {provided.isDragging ? '正在抓取' : '停放'}
                </div>
            )
        }}
    </Dragact>
				</div>
			</div>
		);
	}
}

export default (Test)
