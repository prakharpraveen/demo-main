import React,{Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Select, Checkbox, Button } from 'antd';
import { getFromDataFunc } from 'Store/AppRegister_bak/action';
import Ajax from 'Pub/js/ajax';
import PageTable from './PageTable';
import { createForm } from './CreatForm';
class PageFormCard extends Component{
    constructor(props) {
        super(props);
        this.state={
            DOMDATA: [
				{
					lable: '页面编码',
					type: 'input',
					code: 'pagecode',
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
					code: 'pagename',
					required: true
				},
				{
					lable: '多语字段',
					type: 'input',
					code: 'resid',
					required: false	
				},
				{
					lable: '设为默认页面',
					type: 'checkbox',
					code: 'isdefault',
					required: true	
				},
				{
					lable: '页面描述',
					type: 'imput',
					code: 'pagedesc',
					required: false,
					md: 24,
					lg: 16,
					xl: 16
				},
				{
					lable: '页面地址',
					type: 'input',
					code: 'pageurl',
					required: true,
					md: 24,
					lg: 24,
					xl: 24	
				},
			]
        }
    }
	getFromData = () => {
		const { getFieldsValue, validateFields } = this.props.form;
		let flag = false;
		validateFields((err, values) => {
			if (!err) {
				flag = true;
			}
		});
		return flag ? getFieldsValue() : null;
	};
	componentWillMount() {
		this.props.getFromDataFunc(this.getFromData);
	}
    render() {
        return (
            <div>
                <Form className='from-card'>
					<Row gutter={24}>{createForm(this.state.DOMDATA, this.props)}</Row>
				</Form>
                <div style={{ 'marginTop': '16px', background: '#ffffff', padding: '10px', 'borderRadius': '6px' }}>
					<PageTable />
				</div>
            </div>
        );
    }
}
PageFormCard = Form.create()(PageFormCard);
PageFormCard.propTypes = {
	updateTreeData: PropTypes.func.isRequired,
	nodeData: PropTypes.object.isRequired,
	billStatus: PropTypes.object.isRequired,
	getFromDataFunc: PropTypes.func.isRequired,
	parentData: PropTypes.string.isRequired,
};
export default connect((state)=>{
    let { nodeData, updateTreeData, billStatus,parentData } = state.AppRegister_bakData;
	return { nodeData, updateTreeData, billStatus,parentData };
},{getFromDataFunc})(PageFormCard);