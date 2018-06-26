import React, { Component } from "react";
import { Form, Input, Select } from "antd";
import { PageLayout, PageLayoutHeader } from "Components/PageLayout";
import "./index.less";
const FormItem = Form.Item;
const Option = Select.Option;
class UserInfo extends Component {
  constructor(props) {
    super(props);
  }
  // 表单提交
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    const prefixSelector = getFieldDecorator("prefix", {
      initialValue: "86"
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );
    return (
      <PageLayout header={<PageLayoutHeader>个人信息</PageLayoutHeader>}>
        <div className="workbench-userinfo">
          <Form className="userinfo-container" onSubmit={this.handleSubmit}>
            <div className="userinfo-item userinfo-name">
              <span>用户名</span>
            </div>
            <FormItem
              className="userinfo-item"
              {...formItemLayout}
              label="密码"
            >
              {getFieldDecorator("email", {
                rules: [
                  {
                    type: "email",
                    message: "The input is not valid E-mail!"
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!"
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem
              className="userinfo-item"
              {...formItemLayout}
              label="手机号"
            >
              {getFieldDecorator("phone", {
                rules: [
                  { required: false, message: "Please input your phone number!" }
                ]
              })(
                <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
              )}
            </FormItem>
            <FormItem
              className="userinfo-item"
              {...formItemLayout}
              label="邮箱"
            >
              {getFieldDecorator("email", {
                rules: [
                  {
                    type: "email",
                    message: "The input is not valid E-mail!"
                  },
                  {
                    required: false,
                    message: "Please input your E-mail!"
                  }
                ]
              })(<Input />)}
            </FormItem>
          </Form>
        </div>
      </PageLayout>
    );
  }
}
const WrappedUserInfo = Form.create()(UserInfo);
export default WrappedUserInfo;
