import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Cascader, Input, Icon, Checkbox, List, Button } from 'antd';
import SiderCard from './siderCard.js'
const { Sider } = Layout;

import Ajax from 'Pub/js/ajax';

function onChange(value) {
	console.log(value);
}

class MySider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showSearch: false,
			searchValue: '',
			selectGroupArr: []
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
	onInputChange(e) {
		let _serachText = e.target.value;
		// console.log(_groupName);
		this.state.searchValue = _serachText;
	}
	onInputSearch() {
		console.log(this.state.searchValue, '搜索开始');
	}
	onCascaderChange(value) {
		let cascaderValueArr = value;
		if (cascaderValueArr.length === 1) {
			return;
		}
		const ownModuleID = cascaderValueArr[1];
		Ajax({
			url: `/nccloud/platform/appregister/queryapplazy.do`,
			data: {
				own_module: ownModuleID
			},
			success: (res) => {
				const { data, success } = res.data;
				if (success && data && data.length > 0) {
                    console.log(data);
                    _.forEach(data,(d)=>{
                        d.checkedAll = false;
                        d.indeterminate = false;
                        _.forEach(d.children,(c)=>{
                            c.checked = false;
                        });
                    });
					this.setState({ selectGroupArr: data });
				}
			}
		});
		console.log(value, '选择', this.state);
	}
	switchSearch() {
		const { showSearch } = this.state;
		this.setState({ showSearch: !showSearch });
	}
	getSearchDom() {
		let itemDom;
		if (this.state.showSearch) {
			itemDom = (
				<div className='sider-search'>
					<Input
						placeholder='请输入应用名称'
						style={{ width: '213px' }}
						onPressEnter={this.onInputSearch.bind(this)}
						onChange={this.onInputChange.bind(this)}
						addonAfter={
							<Icon type='search' className='search-input-icon' onClick={this.onInputSearch.bind(this)} />
						}
					/>
					<span className='switch-search-cancel' onClick={this.switchSearch.bind(this)}>
						取消
					</span>
				</div>
			);
		} else {
			itemDom = (
				<div className='sider-search'>
					<Cascader
						className='search-cascader'
						style={{ width: '213px' }}
						options={this.state.domainArr}
						onChange={(value) => {
							this.onCascaderChange(value);
						}}
						placeholder='领域-模块'
					/>
					<span className='switch-search' onClick={this.switchSearch.bind(this)}>
						<Icon type='search' />
					</span>
				</div>
			);
		}
		return itemDom;
    }

    onCheckAllChange = (e ,index ) => {
        const checked = e.target.checked;
        let {selectGroupArr} = this.state;
        let selectGroup = selectGroupArr[index];

        selectGroup.checkedAll = e.target.checked;
        _.forEach(selectGroup.children,(c)=>{
            c.checked = checked;
        });
        this.setState({selectGroupArr});
      }
      onChangeChecked = (e, groupIndex,index)=>{
        const checked = e.target.checked;
        let {selectGroupArr} = this.state;
        let selectGroup = selectGroupArr[groupIndex];
        let child = selectGroup.children[index];
        child.checked = checked;

        let checkCount = 0;
        _.forEach(selectGroup.children,(c)=>{
            if(c.checked){
                checkCount ++;
            }
        });

        selectGroup.checkedAll = checkCount===selectGroup.children.length;
        selectGroup.indeterminate = !!checkCount && checkCount<selectGroup.children.length;
        this.setState(selectGroupArr);
      }
	getResultDom() {
        return this.state.selectGroupArr.map((item, index) => {
            return (
                <div className='result-group-list'>
                    <h4 className='result-header'>
                        <Checkbox checked={item.checkedAll} indeterminate={item.indeterminate} onChange={(e)=>{this.onCheckAllChange(e,index)}}>{item.label}</Checkbox>
                    </h4>
                    <div className='result-app-list'>
                        {
                            item.children.map((child, i) => {
                                return (
                                    <div className='app-col'>
                                        <div className='list-item'>
                                            <SiderCard id={child.value} 
                                            key={child.value}
                                            index={i}
                                            parentIndex = {index}
                                                name = {child.label} 
                                                type={'new'} 
                                                checked = {child.checked}
                                                onChangeChecked = {this.onChangeChecked}
                                                >
                                            </SiderCard>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )
        })
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
					{this.getSearchDom()}
					<div className='add-item'>
						<span />
						<span className='add'>添加</span>
					</div>
					<div className='sider-result'>{this.getResultDom()}</div>
				</div>
			</Sider>
		);
	}
}

export default MySider;
