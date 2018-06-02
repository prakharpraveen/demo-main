import React, {Component} from "react";
import _ from "lodash";
import {
    PageLayout,
    PageLayoutHeader,
    PageLayoutLeft,
    PageLayoutRight
} from "Components/PageLayout";
import TreeCom from "./TreeCom";
import ButtonCreate from "Components/ButtonCreate";
import {
    FormCreate,
    dataTransfer,
    dataRestore,
    dataCheck
} from "Components/FormCreate";
import Ajax from "Pub/js/ajax.js";
import Notice from "Components/Notice";

class IndividuationRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            fields: {},
            isedit: false,
            parentKey: ""
        };
        this.newFormData = {
            code: "",
            name: "",
            resourceid: "",
            resourcepath: "",
            page_part_url: ""
        };
        this.historyData;
    }
    handleBtnClick = key => {
        switch (key) {
            case "add":
                this.setState({
                    isedit: true,
                    isNew: true,
                    fields: {...this.newFormData}
                });
                break;
            case "edit":
                this.setState({isedit: true});
                break;
            case "save":
                this.save();
                break;
            case "cancle":
                if (this.state.isNew) {
                    this.historyData = dataTransfer(this.newFormData);
                }
                this.setState({
                    isedit: false,
                    isNew: false,
                    fields: {...this.historyData}
                });
                break;
            case "del":
                this.del();
                break;
            default:
                break;
        }
    };
    del = () => {
        let pk_individualreg = this.state.fields.pk_individualreg;
        Ajax({
            url: `/nccloud/platform/appregister/deleteindividualreg.do`,
            info: {
                name: "个性化注册",
                action: "删除"
            },
            data: {
                pk_individualreg
            },
            success: res => {
                let {success, data} = res.data;
                if ((success, data)) {
                    let treeData = [...this.state.treeData];
                    _.remove(
                        treeData,
                        item => item.pk_individualreg === pk_individualreg
                    );
                    this.setState({treeData, parentKey: ""});
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
    };
    save = () => {
        let {isNew, fields} = this.state;
        if (dataCheck(fields)) {
            Notice({
                status: "warning",
                msg: "请将必输项填写完整！"
            });
            return;
        }
        fields = dataRestore(fields);
        let saveURL, data;
        if (isNew) {
            saveURL = `/nccloud/platform/appregister/insertindividualreg.do`;
            data = fields;
        } else {
            saveURL = `/nccloud/platform/appregister/editindividualreg.do`;
            data = fields;
        }
        Ajax({
            url: saveURL,
            info: {
                name: "个性化注册",
                action: "保存"
            },
            data: data,
            success: res => {
                let {success, data} = res.data;
                if (success && data) {
                    let treeData = [...this.state.treeData];
                    if (isNew) {
                        treeData = _.concat(treeData, data);
                        fields = data;
                    } else {
                        let dataIndex = _.findIndex(
                            treeData,
                            item =>
                                item.pk_individualreg ===
                                fields.pk_individualreg
                        );
                        treeData[dataIndex] = fields;
                    }
                    this.setState({
                        isNew: false,
                        isedit: false,
                        treeData,
                        fields: dataTransfer(fields)
                    });
                    Notice({
                        status: "success",
                        msg: data.true ? data.true : "保存成功！"
                    });
                } else {
                    Notice({
                        status: "error",
                        msg: data.false
                    });
                }
            }
        });
    };
    handleSelect = selectedKey => {
        if (selectedKey === "00" || selectedKey === undefined) {
            this.setState({
                isedit: false,
                parentKey: selectedKey ? selectedKey : "",
                fields: dataTransfer(this.newFormData)
            });
            return;
        }
        let treeData = this.state.treeData;
        let treeItem = treeData.find(item => item.code === selectedKey);
        treeItem = dataTransfer(treeItem);
        this.historyData = {...treeItem};
        this.setState({
            isedit: false,
            isNew: false,
            parentKey: selectedKey,
            fields: {...treeItem}
        });
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
    componentDidMount() {
        Ajax({
            url: `/nccloud/platform/appregister/queryindividualreg.do`,
            info: {
                name: "个性化注册",
                action: "查询"
            },
            success: res => {
                let {success, data} = res.data;
                if (success && data) {
                    this.setState({treeData: data});
                }
            }
        });
    }

    render() {
        let {treeData, fields, isedit, isNew} = this.state;
        let menuFormData = [
            {
                code: "code",
                type: "string",
                label: "编码",
                isRequired: true,
                isedit: isedit,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "name",
                type: "string",
                label: "名称",
                isRequired: true,
                isedit: isedit,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "resourceid",
                type: "string",
                label: "名称->资源ID",
                isRequired: true,
                isedit: isedit,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "resourcepath",
                type: "string",
                label: "名称->资源路径",
                isRequired: true,
                isedit: isedit,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "page_part_url",
                type: "string",
                label: "页面片段URL",
                isRequired: true,
                isedit: isedit
            }
        ];
        let btnList = [
            {
                name: "新增",
                code: "add",
                type: "primary",
                isshow:
                    (this.state.parentKey === "" ||
                        this.state.parentKey === "00") &&
                    !isedit
            },
            {
                name: "修改",
                code: "edit",
                type: "primary",
                isshow:
                    this.state.parentKey !== "" &&
                    this.state.parentKey !== "00" &&
                    !isedit
            },
            {
                name: "删除",
                code: "del",
                type: "primary",
                isshow:
                    this.state.parentKey !== "" &&
                    this.state.parentKey !== "00" &&
                    !isedit
            },
            {
                name: "保存",
                code: "save",
                type: "primary",
                isshow: isedit
            },
            {
                name: "取消",
                code: "cancle",
                type: "",
                isshow: isedit
            }
        ];
        return (
            <PageLayout
                header={
                    <PageLayoutHeader>
                        <div>个性化注册</div>
                        <ButtonCreate
                            dataSource={btnList}
                            onClick={this.handleBtnClick}
                        />
                    </PageLayoutHeader>
                }>
                <PageLayoutLeft>
                    <TreeCom
                        onSelect={this.handleSelect}
                        dataSource={treeData}
                    />
                </PageLayoutLeft>
                <PageLayoutRight>
                    {(this.state.parentKey === "" ||
                        this.state.parentKey === "00") &&
                    !isNew ? (
                        ""
                    ) : (
                        <FormCreate
                            formData={menuFormData}
                            fields={fields}
                            onChange={this.handleFormChange}
                        />
                    )}
                </PageLayoutRight>
            </PageLayout>
        );
    }
}
export default IndividuationRegister;
