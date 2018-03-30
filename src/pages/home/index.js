import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RGL, { WidthProvider } from 'react-grid-layout';
import { changeIntlData, saveImg, clearData } from 'Store/home/action';
// 工作桌面单页通用布局
import PageLayout from 'Components/PageLayout';
import './index.less';

const GridLayout = WidthProvider(RGL);
// const paths = [
// 	{ apptype: 'wedget', mountid: 'app', row: '2', column: '2', path: '/prod-dist/component1/index.c5bef5d2.js' },
// 	{ apptype: 'wedget', mountid: 'app2', row: '2', column: '1', path: '/prod-dist/component2/index.8b9900d6.js' },
// 	{ apptype: 'app', mountid: 'app3', row: '1', column: '1', path: '/prod-dist/component3/index.621db434.js' },
// 	{ apptype: 'app', mountid: 'app4', row: '1', column: '1', path: '/prod-dist/component4/index.d13337cb.js' }
// ];
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
					return <div className={`widget-container n-6-${column} n-r-${row}`} id={mountid} key='a' />;
				} else if (apptype === 'wedget') {
					return <div className={`widget-container n-3-${column} n-r-${row}`} id={mountid} key='a' />;
				}
			}
		});
	};
	/**
	 * <div className='nc-workbench-home-container'>
					<div className='n-col'>
						<div className='title'>应用</div>
						<div className='n-row'>
							{paths.length > 0 &&
								this.createWidgetMountPoint(
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
						<div className='title'>监控分析233</div>
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
	 */
	render() {
		let { paths } = this.state;
		let layout = [
			{ i: 'a', x: 0, y: 0, w: 2, h: 2, static: true },
			{ i: 'b', x: 1, y: 0, w: 1, h: 1, minW: 1, maxW: 4, minH: 2, maxH: 8 },
			{ i: 'c', x: 2, y: 0, w: 1, h: 2 },
			{ i: 'd', x: 3, y: 0, w: 2, h: 1, static: false },
			{ i: 'e', x: 3, y: 1, w: 1, h: 1, minW: 1, maxW: 4 },
			{ i: 'f', x: 2, y: 1, w: 1, h: 1 },
			{ i: 'g', x: 5, y: 0, w: 1, h: 1, static: false },
			{ i: 'h', x: 6, y: 0, w: 1, h: 1, minW: 1, maxW: 4 },
			{ i: 'i', x: 3, y: 2, w: 1, h: 1 },
			{ i: 'j', x: 4, y: 2, w: 1, h: 1, static: false },
			{ i: 'k', x: 0, y: 3, w: 1, h: 1, minW: 1, maxW: 4 },
			{ i: 'l', x: 1, y: 3, w: 1, h: 1 },
			{ i: 'm', x: 0, y: 2, w: 1, h: 1, static: false },
			{ i: 'n', x: 1, y: 2, w: 1, h: 1, minW: 1, maxW: 4 },
			{ i: 'o', x: 2, y: 2, w: 1, h: 1 }
		];
		return (
			<PageLayout>
				<GridLayout
					className='layout'
					layout={layout}
					compactType='horizontal'
					cols={6}
					width={1200}
					rowHeight={250}
					breakpoints={{
						lg: 1200,
						md: 996,
						sm: 768,
						xs: 480,
						xxs: 0
					}}
					// onBreakpointChange={(newBreakpoint, newCols) => {
					// 	console.log(newBreakpoint);
					// 	console.log(newCols);
					// }}
					// onLayoutChange={(currentLayout, allLayouts) => {
					// 	console.log(currentLayout);
					// 	console.log(allLayouts);
					// }}
				>
					{/* {paths.length > 0 &&
					this.createWidgetMountPoint(
						paths.map((item) => {
							if (item.apptype === 'wedget') {
								return item;
							} else {
								return false;
							}
						})
					)} */}

					<div id='app' style={{ background: '#ffffff' }} key='a' />
					<div id='app2' style={{ background: '#ffffff' }} key='b' />
					<div id='app3' style={{ background: '#ffffff' }} key='c'>
						c
					</div>
					<div style={{ background: '#ffffff' }} key='d'>
						d
					</div>
					<div style={{ background: '#ffffff' }} key='e'>
						e
					</div>
					<div style={{ background: '#ffffff' }} key='f'>
						f
					</div>
					<div style={{ background: '#ffffff' }} key='g'>
						g
					</div>
					<div style={{ background: '#ffffff' }} key='h'>
						h
					</div>
					<div style={{ background: '#ffffff' }} key='i'>
						i
					</div>
					<div style={{ background: '#ffffff' }} key='j'>
						j
					</div>
					<div style={{ background: '#ffffff' }} key='k'>
						k
					</div>
					<div style={{ background: '#ffffff' }} key='l'>
						l
					</div>
					<div style={{ background: '#ffffff' }} key='m'>
						m
					</div>
					<div style={{ background: '#ffffff' }} key='n'>
						n
					</div>
					<div style={{ background: '#ffffff' }} key='o'>
						o
					</div>
				</GridLayout>
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
