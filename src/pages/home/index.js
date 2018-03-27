import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeIntlData, saveImg, clearData } from 'Store/home/action';
// 工作桌面单页通用布局
import PageLayout from 'Components/PageLayout';
import './index.less';
const paths = [
	{ apptype: 'wedget', mountid: 'app', row: '2', column: '2', path: '/prod-dist/component1/index.c5bef5d2.js' },
	{ apptype: 'wedget', mountid: 'app2', row: '2', column: '1', path: '/prod-dist/component2/index.8b9900d6.js' },
	{ apptype: 'app', mountid: 'app3', row: '1', column: '1', path: '/prod-dist/component3/index.621db434.js' },
	{ apptype: 'app', mountid: 'app4', row: '1', column: '1', path: '/prod-dist/component4/index.d13337cb.js' }
];
/**
 * 工作桌面 首页 页面
 * 各个此贴应用及工作台中的小部件 通过 js 片段进行加载渲染
 */
class Home extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		let scripts = document.getElementsByTagName('script');
		// 将 HTMLCollection 类数组对象转换成真正的数组
		let scriptsArray = Array.prototype.slice.call(scripts, 0);
		let bodyDOM = document.getElementsByTagName('body')[0];
		// 将所有的 script 标签 src 值数组
		scriptsArray = scriptsArray.map((scriptItem) => {
			// script 标签上真正书写的 src 字符串
			if (scriptItem.attributes.src) {
				return scriptItem.attributes.src.value;
			}
		});
		// paths 后台返回的当前用户首页所有小部件相关内容
		paths.map((item, index) => {
			let scriptPath = item.path;
			// 查找后台提供的小部件 js 路径是否已经加载到 dom 中
			let flag = scriptsArray.find((scriptsSrc) => {
				return scriptsSrc === scriptPath;
			});
			// 如果没有，进行 script 标签创建及加载指定 js 文件
			if (typeof flag === 'undefined') {
				let script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = item.path;
				bodyDOM.appendChild(script);
			} else {
				for (let scriptIndex = 0; scriptIndex < scripts.length; scriptIndex++) {
					const element = scripts[scriptIndex];
					if (element.attributes.src && element.attributes.src.value === flag) {
						console.log(element);
						bodyDOM.removeChild(element);
						let script = document.createElement('script');
						script.type = 'text/javascript';
						script.src = flag;
						bodyDOM.appendChild(script);
					}
				}
			}
		});
	}
	/**
	 * 动态创建小部件挂载容器
	 * @param {Object} widgets // 小部件类型 
	 */
	createWidgetMountPoint = (widgets) => {
		return widgets.map((item, index) => {
			if (item) {
				let { apptype, mountid, row, column } = item;
				if (apptype === 'app') {
					return <div className={`widget-container n-6-${column} n-r-${row}`} id={mountid} />;
				} else if (apptype === 'wedget') {
					return <div className={`widget-container n-3-${column} n-r-${row}`} id={mountid} />;
				}
			}
		});
	};
	render() {
		return (
			<PageLayout>
				<div className='nc-workbench-home-container'>
					<div className='n-col'>
						<div className='title'>应用</div>
						<div className='n-row'>
							{this.createWidgetMountPoint(
								paths.map((item) => {
									if (item.apptype === 'app') {
										return item;
									} else {
										return false;
									}
								})
							)}
						</div>
					</div>
					<div className='n-col'>
						<div className='title'>监控分析</div>
						<div className=' n-row'>
							{this.createWidgetMountPoint(
								paths.map((item) => {
									if (item.apptype === 'wedget') {
										return item;
									} else {
										return false;
									}
								})
							)}
						</div>
					</div>
				</div>
			</PageLayout>
		);
	}
}
Home.PropTypes = {
	formData: PropTypes.object.isRequired,
	changeIntlData: PropTypes.func.isRequired,
	saveImg: PropTypes.func.isRequired,
	clearData: PropTypes.func.isRequired
};
export default connect(
	(state) => ({
		formData: state.formData,
		proData: state.proData
	}),
	{
		changeIntlData,
		saveImg,
		clearData
	}
)(Home);
