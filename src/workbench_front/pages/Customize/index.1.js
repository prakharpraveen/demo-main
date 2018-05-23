import React, { Component } from 'react';
import { high } from 'nc-lightapp-front';
import 'nc-lightapp-front/dist/platform/nc-lightapp-front/index.css';
const { Refer } = high;

class Customize extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currency: {},
			currency1: {},
			currency2: [],
			currency3: {},
			currency4: [],
			currency5: {},
			currency6: []
		};
	}

	render() {
		return (
			<div style={{ marginTop: '200px' }}>
				<Refer
					refName={'交易类型'}
					placeholder={'单选下拉'}
					refCode={'cont'}
					refType={'grid'}
					queryGridUrl={'/nccloud/reva/ref/cont.do'}
					value={this.state.currency}
					onChange={(val) => {
						console.log(val);
						this.setState({
							currency: val
						});
					}}
					type={'dropDown'}
				/>
				<Refer
					placeholder={'单选表格'}
					refName={'交易类型'}
					refCode={'cont'}
					refType={'grid'}
					queryTreeUrl={'/nccloud/reva/ref/materialclass.do'}
					queryGridUrl={'/nccloud/reva/ref/material.do'}
					value={this.state.currency1}
					onChange={(val) => {
						console.log('change', val);
						this.setState({
							currency1: val
						});
					}}
					columnConfig={[
						{
							name: [ '编码', '名称' ],
							code: [ 'refcode', 'refname' ]
						}
					]}
					isMultiSelectedEnabled={false}
					allowSearchConfig={true}
					allowColumnConfig={true}
					pageSize={100}
					clickContainer={<button>123123</button>}
				/>
				<Refer
					placeholder={'多选表格'}
					refName={'交易类型'}
					refCode={'cont'}
					refType={'grid'}
					queryTreeUrl={'/nccloud/reva/ref/materialclass.do'}
					queryGridUrl={'/nccloud/reva/ref/material.do'}
					value={this.state.currency2}
					onChange={(val) => {
						console.log(val);
						this.setState({
							currency2: val
						});
					}}
					columnConfig={[
						{
							name: [ '编码', '名称' ],
							code: [ 'refcode', 'refname' ]
						}
					]}
					isMultiSelectedEnabled={true}
					queryCondition={() => {
						return {
							pk: this.state.currency1.refpk
						};
					}}
				/>
				<Refer
					placeholder={'单选树'}
					refName={'交易类型'}
					refCode={'cont'}
					refType={'tree'}
					queryTreeUrl={'/nccloud/reva/ref/materialclass.do'}
					queryGridUrl={'/nccloud/reva/ref/material.do'}
					value={this.state.currency3}
					onChange={(val) => {
						console.log(val);
						this.setState({
							currency3: val
						});
					}}
					columnConfig={[
						{
							name: [ '编码', '名称' ],
							code: [ 'refcode', 'refname' ]
						}
					]}
					treeConfig={{
						name: [ '编码', '名称' ],
						code: [ 'refcode', 'refname' ]
					}}
					isMultiSelectedEnabled={false}
					isTreelazyLoad={false}
					fieldDisplayed={[ 'refname', 'refcode' ]}
				/>
				<Refer
					placeholder={'多选树'}
					refName={'交易类型'}
					refCode={'cont'}
					refType={'tree'}
					queryTreeUrl={'/nccloud/reva/ref/materialclass.do'}
					queryGridUrl={'/nccloud/reva/ref/material.do'}
					value={this.state.currency4}
					onChange={(val) => {
						console.log(val);
						this.setState({
							currency4: val
						});
					}}
					columnConfig={[
						{
							name: [ '编码', '名称' ],
							code: [ 'refcode', 'refname' ]
						}
					]}
					treeConfig={{
						name: [ '编码', '名称' ],
						code: [ 'refcode', 'refname' ]
					}}
					isMultiSelectedEnabled={true}
					// isTreelazyLoad={false}
					onlyLeafCanSelect={false}
					fieldDisplayed={[ 'refname', 'refcode' ]}
				/>
				<Refer
					placeholder={'单选树表'}
					refName={'交易类型'}
					refCode={'cont'}
					refType={'gridTree'}
					queryTreeUrl={'/nccloud/reva/ref/materialclass.do'}
					queryGridUrl={'/nccloud/reva/ref/material.do'}
					value={this.state.currency5}
					onChange={(val) => {
						console.log(val);
						this.setState({
							currency5: val
						});
					}}
					columnConfig={[
						{
							name: [ '编码', '名称' ],
							code: [ 'refcode', 'refname' ]
						}
					]}
					isMultiSelectedEnabled={false}
				/>
				<Refer
					placeholder={'多选树表'}
					refName={'交易类型'}
					refCode={'cont'}
					refType={'gridTree'}
					queryTreeUrl={'/nccloud/reva/ref/materialclass.do'}
					queryGridUrl={'/nccloud/reva/ref/material.do'}
					value={this.state.currency6}
					onChange={(val) => {
						console.log(val);
						this.setState({
							currency6: val
						});
					}}
					columnConfig={[
						{
							name: [ '编码', '名称' ],
							code: [ 'refcode', 'refname' ]
						}
					]}
					isMultiSelectedEnabled={true}
				/>
			</div>
		);
	}
}
export default Customize;
