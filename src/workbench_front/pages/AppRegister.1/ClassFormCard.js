import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Form} from "antd";
import {FormCreate} from "Components/FormCreate";
import {setNodeData} from "Store/AppRegister/action";
class ClassFromCard extends Component {
    constructor(props, context) {
        super(props, context);
    }
    /**
     * 表单任一字段值改变操作
     * @param {String|Object} changedFields 改变的字段及值
     */
    handleFormChange = changedFields => {
        this.props.setNodeData({...this.props.nodeData, ...changedFields});
    };
    render() {
        let classFormData = [
            {
                label: "应用编码",
                type: "string",
                code: "code",
                isRequired: true,
                check: (rule, value, callback) => {
                    if (value === this.props.parentData) {
                        callback("不能与父节点编码重复");
                    } else {
                        callback();
                    }
                },
                isedit: this.props.isedit
            },
            {
                label: "应用名称",
                type: "string",
                code: "name",
                isRequired: true,
                isedit: this.props.isedit
            },
            {
                label: "多语字段",
                type: "string",
                code: "resid",
                isRequired: false,
                isedit: this.props.isedit
            },
            {
                label: "应用描述",
                type: "string",
                code: "app_desc",
                isRequired: false,
                isedit: this.props.isedit
            },
            {
                label: "帮助文件名",
                type: "string",
                code: "help_name",
                isRequired: false,
                isedit: this.props.isedit
            }
        ];
        return (
            <FormCreate
                formData={classFormData}
                fields={this.props.nodeData}
                onChange={this.handleFormChange}
            />
        );
    }
}
ClassFromCard = Form.create()(ClassFromCard);
ClassFromCard.propTypes = {
    nodeData: PropTypes.object.isRequired,
};
export default connect(
    state => {
        let {
            nodeData,
        } = state.AppRegisterData;
        return {nodeData};
    },
    {setNodeData}
)(ClassFromCard);
