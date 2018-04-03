import React, { Component } from 'react';
import { Link } from 'react-scroll';
import './index.less';
const tabs = [
	{
		anchor: 'no1',
		text: 'to NO1'
	},
	{
		anchor: 'no2',
		text: 'to NO2'
	},
	{
		anchor: 'no3',
		text: 'to NO3'
	},
	{
		anchor: 'no4',
		text: 'to NO4'
	}
];
class TabsLink extends Component {
	constructor(props, context) {
		super(props, context);
	}
	createTabsLink = () => {
		return tabs.map((item, index) => {
			let { anchor, text } = item;
			return (
				<li>
					<Link activeClass="active" to={anchor} spy={true} smooth={true} duration={500}>
						{text}
					</Link>
				</li>
			);
		});
	};
	render() {
		return <ul className="n-tabs">{this.createTabsLink()}</ul>;
	}
}
export default TabsLink;
