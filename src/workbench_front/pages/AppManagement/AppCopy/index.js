import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MenuTree from "./MenuTree";
import { FormContent, dataDefaults } from "Components/FormCreate";
import "./index.less";
class AppCopy extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        let {
            newMenuItemCode,
            newMenuItemName,
            oldAppCode,
            newAppName,
            isCopyUserTemplet
        } = this.props.copyNodeData;
        let appCopyFormData = [
            {
                label: "新菜单编码",
                type: "string",
                code: "newMenuItemCode",
                isRequired: true,
                isedit: true,
                initialValue: newMenuItemCode,
                lg: 12
            },
            {
                label: "新菜单名称",
                type: "string",
                code: "newMenuItemName",
                isRequired: true,
                isedit: true,
                initialValue: newMenuItemName,
                lg: 12
            },
            {
                label: "应用编码",
                type: "string",
                code: "oldAppCode",
                isRequired: true,
                isedit: false,
                initialValue: oldAppCode,
                lg: 12
            },
            {
                label: "新应用名称",
                type: "string",
                code: "newAppName",
                isRequired: true,
                isedit: true,
                initialValue: newAppName,
                lg: 12
            },
            {
                label: "复制用户自定义模板",
                type: "checkbox",
                code: "isCopyUserTemplet",
                isRequired: true,
                isedit: true,
                initialValue: isCopyUserTemplet,
                lg: 12
            }
        ];
        return (
            <div className="copyapp-content">
                <div className="copyapp-menutree">
                    <MenuTree form={this.props.form} />
                </div>
                <div className="copyapp-form">
                    <FormContent
                        form={this.props.form}
                        formData={appCopyFormData}
                        datasources={dataDefaults(
                            this.props.copyNodeData,
                            appCopyFormData,
                            "code"
                        )}
                    />
                </div>
            </div>
        );
    }
}
AppCopy.propTypes = {
    copyNodeData: PropTypes.object.isRequired
};
export default connect(
    state => ({
        copyNodeData: state.AppManagementData.copyNodeData
    }),
    {}
)(AppCopy);
