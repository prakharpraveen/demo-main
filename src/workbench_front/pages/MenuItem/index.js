import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import _ from "lodash";
import {Button, Table, Switch, Icon, Popconfirm} from "antd";
import {
    PageLayout,
    PageLayoutHeader,
    PageLayoutLeft,
    PageLayoutRight
} from "Components/PageLayout";
import Ajax from "Pub/js/ajax.js";
import {GetQuery} from "Pub/js/utils.js";
import TreeSearch from "./TreeSearch";
import FormCreate from "Components/FormCreate";
import Notice from "Components/Notice";
import "./index.less";
import {WSAESTALE} from "constants";
class MenuItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            mt: "",
            mn: "",
            isedit: false,
            treeData: [],
            fields: {},
            menuFormData: [
                {
                    code: "menuitemcode",
                    type: "input",
                    label: "菜单项编码",
                    isRequired: true
                },
                {
                    code: "menuitemname",
                    type: "input",
                    label: "菜单项名称",
                    isRequired: true
                },
                {
                    placeholder: "应用编码",
                    refName: "关联应用编码",
                    refCode: "appcodeRef",
                    refType: "tree",
                    isTreelazyLoad: false,
                    queryTreeUrl: "/nccloud/platform/appregister/appregref.do",
                    onChange: val => {
                        console.log(val);
                        // this.setFieldsValue({ cont: val });
                    },
                    columnConfig: [
                        {
                            name: ["编码", "名称"],
                            code: ["refcode", "refname"]
                        }
                    ],
                    isMultiSelectedEnabled: false
                },
                {
                    code: "resid",
                    type: "input",
                    label: "多语字段",
                    isRequired: false
                }
            ]
        };
        this.btnList = [
            {
                name: "新增",
                code: "add",
                type: "primary",
                isshow: false
            },
            {
                name: "修改",
                code: "edit",
                type: "primary",
                isshow: false
            },
            {
                name: "删除",
                code: "del",
                type: "primary",
                isshow: false
            },
            {
                name: "保存",
                code: "save",
                type: "primary",
                isshow: false
            },
            {
                name: "取消",
                code: "cancle",
                type: "",
                isshow: false
            }
        ];
        this.historyData;
    }
    creatBtn = () => {
        if (this.state.mt) {
            return;
        }
        return this.btnList.map((item, index) => {
            if (this.state.isedit) {
                if (
                    item.code === "add" ||
                    item.code === "edit" ||
                    item.code === "del"
                ) {
                    item.isshow = false;
                } else {
                    item.isshow = true;
                }
            } else {
                if (
                    item.code === "add" ||
                    (this.state.fields.menuitemcode && item.code === "edit")
                ) {
                    item.isshow = true;
                } else {
                    item.isshow = false;
                }
                if (
                    item.code === "add" &&
                    this.state.fields.menuitemcode &&
                    this.state.fields.menuitemcode.length === 8
                ) {
                    item.isshow = false;
                }
                if (item.code === "del" && this.state.fields.menuitemcode) {
                    item.isshow = true;
                }
            }
            if (item.isshow) {
                return (
                    <Button
                        className="margin-left-10"
                        key={item.code}
                        type={item.type}
                        onClick={() => {
                            this.handleBtnClick(item.code);
                        }}>
                        {item.name}
                    </Button>
                );
            } else {
                return null;
            }
        });
    };
    handleBtnClick = key => {
        switch (key) {
            case "add":
                let fieldsChildren = this.state.fields.children;
                let newCode;
                if (fieldsChildren.length === 0) {
                    let fieldsItem = this.state.fields;
                    newCode = fieldsItem["menuitemcode"] + "01";
                } else {
                    newCode = `${fieldsChildren[fieldsChildren.length - 1][
                        "menuitemcode"
                    ] -
                        0 +
                        1}`;
                }
                this.setState({
                    isedit: true,
                    fields: {
                        menuitemcode: newCode,
                        menuitemname: "",
                        resid: "",
                        appcodeRef: {
                            refcode: "",
                            refname: "",
                            refpk: ""
                        }
                    }
                });
                break;
            case "edit":
                this.setState({isedit: true});
                break;
            case "save":
                let {
                    appcodeRef,
                    pk_menuitem,
                    menuitemcode,
                    menuitemname,
                    menudes,
                    pk_menu,
                    parentcode,
                    resid
                } = this.state.fields;
                console.log(this.state.fields);
                let resData = {
                    pk_menuitem,
                    menuitemcode,
                    menuitemname,
                    menudes,
                    pk_menu,
                    parentcode,
                    resid
                };
                if (this.state.fields.appcodeRef) {
                    resData.appcode = appcodeRef.refcode;
                }
                Ajax({
                    url: `/nccloud/platform/appregister/editappmenuitem.do`,
                    data: resData,
                    info: {
                        name: "菜单注册菜单项",
                        action: "修改"
                    },
                    success: res => {
                        let {success, data} = res.data;
                        if (success && data) {
                            this.setState({isedit: false, fields: {...data}});
                            Notice({
                                status: "success",
                                msg: data.true
                            });
                        } else {
                            Notice({
                                status: "error",
                                msg: data.false
                            });
                        }
                    }
                });
                this.setState({isedit: true});
                break;
            case "cancle":
                this.setState({isedit: false, fields: {...this.historyData}});
                break;
            case "del":
                if (this.state.fields.children) {
                    Notice({
                        status: "warning",
                        msg: "不是叶子节点不能删除！"
                    });
                    return;
                }
                Ajax({
                    url: `/nccloud/platform/appregister/deleteappmenuitem.do`,
                    data: {
                        pk_menuitem: this.state.fields.pk_menuitem
                    },
                    info: {
                        name: "菜单注册菜单项",
                        action: "删除"
                    },
                    success: res => {
                        let {success, data} = res.data;
                        if (success && data) {
                            let treeData = this.state.treeData;
                            _.remove(
                                treeData,
                                item =>
                                    item.pk_menuitem ===
                                    this.state.fields.pk_menuitem
                            );
                            this.setState({isedit: false, treeData});
                            Notice({
                                status: "success",
                                msg: data.true
                            });
                        } else {
                            Notice({
                                status: "error",
                                msg: data.false
                            });
                        }
                    }
                });
                this.setState({isedit: false, fields: {...this.historyData}});
                break;
            default:
                break;
        }
    };
    handleSearch = (value, callback) => {
        Ajax({
            url: `/nccloud/platform/appregister/searchappmenuitem.do`,
            data: {
                search_content: value,
                pk_menu: this.state.id
            },
            info: {
                name: "菜单项",
                action: "查询应用树"
            },
            success: res => {
                let {success, data} = res.data;
                if (success && data) {
                    this.setState(
                        {
                            treeData: data
                        },
                        () => {
                            callback(data);
                        }
                    );
                }
            }
        });
    };
    handleSelect = selectedKey => {
        let treeData = this.state.treeData;
        let treeItem = treeData.find(item => item.menuitemcode === selectedKey);
        this.historyData = {...treeItem};
        let menuFormData = this.state.menuFormData;
        menuFormData = menuFormData.map((item, index) => {
            if (
                treeItem.menuitemcode.length < 8 &&
                item.refCode === "appcodeRef"
            ) {
                item.disabled = true;
            } else {
                item.disabled = false;
            }
            return item;
        });
        console.log(menuFormData);

        this.setState({isedit: false, fields: {...treeItem}});
    };
    /**
     * 表单任一字段值改变操作
     * @param {String|Object} changedFields 改变的字段及值
     */
    handleFormChange = changedFields => {
        this.setState(({fields}) => ({
            fields: {...fields, ...changedFields}
        }));
    };
    componentWillMount() {
        let {id, mn, mt} = GetQuery(this.props.location.search);
        this.setState({id, mn: decodeURIComponent(mn), mt: mt - 0});
    }
    componentDidMount() {
        Ajax({
            url: `/nccloud/platform/appregister/queryappmenus.do`,
            data: {
                pk_menu: this.state.id
            },
            info: {
                name: "菜单项",
                action: "查询应用树"
            },
            success: res => {
                let {success, data} = res.data;
                if (success && data) {
                    this.setState({
                        treeData: data
                    });
                }
            }
        });
    }

    render() {
        let {treeData, mn, isedit, fields, menuFormData} = this.state;
        return (
            <PageLayout
                header={
                    <PageLayoutHeader>
                        <div>{mn}</div>
                        <div>{this.creatBtn()}</div>
                    </PageLayoutHeader>
                }
                className="nc-workbench-menuitem">
                <PageLayoutLeft>
                    <TreeSearch
                        onSelect={this.handleSelect}
                        onSearch={this.handleSearch}
                        dataSource={treeData}
                    />
                </PageLayoutLeft>
                <PageLayoutRight>
                    <div className="nc-workbench-menuitem-form">
                        {fields.menuitemcode || fields.menuitemcode === "" ? (
                            <FormCreate
                                isedit={isedit}
                                formData={menuFormData}
                                fields={fields}
                                onChange={this.handleFormChange}
                            />
                        ) : (
                            ""
                        )}
                    </div>
                </PageLayoutRight>
            </PageLayout>
        );
    }
}
MenuItem.propTypes = {
    menuItemData: PropTypes.object.isRequired
};
export default connect(state => {
    return {
        menuItemData: state.menuRegisterData.menuItemData
    };
}, {})(MenuItem);
