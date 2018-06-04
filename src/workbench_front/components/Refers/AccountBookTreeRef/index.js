import React, {Component} from "react";
import {base, high} from "nc-lightapp-front";
/**
 * 财务核算账簿 参照
 */
const {PopRefer} = high.Refer, // 引入PopRefer类
    {NCRadio: Radio} = base,
    {NCRadioGroup: RadioGroup} = Radio;
class Ref extends PopRefer {
    // 继承PopRefer类
    constructor(props) {
        super(props);

        this.state = {
            ...this.state, // 继承state
            treetype: "sobtablename"
        };
    }

    onTreeTypeChange = value => {
        this.state.treetype = value;
        this.setState(this.state, () => {
            const {queryTreeUrl, isCacheable, rootNode} = this.props;
            let param = {
                ...this.getParam(),
                treetype: this.state.treetype,
                disabledDataShow: false
            };
            debugger;
            this.loadTreeData(param).then(data => {
                debugger;
                this.setTreeData(
                    "treeData",
                    {
                        refname:
                            value === "sobtablename" ? "账簿类型" : "主账簿",
                        refpk: "root"
                    },
                    data
                );
            });
        });
    };

    getParam = (param = {}) => {
        let {queryCondition, pageSize, refType} = this.props,
            {keyword = "", pid = "", pageInfo = {}} = param;
        pageInfo = {
            pageSize: pageInfo.pageSize || pageSize,
            pageIndex: pageInfo.pageIndex || (refType === "tree" ? -1 : 0)
        };
        return {
            pid, // 对应的树节点
            keyword,
            disabledDataShow: false,
            queryCondition: queryCondition
                ? typeof queryCondition === "function"
                    ? queryCondition()
                    : typeof queryCondition === "object"
                        ? queryCondition
                        : {}
                : {},
            pageInfo
        };
    };

    renderPopoverLeftHeader = () => {
        return (
            <div>
                <RadioGroup
                    name="booktype"
                    selectedValue={this.state.treetype}
                    onChange={this.onTreeTypeChange.bind(this)}>
                    <Radio value="sobtablename">账簿类型</Radio>
                    <Radio value="acctypetablename">主账簿</Radio>
                </RadioGroup>
            </div>
        );
    };
}

export default function(props = {}) {
    var conf = {
        refName: "财务核算账簿",
        placeholder: "财务核算账簿",
        rootNode: {refname: "财务核算账簿", refpk: "root"},
        refCode: "uapbd.ref.AccountBookTreeRef",
        queryTreeUrl: "/nccloud/uapbd/ref/AccountBookTreeRef.do",
        isMultiSelectedEnabled: false,
        refType: "tree",
        isTreelazyLoad: false,
        treeConfig: {name: ["编码", "名称"], code: ["refcode", "refname"]}
    };
    return <Ref {...Object.assign(conf, props)} />;
}
