import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Cascader, Input, Button, Icon, Checkbox, List } from 'antd';
const { Sider } = Layout;
const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;

import Ajax from 'Pub/js/ajax';

function onChange(value) {
	console.log(value);
}

class MySider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showSearch: false,
			data233: [
				{
					title: 'Title 1'
				},
				{
					title: 'Title 2'
				},
				{
					title: 'Title 3'
				},
				{
					title: 'Title 4'
				}
			]
		};
	}
	componentDidMount() {
		Ajax({
			url: `/nccloud/platform/appregister/queryapplazy.do`,
			success: (res) => {
				if (res) {
					let { data, success } = res.data;
					if (success && data && data.length > 0) {
						this.setState({ domainArr: data });
					}
				}
			}
		});
	}
	cancleSave() {
		alert(123);
	}
	render() {
		const contentHeight = this.props.contentHeight;
		return (
			<Sider
				className='nc-workbench-home-sider'
				breakpoint='lg'
				collapsedWidth='200'
				width='300'
				style={{ height: contentHeight }}
			>
				<div className='sider-content'>
					<div className='sider-search'>
						{/* <Search
						placeholder='请输入应用名称'
						onSearch={(value) => console.log(value)}
						style={{ width: 200 }}
                        enterButton
                        disabled={true}
					/> */}
						<Cascader
							style={{ width: 222 }}
							options={this.state.domainArr}
							onChange={onChange}
							placeholder='领域-模块'
						/>
                        <Icon type="search" className="switch-search"/>
					</div>
					<div className="add-item">
                        <span></span>
						<span className="add">添加</span>
					</div>
					<div className='sider-result'>
						<div className='result-group-list'>
                        <h4 className="result-header"><Checkbox>第一组</Checkbox></h4>				
							<div className='result-app-list'>
								<div className='app-col'>
									<div className='list-item'>
										<div className='list-item-content'>app1</div>
									</div>
								</div>
								<div className='app-col'>
									<div className='list-item'>
										<div className='list-item-content'>app1</div>
									</div>
								</div>
								<div className='app-col'>
									<div className='list-item'>
										<div className='list-item-content'>app1</div>
									</div>
								</div>
							</div>
						</div>
                        <div className='result-group-list'>
                        <h4 className="result-header"><Checkbox>第一组</Checkbox></h4>				
							<div className='result-app-list'>
								<div className='app-col'>
									<div className='list-item'>
										<div className='list-item-content'>app1</div>
									</div>
								</div>
								<div className='app-col'>
									<div className='list-item'>
										<div className='list-item-content'>app1</div>
									</div>
								</div>
								<div className='app-col'>
									<div className='list-item'>
										<div className='list-item-content'>app1</div>
									</div>
								</div>
							</div>
						</div><div className='result-group-list'>
                        <h4 className="result-header"><Checkbox>第一组</Checkbox></h4>				
							<div className='result-app-list'>
								<div className='app-col'>
									<div className='list-item'>
										<div className='list-item-content'>app1</div>
									</div>
								</div>
								<div className='app-col'>
									<div className='list-item'>
										<div className='list-item-content'>app1</div>
									</div>
								</div>
								<div className='app-col'>
									<div className='list-item'>
										<div className='list-item-content'>app1</div>
									</div>
								</div>
							</div>
						</div>
                        
					</div>
				</div>
			</Sider>
		);
	}
}

export default MySider;
