import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setPageCopyData } from "Store/AppManagement/action";
import { FormCreate, dataRestore } from "Components/FormCreate";
import Ajax from "Pub/js/ajax";
import "./index.less";
class PageCopy extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  /**
   * 表单任一字段值改变操作
   * @param {String|Object} changedFields 改变的字段及值
   */
  handleFormChange = changedFields => {
    this.props.setCopyNodeData({
      ...this.props.pageCopyData,
      ...changedFields
    });
  };
  componentDidMount() {
    Ajax({
        url:``,
        info:{
            name:"",
            action:""
        },
        data:{

        },
        success:({data:{data}})=>{
            if(data){

            }
        }
    });
  }
  
  render() {
    let pageCopyFormData = [
      {
        label: "新页面名称",
        type: "string",
        code: "newPageName",
        isRequired: true,
        isedit: true,
        lg: 12
      },
      {
        label: "新页面编码",
        type: "select",
        code: "newPageCode",
        isRequired: true,
        isedit: true,
        lg: 12
      },
      {
        label: "页面编码",
        type: "string",
        code: "oldPageCode",
        isRequired: false,
        isedit: false,
        lg: 12
      },
      {
        label: "应用编码",
        type: "string",
        code: "appCode",
        isRequired: false,
        isedit: false,
        lg: 12
      },
      {
        label: "应用主键",
        type: "string",
        code: "appId",
        isRequired: false,
        isedit: false,
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