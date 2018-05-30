import React, { Component } from "react";
import { Form, Input } from "antd";
import { FormContent } from "./FormContent";
const FormItem = Form.Item;
class FormItem1 extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
                <FormItem label="Username">
                    {getFieldDecorator("username", {
                        rules: [
                            { required: true, message: "Username is required!" }
                        ]
                    })(<Input />)}
                </FormItem>
                <FormItem label="Username1">
                    {getFieldDecorator("username1", {
                        rules: [
                            { required: true, message: "Username is required!" }
                        ]
                    })(<Input />)}
                </FormItem>
                <FormItem label="Username2">
                    {getFieldDecorator("username2", {
                        rules: [
                            { required: true, message: "Username is required!" }
                        ]
                    })(<Input />)}
                </FormItem>
            </Form>
        );
    }
}
export default FormContent(FormItem1);
