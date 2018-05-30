import React, { Component } from "react";

// import FormItem1 from "./FormItem";
import FormContent from "./FormCreate";

class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // fields: {
            //     username: "benjycui",
            //     username1: "111111",
            //     username2: "2222"
            // }
            isedit: true,
            fields: {
                menuitemcode: "benjycui",
                menuitemname: "111111",
                resid: "111111",
                appcodeRef: {
                    refcode: "102202APP",
                    refname: "应用注册",
                    refpk: "0001Z510000000065KV7"
                }
            }
        };
        this.menuFormData = [
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
        ];
    }
    handleFormChange = changedFields => {
        console.log(changedFields);
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields }
        }));
    };
    handleClick = () => {
        this.setState({
            fields: {
                menuitemcode: "benjycui",
                menuitemname: "4444",
                resid: "6666",
                appcodeRef: {
                    refcode: "102202APP",
                    refname: "应用注册",
                    refpk: "0001Z510000000065KV7"
                }
            }
        });
    };
    handleClickSave = () => {
        console.log(this.state.fields);
    };
    render() {
        const fields = this.state.fields;
        return (
            <div style={{ marginTop: "100px" }}>
                <button onClick={this.handleClick}>修改</button>
                <button onClick={this.handleClickSave}>保存</button>
                <FormContent
                    isedit={this.state.isedit}
                    fields={{ ...fields }}
                    onChange={this.handleFormChange}
                    formData={this.menuFormData}
                />
                {/* {FormContent(this.state.fields)(FormItem1)} */}
                <pre className="language-bash">
                    {JSON.stringify(fields, null, 2)}
                </pre>
            </div>
        );
    }
}
export default Demo;
