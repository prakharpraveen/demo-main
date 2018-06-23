import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Tree } from "antd";
import { createTree } from "Pub/js/createTree.js";
import { setMenuTreeSelectedData } from "Store/AppManagement/action.js";
const TreeNode = Tree.TreeNode;
class MenuTree extends Component {
  constructor(props) {
    super(props);
  }
  handleSelect = (selectedKey, info) => {
    let selectedNode;
    if (info["selectedNodes"].length > 0) {
      selectedNode = info["selectedNodes"][0]["props"]["refData"];
    }
    this.props.setMenuTreeSelectedData(selectedNode);
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
        return <TreeNode key={code} title={itemContent} refData={item} />;
      });
    let newTreeData = createTree(this.props.menuTreeData, "refcode", "pid");
    return (
      <Tree showLine onSelect={this.handleSelect}>
        {loop(newTreeData)}
      </Tree>
    );
  }
}
MenuTree.propTypes = {
  setMenuTreeSelectedData: PropTypes.func.isRequired,
  menuTreeData: PropTypes.array.isRequired
};
export default connect(
  state => ({
    menuTreeData: state.AppManagementData.menuTreeData
  }),
  { setMenuTreeSelectedData }
)(MenuTree);
