import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FormContent, dataDefaults } from "Components/FormCreate";
import { setNodeData } from "Store/AppManagement/action";
import Ajax from "Pub/js/ajax";
class ModuleFromCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgtypecode: []
        };
    }
    /**
     * 获取组织类型 下拉数据
     *
     */
    getOrgTypeCodeOptionsData = () => {
        if (this.state.orgtypecode.length > 0) {
            return;
        }
        Ajax({
            url: `/nccloud/platform/appregister/queryorgtype.do`,
            info: {
                name: "组织类型",
                action: "查询"
            },
            success: ({ data }) => {
                if (data.success && data.data) {
                    let options = data.data.rows;
                    options = options.map((option, i) => {
                        return {
                            value: option.refpk,
                            text: option.refname
                        };
                    });
                    this.setState({ orgtypecode: options });
                }
            }
        });
    };
    /**
     * 表单任一字段值改变操作
     * @param {String|Object} changedFields 改变的字段及值
     */
    handleFormChange = changedFields => {
        this.props.setNodeData({ ...this.props.nodeData, ...changedFields });
    };
    componentDidMount() {
        this.getOrgTypeCodeOptionsData();
    }
    render() {
        let isEdit = this.props.isEdit;
        let {
            systypecode,
            moduleid,
            systypename,
            devmodule,
            appscope,
            orgtypecode,
            resid,
            supportcloseaccbook,
            isaccount
        } = this.props.nodeData;
        let moduleFormData = [
            {
                label: "模块编码",
                type: "string",
                code: "systypecode",
                isRequired: true,
                isedit: isEdit,
                initialValue: systypecode,
                lg: 8
            },
            {
                label: "模块号",
                type: "string",
                code: "moduleid",
                isRequired: true,
                isedit: isEdit,
                initialValue: moduleid,
                lg: 8
            },
            {
                label: "模块名称",
                type: "string",
                code: "systypename",
                isRequired: true,
                isedit: isEdit,
                initialValue: systypename,
                lg: 8
            },
            {
                label: "对应模块号",
                type: "string",
                code: "devmodule",
                isRequired: false,
                isedit: isEdit,
                initialValue: devmodule,
                lg: 8
            },
            {
                label: "应用范围",
                type: "select",
                code: "appscope",
                isRequired: false,
                initialValue: appscope,
                options: [
                    {
                        value: "0",
                        text: "全局"
                    },
                    {
                        value: "1",
                        text: "集团"
                    }
                ],
                isedit: isEdit,
                lg: 8
            },
            {
                label: "组织类型",
                type: "select",
                code: "orgtypecode",
                isRequired: false,
                options: this.state.orgtypecode,
                isedit: isEdit,
                initialValue: orgtypecode,
                lg: 8
            },
            {
                label: "多语字段",
                type: "string",
                code: "resid",
                isRequired: false,
                isedit: isEdit,
                initialValue: resid,
                lg: 8
            },
            {
                label: "是否支持开关帐设置",
                type: "checkbox",
                code: "supportcloseaccbook",
                isRequired: false,
                isedit: isEdit,
                initialValue: supportcloseaccbook,
                lg: 8
            },
            {
                label: "是否发送会计平台",
                type: "checkbox",
                code: "isaccount",
                isRequired: false,
                isedit: isEdit,
                initialValue: isaccount,
                lg: 8
            }
        ];
        return (
            <FormContent
                datasources={dataDefaults(
                    this.props.nodeData,
                    moduleFormData,
                    "code"
                )}
                form={this.props.form}
                formData={moduleFormData}
            />
        );
    }
}
ModuleFromCard.propTypes = {
    isEdit: PropTypes.bool.isRequired,
    nodeData: PropTypes.object.isRequired,
    setNodeData: PropTypes.func.isRequired
};
export default connect(
    state => ({
        nodeData: state.AppManagementData.nodeData,
        isEdit: state.AppManagementData.isEdit
    }),
    {
        setNodeData
    }
)(ModuleFromCard);
