import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Form} from "antd";
import {FormCreate} from "Components/FormCreate";
import {setNodeData} from "Store/AppRegister1/action";
import PageTable from "./PageTable";
class PageFormCard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    /**
     * 表单任一字段值改变操作
     * @param {String|Object} changedFields 改变的字段及值
     */
    handleFormChange = changedFields => {
        this.props.setNodeData({...this.props.nodeData, ...changedFields});
    };
    render() {
        let isEdit = this.props.isEdit;
        let pageFormData = [
            {
                label: "页面编码",
                type: "string",
                code: "pagecode",
                isRequired: true,
                check: (rule, value, callback) => {
                    if (value === this.props.parentData) {
                        callback("不能与父节点编码重复");
                    } else {
                        callback();
                    }
                },
                isedit: isEdit
            },
            {
                label: "页面名称",
                type: "string",
                code: "pagename",
                isRequired: true,
                isedit: isEdit
            },
            {
                label: "多语字段",
                type: "string",
                code: "resid",
                isRequired: false,
                isedit: isEdit
            },
            {
                label: "设为默认页面",
                type: "checkbox",
                code: "isdefault",
                isRequired: true,
                isedit: isEdit
            },
            {
                label: "页面描述",
                type: "string",
                code: "pagedesc",
                isRequired: false,
                isedit: isEdit,
                md: 24,
                lg: 16,
                xl: 16
            },
            {
                label: "页面地址",
                type: "string",
                code: "pageurl",
                isRequired: true,
                isedit: isEdit,
                md: 24,
                lg: 24,
                xl: 24
            }
        ];
        return (
            <div>
                <FormCreate
                    formData={pageFormData}
                    fields={this.props.nodeData}
                    onChange={this.handleFormChange}
                />
                <div
                    style={{
                        marginTop: "16px",
                        background: "#ffffff",
                        padding: "10px",
                        borderRadius: "6px"
                    }}>
                    <PageTable />
                </div>
            </div>
        );
    }
}
PageFormCard = Form.create()(PageFormCard);
PageFormCard.propTypes = {
    isEdit: PropTypes.bool.isRequired,
    nodeData: PropTypes.object.isRequired,
    setNodeData: PropTypes.func.isRequired
};
export default connect(
    state => ({
        nodeData: state.AppRegisterData1.nodeData,
        isEdit: state.AppRegisterData1.isEdit,
    }),
    {setNodeData}
)(PageFormCard);
