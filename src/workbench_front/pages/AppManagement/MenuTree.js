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
        let { flag, moduleid: code, systypename: name, systypecode } = item;
        let itemContent;
        if (code === "00") {
          itemContent = `${name}`;
        } else {
          if (flag - 0 === 0) {
            itemContent = `${code} ${name}`;
          } else {
            itemContent = `${systypecode} ${name}`;
          }
        }
        if (item.children) {
          return (
            <TreeNode key={code} title={itemContent} refData={item}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={code} title={itemContent} refData={item} />;
      });
    let newTreeData = [
      {
        /* 给树填个根 */
        systypename: "应用节点",
        moduleid: "00",
        children: createTree(this.props.MenuTreeData, "moduleid", "parentcode")
      }
    ];
    return (
      <Tree showLine onSelect={this.handleSelect}>
        >
        {loop(newTreeData)}
      </Tree>
    );
  }
}
MenuTree.prototype = {
  setMenuTreeSelectedData: PropTypes.func.isRequired,
  MenuTreeData: PropTypes.array.isRequired
};
export default connect(
  state => ({
    MenuTreeData: state.AppManagementData.MenuTreeData
  }),
  { setMenuTreeSelectedData }
)(MenuTree);
