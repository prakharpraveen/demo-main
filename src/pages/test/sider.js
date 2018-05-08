import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Cascader, Input, Icon, Checkbox, Button, Radio, Modal } from 'antd';
import SiderCard from './siderCard.js'
import { connect } from 'react-redux';
import { updateShadowCard, updateGroupList, updateSelectCardIDList } from 'Store/test/action';
import * as utilService from './utilService';
import Ajax from 'Pub/js/ajax';
const { Sider } = Layout;
const RadioGroup = Radio.Group;

class MySider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showSearch: false,
			searchValue: '',
			selectGroupArr: [],
			modalVisible: false,
			selectedValue: 0
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
		Ajax({
			url: `/nccloud/platform/appregister/queryapplazy.do`,
			data: {
				search_content: this.state.searchValue,
				userid: '1111Z510000000039689'
				// search_content:'采购'
			},
			success: (res) => {
				const { data, success } = res.data;
				if (success && data && data.length > 0) {
                    console.log(data);
				}
			}
		});
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
				// search_content:'采购'
			},
			success: (res) => {
				const { data, success } = res.data;
				if (success && data && data.length > 0) {
                    console.log(data);
                    _.forEach(data,(d)=>{
						d.isShow = true;
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
        this.setState({selectGroupArr});
	  }
	hasChechedItem() {
		let flag = false;
		let { selectGroupArr } = this.state;
		_.forEach(selectGroupArr, (s) => {
			_.forEach(s.children, (c) => {
				if (c.checked) {
					flag = true;
					return false;
				}
			});
			if (flag) {
				return false;
			}
		})
		return flag;
	}
	onChangeShowHide(index){
		let { selectGroupArr } = this.state;
		selectGroupArr[index].isShow = !selectGroupArr[index].isShow;
		this.setState({selectGroupArr});
	}
	getResultDom() {
        return this.state.selectGroupArr.map((item, index) => {
            return (
                <div className='result-group-list'>
                    <h4 className='result-header'>
                        <Checkbox checked={item.checkedAll} indeterminate={item.indeterminate} onChange={(e)=>{this.onCheckAllChange(e,index)}}></Checkbox>
						
						<span className='result-header-name' onClick={()=>{this.onChangeShowHide(index)}}>
						{item.label}
						{
							item.isShow? <Icon type="down" />: <Icon type="right" />
						}
						</span>
                    </h4>
                    <div className='result-app-list' style={{display: item.isShow?'flex':'none'}}>
                        {
                            item.children.map((child, i) => {
                                return (
                                    <div className='app-col'>
                                        <div className='list-item'>
                                            <SiderCard id={child.value} 
											key={child.value}
											width={child.width}
											height={child.height}
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
	getGroupItemNameRadio(groups) {
		if (!groups) return;
		return (
			<RadioGroup
				className='modal-radio-group'
				value={this.state.selectedValue}
				onChange={this.onChangeRadio.bind(this)}
			>
				{
					groups.map((g, i) => {
						return (
							<Radio className='modal-radio' key={g.pk_app_group} value={g.pk_app_group}>
								{g.groupname}
							</Radio>
						)

					})
				}
			</RadioGroup>
		);
	}
	setModalVisible(modalVisible) {
		this.setState({ modalVisible });
	}
	//移动到的弹出框中，组名选择
	onChangeRadio(e) {
		this.setState({ selectedValue: e.target.value });
	}
	//移动到的弹出框中，点击确认
	onOkMoveDialog(modalVisible) {
		const targetGroupID = this.state.selectedValue;
		if (targetGroupID === 0) {
			return;
		}
		this.setModalVisible(modalVisible);
		console.log(targetGroupID);
	}
	render() {
		const contentHeight = this.props.contentHeight;
		const { groups } = this.props;
		const groupNameRadioGroup = this.getGroupItemNameRadio(groups);
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
						<Icon className={this.hasChechedItem() ? "add" : "cannot-add"} type="plus-circle-o" title ='占位符' onClick={()=>{this.setModalVisible(true)}}/>
					</div>
					<div className='sider-result'>{this.getResultDom()}</div>
					
					{/* <div className='sider-result'>
					<div  style={{width:'100px', height: '100px', border:'1px solid'}}>2222222</div>
					</div> */}
				</div>
				<Modal
					title='添加到'
					wrapClassName='vertical-center-modal'
					visible={this.state.modalVisible}
					onOk={() => this.onOkMoveDialog(false)}
					onCancel={() => this.setModalVisible(false)}
					footer={[
						<Button key="submit" type="primary" onClick={() => this.onOkMoveDialog(false)}>确定</Button>,
						<Button key="back" onClick={() => this.setModalVisible(false)}>
						  取消
						</Button>,
					  ]}
				>
					{groupNameRadioGroup}
				</Modal>
			</Sider>
		);
	}
}
export default (connect(
	(state) => ({
		groups: state.templateDragData.groups,
		selectCardIDList: state.templateDragData.selectCardIDList,
		shadowCard: state.templateDragData.shadowCard,
        layout: state.templateDragData.layout,
	}),
	{
		updateShadowCard,
		updateGroupList,
		updateSelectCardIDList
	}
)(MySider))
