import React, { Component } from "react";
import { Form, Modal, Button } from "antd";
import { PageLayout, PageLayoutHeader } from "Components/PageLayout";
import Notice from "Components/Notice";
import Ajax from "Pub/js/ajax";
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
            visible: false,
            picture: "",
            phone: "",
            email: ""
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
    handleOk = type => {
        // 表单提交前进行校验
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let allValue = this.props.form.getFieldsValue();
                this.saveInfo(type, allValue);
            }
        });
    };
    /**
     * 用户信息保存
     * @param {String} key "0" - 密码修改 "1" - 手机修改 "2" - 电子邮件修改
     * @param {Object} data 需要保存的数据
     */
    saveInfo = (key, data) => {
        switch (key) {
            case "0":
                let { pw, newpw } = data;
                Ajax({
                    url: `/nccloud/platform/appregister/resetuserpwd.do`,
                    data: { oldPassword: pw, newPassword: newpw },
                    info: {
                        name: "账户设置",
                        action: "密码设置"
                    },
                    success: ({ data: { data } }) => {
                        Notice({ status: "success", msg: data.msg });
                        this.handleCancel();
                    }
                });
                break;
            case "1":
                return "手机修改";
            case "2":
                return "电子邮箱修改";
            default:
                break;
        }
    };
    handleCancel = () => {
        this.props.form.resetFields();
        this.setState({
            visible: false
        });
    };
    componentDidMount() {
        /**
         * 获取账户数据
         */
    }
    render() {
        let { picture, phone, email } = this.state;
        return (
            <PageLayout>
                <div className="workbench-userinfo">
                    <InfoForm
                        picture={picture}
                        phone={phone}
                        email={email}
                        infoSetting={this.showModal}
                    />
                    <Modal
                        closable={false}
                        title={this.state.modalTitle}
                        mask={false}
                        wrapClassName="vertical-center-modal"
                        visible={this.state.visible}
                        onOk={e => {
                            e.preventDefault();
                            this.handleOk(this.state.infoType);
                        }}
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
