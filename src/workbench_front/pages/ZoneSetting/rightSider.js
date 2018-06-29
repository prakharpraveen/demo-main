import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BasicProperty from './basicProperty';
import { Tabs, Input, Checkbox, InputNumber, Select } from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import * as utilService from './utilService';
import { updateSelectCard, updateAreaList } from 'Store/ZoneSetting/action';
import InterModal from './interModal';
import MoneyModal from './moneyModal';
import ReferModal from './referModal';
import CustomModal from './customModal';
import RelateMetaModal from './relateMetaModal';
import { high } from 'nc-lightapp-front';
import 'nc-lightapp-front/dist/platform/nc-lightapp-front/index.css';
const { Refer, FormulaEditor } = high;
const Search = Input.Search;


function Formula({ setName, setExplain, name }) {
	return (<div className='Formula'>
		<ul>
			{(() => {
				let propertyList = name && name.queryPropertyList;
				return propertyList && propertyList.map((v, i) => {
					return <li
						onDoubleClick={() => { setExplain(`${name.code}.${v.code}`) }}
						onClick={() => { setName(`${name.code}.${v.code}`) }}
						key={i}>
						{v.label}
					</li>
				})
			})()}
		</ul>
	</div>)
	
}
class MyRightSider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			interModalVal: false,
			moneyModalVisibel: false,
			ReferModalVisibel: false,
			relateMetaModalVisibel: false
		};
	}

	componentDidMount() {}

	changeValue = (value, propertyKey) => {
		let { selectCard } = this.props;
		if (_.isEmpty(selectCard)) {
			console.log('empty');
			return;
		}

		selectCard = { ...selectCard };
		selectCard[propertyKey] = value;
		this.props.updateSelectCard(selectCard);
	};
	updateCardInArea = (propertyKey) => {
		let { areaList, selectCard } = this.props;
		if (_.isEmpty(selectCard)) {
			console.log('empty');
			return;
		}
		let targetAreaIndex = 0;
		let targetCardIndex = 0;
		areaList = _.cloneDeep(areaList);
		_.forEach(areaList, (a, i) => {
			_.forEach(a.queryPropertyList, (q, index) => {
				if (q.areaid === selectCard.areaid && q.pk_query_property === selectCard.pk_query_property) {
					targetAreaIndex = i;
					targetCardIndex = index;
					return false;
				}
			});
		});
		areaList[targetAreaIndex].queryPropertyList[targetCardIndex][propertyKey] = selectCard[propertyKey];
		this.props.updateAreaList(areaList);
	};

	getCardListInAreaBySelectCard = () => {
		let { areaList, selectCard } = this.props;
		let targetAreaIndex = 0;
		_.forEach(areaList, (a, i) => {
			if (a.pk_area === selectCard.areaid) {
				targetAreaIndex = i;
				return false;
			}
		});
		return areaList[targetAreaIndex].queryPropertyList;
	};
	changeCheckboxValue = (value, property) => {
		let { selectCard } = this.props;
		if (_.isEmpty(selectCard)) {
			return;
		}
		selectCard = { ...selectCard };
		selectCard[property] = value;
		this.asyncUpdateSelectCard(selectCard).then(() => {
			this.updateCardInArea(property);
		});
	};
	onPressEnter = (value, property) => {
		this[`${property}input`].blur();
	};

	getMyNumberInput = (placeholder, property) => {
		return (
			<InputNumber
				min={1}
				value={this.props.selectCard[property]}
				onChange={(value) => {
					this.changeValue(value, property);
				}}
				onBlur={(e) => {
					this.updateCardInArea(property);
				}}
				ref={(input) => (this[`${property}input`] = input)}
				onPressEnter={(e) => {
					this.onPressEnter(e.target.value, property);
				}}
			/>
		);
	};

	getMyInput(placeholder, property) {
		return (
			<Input
				style={{ height: 23, width: 176 }}
				placeholder={placeholder}
				value={this.props.selectCard[property]}
				onChange={(e) => {
					this.changeValue(e.target.value, property);
				}}
				onBlur={(e) => {
					this.updateCardInArea(property);
				}}
				ref={(input) => (this[`${property}input`] = input)}
				onPressEnter={(e) => {
					this.onPressEnter(e.target.value, property);
				}}
			/>
		);
	}

	getMyCheckbox = (property) => {
		return (
			<Checkbox
				checked={Boolean(this.props.selectCard[property])}
				onChange={(e) => {
					this.changeCheckboxValue(e.target.checked, property);
				}}
			/>
		);
	};
	//下拉选择的事件处理
	handleSelectChange = (value, property) => {
		let { selectCard } = this.props;
		if (_.isEmpty(selectCard)) {
			return;
		}
		selectCard = { ...selectCard };
		selectCard[property] = value;

		if(property === 'datatype'){
			selectCard.itemtype = utilService.getItemtypeByDatatype(selectCard.datatype);
		}
		this.asyncUpdateSelectCard(selectCard).then(() => {
			this.updateCardInArea(property);
		});
	};
	//获取下拉选择Dom
	getMySelect = (mySelectObj, property) => {
		return (
			<Select
				value={
					_.isEmpty(this.props.selectCard[property]) ? mySelectObj[0].value : this.props.selectCard[property]
				}
				onChange={(value) => {
					if (property === 'datatype') {
						this.props.selectCard.dataval = '';
					}
					this.handleSelectChange(value, property);
				}}
				style={{ width: 176 }}
				size={'small'}
			>
				{(() => {
					if (property === 'color') {
					return	mySelectObj.map((c, index) => {
							return (
								<Option key={index} value={c.value}  >
									<span className="template-setting-color-select">
										<span>{c.name}</span>
										<span className="color-select-color" style={{ backgroundColor: c.value }}>
										</span>
									</span>
								</Option>
							);
						});
					} else {
						return	mySelectObj.map((c, index) => {
							return (
								<Option key={index} value={c.value}>
									{c.name}
								</Option>
							);
						});
					}
				})()}
			</Select>
		);
	};
	async asyncUpdateSelectCard(selectCard) {
		let user = await this.props.updateSelectCard(selectCard);
		return user;
	}

	//
	getMetaType = (selectCard) => {
		if (!!selectCard.metapath) return true; // 是元数据
		return false; // 不是元数据 默认没选的情况是false
	};
	// 获取当前区域的类型 
	getAreaType = (areaList, selectCard) => {
		let result;
		_.forEach(areaList, (val, index) => {
			_.forEach(val.queryPropertyList, (v, i) => {
				if (selectCard.areaid === v.areaid) {
					result = val.areatype;
					return;
				}
			});
		});
		return result;
	};
	// 获取当前区域
	getArea = (areaList, selectCard) => {
		let result;
		_.forEach(areaList, (val, index) => {
			_.forEach(val.queryPropertyList, (v, i) => {
				if (selectCard.areaid === v.areaid) {
					result = val;
					return ;
				}
			});
		});
		return result;
	};
	//查询区，元数据属性
	getDom1 = () => {
		const { selectCard } = this.props;
		return (
			<Tabs defaultActiveKey='1'>
				<TabPane tab='显示属性' key='1'>
					<ul className='basic-property'>
						<li>显示名称</li>
						<li>{this.getMyInput('显示名称', 'label')}</li>
						<li>数据类型</li>
						<li>{utilService.getDatatypeName(selectCard.datatype)}</li>
						<li>非元数据</li>
						<li>
							<Checkbox checked={selectCard.metapath === ''} disabled />
						</li>
						<li>编码</li>
						<li>{this.getMyInput('编码', 'code')}</li>
						<li>操作符编码</li>
						<li>{this.getMyInput('操作符编码', 'opersign')}</li>
						<li>操作符名称</li>
						<li>{this.getMyInput('操作符名称', 'opersignname')}</li>
						<li>默认取值</li>
						<li>{this.getMyInput('默认取值', 'defaultvalue')}</li>
						<li>可修改</li>
						<li>{this.getMyCheckbox('disabled')}</li>
						<li>可见</li>
						<li>{this.getMyCheckbox('visible')}</li>
						<li>固定条件</li>
						<li>{this.getMyCheckbox('isfixedcondition')}</li>
						<li>必输条件</li>
						<li>{this.getMyCheckbox('required')}</li>
						<li>查询条件</li>
						<li>{this.getMyCheckbox('isquerycondition')}</li>
						<li>参照名称</li>
						<li>{this.getMyInput('参照名称', 'refname')}</li>
						<li>参照包含下级</li>
						<li>{this.getMyCheckbox('containlower')}</li>
						<li>参照自动检查</li>
						<li>{this.getMyCheckbox('ischeck')}</li>
						<li>参照跨集团</li>
						<li>{this.getMyCheckbox('isbeyondorg')}</li>
						<li>使用系统函数</li>
						<li>{this.getMyCheckbox('usefunc')}</li>
						<li>组件类型</li>
						<li>{this.getMySelect(utilService.getItemtypeObjByDatatype(selectCard.datatype), 'itemtype')}</li>
						<li>显示类型</li>
						<li>{this.getMySelect(utilService.showAndReturnType, 'showtype')}</li>
						<li>返回类型</li>
						<li>{this.getMySelect(utilService.showAndReturnType, 'returntype')}</li>
						<li>自定义1</li>
						<li>{this.getMyInput('自定义1', 'define1')}</li>
						<li>自定义2</li>
						<li>{this.getMyInput('自定义2', 'define2')}</li>
						<li>自定义3</li>
						<li>{this.getMyInput('自定义3', 'define3')}</li>
						<li>自定义4</li>
						<li>{this.getMyInput('自定义4', 'define4')}</li>
						<li>自定义5</li>
						<li>{this.getMyInput('自定义5', 'define5')}</li>
					</ul>
				</TabPane>
			</Tabs>
		);
	};
	//查询区，非元数据属性
	getDom2 = () => {
		const { selectCard } = this.props;
		return (
			<Tabs defaultActiveKey='1'>
				<TabPane tab='显示属性' key='1'>
					<ul className='basic-property'>
						<li>显示名称</li>
						<li>{this.getMyInput('显示名称', 'label')}</li>
						<li>非元数据</li>
						<li>
							<Checkbox checked={selectCard.metapath === ''} disabled />
						</li>
						<li>元数据属性</li>
						<li>{this.getMyInput('元数据属性', 'metadataproperty')}</li>
						<li>编码</li>
						<li>{this.getMyInput('编码', 'code')}</li>
						<li>操作符编码</li>
						<li>{this.getMyInput('操作符编码', 'opersign')}</li>
						<li>操作符名称</li>
						<li>{this.getMyInput('操作符名称', 'opersignname')}</li>
						<li>默认取值</li>
						<li>{this.getMyInput('默认取值', 'defaultvalue')}</li>
						<li>可修改</li>
						<li>{this.getMyCheckbox('disabled')}</li>
						<li>可见</li>
						<li>{this.getMyCheckbox('visible')}</li>
						<li>固定条件</li>
						<li>{this.getMyCheckbox('isfixedcondition')}</li>
						<li>必输条件</li>
						<li>{this.getMyCheckbox('required')}</li>
						<li>查询条件</li>
						<li>{this.getMyCheckbox('isquerycondition')}</li>
						<li>参照名称</li>
						<li>{this.getMyInput('参照名称', 'refname')}</li>
						<li>参照包含下级</li>
						<li>{this.getMyCheckbox('containlower')}</li>
						<li>参照自动检查</li>
						<li>{this.getMyCheckbox('ischeck')}</li>
						<li>参照跨集团</li>
						<li>{this.getMyCheckbox('isbeyondorg')}</li>
						<li>使用系统函数</li>
						<li>{this.getMyCheckbox('usefunc')}</li>
						<li>显示类型</li>
						<li>{this.getMySelect(utilService.showAndReturnType, 'showtype')}</li>
						<li>返回类型</li>
						<li>{this.getMySelect(utilService.showAndReturnType, 'returntype')}</li>
					</ul>
				</TabPane>
				<TabPane tab='高级属性' key='2'>
					<ul className='basic-property'>
						<li>数据类型</li>
						<li>{this.getMySelect(utilService.dataTypeObj, 'datatype')}</li>
						<li>类型设置</li>
						<li>{this.getMyInput('类型设置', 'dataval')}</li>
						<li>组件类型</li>
						<li>{this.getMySelect(utilService.getItemtypeObjByDatatype(selectCard.datatype), 'itemtype')}</li>
						<li>自定义1</li>
						<li>{this.getMyInput('自定义1', 'define1')}</li>
						<li>自定义2</li>
						<li>{this.getMyInput('自定义2', 'define2')}</li>
						<li>自定义3</li>
						<li>{this.getMyInput('自定义3', 'define3')}</li>
						<li>自定义4</li>
						<li>{this.getMyInput('自定义4', 'define4')}</li>
						<li>自定义5</li>
						<li>{this.getMyInput('自定义5', 'define5')}</li>
					</ul>
				</TabPane>
			</Tabs>
		);
	};
	// 设置不同弹框的显示和隐藏
	setModalVisibel = (type, val) => {
		switch (type) {
			case 'inter':
				this.setState({ interModalVisibel: val });
				break;
			case 'money':
				this.setState({ moneyModalVisibel: val });
				break;
			case 'refer':
				this.setState({ ReferModalVisibel: val });
				break;
			case 'custom':
				this.setState({ CustomModalVisibel: val });
				break;
			case 'relatemeta':
				this.setState({ relateMetaModalVisibel: val });
				break;
			default:
				break;
		}
	};
	getMySearch = (key, whichModalVisibel) => {
		const { selectCard } = this.props;
		return (
			<Search
				size='small'
				style={{ width: 176 }}
				value={selectCard[key]}
				onSearch={() => {
					this.setState({ [whichModalVisibel]: true });
				}}
			/>
		);
	};
	getMyFormulaSearch = (key) => {
		const { selectCard } = this.props;
		return (
			<Search
				size='small'
				style={{ width: 176 }}
				value={selectCard[key]} 
				onSearch={() => {
					//this.refs[key].setShow(true);
					this.setState({ [key]: true})	
				//	this.refs[key].handleTextAreaChange(selectCard[key]);
				}}
			/>
		);
	};
	//非查询区，元数据属性||非元数据 	
	getDom3 = (areaType, isMetaData) => {
		const { selectCard } = this.props;
		const isShowRelateMeta = selectCard.datatype === '204' ? 'block' : 'none';
		const areaCardList = this.getCardListInAreaBySelectCard();
		return (
			<Tabs defaultActiveKey='1'>
				<TabPane tab='显示属性' key='1'>
					<ul className='basic-property'>
						<li>显示名称</li>
						<li>{this.getMyInput('显示名称', 'label')}</li>
						<li>编码</li>
						<li>{this.getMyInput('编码', 'code')}</li>
						{(() => {
							if (!isMetaData) {
								return <li>元数据属性</li>;
							}
						})()}
						{(() => {
							if (!isMetaData) {
								return <li>{this.getMyInput('元数据属性', 'metadataproperty')}</li>;
							}
						})()}
						<li>组件长度</li>
						{(() => {
							if (areaType === '1') {
								return <li>{this.getMySelect(utilService.componentWidthObj, 'width')}</li>;
							} else {
								return <li>{this.getMyInput('组件长度', 'width')}</li>;
							}
						})()}
						<li>最大长度</li>
						<li>{this.getMyInput('最大长度', 'maxlength')}</li>
						<li>可修订</li>
						<li>{this.getMyCheckbox('isrevise')}</li>
						<li>合计</li>
						<li>{this.getMyCheckbox('istotal')}</li>
						<li>可见</li>
						<li>{this.getMyCheckbox('visible')}</li>
						<li>必输项</li>
						<li>{this.getMyCheckbox('required')}</li>
						<li>可修改</li>
						<li>{this.getMyCheckbox('disabled')}</li>
						<li>多行文本显示行数</li>
						<li>{this.getMyInput('多行文本显示行数', 'textrows')}</li>
						<li>左空白</li>
						<li>{this.getMyInput('左空白', 'leftspace')}</li>
						<li>右空白</li>
						<li>{this.getMyInput('右空白', 'rightspace')}</li>
						<li>默认系统变量</li>
						<li>{this.getMySelect(utilService.defaultvarObj, 'defaultvar')}</li>
						<li>显示颜色</li>
						<li>{this.getMySelect(utilService.colorObj, 'color')}</li>
					</ul>
				</TabPane>
				<TabPane tab='高级属性' key='2'>
					<ul className='basic-property'>
						<li>数据类型</li>
						{(() => {
							if (isMetaData) {
								return <li>{utilService.getDatatypeName(selectCard.datatype)}</li>;
							} else {
								return <li>{this.getMySelect(utilService.dataTypeObj, 'datatype')}</li>;
							}
						})()}
						<li>类型设置</li>
						{(() => {
							if (isMetaData ) {
								if(selectCard.datatype === '204'){
									return (
										<li>
											{this.getMySearch('dataval', 'ReferModalVisibel')}
											<ReferModal
												handleSelectChange={this.handleSelectChange}
												initVal={selectCard.dataval}
												modalVisibel={this.state.ReferModalVisibel}
												setModalVisibel={this.setModalVisibel}
											/>
										</li>
									);
								}else{
									return <li/>
								}
								
							} else {
								switch (selectCard.datatype) {
									case '204':
										return (
											<li>
											{this.getMySearch('dataval', 'ReferModalVisibel')}
											<ReferModal
												handleSelectChange={this.handleSelectChange}
												initVal={selectCard.dataval}
												modalVisibel={this.state.ReferModalVisibel}
												setModalVisibel={this.setModalVisibel}
											/>
										</li>
										);
									case '2':
										return (
											<li>
												{this.getMySearch('dataval', 'moneyModalVisibel')}
												<MoneyModal
													type='小数'
													handleSelectChange={this.handleSelectChange}
													initVal={selectCard.dataval}
													modalVisibel={this.state.moneyModalVisibel}
													setModalVisibel={this.setModalVisibel}
												/>
											</li>
										);
									case '4':
										return (
											<li>
												{this.getMySearch('dataval', 'interModalVisibel')}
												<InterModal
													handleSelectChange={this.handleSelectChange}
													initVal={selectCard.dataval}
													modalVisibel={this.state.interModalVisibel}
													setModalVisibel={this.setModalVisibel}
												/>
											</li>
										);
									case '52':
										return (
											<li>
												{this.getMySearch('dataval', 'moneyModalVisibel')}
												<MoneyModal
													type='金额'
													handleSelectChange={this.handleSelectChange}
													initVal={selectCard.dataval}
													modalVisibel={this.state.moneyModalVisibel}
													setModalVisibel={this.setModalVisibel}
												/>
											</li>
										);
									case '57':
										return (
											<li>
												{this.getMySearch('dataval', 'CustomModalVisibel')}
												<CustomModal
													handleSelectChange={this.handleSelectChange}
													initVal={selectCard.dataval}
													modalVisibel={this.state.CustomModalVisibel}
													setModalVisibel={this.setModalVisibel}
												/>
											</li>
										);
									default:
										return <li />;
								}
							}
						})()}

						{(() => {
							if (isMetaData) {
								return <li style={{ display: isShowRelateMeta }}>元数据编辑关联项</li>;
							}
						})()}
						{(() => {
							if (isMetaData) {
								return (
									<li style={{ display: isShowRelateMeta }}>
										{this.getMySearch('relatemeta', 'relateMetaModalVisibel')}
										<RelateMetaModal
											cards={areaCardList}
											handleSelectChange={this.handleSelectChange}
											initVal={selectCard.relatemeta}
											modalVisibel={this.state.relateMetaModalVisibel}
											setModalVisibel={this.setModalVisibel}
										/>
									</li>
								);
							}
						})()}

						<li>组件类型</li>
						<li>{this.getMySelect(utilService.getItemtypeObjByDatatype(selectCard.datatype), 'itemtype')}</li>
						<li>显示公式</li>
						<li>
							{this.getMyFormulaSearch('showformula')}
							<FormulaEditor
								value={selectCard['showformula']}
								noControlBtns={[ 'validate']}
								isValidateOnOK={false}
								/* treeParam={{
									pk_billtype: 'CM02',
									bizmodelStyle: 'fip',
									classid: ''
								}} */

								noShowAttr={['元数据属性']}
								show={this.state.showformula}
								onHide = {()=>{
									this.setState({ showformula: false })
								}}
								attrConfig={this.state.tab}
								onOk={(val) => {
									this.handleSelectChange(val, 'showformula');
									this.setState({ showformula: false })
								}}
								onCancel={()=>{
									this.setState({ showformula:false})
								}}
							/>
						</li>
						<li>编辑公式</li>
						<li>
							{this.getMyFormulaSearch('editformula')}
							<FormulaEditor
								value={selectCard['editformula']}
								noShowAttr={['元数据属性']}
								show={this.state.editformula}
								onHide={() => {
									this.setState({ editformula: false })
								}}
								attrConfig={this.state.tab}
								onOk={(val) => {
									this.handleSelectChange(val, 'editformula');
									this.setState({ editformula: false })
								}}
								onCancel={() => {
									this.setState({ editformula: false })
								}}
							/>
						</li>

						<li>验证公式</li>
						<li>
							{this.getMyFormulaSearch('validateformula')}
							<FormulaEditor
								value={selectCard['validateformula']}
								noControlBtns={['validate']}
								isValidateOnOK={false}
								/* treeParam={{
									pk_billtype: 'CM02',
									bizmodelStyle: 'fip',
									classid: ''
								}} */
								noShowAttr={['元数据属性']}
								show={this.state.validateformula}
								onHide={() => {
									this.setState({ validateformula: false })
								}}
								attrConfig={this.state.tab}
								onOk={(val) => {
									debugger;
									this.handleSelectChange(val, 'validateformula');
									this.setState({ validateformula: false })
								}}
								onCancel={() => {
									this.setState({ validateformula: false })
								}}
							/>
						</li>
						<li>自定义1</li>
						<li>{this.getMyInput('自定义1', 'define1')}</li>
						<li>自定义2</li>
						<li>{this.getMyInput('自定义2', 'define2')}</li>
						<li>自定义3</li>
						<li>{this.getMyInput('自定义3', 'define3')}</li>
					</ul>
				</TabPane>
			</Tabs>
		);
	};	

	// 获取主表 
	getMainArea = (areaList, headcode) => {
		if (!headcode) return ; 
		let result;
		_.forEach(areaList, (val, index) => {
			if (val.code === headcode) {
				result = val;
				return;
			}
		});
		return result;
	};

	componentWillReceiveProps(nextProps){
		this.handleFormula(nextProps)
	}
	// 公式编辑器 
	handleFormula = (props) =>{
		const { selectCard, areaList } = props;
		if (_.isEmpty(selectCard) || _.isEmpty(areaList)) return ;
		let headcode = areaList[0] && areaList[0].headcode;
		let area = this.getArea(areaList, selectCard);
		let mainArea = this.getMainArea(areaList, headcode);
		let tab;
		//  headcode 存在 时候最多有两个 table或者自己主表单时为一个 
		//  headcode 不存在 只有一个 tab  
		if (!headcode || (headcode && headcode === area.code) ){
			tab = [{ tab: area.name, TabPaneContent: Formula, params: { name: area} }]
		}

		else if (headcode && headcode !== area.code) {
			tab = [{ tab: area.name, TabPaneContent: Formula, params: { name: area } }, { tab: mainArea.name, TabPaneContent: Formula, params: { name: mainArea } }]
		}
		this.setState({tab});
	}
	render() {
		const { selectCard, areaList } = this.props;
		// 1 判断是否是元数据 2 判断所属的类型是否是查询区  默认是 不是元数据 不是查询区
		// 处理公式编辑器
		let result_div;
		if (_.isEmpty(selectCard)) {
			result_div = <div />;
		} else {
			let isMetaData = this.getMetaType(selectCard);
			let areaType = this.getAreaType(areaList, selectCard);
			let isSearch = areaType === '0';
			if (isSearch) {
				//不区分显示属性和高级属性
				if (isMetaData) {
					//元数据中metapath 和datatype和类型设置 为只读
					result_div = this.getDom1();
				} else {
					//非元数据metapath为空且只读，datatype和类型设置 为可以设置
					result_div = this.getDom2();
				}
			} else {
				//非查询区，元数据||非元数据
				result_div = this.getDom3(areaType, isMetaData);
			}
		}
		

		return (
			<div className='template-setting-right-sider template-setting-sider'>
				<div className='sider-content'>
					<div className='sider-tab'>{result_div}</div>
				</div>
			</div>
		);
	}
}
export default connect(
	(state) => ({
		areaList: state.zoneSettingData.areaList,
		selectCard: state.zoneSettingData.selectCard
	}),
	{
		updateAreaList,
		updateSelectCard
	}
)(MyRightSider);
