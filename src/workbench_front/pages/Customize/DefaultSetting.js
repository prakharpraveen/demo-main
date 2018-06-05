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
import { high } from 'nc-lightapp-front';
import 'nc-lightapp-front/dist/platform/nc-lightapp-front/index.css';
const { Refer } = high;
class DefaultSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 默认业务单元
            org_df_bizRef: {
                refcode: "1",
                refname: "董事会",
                refpk: "0001A110000000007614"
            },
            // 信用控制域
            org_df_creditRef: {
                refcode: "10106",
                refname: "福建大区",
                refpk: "1001A1100000000028HV"
            },
            // 默认成本域
            org_df_costRef: {
                refcode: "10201",
                refname: "赣州播恩生物技术股份有限公司",
                refpk: "1001A110000000000BNF"
            },
            // 默认财务核算账簿
            org_df_faRef: {
                refcode: "10101-0001",
                refname: "成都播恩生物技术有限公司-基准账簿",
                refpk: "1001A110000000000TCQ"
            }
        };
    }
    getAllData=()=>{

    }
    componentDidMount() {}

    render() {
        let {org_df_bizRef,org_df_creditRef,org_df_costRef,org_df_faRef} = this.state;
        return (
            <ComLayout className="defaultSetting" title={this.props.title}>
                <div className="default-title">默认设置</div>
                <div className="dafault-form">
                    <label >默认业务单元</label>
                    <BusinessUnitTreeRef value={org_df_bizRef} placeholder={'默认业务单元'}/>
                </div>
                <div className="dafault-form">
                    <label >默认财务核算账簿</label>
                    <AccountBookTreeRef value={org_df_faRef} placeholder={'默认财务核算账簿'}/>
                </div>
                <div className="dafault-form">
                    <label >默认信用控制域</label>
                    <CreditCtlRegionGridRef value={org_df_bizRef} placeholder={'默认信用控制域'}/>
                </div>
                <div className="dafault-form">
                    <label >默认成本域</label>
                    <CostRegionDefaultGridRef value={org_df_costRef} placeholder={'默认成本域'}/>
                </div>
                <div className="default-title">默认语言格式</div>
                <div className="dafault-form">
                    <AccountBookTreeRef value={org_df_bizRef} placeholder={'默认财务核算账簿'}/>
                </div>
                <div className="dafault-form">
                    <AccountBookTreeRef value={org_df_bizRef} placeholder={'默认财务核算账簿'}/>
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
