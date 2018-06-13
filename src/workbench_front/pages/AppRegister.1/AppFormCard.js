import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Form} from "antd";
import {setNodeData} from "Store/AppRegister/action";
import {FormCreate,dataRestore} from "Components/FormCreate";
import Ajax from "Pub/js/ajax";
import AppTable from "./AppTable";
let timeout;
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
/**
 * 关联元数据 ID 数据查询
 * @param {*} value
 * @param {*} callback
 */
function fetch(value, callback) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    function fake() {
        Ajax({
            url: `/nccloud/platform/appregister/querymdid.do`,
            info: {
                name: "元数据ID",
                action: "查询"
            },
            data: {search_content: value},
            success: ({data: {success, data}}) => {
                if (success && data) {
                    callback(data.rows);
                }
            }
        });
    }
    timeout = setTimeout(fake, 300);
}
class AppFromCard extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            orgtypecode: [],
            mdid: [],
            target_path: []
        };
    }
    /**
     * 获取组织类型 下拉数据
     * @param {String} code
     */
    getOptionsData = code => {
		let url, data, info;
		let nodeData = dataRestore(this.props.nodeData);
        if (code === "target_path") {
            url = `/nccloud/platform/appregister/querypagesel.do`;
            data = {pk_appregister: nodeData.moduleid};
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
     * 关联元数据 ID
     * @param {String} value
     */
    handleSearch = searchValue => {
        this.props.form.setFieldsValue({
            mdid: searchValue
        });
        fetch(searchValue, options => {
            options = options.map((option, i) => {
                return {
                    value: option.refpk,
                    text: `${option.refname} ${option.refcode}`
                };
            });
            this.setState({mdid: options});
        });
    };

    /**
     * 表单任一字段值改变操作
     * @param {String|Object} changedFields 改变的字段及值
     */
    handleFormChange = changedFields => {
        this.props.setNodeData({...this.props.nodeData, ...changedFields});
    };
    componentDidMount() {
        this.getOptionsData("orgtypecode");
        this.getOptionsData("target_path");
    }

    render() {
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
                label: "组织类型",
                type: "select",
                code: "orgtypecode",
                isRequired: true,
                options: this.state.orgtypecode,
                isedit: this.props.isedit
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
                isedit: this.props.isedit
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
                isedit: this.props.isedit
            },
            {
                label: "应用宽",
                type: "string",
                code: "width",
                isRequired: true,
                isedit: this.props.isedit
            },
            {
                label: "应用高",
                type: "string",
                code: "height",
                isRequired: true,
                isedit: this.props.isedit
            },
            {
                label: "关联元数据ID",
                type: "search",
                code: "mdid",
                isRequired: false,
                placeholder: "请输入元数据名称过滤",
                search: this.handleSearch,
                options: this.state.mdid,
                isedit: this.props.isedit
            },
            {
                label: "所属集团",
                type: "string",
                code: "pk_group",
                isRequired: false,
                isedit: this.props.isedit
            },
            {
                label: "是否启用",
                type: "checkbox",
                code: "isenable",
                isRequired: false,
                isedit: this.props.isedit
            },
            {
                label: "是否加载占用",
                type: "checkbox",
                code: "uselicense_load",
                isRequired: false,
                isedit: this.props.isedit
            },
            {
                label: "是否CA用户可用",
                type: "checkbox",
                code: "iscauserusable",
                isRequired: false,
                isedit: this.props.isedit
            },
            {
                label: "默认页面",
                type: "select",
                code: "target_path",
                isRequired: false,
                options: this.state.target_path,
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
                label: "帮助文件名",
                type: "string",
                code: "help_name",
                isRequired: false,
                isedit: this.props.isedit
            },
            {
                label: "应用描述",
                type: "string",
                code: "app_desc",
                isRequired: false,
                md: 24,
                lg: 24,
                xl: 24,
                isedit: this.props.isedit
            },
            {
                label: "图标路径",
                type: "chooseImage",
                code: "image_src",
                isRequired: true,
                options: IMGS,
                md: 24,
                lg: 24,
                xl: 24,
                isedit: this.props.isedit
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
	nodeData: PropTypes.object.isRequired,
	setNodeData: PropTypes.func.isRequired,
};
export default connect(
    state => {
        let {nodeData} = state.AppRegisterData;
        return {nodeData};
    },
    {setNodeData}
)(AppFromCard);
