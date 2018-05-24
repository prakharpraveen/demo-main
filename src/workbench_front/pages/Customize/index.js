import React, { Component } from 'react';
import { PageLayout, PageLayoutLeft, PageLayoutRight } from 'Components/PageLayout';
import MenuList from './MenuList';
import { high } from 'nc-lightapp-front';
import Loadable from 'react-loadable';
import Loading from 'Components/Loading';
import 'nc-lightapp-front/dist/platform/nc-lightapp-front/index.css';
import './index.less';
const { Refer } = high;
const DefaultSetting = Loadable({
	loader: () => import('./DefaultSetting'),
	loading: Loading
});
const ApproveLanguage = Loadable({
	loader: () => import('./ApproveLanguage'),
	loading: Loading
});
class Customize extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeKey: 'default',
			listArray: [
				{
					name: '默认设置',
					active: true,
					code: 'default'
				},
				{
					name: '审批语设置',
					code: 'approveLanguage'
				},
				{
					name: '常用数据',
					code: '3'
				},
				{
					name: '代理人设置',
					code: '4'
				},
				{
					name: '集团财务合并',
					code: '5'
				},
				{
					name: '单体财务报表',
					code: '6'
				},
				{
					name: '集团报表',
					code: '7'
				}
			]
		};
	}
	/**
	 * 个性化页面页面
	 * @param {String} key 菜单标识
	 */
	hanleMenuListClick = (key) => {
		let { listArray } = this.state;
		// 为选中list 项添加 活跃标识
		listArray = listArray.map((item, index) => {
			delete item.active;
			if (item.code === key) {
				item.active = true;
			}
			return item;
		});
		this.setState({ listArray, activeKey: key });
		switch (key) {
			case 'value':
				break;

			default:
				break;
		}
	};
	/**
	 * 
	 */
	loadCom = (key) => {
		switch (key) {
			case 'default':
				return <DefaultSetting title={'默认设置'} />;
			case 'approveLanguage':
				return <ApproveLanguage title={'审批语设置'} />;
			default:
				break;
		}
	};
	render() {
		let { listArray } = this.state;
		return (
			<PageLayout>
				<PageLayoutLeft>
					<MenuList onClick={this.hanleMenuListClick} listArray={listArray} />
				</PageLayoutLeft>
				<PageLayoutRight>{this.loadCom(this.state.activeKey)}</PageLayoutRight>
			</PageLayout>
		);
	}
}
export default Customize;
