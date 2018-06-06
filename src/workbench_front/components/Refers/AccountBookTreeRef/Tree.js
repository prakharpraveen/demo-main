import React, {Component} from "react";
import {base, high} from "nc-lightapp-front";
let {NCTree} = base;

const TreeNode = NCTree.NCTreeNode;

export default class ReferTree extends Component {
    static defaultProps = {
        defaultExpandAll: false
    };

    constructor(props) {
        super(props);
        this.state = {
            group: {}
        };
    }

    componentWillMount() {
        this.group(this.props.data);
    }

    componentWillReceiveProps(nextProps) {
        this.group(nextProps.data);
    }

    group = data => {
        let group = {};
        const {root} = this.props;
        data.forEach(e => {
            group[e.pid] ? group[e.pid].push(e) : (group[e.pid] = [e]);
        });
        this.setState({
            group
        });
    };

    makeDOM = data => {
        if (data === undefined) return;
        if (typeof data === "boolean") {
            return data ? "" : [];
        }
        let {group} = this.state;
        const {onlyLeafCanSelect} = this.props;
        return data.map((e, i) => {
            let {refpk, _display, ...otherProps} = e;
            return (
                <TreeNode
                    key={refpk}
                    title={_display || e.refname}
                    treeNodeData={e}
                    disableCheckbox={
                        onlyLeafCanSelect === true && e.isleaf === false
                    }>
                    {this.makeDOM(group[e.treeid] || e.isleaf)}
                </TreeNode>
            );
        });
    };

    render() {
        const {data, isTreelazyLoad, root, ...otherProps} = this.props;
        let {group} = this.state;
        return (
            <NCTree
                {...otherProps}
                // filterTreeNode={(node) => {
                // 	return node.props.treeNodeData.refname.includes('宣传品');
                // }}
            >
                {this.makeDOM(group["undefined"])}
            </NCTree>
        );
    }
}
