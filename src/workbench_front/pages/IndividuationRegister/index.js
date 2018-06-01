import React, {Component} from "react";
import {
    PageLayout,
    PageLayoutHeader,
    PageLayoutLeft,
    PageLayoutRight
} from "Components/PageLayout";
import TreeCom from "./TreeCom";
import ButtonCreate from "Components/ButtonCreate";
import FormCreate from "Components/FormCreate";
class IndividuationRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            fields: {}
        };
    }
    handleBtnClick = key => {
        switch (key) {
            case "add":
            console.log(key);
                break;
            case "edit":
            console.log(key);
                break;
            case "save":
            console.log(key);
                break;
            case "cancle":
            console.log(key);
                break;
            case "del":
            console.log(key);
                break;
            default:
                break;
        }
    };
    handleSelect = selectedKey => {
        if (selectedKey === "00") {
            this.setState({isedit: false, parentKey: selectedKey, fields: {}});
            return;
        }
        let treeData = this.state.treeData;
        let treeItem = treeData.find(item => item.menuitemcode === selectedKey);
        this.historyData = {...treeItem};
        this.setState({
            isedit: false,
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
    render() {
        let {treeData, fields, isedit} = this.state;
        let menuFormData = [
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
                disabled: this.state.disabled,
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
        ];
        let btnList = [
            {
                name: "新增",
                code: "add",
                type: "primary",
                isshow: true
            },
            {
                name: "修改",
                code: "edit",
                type: "primary",
                isshow: true
            },
            {
                name: "删除",
                code: "del",
                type: "primary",
                isshow: true
            },
            {
                name: "保存",
                code: "save",
                type: "primary",
                isshow: true
            },
            {
                name: "取消",
                code: "cancle",
                type: "",
                isshow: true
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
                    <FormCreate
                        isedit={isedit}
                        formData={menuFormData}
                        fields={fields}
                        onChange={this.handleFormChange}
                    />
                </PageLayoutRight>
            </PageLayout>
        );
    }
}
export default IndividuationRegister;
