import React, {Component} from "react";
import {Form, Row, Col, Input} from "antd";
import {FormControl} from "./FormControl";
import {high} from "nc-lightapp-front";
import "nc-lightapp-front/dist/platform/nc-lightapp-front/index.css";
import "./index.less";
const {Refer} = high;
const FormItem = Form.Item;
/**
 * 输入框类浏览态组件
 */
class ShowCom extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        // console.log(this.props);

        return (
            <div>
                {typeof this.props.value === "object"
                    ? this.props.value.refname
                        ? this.props.value.refname
                        : ""
                    : this.props.value}
            </div>
        );
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
    isedit: isedit - 是否可编辑
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
            isedit = false
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
                                }
                            ]
                        })(isedit ? <Input /> : <ShowCom />)}
                    </FormItem>
                );
                break;
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
                        })(isedit ? <Refer {...item.options} /> : <ShowCom />)}
                    </FormItem>
                );
                break;
            default:
                break;
        }
    };
    /**
     * 创建表单项
     */
    createFormItem = () => {
        let children = this.props.formData.map((item, index) => {
            let {xs = 24, md = 24, lg = 24, code} = item;
            return (
                <Col xs={xs} md={md} lg={lg} key={code}>
                    {this.createComponent(item)}
                </Col>
            );
        });
        return children;
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
