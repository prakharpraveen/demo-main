import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.less';
/**
 * 工作桌面中页面布局组件
 */
class PageLayout extends Component {
	render() {
		return (
			<div className='page-scroll'>
				<div className='page-layout'>{this.props.children}</div>
			</div>
		);
	}
}

PageLayout.propTypes = {
	// breadcrumb: PropTypes.array,
	children: PropTypes.any.isRequired
};

export default PageLayout;
