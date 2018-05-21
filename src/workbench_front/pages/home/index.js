import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Masonry from 'masonry-layout';
import { animateScroll, scrollSpy } from 'react-scroll';
import Ajax from 'Pub/js/ajax';
import { Element } from 'react-scroll';
import Svg from 'Components/Svg';
import './index.less';

import { updateGroupList } from 'Store/home/action';
const UNIT = 175;
/**
 * 工作桌面 首页 页面
 * 各个此贴应用及工作台中的小部件 通过 js 片段进行加载渲染
 */
class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			layout:{
				margin: [ 10, 10 ],
				containerPadding: [ 0, 0 ],
				rowHeight:175,
				calWidth:175
			},
			groups:[]
		};
	}
	
	componentDidMount() {
		Ajax({
			url: `/nccloud/platform/appregister/queryapp.do`,
			data: {
				relateid: this.props.userID
			},
			success: (res) => {
				if (res) {
					let { data, success } = res.data;
					if (success && data && data.length > 0) {
						this.setState({groups:data[0].groups});
						this.props.updateGroupList(data[0].groups);
						animateScroll.scrollTo(0);
						scrollSpy.update();
					}
				}
			}
		});
	}

	createScript = () => {
		let { groups } = this.state;
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
		groups.map((group, i) => {
			group.apps.map((item,index)=>{
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
			})
		});
	};

	calGridItemPosition(gridx, gridy) {
		const { margin, rowHeight, calWidth } = this.state.layout;

		const x = Math.round(gridx * calWidth + margin[0] * (gridx + 1));
		const y = Math.round(gridy * rowHeight + margin[1] * (gridy + 1));
		return {
			x: x,
			y: y
		};
	}
	//宽和高计算成为px
	calWHtoPx(w, h) {
		const { margin, calWidth, rowHeight } = this.state.layout;
		const wPx = Math.round(w * calWidth + (w - 1) * margin[0]);
		const hPx = Math.round(h * rowHeight + (h - 1) * margin[1]);
		return { wPx, hPx };
	}
	
	/**
	 * 动态创建小应用
	 * @param {Object} appOption // 小部件类型 
	 * @param {Number} domWidth // 小应用宽度
	 * @param {Number} domHeight // 小应用高度
	 * @param {Boolean} isOwn //是否为系统预置应用 默认为 false 非系统预置应用
	 */
	createApp = (appOption, domWidth, domHeight, isOwn = false) => {
		const { x, y } = this.calGridItemPosition(appOption.gridx, appOption.gridy);
		const { wPx, hPx } = this.calWHtoPx(appOption.width, appOption.height);
		console.log(x,y,wPx,hPx)
		const { image_src, name, mountid, target_path, pk_appregister } = appOption;
		return (
			<div
				className='grid-item'
				key = {pk_appregister}
				id={mountid}
				style={{
					width: wPx,
					height: hPx,
					transform: `translate(${x}px, ${y}px)`,
					
				}}
				onClick={() => {
					window.openNew(appOption, isOwn ? 'own' : undefined);
				}}

			>
				<div  field="app-item" fieldname={name} className='app-item'>
					<span className='title'>{name}</span>
					<div className='app-content'>
						{/* <img className='icon' src={image_src} alt={name} /> */}
						{image_src.indexOf('/') === -1?(<div >
								<Svg width={100} height={100} xlinkHref={`#icon-${image_src}`}></Svg>
							</div>):(<div
							className='icon'
							style={{ background: `url(${image_src}) no-repeat 0px 0px`, 'backgroundSize': 'contain' }}
						/>)}
					</div>
				</div>
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
				let { apptype, width, height, name } = item;
				const domWidth = Number(width) * UNIT + (Number(width) - 1) * 12;
				const domHeight = Number(height) * UNIT + (Number(height) - 1) * 10;
				switch (Number(apptype)) {
					case 1:
						// 系统预置的应用打开需要特殊处理
						if (name === '应用注册') {
							return this.createApp(item, domWidth, domHeight, true);
						}
						return this.createApp(item, domWidth, domHeight);
						break;
					case 2:
						// 目前先不渲染小部件
						// return (
						// 	<div className={`grid-item`} style={{ width: domWidth, height: domHeight }} id={item.mountid} />
						// );
						break;
					// case 3:
					// return this.createApp(item, domWidth, domHeight, true);
					// break;
					default:
						break;
				}
			}
		});
	};

	layoutBottom = (layout) => {
		let max = 0,
			bottomY;
		for (let i = 0, len = layout.length; i < len; i++) {
			bottomY = layout[i].gridy + layout[i].height;
			if (bottomY > max) max = bottomY;
		}
		return max;
	}
	//计算卡片容器的最大高度
	getContainerMaxHeight = (cards, rowHeight, margin) => {
		//行转列并且分组
		const resultRow = this.layoutBottom(cards)
		return resultRow * rowHeight + (resultRow - 1) * margin[1] + 2 * margin[1];
	};

	render() {
		let { groups,layout } = this.state;
		return (
			<div className='nc-workbench-home-page'>
				<div className='nc-workbench-home-container'>
					{
						groups.map((g,index)=>{
							const containerHeight = this.getContainerMaxHeight(g.apps, layout.rowHeight, layout.margin);
							return(
								<Element name={g.pk_app_group} key={index} className='n-col padding-left-70 padding-right-60'>
									<div className='title'>{g.groupname}</div>
									<div className='grid' style={{height: containerHeight}} >
										{this.createWidgetMountPoint(g.apps)}
									</div>
								</Element>
							)
						})
					}
				</div>
			</div>
		);
	}
}

const createItem = () => {
	let itemDoms = [];
	for (let index = 0; index < 30; index++) {
		itemDoms.push(
			<div style={{ width: `${UNIT}px`, height: `${UNIT}px` }} className={`grid-item widget-container `}>
				<div className='app-item'>
					<span className='icon'>{index}</span>
					<span className='title'>应用{index}</span>
				</div>
			</div>
		);
	}
	return itemDoms;
};
const scrollToAnchor = (anchorName) => {
	if (anchorName) {
		let anchorElement = document.getElementById(anchorName);
		if (anchorElement) {
			// anchorElement.scrollIntoView(true);
			anchorElement.scrollIntoView({
				behavior: 'smooth'
			});
		}
	}
};

Home.propTypes = {
};
export default connect((state) => ({
	userID : state.appData.userID
}),{
	updateGroupList
})(Home);
