import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MenuTree from "./MenuTree";
import { setCopyNodeData } from "Store/AppManagement/action";
import { FormCreate, dataRestore } from "Components/FormCreate";
import "./index.less";
class AppCopy extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  /**
   * 表单任一字段值改变操作
   * @param {String|Object} changedFields 改变的字段及值
   */
  handleFormChange = changedFields => {
    this.props.setCopyNodeData({ ...this.props.copyNodeData, ...changedFields });
  };
  render() {
    let appCopyFormData = [
      {
        label: "新菜单编码",
        type: "string",
        code: "newMenuItemCode",
        isRequired: true,
        isedit: true,
        lg: 12
      },
      {
        label: "新菜单名称",
        type: "string",
        code: "newMenuItemName",
        isRequired: true,
        isedit: true,
        lg: 12
      },
      {
        label: "应用编码",
        type: "string",
        code: "oldAppCode",
        isRequired: true,
        isedit: false,
        lg: 12
      },
      {
        label: "新应用名称",
        type: "string",
        code: "newAppName",
        isRequired: true,
        isedit: true,
        lg: 12
      }
    ];
    return (
      <div className="copyapp-content">
        <div className="copyapp-menutree">
          <MenuTree />
        </div>
        <div className="copyapp-form">
          <FormCreate
            formData={appCopyFormData}
            fields={this.props.copyNodeData}
            onChange={this.handleFormChange}
          />
        </div>
      </div>
    );
  }
}
AppCopy.propTypes = {
  copyNodeData: PropTypes.object.isRequired,
  setCopyNodeData: PropTypes.func.isRequired
};
export default connect(
  state => ({
    copyNodeData: state.AppManagementData.copyNodeData
  }),
  { setCopyNodeData }
)(AppCopy);
