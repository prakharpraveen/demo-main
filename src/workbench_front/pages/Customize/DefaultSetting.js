import React, { Component } from "react";
import { Button } from "antd";
import ComLayout from "./ComLayout";
// 业务单元
import BusinessUnitTreeRef from "Components/Refers/BusinessUnitTreeRef";
// 财务核算账簿
import AccountBookTreeRef from "Components/Refers/AccountBookTreeRef";
// 默认信用控制域
import CreditCtlRegionGridRef from "Components/Refers/CreditCtlRegionGridRef";
// 默认成本域
import CostRegionDefaultGridRef from "Components/Refers/CostRegionDefaultGridRef";
// 默认内容语种参照
import ContentLangRef from "Components/Refers/ContentLangRef";
// 默认数据格式参照
import DataFormatRef from "Components/Refers/DataFormatRef";
import Notice from "Components/Notice";
import Ajax from "Pub/js/ajax";
import { high } from "nc-lightapp-front";
import "nc-lightapp-front/dist/platform/nc-lightapp-front/index.css";
const { Refer } = high;
class DefaultSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 默认业务单元
            org_df_biz: {
                refcode: "",
                refname: "",
                refpk: ""
            },
            // 信用控制域
            org_df_credit: {
                refcode: "",
                refname: "",
                refpk: ""
            },
            // 默认成本域
            org_df_cost: {
                refcode: "",
                refname: "",
                refpk: ""
            },
            // 默认财务核算账簿
            org_df_fa: {
                refcode: "",
                refname: "",
                refpk: ""
            },
            // 默认数据格式参照
            dataFormat: {
                refcode: "",
                refname: "",
                refpk: ""
            },
            // 默认内容语种参照
            contentLang: {
                refcode: "",
                refname: "",
                refpk: ""
            }
        };
    }
    getAllData = () => {
        let individualPropertyVOs = [
            {
                propertyname: "org_df_biz",
                value: ""
            },
            {
                propertyname: "org_df_fa",
                value: ""
            },
            {
                propertyname: "org_df_credit",
                value: ""
            },
            {
                propertyname: "org_df_cost",
                value: ""
            }
        ];
        individualPropertyVOs = individualPropertyVOs.map(item => {
            item.value = this.state[item.propertyname]["refpk"];
            return item;
        });
        let reqData = {
            individualPropertyVOs,
            dataFormat: this.state["dataFormat"]["refpk"],
            contentLang: this.state["contentLang"]["refpk"]
        };
        Ajax({
            url: `/nccloud/platform/appregister/saveindividualpro.do`,
            data: reqData,
            info: {
                name: "个性化-默认设置",
                action: "保存"
            },
            success: ({ data: { data } }) => {
                if (data) {
                    Notice({
                        status: "success"
                    });
                    this.setState(data);
                }
            }
        });
    };
    handdleRefChange = (value, type) => {
        console.log(value, type);
        let { refname, refcode, refpk } = value;
        let obj = {};
        obj[type] = {};
        obj[type]["refname"] = refname;
        obj[type]["refcode"] = refcode;
        obj[type]["refpk"] = refpk;
        this.setState(obj);
    };
    componentDidMount() {
        Ajax({
            url: `/nccloud/platform/appregister/queryindividualpro.do`,
            info: {
                name: "个性化-默认设置",
                action: "查询"
            },
            success: ({ data: { data } }) => {
                if (data) {
                    for (const key in data) {
                        if (!data[key]) {
                            data[key] = {};
                        }
                    }
                    this.setState({ ...data });
                }
            }
        });
    }
    render() {
        let {
            org_df_biz,
            org_df_credit,
            org_df_cost,
            org_df_fa,
            contentLang,
            dataFormat
        } = this.state;
        return (
            <ComLayout title={this.props.title}>
                <div className="defaultSetting">
                    <div className="default-title">默认设置</div>
                    <div className="default-form-container">
                        <div className="default-form">
                            <label className="default-label">
                                默认业务单元
                            </label>
                            <BusinessUnitTreeRef
                                value={org_df_biz}
                                placeholder={"默认业务单元"}
                                onChange={value => {
                                    this.handdleRefChange(value, "org_df_biz");
                                }}
                            />
                        </div>
                        <div className="default-form">
                            <label className="default-label">
                                默认财务核算账簿
                            </label>
                            <AccountBookTreeRef
                                value={org_df_fa}
                                placeholder={"默认财务核算账簿"}
                                onChange={value => {
                                    this.handdleRefChange(value, "org_df_fa");
                                }}
                            />
                        </div>
                        <div className="default-form">
                            <label className="default-label">
                                默认信用控制域
                            </label>
                            <CreditCtlRegionGridRef
                                value={org_df_credit}
                                placeholder={"默认信用控制域"}
                                onChange={value => {
                                    this.handdleRefChange(
                                        value,
                                        "org_df_credit"
                                    );
                                }}
                            />
                        </div>
                        <div className="default-form">
                            <label className="default-label">默认成本域</label>
                            <CostRegionDefaultGridRef
                                value={org_df_cost}
                                placeholder={"默认成本域"}
                                onChange={value => {
                                    this.handdleRefChange(value, "org_df_cost");
                                }}
                            />
                        </div>
                    </div>
                    <div className="default-title">默认语言格式</div>
                    <div className="default-form-container">
                        <div className="default-form">
                            <label className="default-label">
                                默认数据格式
                            </label>
                            <DataFormatRef
                                value={dataFormat}
                                placeholder={"默认数据格式"}
                                onChange={value => {
                                    this.handdleRefChange(value, "dataFormat");
                                }}
                            />
                        </div>
                        <div className="default-form">
                            <label className="default-label">
                                默认内容语种
                            </label>
                            <ContentLangRef
                                value={contentLang}
                                placeholder={"默认内容语种"}
                                onChange={value => {
                                    this.handdleRefChange(value, "contentLang");
                                }}
                            />
                        </div>
                    </div>
                    <div className="default-footer">
                        <Button type="primary" onClick={this.getAllData}>
                            应用
                        </Button>
                    </div>
                </div>
            </ComLayout>
        );
    }
}
export default DefaultSetting;
