import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeIntlData, saveImg, clearData } from 'Store/home/action';
import Masonry from 'masonry-layout';
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
			method: 'POST',
			url: `/nccloud/platform/appregister/query.do`
		}).then((res) => {
			if (res) {
				let { data, success } = res.data;
				if (success) {
					this.setState({ paths: data }, this.createScript);
				}
				let grid = document.querySelectorAll('.grid');
				for (let index = 0; index < grid.length; index++) {
					const element = grid[index];
					new Masonry(element, {
						itemSelector: '.grid-item',
						columnWidth: 170,
						gutter: 10
					});
				}
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
			let { path, apptype } = item;
			if (apptype === '2') {
				let scriptPath = path;
				// 查找后台提供的小部件 js 路径是否已经加载到 dom 中
				let flag = scriptsArray.find((scriptsSrc) => {
					return scriptsSrc === scriptPath;
				});
				// 如果没有，进行 script 标签创建及加载指定 js 文件
				if (typeof flag === 'undefined') {
					let script = document.createElement('script');
					script.type = 'text/javascript';
					script.src = path;
					bodyDOM.appendChild(script);
				} else {
					for (let scriptIndex = 0; scriptIndex < scripts.length; scriptIndex++) {
						const element = scripts[scriptIndex];
						if (element.attributes.src && element.attributes.src.value === flag) {
							bodyDOM.removeChild(element);
							let script = document.createElement('script');
							script.type = 'text/javascript';
							script.src = flag;
							bodyDOM.appendChild(script);
						}
					}
				}
			}
		});
	};

	/**
	 * 动态创建小应用
	 * @param {Object} appOption // 小部件类型 
	 */
	createApp = (appOption, domWidth, domHeight) => {
		const { img_src, name, mountid, target_path } = appOption;
		return (
			<div
				className='grid-item'
				id={mountid}
				style={{ width: domWidth, height: domHeight }}
				onClick={() => {
					window.openNew(target_path);
				}}
			>
				<p>{name}</p>
				<hr />
				<img src={img_src} alt={name} />
			</div>
		);
	};

	/**
	 * 动态创建小部件挂载容器
	 * @param {Object} widgets // 小部件类型 
	 */
	createWidgetMountPoint = (widgets) => {
		return widgets.map((item, index) => {
			if (item) {
				let { apptype, width, height } = item;
				const domWidth = Number(width) * 170;
				const domHeight = Number(height) * 170;
				if (apptype === '1') {
					return this.createApp(item, domWidth, domHeight);
				} else if (apptype === '2') {
					return (
						<div className={`grid-item`} style={{ width: domWidth, height: domHeight }} id={item.mountid} />
					);
				}
			}
		});
	};

	render() {
		let { paths } = this.state;
		return (
			<div className='nc-workbench-home-page'>
				<ul className='n-tabs'>
					<li>
						<span
							name='no1'
							onClick={() => {
								scrollToAnchor('no1');
							}}
						>
							To 分类一
						</span>
					</li>
					<li>
						<span
							onClick={() => {
								scrollToAnchor('no2');
							}}
							name='no2'
						>
							To 分类二
						</span>
					</li>
				</ul>
				<PageLayout height='80'>
					<div className='nc-workbench-home-container'>
						<div className='n-col'>
							<div id='no1' className='title'>
								分类一
							</div>
							<div class='grid'>
								{paths.length > 0 &&
									this.createWidgetMountPoint(
										paths.map((item) => {
											return item;
										})
									)}
								{createItem()}
							</div>
						</div>
						<div className='n-col'>
							<div id='no2' className='title'>
								分类二
							</div>
							<div className='grid'>
								{/* {this.createWidgetMountPoint(paths)} */}
								{createItem()}
							</div>
						</div>
					</div>
				</PageLayout>
			</div>
		);
	}
}

const createItem = () => {
	let itemDoms = [];
	for (let index = 0; index < 30; index++) {
		itemDoms.push(
			<div className={`grid-item widget-container `}>
				<span>{index}</span>
			</div>
		);
	}
	return itemDoms;
};
const scrollToAnchor = (anchorName) => {
	if (anchorName) {
		let anchorElement = document.getElementById(anchorName);
		if (anchorElement) {
			anchorElement.scrollIntoView({
				alignToTop: true,
				behavior: 'smooth'
			});
		}
	}
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
