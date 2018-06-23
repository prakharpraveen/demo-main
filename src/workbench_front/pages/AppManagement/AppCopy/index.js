import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MenuTree from "./MenuTree";
import { FormCreate, dataRestore } from "Components/FormCreate";
import './index.less';
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
    this.props.setNodeData({ ...this.props.copyNodeData, ...changedFields });
  };
  render() {
    let appCopyFormData = [
      {
        label: "菜单编码",
        type: "string",
        code: "name",
        isRequired: true,
        isedit: true,
        lg: 12
      },
      {
        label: "应用名称",
        type: "string",
        code: "width",
        isRequired: true,
        isedit: true,
        lg: 12
      },
      {
        label: "对应应用编码",
        type: "string",
        code: "height",
        isRequired: true,
        isedit: true,
        lg: 12
      },
      {
        label: "对应应用名称",
        type: "string",
        code: "mdidRef",
        isRequired: true,
        isedit: true,
        lg: 12
      }
    ];
    return (
      <div className='copyapp-content'>
        <div className='copyapp-menutree'>
          <MenuTree />
        </div>
        <div className='copyapp-form'>
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
  copyNodeData: PropTypes.object.isRequired
};
export default connect(
  state => ({
    copyNodeData: state.AppManagementData.copyNodeData
  }),
  {}
)(AppCopy);
