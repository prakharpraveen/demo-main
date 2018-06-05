import React, {Component} from "react";
import {Button} from "antd";
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
import Ajax from "Pub/js/ajax";
import {high} from "nc-lightapp-front";
import "nc-lightapp-front/dist/platform/nc-lightapp-front/index.css";
const {Refer} = high;
class DefaultSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 默认业务单元
            org_df_biz: {
                refcode: "1",
                refname: "董事会",
                refpk: "0001A110000000007614"
            },
            // 信用控制域
            org_df_credit: {
                refcode: "10106",
                refname: "福建大区",
                refpk: "1001A1100000000028HV"
            },
            // 默认成本域
            org_df_cost: {
                refcode: "10201",
                refname: "赣州播恩生物技术股份有限公司",
                refpk: "1001A110000000000BNF"
            },
            // 默认财务核算账簿
            org_df_fa: {
                refcode: "10101-0001",
                refname: "成都播恩生物技术有限公司-基准账簿",
                refpk: "1001A110000000000TCQ"
            },
            // 默认数据格式参照
            dataFormat: {
                refcode: "ZH-TW",
                refname: "台湾繁体",
                refpk: "FMT0Z000000000000001"
            },
            // 默认内容语种参照
            contentLang: {
                refcode: "ZH",
                refname: "简体中文",
                refpk: "zhCN0000000000000000"
            },
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
        individualPropertyVOs = individualPropertyVOs.map((item)=>{
            item.value = this.state[item.propertyname]['refpk'];
            return item;
        });
        let reqData = {
            individualPropertyVOs,
            dataFormat:this.state['dataFormat']['refpk'],
            contentLang:this.state['contentLang']['refpk'],
        }
        Ajax({
            url:`/nccloud/platform/appregister/saveindividualpro.do`,
            data:reqData,
            info:{
                name:'个性化-默认设置',
                action:'保存'
            },
            success:(res)=>{
                let {success,data} = res;
                if(success&&data){
                    this.setState(data);
                }
            }
        });
    };
    handdleRefChange = (value, type) => {
        let {refname, refcode, refpk} = value;
        let obj = {};
        obj[type] = {};
        obj[type]["refname"] = refname;
        obj[type]["refcode"] = refcode;
        obj[type]["refpk"] = refpk;
        this.setState(obj);
    };
    componentDidMount() {
        Ajax({
            url:`/nccloud/platform/appregister/queryindividualpro.do`,
            info:{
                name:'个性化-默认设置',
                action:'查询'
            },
            success:(res)=>{
                let {success,data} = res;
                if(success&&data){
                    this.setState(data);
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
            <ComLayout className="defaultSetting" title={this.props.title}>
                <div className="default-title">默认设置</div>
                <div className="dafault-form">
                    <label>默认业务单元</label>
                    <BusinessUnitTreeRef
                        value={org_df_biz}
                        placeholder={"默认业务单元"}
                        onChange={value => {
                            this.handdleRefChange(value, "org_df_biz");
                        }}
                    />
                </div>
                <div className="dafault-form">
                    <label>默认财务核算账簿</label>
                    <AccountBookTreeRef
                        value={org_df_fa}
                        placeholder={"默认财务核算账簿"}
                        onChange={value => {
                            this.handdleRefChange(value, "org_df_fa");
                        }}
                    />
                </div>
                <div className="dafault-form">
                    <label>默认信用控制域</label>
                    <CreditCtlRegionGridRef
                        value={org_df_biz}
                        placeholder={"默认信用控制域"}
                        onChange={value => {
                            this.handdleRefChange(value, "org_df_biz");
                        }}
                    />
                </div>
                <div className="dafault-form">
                    <label>默认成本域</label>
                    <CostRegionDefaultGridRef
                        value={org_df_cost}
                        placeholder={"默认成本域"}
                        onChange={value => {
                            this.handdleRefChange(value, "org_df_cost");
                        }}
                    />
                </div>
                <div className="default-title">默认语言格式</div>

                <div className="dafault-form">
                    <label htmlFor="">默认数据格式</label>
                    <DataFormatRef
                        value={dataFormat}
                        placeholder={"默认数据格式"}
                        onChange={value => {
                            this.handdleRefChange(value, "dataFormat");
                        }}
                    />
                </div>
                <div className="dafault-form">
                    <label htmlFor="">默认内容语种</label>
                    <ContentLangRef
                        value={contentLang}
                        placeholder={"默认内容语种"}
                        onChange={value => {
                            this.handdleRefChange(value, "contentLang");
                        }}
                    />
                </div>
                <div className="default-footer">
                    <Button type="primary" onClick={this.getAllData}>
                        应用
                    </Button>
                </div>
            </ComLayout>
        );
    }
}
export default DefaultSetting;
