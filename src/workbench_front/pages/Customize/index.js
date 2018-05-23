import React, { Component } from 'react';
import { PageLayout, PageLayoutLeft, PageLayoutRight } from 'Components/PageLayout';
import { high } from 'nc-lightapp-front';
import 'nc-lightapp-front/dist/platform/nc-lightapp-front/index.css';
const { Refer } = high;

class Customize extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<PageLayout>
				<PageLayoutLeft>123</PageLayoutLeft>
				<PageLayoutRight>222</PageLayoutRight>
			</PageLayout>
		);
	}
}
export default Customize;
