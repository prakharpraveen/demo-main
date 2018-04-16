import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeIntlData, saveImg, clearData } from 'Store/home/action';
import { Link as TabLink, Element } from 'react-scroll';
// 工作桌面单页通用布局
import PageLayout from 'Components/PageLayout';
import TabsLink from 'Components/TabsLink';
import './index.less';
import Card from './card.js';
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";

const ReactGridLayout = WidthProvider(RGL);

const UNIT = 150;
let msnry = null;
/**
 * 工作桌面 首页 页面
 * 各个此贴应用及工作台中的小部件 通过 js 片段进行加载渲染
 */
const defaultProps = {
	className: "layout",
	items: 20,
	rowHeight: 30,
	cols: 12
	};
class Drag extends Component {
	

	constructor(props) {
		super(props);
		const layout1 = this.generateLayout();
		const layout2 = this.generateLayout();
		this.state = { layout1:layout1,layout2:layout2 };
	}

	generateDOM() {
		return _.map(_.range(defaultProps.items), function(i) {
		  return (
			<div style={{background:"#CCC"}} key={i}>
			  <span className="text">{i}</span>
			</div>
		  );
		});
	}


	  generateLayout() {
		const p = defaultProps;
		return _.map(new Array(p.items), function(item, i) {
		  const y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
		  const x = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
		  return {
			x: (i * 2) % 12,
			y: Math.floor(i / 6) * y,
			w: 2,
			h: y,
			i: i.toString()
		  };
		});
		}
		
		aaaaa(){
		}

	  onLayoutChange(layout) {
			console.log(layout);
		}

	render() {
		const { cards } = this.state;
		return (
			<div className='nc-workbench-home-page'>
				<div className='nc-workbench-home-container'>
					<ReactGridLayout
        layout={this.state.layout1}
        onLayoutChange={this.onLayoutChange}
				onDrag={this.onDragCallBack}
				onDragStop = {this.aaaaa}
				{...defaultProps}
      >
        {this.generateDOM()}
      </ReactGridLayout>
			<ReactGridLayout
        layout={this.state.layout2}
        onLayoutChange={this.onLayoutChange}
				onDrag={this.onDragCallBack}
				onDragStop = {this.aaaaa}
				{...defaultProps}
      >
        {this.generateDOM()}
      </ReactGridLayout>
					
				</div>
			</div>
		);
	}
}

export default (connect(
	(state) => ({
		formData: state.formData,
		proData: state.proData
	}),
	{
		changeIntlData,
		saveImg,
		clearData
	}
)(Drag))
