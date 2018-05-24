import React, { Component } from 'react';
import { PageLayout, PageLayoutLeft, PageLayoutRight } from 'Components/PageLayout';
import MenuList from './MenuList';
import { high } from 'nc-lightapp-front';
import 'nc-lightapp-front/dist/platform/nc-lightapp-front/index.css';
import './index.less';
const { Refer } = high;

class Customize extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listArray:[
				{
					name:'默认设置',
					active:true,
					code:'1'
				},
				{
					name:'审批语设置',
					code:'2'
				},
				{
					name:'常用数据',
					code:'3'
				},
				{
					name:'代理人设置',
					code:'4'
				},
				{
					name:'集团财务合并',
					code:'5'
				},
				{
					name:'单体财务报表',
					code:'6'
				},
				{
					name:'集团报表',
					code:'7'
				},
			]
		};
	}
	hanleMenuListClick = (key)=>{
		let { listArray } = this.state;
		// 为选中list 项添加 活跃标识
		listArray = listArray.map((item,index)=>{
			delete item.active;
			if(item.code === key){
				item.active = true;
			}
			return item;
		});
		this.setState({listArray});
		switch (key) {
			case 'value':
				
				break;
		
			default:
				break;
		}
	}
	render() {
		let {listArray} = this.state;
		return (
			<PageLayout>
				<PageLayoutLeft>
					<MenuList onClick ={this.hanleMenuListClick} listArray = {listArray}></MenuList>
				</PageLayoutLeft>
				<PageLayoutRight>222</PageLayoutRight>
			</PageLayout>
		);
	}
}
export default Customize;
