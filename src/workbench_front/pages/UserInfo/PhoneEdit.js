import React, { Component } from "react";
import { Form, Input, Select } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
class PhoneEdit extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { layout, fieldDecorator: getFieldDecorator } = this.props;
    const prefixSelector = getFieldDecorator("prefix", {
      initialValue: "86"
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );
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
        <FormItem className="userinfo-item" {...layout} label="手机号">
          {getFieldDecorator("phone", {
            rules: [
              {
                required: false,
                message: "Please input your phone number!"
              }
            ]
          })(<Input addonBefore={prefixSelector} style={{ width: "100%" }} />)}
        </FormItem>
      </Form>
    );
  }
}
export default PhoneEdit;
