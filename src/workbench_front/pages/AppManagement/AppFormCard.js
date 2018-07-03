import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Form} from "antd";
import {setNodeData} from "Store/AppManagement/action";
import {FormCreate, dataRestore} from "Components/FormCreate";
import AppTable from "./AppTable";
import Ajax from "Pub/js/ajax";
const IMGS = [
    {
        name: "img1",
        value: "toupiao",
        src: "toupiao"
    },
    {
        name: "img2",
        value: "wenku",
        src: "wenku"
    },
    {
        name: "img3",
        value: "rizhi",
        src: "rizhi"
    },
    {
        name: "img4",
        value: "xinzifafang",
        src: "xinzifafang"
    },
    {
        name: "img5",
        value: "gonggao",
        src: "gonggao"
    },
    {
        name: "img6",
        value: "huati",
        src: "huati"
    },
    {
        name: "img7",
        value: "zuzhiguanli",
        src: "zuzhiguanli"
    },
    {
        name: "img8",
        value: "jiaqin",
        src: "jiaqin"
    }
];
class AppFromCard extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            orgtypecode: [],
            target_path: []
        };
    }
    /**
     * 获取组织类型 下拉数据
     * @param {String} code
     */
    getOptionsData = (code, nodeData) => {
        let url, data, info;
        if (
            this.state.target_path.length > 0 &&
            this.state.orgtypecode.length > 0
        ) {
            return;
        }
        if (JSON.stringify(nodeData) === "{}") {
            return;
        }
        nodeData = dataRestore(nodeData);
        if (code === "target_path") {
            url = `/nccloud/platform/appregister/querypagesel.do`;
            data = {pk_appregister: nodeData.pk_appregister};
            info = {
                name: "默认页面",
                action: "查询"
            };
        } else {
            url = `/nccloud/platform/appregister/queryorgtype.do`;
            info = {
                name: "组织类型",
                action: "查询"
            };
        }
        Ajax({
            url: url,
            data: data,
            info: info,
            success: ({data: {success, data}}) => {
                if (success && data) {
                    if (code === "target_path") {
                        this.setState({target_path: data});
                    } else {
                        let options = data.rows;
                        options = options.map((option, i) => {
                            return {
                                value: option.refpk,
                                text: option.refname
                            };
                        });
                        this.setState({orgtypecode: options});
                    }
                }
            }
        });
    };
    /**
     * 表单任一字段值改变操作
     * @param {String|Object} changedFields 改变的字段及值
     */
    handleFormChange = changedFields => {
        this.props.setNodeData({...this.props.nodeData, ...changedFields});
    };
    componentWillReceiveProps(nextProps) {
        this.getOptionsData("orgtypecode", nextProps.nodeData);
        this.getOptionsData("target_path", nextProps.nodeData);
    }
    componentDidMount() {
        this.getOptionsData("orgtypecode", this.props.nodeData);
        this.getOptionsData("target_path", this.props.nodeData);
    }

    render() {
        let isEdit = this.props.isEdit;
        let resNodeData = dataRestore(this.props.nodeData);
        let apptype = "1";
        if(resNodeData){
            apptype = resNodeData.apptype;
        }
        let appFormData = [
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
                isedit: isEdit,
                lg: 8
            },
            {
                label: "应用名称",
                type: "string",
                code: "name",
                isRequired: true,
                isedit: isEdit,
                lg: 8
            },
            {
                label: "组织类型",
                type: "select",
                code: "orgtypecode",
                isRequired: true,
                options: this.state.orgtypecode,
                isedit: isEdit,
                lg: 8
            },
            {
                label: "功能性质",
                type: "select",
                code: "fun_property",
                isRequired: true,
                options:  [
                    {
                        value: "0",
                        text: "可执行功能"
                    },
                    {
                        value: "1",
                        text: "附属功能"
                    },
                ],
                isedit: isEdit,
                lg: 8
            },
            {
                label: "功能点类型",
                type: "select",
                code: "funtype",
                isRequired: true,
                options: [
                    {
                        value: "0",
                        text: "业务类应用"
                    },
                    {
                        value: "1",
                        text: "管理类应用"
                    },
                    {
                        value: "2",
                        text: "系统类应用"
                    },
                    {
                        value: "3",
                        text: "管理+业务类应用"
                    }
                ],
                isedit: isEdit,
                lg: 8
            },
            {
                label: "应用类型",
                type: "select",
                code: "apptype",
                isRequired: true,
                options: [
                    {
                        value: "1",
                        text: "小应用"
                    },
                    {
                        value: "2",
                        text: "小部件"
                    }
                ],
                isedit: isEdit,
                lg: 8
            },
            {
                label: "挂载ID",
                type: "string",
                code: "mountid",
                isRequired: apptype === "2",
                hidden: apptype === "1",
                isedit: isEdit,
                lg: 8
            },
            {
                label: "应用宽",
                type: "string",
                code: "width",
                isRequired: true,
                isedit: isEdit,
                lg: 8
            },
            {
                label: "应用高",
                type: "string",
                code: "height",
                isRequired: true,
                isedit: isEdit,
                lg: 8
            },
            {
                label: "关联元数据ID",
                type: "refer",
                code: "mdidRef",
                isRequired: false,
                options: {
                    queryTreeUrl:'/nccloud/riart/ref/mdClassDefaultEntityRefTreeAction.do',
                    refType:"tree",
                    isTreelazyLoad:false,
                    placeholder: "关联元数据ID",
                },
                isedit: isEdit,
                lg: 8
            },
            {
                label: "是否启用",
                type: "checkbox",
                code: "isenable",
                isRequired: false,
                isedit: isEdit,
                lg: 8
            },
            {
                label: "是否加载占用",
                type: "checkbox",
                code: "uselicense_load",
                isRequired: false,
                isedit: isEdit,
                lg: 8
            },
            {
                label: "是否CA用户可用",
                type: "checkbox",
                code: "iscauserusable",
                isRequired: false,
                isedit: isEdit,
                lg: 8
            },
            {
                label: "是否复制页面",
                type: "checkbox",
                code: "iscopypage",
                isRequired: false,
                isedit: isEdit,
                lg: 8
            },
            {
                label: apptype === "1"?"默认页面":"小部件路径",
                type: apptype === "1"?"select":"string",
                code: "target_path",
                isRequired: apptype === "2",
                options: this.state.target_path,
                isedit: isEdit,
                lg: 8
            },
            {
                label: "所属集团",
                type: "string",
                code: "pk_group",
                isRequired: false,
                isedit: isEdit,
                lg: 8
            },
            {
                label: "多语字段",
                type: "string",
                code: "resid",
                isRequired: false,
                isedit: isEdit,
                lg: 8
            },
            {
                label: "帮助文件名",
                type: "string",
                code: "help_name",
                isRequired: false,
                isedit: isEdit,
                lg: 8
            },
            {
                label: "应用描述",
                type: "string",
                code: "app_desc",
                isRequired: false,
                md: 24,
                lg: 16,
                xl: 24,
                isedit: isEdit
            },
            {
                label: "图标路径",
                type: "chooseImage",
                code: "image_src",
                isRequired: apptype === "1",
                options: IMGS,
                hidden: apptype === "2",
                md: 24,
                lg: 24,
                xl: 24,
                isedit: isEdit
            }
        ];
        return (
            <div>
                <FormCreate
                    formData={appFormData}
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
                    <AppTable />
                </div>
            </div>
        );
    }
}
AppFromCard = Form.create()(AppFromCard);
AppFromCard.propTypes = {
    isEdit: PropTypes.bool.isRequired,
    nodeData: PropTypes.object.isRequired,
    setNodeData: PropTypes.func.isRequired
};
export default connect(
    state => ({
        nodeData: state.AppManagementData.nodeData,
        isEdit: state.AppManagementData.isEdit,
    }),
    {setNodeData}
)(AppFromCard);
