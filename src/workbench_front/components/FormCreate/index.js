import React, {Component} from "react";
import {Form, Row, Col, Input} from "antd";
import {FormControl} from "./FormControl";
import {high} from "nc-lightapp-front";
import "nc-lightapp-front/dist/platform/nc-lightapp-front/index.css";
import name from "./index.less";
const {Refer} = high;
const FormItem = Form.Item;
class ShowCom extends Component {
    constructor(props) {
        super(props);
    }
    render() {
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
class FormCreate extends Component {
    constructor(props) {
        super(props);
    }
    createComponent = item => {
        const {getFieldDecorator} = this.props.form;
        switch (item.type) {
            case "input":
                return (
                    <Col xs={24} md={24} lg={24} key={item.code}>
                        <FormItem
                            className="form-item margin-bottom-20"
                            label={item.label}>
                            {getFieldDecorator(item.code, {
                                initialValue: "",
                                rules: [
                                    {
                                        type: "string",
                                        message:
                                            "The input is not valid E-mail!"
                                    },
                                    {
                                        required: item.isRequired,
                                        message: "Please input your E-mail!"
                                    }
                                ]
                            })(this.props.isedit ? <Input /> : <ShowCom />)}
                        </FormItem>
                    </Col>
                );
                break;
            default:
                return (
                    <Col xs={24} md={24} lg={24} key={item.refCode}>
                        <FormItem
                            className="form-item margin-bottom-20"
                            label={item.refName}>
                            {getFieldDecorator(item.refCode, {
                                initialValue: {},
                                rules: [
                                    {
                                        required: false,
                                        message: ""
                                    },
                                    {
                                        type: "object",
                                        validator: null
                                    }
                                ]
                            })(
                                this.props.isedit ? (
                                    <Refer {...item} />
                                ) : (
                                    <ShowCom />
                                )
                            )}
                        </FormItem>
                    </Col>
                );
                break;
        }
    };
    /**
     * 创建表单项
     */
    createFormItem() {
        let children = this.props.formData.map((item, index) => {
            return this.createComponent(item);
        });
        return children;
    }
    render() {
        return (
            <Form layout="inline">
                <Row>{this.createFormItem()}</Row>
            </Form>
        );
    }
}
export default FormControl(FormCreate);
