import React, {Component} from "react";
import {Tree} from "antd";
import {createTree} from "Pub/js/createTree.js";
const TreeNode = Tree.TreeNode;
class TreeCom extends Component {
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
            this.props.onSearch(value, this.handleExpanded);
        });
    };
    handleExpanded = dataList => {
        const expandedKeys = dataList.map((item, index) => {
            return item.menuitemcode;
        });
        expandedKeys.push("00");
        this.setState({
            expandedKeys,
            autoExpandParent: true
        });
    };
    render() {
        const {searchValue, expandedKeys, autoExpandParent} = this.state;
        const loop = data =>
            data.map(item => {
                let {menuitemcode, menuitemname} = item;
                let itemContent;
                if (menuitemcode === "00") {
                    itemContent = `${menuitemname}`;
                } else {
                    itemContent = `${menuitemcode} ${menuitemname}`;
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
                        <TreeNode key={menuitemcode} title={title}>
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={menuitemcode} title={title} />;
            });
        let newTreeData = [
            {
                /* 给树填个根 */
                menuitemname: "个性化设置",
                menuitemcode: "00",
                children: createTree(
                    this.props.dataSource,
                    "menuitemcode",
                    "parentcode"
                )
            }
        ];
        return (
            <div>
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
export default TreeCom;
