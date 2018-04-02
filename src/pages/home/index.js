import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeIntlData, saveImg, clearData } from 'Store/home/action';
// 工作桌面单页通用布局
import PageLayout from 'Components/PageLayout';
import './index.less';

/**
 * 工作桌面 首页 页面
 * 各个此贴应用及工作台中的小部件 通过 js 片段进行加载渲染
 */
class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			paths: []
		};
	}
	componentDidMount() {
		let { paths } = this.state;
		axios({
			method: 'get',
			url: `pageInfo.json`
		}).then((res) => {
			if (res) {
				this.setState({ paths: res.data.data }, this.createScript);
			}
		});
	}
	createScript = () => {
		let { paths } = this.state;
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
	};
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
		let { paths, layout } = this.state;
		return (
			<PageLayout>
				<div className='nc-workbench-home-container'>
					<ul className='n-tabs'>
						<li>
							<span name='no1'>To 分类一</span>
						</li>
						<li>
							<span name='no2'>To 分类二</span>
						</li>
					</ul>
					<div className='n-col'>
						<div className='title'>分类一</div>
						<div className='n-row'>
							{/* {paths.length > 0 &&
								this.createWidgetMountPoint(
									paths.map((item) => {
										if (item.apptype === 'app') {
											return item;
										} else {
											return false;
										}
									})
								)} */}
							{createItem()}
						</div>
					</div>
					<div className='n-col'>
						<div className='title'>分类二</div>
						<div className=' n-row'>
							{paths.length > 0 &&
								this.createWidgetMountPoint(
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

const createItem = () => {
	let itemDoms = [];
	for (let index = 0; index < 30; index++) {
		itemDoms.push(
			<div className={`widget-container n-6-1 n-r-1`}>
				<span>{index}</span>
			</div>
		);
	}
	return itemDoms;
};

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
