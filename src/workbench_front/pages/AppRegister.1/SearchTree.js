import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Tree, Input} from "antd";
import {createTree} from "Pub/js/createTree.js";
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
class SearchTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedKeys: ["00"],
            searchValue: "",
            autoExpandParent: true
        };
    }
    onExpand = expandedKeys => {
        expandedKeys.push("00");
        this.setState({
            expandedKeys,
            autoExpandParent: false
        });
    };
    onChange = e => {
        const value = e.target.value;
        this.setState({searchValue: value}, () => {
            // this.props.onSearch(value, this.handleExpanded);
        });
    };
    handleExpanded = dataList => {
        const expandedKeys = dataList.map((item, index) => {
            return item.code;
        });
        expandedKeys.push("00");
        this.setState({
            expandedKeys,
            autoExpandParent: true
        });
    };
    /**
     * 树节点选中事件
     * @param {Array} selectedKey
     */
    handleSelect = (selectedKey,info) => {
        let selectedNode = info['selectedNodes'][0]['props']['refData'];
        // 为父组件返回选中的树节点对象
        this.props.onSelect(selectedNode);
    };
    render() {
        const {searchValue, expandedKeys, autoExpandParent} = this.state;
        const loop = data =>
            data.map(item => {
                let {moduleid: code, systypename: name} = item;
                let itemContent;
                if (code === "00") {
                    itemContent = `${name}`;
                } else {
                    itemContent = `${code} ${name}`;
                }
                const index = itemContent.indexOf(searchValue);
                const beforeStr = itemContent.substr(0, index);
                const afterStr = itemContent.substr(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span style={{color: "#f50"}}>{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>{itemContent}</span>
                    );
                if (item.children) {
                    return (
                        <TreeNode key={code} title={title} refData={item}>
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={code} title={title} refData={item}/>;
            });
        let newTreeData = [
            {
                /* 给树填个根 */
                systypename: "应用节点",
                moduleid: "00",
                children: createTree(
                    this.props.treeData,
                    "moduleid",
                    "parentcode"
                )
            }
        ];
        return (
            <div>
                <Search
                    style={{marginBottom: 8}}
                    placeholder="应用查询"
                    onChange={this.onChange}
                />
                <Tree
                    showLine
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    onSelect={this.handleSelect}
                    autoExpandParent={autoExpandParent}>
                    {loop(newTreeData)}
                </Tree>
            </div>
        );
    }
}
SearchTree.propTypes = {
    treeData: PropTypes.array.isRequired
};
export default connect(
    state => ({
        treeData: state.AppRegisterData.treeData
    }),
    {}
)(SearchTree);
