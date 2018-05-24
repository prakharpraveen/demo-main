import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Ajax from 'Pub/js/ajax';
import './index.less';

class BasicProperty extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {}

	render() {
		return (
			<ul className='basic-property'>
				<li>名称</li>
				<li>233</li>
				<li>下拉选项</li>
				<li>233</li>
				<li>是否可修改</li>
				<li>233</li>
				<li>是否可见</li>
				<li>233</li>
				<li>精度</li>
				<li>233</li>
				<li>是否必输</li>
				<li>233</li>
				<li>最大长度</li>
				<li>233</li>
				<li>单位</li>
				<li>233</li>
				<li>计算比率</li>
				<li>233</li>
				<li>格式化类型</li>
				<li>233</li>
				<li>是否可用</li>
				<li>233</li>
				<li>必须启用</li>
				<li>233</li>
				<li>位置</li>
				<li>233</li>
				<li>操作符</li>
				<li>233</li>
			</ul>
		);
	}
}
export default connect((state) => ({}), {})(BasicProperty);
