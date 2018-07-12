import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Tree } from "antd";
import { createTree } from "Pub/js/createTree.js";
import { Pad } from "Pub/js/utils";
import { dataTransfer, dataRestore } from "Components/FormCreate";
import { setCopyNodeData } from "Store/AppManagement/action.js";
const TreeNode = Tree.TreeNode;
class MenuTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKeys: []
        };
    }
    handleSelect = (selectedKeys, info) => {
        let selectedNode;
        if (info["selectedNodes"].length > 0) {
            selectedNode = info["selectedNodes"][0]["props"]["refData"];
            if (selectedNode.refcode.length !== 6) {
                return;
            }
            let newMenuItemCode = `${selectedNode.refcode + Pad(1, 2)}`;
            if (selectedNode.children && selectedNode.children.length > 0) {
                newMenuItemCode = `${selectedNode["children"][
                    selectedNode.children.length - 1
                ]["refcode"] -
                    0 +
                    1}`;
            }
            this.props.form.setFieldsValue({
                newMenuItemCode: newMenuItemCode
            });
            this.setState({ selectedKeys });
        }
    };
    render() {
        const loop = data =>
            data.map(item => {
                let { refcode: code, refname: name } = item;
                let itemContent = `${code} ${name}`;
                if (item.children) {
                    return (
                        <TreeNode key={code} title={itemContent} refData={item}>
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return (
                    <TreeNode key={code} title={itemContent} refData={item} />
                );
            });
        let newTreeData = createTree(this.props.menuTreeData, "refcode", "pid");
        return (
            <Tree
                showLine
                onSelect={this.handleSelect}
                selectedKeys={this.state.selectedKeys}
            >
                {loop(newTreeData)}
            </Tree>
        );
    }
}
MenuTree.propTypes = {
    menuTreeData: PropTypes.array.isRequired,
    copyNodeData: PropTypes.object.isRequired,
    setCopyNodeData: PropTypes.func.isRequired
};
export default connect(
    state => ({
        menuTreeData: state.AppManagementData.menuTreeData,
        copyNodeData: state.AppManagementData.copyNodeData
    }),
    { setCopyNodeData }
)(MenuTree);
