import React, { Component } from "react";
import { Form, Input } from "antd";
const FormItem = Form.Item;
class EmailEdit extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { layout, fieldDecorator: getFieldDecorator } = this.props;
    return (
      <Form>
        <FormItem className="userinfo-item" {...layout} label="密码">
          {getFieldDecorator("pw", {
            rules: [
              {
                required: true,
                message: "请输入密码！"
              }
            ]
          })(<Input type="password" />)}
        </FormItem>
        <FormItem {...layout} label="E-mail">
          {getFieldDecorator("email", {
            rules: [
              {
                type: "email",
                message: "输入不是有效的电子邮箱！"
              },
              {
                required: true,
                message: "请输入电子邮箱!"
              }
            ]
          })(<Input />)}
        </FormItem>
      </Form>
    );
  }
}
export default EmailEdit;
