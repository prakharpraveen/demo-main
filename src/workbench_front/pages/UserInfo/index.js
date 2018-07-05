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
                        formObj={this.props.formObj}
                    />
                );
            // 手机修改
            case "1":
                return (
                    <PhoneEdit
                        layout={formItemLayout}
                        formObj={this.props.formObj}
                    />
                );
            // 邮箱修改
            case "2":
                return (
                    <EmailEdit
                        layout={formItemLayout}
                        formObj={this.props.formObj}
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
        let allValue = this.props.form.getFieldsValue();
        console.log(allValue);
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
                        <div className="userinfo-modal-content">
                            <SwitchInfo
                                infoType={this.state.infoType}
                                formObj={this.props.form}
                            />
                        </div>
                    </Modal>
                </div>
            </PageLayout>
        );
    }
}
const WrappedUserInfo = Form.create()(UserInfo);
export default WrappedUserInfo;
