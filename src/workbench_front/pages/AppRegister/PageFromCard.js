import React,{Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Select, Checkbox, Button } from 'antd';
import Ajax from 'Pub/js/ajax';
import PageTable from './PageTable';
const FormItem = Form.Item;
class PageFormCard extends Component{
    constructor(props) {
        super(props);
        this.state={
            DOMDATA: [
				{
					lable: '页面编码',
					type: 'input',
					code: 'code',
					required: true,
					check: (rule, value, callback)=>{
						if(value === this.props.parentData){
							callback('不能与父节点编码重复');
						}else{
							callback();
						}
					}
				},
				{
					lable: '页面名称',
					type: 'input',
					code: 'name',
					required: true
				},
				{
					lable: '页面描述',
					type: 'imput',
					code: 'orgtypecode',
					required: false,
				}
			]
        }
    }
    /**
	 * 动态创建页面dom
	 * @param {*} nodeData 
	 */
	getFields(nodeData) {
		let { DOMDATA } = this.state;
		if (nodeData.systypename) {
			return;
		}
		const children = [];
		DOMDATA.map((item, index) => {
			let { lable, md = 24, lg = 12, xl = 8 } = item;
			children.push(
				<Col md={md} lg={lg} xl={xl} key={index}>
					{this.createDom(item, nodeData)}
				</Col>
			);
		});
		return children;
	}
    createDom = (itemInfo, nodeData) => {
		const { getFieldDecorator } = this.props.form;
		const { isEdit } = this.props.billStatus;
		let { lable, type, code,required,check } = itemInfo;
		switch (type) {
			case 'select':
				return isEdit ? (
					<FormItem label={lable} hasFeedback>
						{getFieldDecorator(code, {
							initialValue: nodeData[code],
							rules: [ { required: required, message: `请选择${lable}` } ]
						})(<Select placeholder={`请选择${lable}`}>{this.createOption(itemInfo.options)}</Select>)}
					</FormItem>
				) : (
					<FormItem label={lable}>
						<span className='ant-form-text'>{this.optionShow(itemInfo.options, nodeData[code])}</span>
					</FormItem>
				);
			case 'search':
				return isEdit ? (
					<FormItem label={lable} hasFeedback>
						{getFieldDecorator(code, {
							initialValue: nodeData[code],
							rules: [
								{ required: required, message: itemInfo.placeholder ? itemInfo.placeholder : `请选择${lable}` }
							]
						})(
							<Select
								placeholder={itemInfo.placeholder ? itemInfo.placeholder : `请选择${lable}`}
								mode='combobox'
								defaultActiveFirstOption={false}
								showArrow={false}
								filterOption={false}
								onChange={this.handleSearch}
							>
								{this.createOption(itemInfo.options)}
							</Select>
						)}
					</FormItem>
				) : (
					<FormItem label={lable}>
						<span className='ant-form-text'>{nodeData[code]}</span>
					</FormItem>
				);
			case 'checkbox':
				return (
					<FormItem>
						{getFieldDecorator(code, {
							valuePropName: 'checked',
							initialValue: nodeData[code]
						})(<Checkbox disabled={!isEdit}>{lable}</Checkbox>)}
					</FormItem>
				);
			case 'chooseImage':
				return isEdit ? (
					<FormItem label={lable}>
							{getFieldDecorator(code, {
								initialValue: nodeData[code],
								rules: [
									{ required: required, message: itemInfo.placeholder ? itemInfo.placeholder : `请选择${lable}` }
								],
							})(<ChooseImageForForm data={imgs} title={'图标选择'}/>)}
						</FormItem>
				) : (
					<FormItem label={lable}>
						<span className='ant-form-text'>{nodeData[code]}</span>
					</FormItem>
				);
			default:
				return isEdit ? (
					<FormItem label={lable}>
						{getFieldDecorator(code, {
							initialValue: nodeData[code],
							rules: [
								{
									required: required,
									message: `请输入${lable}`
								},{
									validator: check?check:null
								}
							]
						})(<Input placeholder={`请输入${lable}`} />)}
					</FormItem>
				) : (
					<FormItem label={lable}>
						<span className='ant-form-text'>{nodeData[code]}</span>
					</FormItem>
				);
		}
	};
    render() {
        return (
            <div>
                <Form className='from-card'>
					<Row gutter={24}>{this.getFields(this.props.nodeData)}</Row>
				</Form>
                <div style={{ 'margin-top': '16px', background: '#ffffff', padding: '10px', 'border-radius': '6px' }}>
					<PageTable />
				</div>
            </div>
        );
    }
}
PageFormCard = Form.create()(PageFormCard);
PageFormCard.PropTypes = {
	updateTreeData: PropTypes.func.isRequired,
	nodeData: PropTypes.object.isRequired,
	billStatus: PropTypes.object.isRequired,
	setNodeData: PropTypes.func.isRequired,
	setAppData: PropTypes.func.isRequired,
	getFromDataFunc: PropTypes.func.isRequired,
	parentData: PropTypes.string.isRequired,
};
export default connect((state)=>{
    let { nodeData, updateTreeData, billStatus,parentData } = state.AppRegisterData;
	return { nodeData, updateTreeData, billStatus,parentData };
},{})(PageFormCard);