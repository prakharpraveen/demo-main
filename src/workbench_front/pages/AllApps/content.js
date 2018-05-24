import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import './index.less';
import { connect } from 'react-redux';

class MyContent extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { contentData } = this.props;
		return (
			<div className='content'>
				{contentData.map((c, index) => {
					return (
						<div className='content-item' key={index}>
							<div className='content-item-header'>
								<strong>&bull; {c.label}</strong>
							</div>
							<div className='content-item-content'>
								{c.children.map((child, i) => {
									return (
										<div className='item-app' key={i}>
											<a href="javascript:void(0);" onClick={()=>{
                                                window.openNew({
                                                    code: child.code,
                                                    pk_appregister: child.pk_appregister,
                                                    name: child.name
                                                });
                                            }} > {child.label}
                                            </a>
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		);
	}
}
export default connect(
	(state) => ({
		userID: state.appData.userID
	}),
	{}
)(MyContent);
