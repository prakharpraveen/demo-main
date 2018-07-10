import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setPageCopyData } from "Store/AppManagement/action";
import { FormCreate } from "Components/FormCreate";
import "./index.less";
class PageCopy extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  /**
   * 表单任一字段值改变操作
   * @param {String|Object} changedFields 改变的字段及值
   */
  handleFormChange = changedFields => {
    this.props.setPageCopyData({
      ...this.props.pageCopyData,
      ...changedFields
    });
  };
  render() {
    let pageCopyFormData = [
      {
        label: "新页面名称",
        type: "string",
        code: "newPageName",
        isRequired: true,
        isedit: true,
        lg: 24
      },
      {
        label: "新页面编码",
        type: "select",
        code: "newPageCode",
        isRequired: true,
        isedit: true,
        options: this.props.newPageOtions,
        lg: 24
      },
    ];
    return (
      <div className="copypage-content">
        <div className="copypage-form">
          <FormCreate
            formData={pageCopyFormData}
            fields={this.props.pageCopyData}
            onChange={this.handleFormChange}
          />
        </div>
      </div>
    );
  }
}
PageCopy.propTypes = {
  pageCopyData: PropTypes.object.isRequired,
  setPageCopyData: PropTypes.func.isRequired
};
export default connect(
  state => ({
    pageCopyData: state.AppManagementData.pageCopyData
  }),
  { setPageCopyData }
)(PageCopy);
