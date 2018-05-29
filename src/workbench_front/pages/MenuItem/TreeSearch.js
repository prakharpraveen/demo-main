import React, {Component} from "react";
import {Tree, Input} from "antd";
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
        const expandedKeys = dataList
            .map(item => {
                if (item.key.indexOf(value) > -1) {
                    return getParentKey(item.key, gData);
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true
        });
    };
    render() {
        const {searchValue, expandedKeys, autoExpandParent} = this.state;
        const loop = data =>
            data.map(item => {
                const index = item.key.indexOf(searchValue);
                const beforeStr = item.key.substr(0, index);
                const afterStr = item.key.substr(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span style={{color: "#f50"}}>{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>{item.key}</span>
                    );
                if (item.children) {
                    return (
                        <TreeNode key={item.key} title={title}>
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.key} title={title} />;
            });
        return (
            <div>
                <Search
                    style={{marginBottom: 8}}
                    placeholder="Search"
                    onChange={this.onChange}
                />
                <Tree
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}>
                    {loop(gData)}
                </Tree>
            </div>
        );
    }
}
export default TreeSearch;
