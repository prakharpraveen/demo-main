import { Row, Col, Form, Input, Select, Checkbox, Button } from 'antd';
import ChooseImageForForm from 'Components/ChooseImageForForm';
const FormItem = Form.Item;
const Option = Select.Option;
const imgs = [
	{
		name:'img1',
		value:'toupiao',
		src:'toupiao'
	},{
		name:'img2',
		value:'wenku',
		src:'wenku'
	},{
		name:'img3',
		value:'rizhi',
		src:'rizhi'
	},{
		name:'img4',
		value:'xinzifafang',
		src:'xinzifafang'
	},{
		name:'img5',
		value:'gonggao',
		src:'gonggao'
	},{
		name:'img6',
		value:'huati',
		src:'huati'
	},{
		name:'img7',
		value:'zuzhiguanli',
		src:'zuzhiguanli'
	},{
		name:'img8',
		value:'jiaqin',
		src:'jiaqin'
	}
];
/**
 * 创建 下拉内容
 */
const createOption = (options) => {
    return options.map((item, index) => {
        return <Option value={item.value}>{item.text}</Option>;
    });
};
/**
 * 下拉数据浏览态展示
 * 
 */
const optionShow = (options, value) => {
    let option = options.find((item) => item.value === value);
    if (option) {
        return option.text;
    }
};
/**
 * 创建表单
 * @param {*} propsData 
 * @param {*} DOMDATA 
 * @param {*} nodeData 
 */
export const createForm =(DOMDATA,propsData)=>{
		// if (nodeData.systypename) {
		// 	return;
		// }
		const children = [];
		DOMDATA.map((item, index) => {
            let { lable, md = 24, lg = 12, xl = 8 } = item;
			children.push(
				<Col md={md} lg={lg} xl={xl} key={index}>
					{createFormItem(propsData, item)}
				</Col>
			);
        });
		return children.filter((item)=>item.props.children);
}
/**
 * 创建表单
 * @param {*} props 
 * @param {*} itemInfo 
 */
const createFormItem = (props,itemInfo) => {
    let nodeData = props.nodeData;
    const { getFieldDecorator } = props.form;
    const { isEdit,isNew } = props.billStatus;
    let { lable, type, code,required,check,search } = itemInfo;
    switch (type) {
        case 'select':
            if(code === 'target_path'){
                return isEdit ? !isNew?(
                    <FormItem label={lable} hasFeedback>
                        {getFieldDecorator(code, {
                            initialValue: nodeData[code],
                            rules: [ { required: required, message: `请选择${lable}` } ]
                        })(<Select placeholder={`请选择${lable}`}>{createOption(itemInfo.options)}</Select>)}
                    </FormItem>
                ) :null: (
                    <FormItem label={lable}>
                        <span className='ant-form-text'>{optionShow(itemInfo.options, nodeData[code])}</span>
                    </FormItem>
                );
            }else{
                return isEdit ? (
                    <FormItem label={lable} hasFeedback>
                        {getFieldDecorator(code, {
                            initialValue: nodeData[code],
                            rules: [ { required: required, message: `请选择${lable}` } ]
                        })(<Select placeholder={`请选择${lable}`}>{createOption(itemInfo.options)}</Select>)}
                    </FormItem>
                ) : (
                    <FormItem label={lable}>
                        <span className='ant-form-text'>{optionShow(itemInfo.options, nodeData[code])}</span>
                    </FormItem>
                );
            }
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
                            onChange={search}
                        >
                            {createOption(itemInfo.options)}
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
                        initialValue: nodeData[code]?nodeData[code]+'':'',
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