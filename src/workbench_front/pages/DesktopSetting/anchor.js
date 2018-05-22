import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './index.less';
import { connect } from 'react-redux';

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
        if(this.props.name !== nextProps.name){
            return true;
        }
        if(this.props.index !== nextProps.index){
            return true;
        }
        return false;
    }
	render() {
		const { name } = this.props;
		return (<li onClick={this.targetAnchor}>{name}</li>)
	}
}

class MyContentAnchor extends Component {
	constructor(props) {
		super(props);
		this.state = {};
    }
	render() {
		const { groups} = this.props;
		return (
			<ul className='content-anchor'>
				{groups.map((g, i) => {
					return <AnchorLi key={g.pk_app_group} id={g.pk_app_group} index={i} name={g.groupname} />;
				})}
			</ul>
		);
	}
}

export default connect(
	(state) => ({
		groups: state.templateDragData.groups
	}),
	{}
)(MyContentAnchor);
