import React, {Component} from "react";
import {Button} from "antd";
import ComLayout from "./ComLayout";
import FormContent from "./FormCreate";
class DefaultSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
        this.getFormDataFun1;
        this.getFormDataFun2;
        this.setFormDataFun1;
        this.setFormDataFun2;
        this.defaultForm = [
            {
                placeholder: "默认业务单元",
                refName: "默认业务单元",
                refCode: "uapbd/refer/org/BusinessUnitTreeRef",
                refType: "tree",
                queryTreeUrl: "/nccloud/uapbd/ref/businessunit.do",
                onChange: val => {
                    console.log(val);
                    // this.setFieldsValue({ cont: val });
                },
                isMultiSelectedEnabled: false
            },
            {
                placeholder: "财务核算账簿 ",
                refName: "财务核算账簿",
                refCode: "uapbd/refer/org/AccountBookTreeRef",
                refType: "tree",
                queryTreeUrl: "/nccloud/uapbd/ref/AccountBookTreeRef.do",
                onChange: val => {
                    console.log(val);
                    // this.setFieldsValue({ cont: val });
                },
                isMultiSelectedEnabled: false
            }
        ];
        this.defaultLang = [
            {
                placeholder: "多选树表",
                refName: "交易类型",
                refCode: "cont1",
                refType: "gridTree",
                queryTreeUrl: "/nccloud/reva/ref/materialclass.do",
                queryGridUrl: "/nccloud/reva/ref/material.do",
                onChange: val => {
                    console.log(val);
                    // this.setFieldsValue({ cont1: val });
                },
                columnConfig: [
                    {
                        name: ["编码", "名称"],
                        code: ["refcode", "refname"]
                    }
                ],
                isMultiSelectedEnabled: false
            }
        ];
    }
    componentDidMount(){

    };

    render() {
        return (
            <ComLayout className="defaultSetting" title={this.props.title}>
                <div className="default-title">默认设置</div>
                <div className="dafault-form">
                    <FormContent
                        formData={this.defaultForm}
                        getFormData={this.getFormData1}
                        setFormData={this.setFormData1}
                    />
                </div>
                <div className="default-title">默认语言格式</div>
                <div className="dafault-form">
                    <FormContent
                        formData={this.defaultLang}
                        getFormData={this.getFormData2}
                        setFormData={this.setFormData2}
                    />
                </div>
                <div className="default-footer">
                    <Button type="primary" onClick={this.getAllFormData}>
                        应用
                    </Button>
                </div>
            </ComLayout>
        );
    }
}
export default DefaultSetting;
