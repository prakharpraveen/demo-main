import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { saveFormData, saveImg, clearData } from 'Store/home/action';
import PageLayout from 'Components/PageLayout';
import './index.less';
const paths = [
	{ mountId: 'app2', path: '/prod-dist/component1/index.a7f2386b.js' },
	{ mountId: 'app3', path: '/prod-dist/component2/index.a7f2386b.js' }
];
class Home extends Component {
	static propTypes = {
		formData: PropTypes.object.isRequired,
		saveFormData: PropTypes.func.isRequired,
		saveImg: PropTypes.func.isRequired,
		clearData: PropTypes.func.isRequired
	};
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		let scripts = document.getElementsByTagName('script');
		// 将 HTMLCollection 类数组对象转换成真正的数组
		let scriptsArray = Array.prototype.slice.call(scripts, 0);
		let bodyDOM = document.getElementsByTagName('body')[0];
		paths.map((item) => {
			if (
				scriptsArray.find((obj) => {
					return obj.src !== item.path;
				})
			) {
				// 添加小部件 js
				let script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = item.path;
				bodyDOM.appendChild(script);
			}
		});
	}
	/**
	 * @param {Object} widgets // 小部件类型 
	 */
	createWidgetMountPoint = (widgets) => {
		return widgets.map((item, index) => {
			let { mountId } = item;
			return <div className='n-6-1 n-r-1' id={mountId} />;
		});
	};
	render() {
		return (
			<PageLayout>
				<div className='nc-workbench-home-container'>
					<div className='n-col'>
						<div className='title'>应用</div>
						<div className='n-row'>{this.createWidgetMountPoint(paths)}</div>
					</div>
					<div className='n-col'>
						<div className='title'>监控分析</div>
						<div className=' n-row'>
							<div className='n-3-1 n-r-2'>1</div>
							<div className='n-3-1 n-r-2'>2</div>
						</div>
					</div>
				</div>
			</PageLayout>
		);
	}
}
export default connect(
	(state) => ({
		formData: state.formData,
		proData: state.proData
	}),
	{
		saveFormData,
		saveImg,
		clearData
	}
)(Home);
