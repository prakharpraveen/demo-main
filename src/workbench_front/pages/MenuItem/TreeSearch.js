import React, {Component} from "react";
import {Tree, Input} from "antd";
import {createTree} from "Pub/js/createTree.js";
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
class TreeSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedKeys: [],
            searchValue: "",
            autoExpandParent: true
        };
    }
    onExpand = expandedKeys => {
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
        this.setState({
            expandedKeys,
            autoExpandParent: true
        });
    };
    handleSelect = selectedKey => {
        this.props.onSelect(selectedKey[0]);
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
                menuitemname: "菜单树",
                menuitemcode: "00",
                children: createTree(
                    this.props.dataSource,
                    "menuitemcode",
                    "parentcode"
                )
            }
        ];
        return (
            <div className="menuitem-tree-search">
                <Search
                    style={{marginBottom: 8}}
                    placeholder="查询应用"
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
export default TreeSearch;
