import React, { Component } from "react";
import { Form, Input } from "antd";
const FormItem = Form.Item;
class PasswordEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false
    };
  }
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };
  render() {
    let { layout, fieldDecorator: getFieldDecorator } = this.props;
    return (
      <Form>
        <FormItem className="userinfo-item" {...layout} label="旧密码">
          {getFieldDecorator("pw", {
            rules: [
              {
                required: true,
                message: "请输入原始密码！"
              }
            ]
          })(<Input type="password" />)}
        </FormItem>
        <FormItem className="userinfo-item" {...layout} label="新密码">
          {getFieldDecorator("newpw", {
            rules: [
              {
                required: true,
                message: "请输入新密码！"
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(<Input type="password" />)}
        </FormItem>
        <FormItem className="userinfo-item" {...layout} label="确认密码">
          {getFieldDecorator("confirmpw", {
            rules: [
              {
                required: true,
                message: "请再次确认新密码！"
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
        </FormItem>
      </Form>
    );
  }
}
export default PasswordEdit;
