import React, {Component} from "react";
import {Form, Row, Col, Input, Select, Checkbox} from "antd";
import {FormControl} from "./FormControl";
import {high} from "nc-lightapp-front";
import ChooseImageForForm from "Components/ChooseImageForForm";
import "nc-lightapp-front/dist/platform/nc-lightapp-front/index.css";
import "./index.less";
const {Refer} = high;
const FormItem = Form.Item;
const Option = Select.Option;
/**
 * 常规显示
 * 其中包括 type 类型为 string
 */
class NormalShow extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div>{this.props.value}</div>;
    }
}
/**
 * 参照显示
 * type 类型为 refer
 */
class ReferShow extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        // console.log(this.props);
        return (
            <div>
                {this.props.value&&this.props.value.refname ? this.props.value.refname : ""}
            </div>
        );
    }
}
/**
 * 下拉显示
 * type 类型为 select
 */
class SelectShow extends Component {
    constructor(props) {
        super(props);
    }
    showValue = () => {
        let {options, value} = this.props;
        let option = options.find(item => item.value === value);
        if (option) {
            return option.text;
        }
        return "";
    };
    render() {
        return <div>{this.showValue()}</div>;
    }
}
/**
 * 表单创建组件
 * formData - 表单数据描述
 * {
    code: "code", - 编码
    type: "string", -类型
    label: "编码", - label
    isRequired: true, - 是否必输
    isedit: isedit - 是否可编辑,
    hidden: false 显示隐藏 默认为 false - 显示 true - 不显示
    options: 组件其他项 object 
    },
 * fields - 表单字段值描述
 * onChange - 表单值改变事件
 */
class FormContent extends Component {
    constructor(props) {
        super(props);
    }
    createComponent = item => {
        const {getFieldDecorator} = this.props.form;
        let {
            type = "string",
            isRequired = false,
            label = "",
            code,
            isedit = false,
            check
        } = item;
        switch (type) {
            case "string":
                return (
                    <FormItem
                        className="form-item margin-bottom-20"
                        label={label}>
                        {getFieldDecorator(code, {
                            initialValue: "",
                            rules: [
                                {
                                    type: "string",
                                    message: "当前字段数据类型-string"
                                },
                                {
                                    required: isRequired,
                                    message: "此字段为必输项！"
                                },
                                {
                                validator: check?check:null
                                }
                            ]
                        })(isedit ? <Input /> : <NormalShow />)}
                    </FormItem>
                );
            case "refer":
                return (
                    <FormItem
                        className="form-item margin-bottom-20"
                        label={label}>
                        {getFieldDecorator(code, {
                            initialValue: {},
                            rules: [
                                {
                                    required: isRequired,
                                    message: "此字段为必输项！"
                                },
                                {
                                    type: "object",
                                    message: "当前字段数据类型-object",
                                    validator: null
                                }
                            ]
                        })(
                            isedit ? <Refer {...item.options} /> : <ReferShow />
                        )}
                    </FormItem>
                );
            case "select":
                return (
                    <FormItem
                        className="form-item margin-bottom-20"
                        label={label}>
                        {getFieldDecorator(code, {
                            initialValue: {},
                            rules: [
                                {
                                    type: "string",
                                    message: "当前字段数据类型-string",
                                    validator: null
                                },
                                {
                                    required: isRequired,
                                    message: "此字段为必输项！"
                                }
                            ]
                        })(
                            isedit ? (
                                <Select placeholder={`请选择${lable}`}>
                                    {this.createOption(item.options)}
                                </Select>
                            ) : (
                                <SelectShow options={item.options} />
                            )
                        )}
                    </FormItem>
                );
            case "checkbox":
                return (
                    <FormItem>
                        {getFieldDecorator(code, {
                            initialValue: false
                        })(<Checkbox disabled={!isedit}>{lable}</Checkbox>)}
                    </FormItem>
                );
            case "chooseImage":
                return isEdit ? (
                    <FormItem label={lable}>
                        {getFieldDecorator(code, {
                            initialValue: nodeData[code],
                            rules: [
                                {
                                    required: required,
                                    message: "请选择一张图片！"
                                }
                            ]
                        })(
                            <ChooseImageForForm
                                data={item.options}
                                title={"图标选择"}
                            />
                        )}
                    </FormItem>
                ) : (
                    <ChooseImageForForm
                        data={item.options}
                        title={"已选"}
                    />
                );
            default:
                break;
        }
    };
    /**
     * 创建表单项
     */
    createFormItem = () => {
        let children = this.props.formData.map((item) => {
            let {xs = 24, md = 24, lg = 24, code, hidden=false} = item;
            if(hidden === true){
                return null;
            }
            return (
                <Col xs={xs} md={md} lg={lg} key={code}>
                    {this.createComponent(item)}
                </Col>
            );
        });
        return children;
    };
    /**
     * 创建 下拉内容
     * @param {Array} options 下拉项数组
     */
    createOption = options => {
        return options.map((item, index) => {
            return (
                <Option key={item.value} value={item.value}>
                    {item.text}
                </Option>
            );
        });
    };
    render() {
        return (
            <Form layout="inline">
                <Row>{this.createFormItem()}</Row>
            </Form>
        );
    }
}
// export default FormControl(FormCreate);
const FormCom = FormControl(FormContent);
export class FormCreate extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {onChange, formData, fields} = this.props;
        return <FormCom onChange={onChange} formData={formData} {...fields} />;
    }
}
/**
 * 数据转换
 * @param {*} object
 */
export const dataTransfer = (object, defaultObj) => {
    if (JSON.stringify(object) == "{}") {
        console.error("dataTransfer 函数参数不能为空对象");
        return;
    }
    let obj = {};
    if (defaultObj) {
        for (const key in defaultObj) {
            if (object.hasOwnProperty(key)) {
                const element = object[key];
                obj[key] = {};
                obj[key]["value"] = element;
            }
        }
    } else {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const element = object[key];
                obj[key] = {};
                obj[key]["value"] = element;
            }
        }
    }
    return obj;
};
/**
 * 数据还原
 */
export const dataRestore = object => {
    if (JSON.stringify(object) == "{}") {
        console.error("dataTransfer 函数参数不能为空对象");
        return;
    }
    let obj = {};
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const element = object[key];
            obj[key] = element.value;
        }
    }
    return obj;
};
/**
 * 数据检查
 */
export const dataCheck = object => {
    if (JSON.stringify(object) == "{}") {
        console.error("dataTransfer 函数参数不能为空对象");
        return;
    }
    let objArray = [];
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const element = object[key];
            if (element.errors) {
                objArray.push(element);
            }
        }
    }
    if (objArray.length > 0) {
        return true;
    } else {
        return false;
    }
};
