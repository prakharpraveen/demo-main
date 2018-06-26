import React, { Component } from "react";
import { Form, Modal, Button } from "antd";
import { PageLayout, PageLayoutHeader } from "Components/PageLayout";
import InfoForm from "./InfoForm";
import PasswordEdit from "./PasswordEdit";
import PhoneEdit from "./PhoneEdit";
import EmailEdit from "./EmailEdit";
import "./index.less";
class SwitchInfo extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    switch (this.props.infoType) {
      // 密码修改
      case "0":
        return (
          <PasswordEdit
            layout={formItemLayout}
            fieldDecorator={this.props.fieldDecorator}
          />
        );
      // 手机修改
      case "1":
        return (
          <PhoneEdit
            layout={formItemLayout}
            fieldDecorator={this.props.fieldDecorator}
          />
        );
      // 邮箱修改
      case "2":
        return (
          <EmailEdit
            layout={formItemLayout}
            fieldDecorator={this.props.fieldDecorator}
          />
        );
      default:
        return "";
    }
  }
}
class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editData: {},
      infoType: "",
      modalTitle: "",
      visible: false
    };
  }
  /**
   * 弹框标题选择
   */
  switchTitle = key => {
    switch (key) {
      case "0":
        return "密码修改";
      case "1":
        return "手机修改";
      case "2":
        return "电子邮箱修改";
      default:
        break;
    }
  };
  showModal = infoType => {
    let modalTitle = this.switchTitle(infoType);
    this.setState({
      visible: true,
      infoType,
      modalTitle
    });
  };
  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };
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
    return (
      <PageLayout header={<PageLayoutHeader>账户设置</PageLayoutHeader>}>
        <div className="workbench-userinfo">
          <InfoForm infoSetting={this.showModal} />
          <Modal
            title={this.state.modalTitle}
            mask={false}
            wrapClassName="vertical-center-modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText={"确认"}
            cancelText={"取消"}
          >
            <SwitchInfo
              infoType={this.state.infoType}
              fieldDecorator={getFieldDecorator}
            />
          </Modal>
        </div>
      </PageLayout>
    );
  }
}
const WrappedUserInfo = Form.create()(UserInfo);
export default WrappedUserInfo;
