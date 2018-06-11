import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './index.less';
import { connect } from 'react-redux';
import { Link } from 'react-scroll';

class AnchorLi extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	targetAnchor = () => {
		const targetID = this.props.id;
		//id不能以数字开头
		// document.querySelector(`#a${targetID}`).scrollIntoView({ block: 'start',  behavior: 'smooth' });
		document.querySelector(`#a${targetID}`).scrollIntoView();
	};
	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.name !== nextProps.name) {
			return true;
		}
		if (this.props.index !== nextProps.index) {
			return true;
		}
		return false;
	}
	render() {
		const { name, id } = this.props;
		return (
			<Link
				activeClass='active'
				to={`a${id}`}
				offset={-133}
				spy={true}
				smooth={true}
				duration={250}
				containerId='nc-workbench-home-container'
			>
				{name}<span></span>
			</Link>
		);
	}
}

class MyContentAnchor extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { groups } = this.props;
		return (
			<div className='content-anchor'>
				{groups.map((g, i) => {
					return <AnchorLi key={g.pk_app_group} id={g.pk_app_group} index={i} name={g.groupname} />;
				})}
			</div>
		);
	}
}

export default connect(
	(state) => ({
		groups: state.templateDragData.groups
	}),
	{}
)(MyContentAnchor);
