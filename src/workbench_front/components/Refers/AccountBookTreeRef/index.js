import React, {Component} from "react";
import {base, high} from "nc-lightapp-front";
import Tree from "./Tree.js";
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
                        refpk: "root",
                        treeid: "root"
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

    onTreeNodeSelectWapper(
        selectedKeys,
        {selected, selectedNodes, node, event},
        ...rest
    ) {
        if (node.props.treeNodeData.pid != "root") {
            this.onTreeNodeSelect(
                selectedKeys,
                {selected, selectedNodes, node, event},
                ...rest
            );
        }
    }

    onTreeNodeCheckWapper(checkedKeys, {checked, checkedNodes, node, event}) {
        if (node.props.treeNodeData.pid != "root") {
            this.onTreeNodeCheckWapper(checkedKeys, {
                checked,
                checkedNodes,
                node,
                event
            });
        }
    }
    setTreeData = (target, parentNode, data, cb) => {
        let {expandedKeys} = this.state,
            {isTreelazyLoad, rootNode} = this.props;
        debugger;
        data.rows.forEach(e => {
            e._display = this.props.treeConfig.code
                .map(item => e[item] || e.values[item].value)
                .join(" ");
            e.pid = e.pid || rootNode.refpk;
        });

        let newpks = data.rows.map(e => e.refpk);

        this.state[target] = this.state[target]
            .filter(e => !newpks.includes(e.refpk))
            .concat(data.rows);

        this.state[target] = data.rows.concat(parentNode);
        this.setState(
            {
                [target]: this.state[target],
                expandedKeys: expandedKeys.filter(e => !newpks.includes(e))
            },
            () => {
                typeof cb === "function" && cb();
            }
        );
    };

    // 复写原型方法：渲染弹出层左侧
    renderPopoverLeft = () => {
        let {
            isSearch,
            selectedKeys,
            expandedKeys,
            selectedValues,
            treeData
        } = this.state;
        const {
            refType,
            isMultiSelectedEnabled,
            isTreelazyLoad,
            rootNode,
            onlyLeafCanSelect
        } = this.props;
        return (
            <Tree
                checkStrictly={true}
                checkable={refType === "tree" && isMultiSelectedEnabled}
                data={treeData}
                onSelect={this.onTreeNodeSelectWapper.bind(this)}
                onExpand={this.onTreeNodeExpand}
                onCheck={this.onTreeNodeCheckWapper.bind(this)}
                checkedKeys={[...selectedValues.keys()]}
                selectedKeys={selectedKeys}
                expandedKeys={expandedKeys}
                autoExpandParent={false}
                isTreelazyLoad={isTreelazyLoad}
                root={rootNode}
                onlyLeafCanSelect={onlyLeafCanSelect}
                onDoubleClick={() => {}}
            />
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
    conf.rootNode = {...conf.rootNode, treeid: "root"};
    return <Ref {...Object.assign(conf, props)} />;
}
