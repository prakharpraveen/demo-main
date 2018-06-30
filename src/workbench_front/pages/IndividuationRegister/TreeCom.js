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
            return item.code;
        });
        expandedKeys.push("00");
        this.setState({
            expandedKeys,
            autoExpandParent: true
        });
    };
    handleSelect = (selectedKey,info) => {
        console.log(info);
        
        this.props.onSelect(selectedKey[0]);
    };
    render() {
        const {searchValue, expandedKeys, autoExpandParent} = this.state;
        const loop = data =>
            data.map(item => {
                let {code, name} = item;
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
                        <TreeNode key={code} title={title} >
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={code} title={title} />;
            });
        let newTreeData = [
            {
                /* 给树填个根 */
                name: "个性化设置",
                code: "00",
                children: createTree(
                    this.props.dataSource,
                    "code",
                    "parentcode"
                )
            }
        ];
        return (
            <div className='individuation-tree-search'>
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
