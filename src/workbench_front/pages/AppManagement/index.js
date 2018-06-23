import React, { Component } from "react";
import { Modal } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  setTreeData,
  setNodeInfo,
  setNodeData,
  setPageButtonData,
  setPageTemplateData,
  setAppParamData,
  setIsNew,
  setIsEdit,
  setExpandedKeys,
  setSelectedKeys,
  setOptype,
  setCopyNodeData,
  setMenuTreeData
} from "Store/AppManagement/action";
import Ajax from "Pub/js/ajax";
import SearchTree from "./SearchTree";
import ModuleFormCard from "./ModuleFormCard";
import ClassFormCard from "./ClassFormCard";
import AppFormCard from "./AppFormCard";
import PageFromCard from "./PageFromCard";
import { dataTransfer, dataRestore, dataCheck } from "Components/FormCreate";
import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutLeft,
  PageLayoutRight
} from "Components/PageLayout";
import ButtonCreate from "Components/ButtonCreate";
import AppCopy from "./AppCopy/index";
import Notice from "Components/Notice";
import "./index.less";
const confirm = Modal.confirm;
/**
 * 工作桌面 首页 页面
 * 各个此贴应用及工作台中的小部件 通过 js 片段进行加载渲染
 */

class AppManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.historyOptype;
    this.historyNodeData;
  }
  /**
   * 按钮点击事件
   * @param {String} code
   */
  handleClick = code => {
    switch (code) {
      case "copy":
        this.setState(
          {
            visible: true
          },
          this.reqMenuTreeData
        );
        break;
      case "active":
        this.appActive();
        break;
      default:
        break;
    }
  };
  // 请求菜单树数据
  reqMenuTreeData = () => {
    Ajax({
      url: `/nccloud/platform/appregister/menuitemregref.do`,
      info: {
        name: "应用复制",
        action: "菜单参照"
      },
      success: ({
        data: {
          data: { rows }
        }
      }) => {
        if (rows.length > 0) {
          this.props.setMenuTreeData(rows);
          this.appCopy();
        }
      }
    });
  };
  // 应用复制
  appCopy = () => {
    let { code } = this.props.nodeInfo;
    let copyNodeData = {
      code: code,
      menucode: "",
      name: "",
      menuname: ""
    };
    this.props.setCopyNodeData(dataTransfer(copyNodeData));
  };
  // 应用停启用
  appActive = () => {};
  /**
   * 右侧表单选择
   */
  switchFrom = () => {
    switch (this.props.optype) {
      // 对应树结构中的第一层
      case "1":
        return <ModuleFormCard />;
        对应树结构中的第二层;
      case "2":
        return <ModuleFormCard />;
      // 对应树结构的第三层
      case "3":
        return <ClassFormCard />;
      // 对应树结构的第四层
      case "4":
        return <AppFormCard />;
      // 对应树结构的第五层
      case "5":
        return <PageFromCard />;
      default:
        return "";
    }
  };
  /**
   * tree 数据请求
   */
  reqTreeData = () => {
    Ajax({
      url: `/nccloud/platform/appregister/querymodules.do`,
      info: {
        name: "应用注册模块",
        action: "查询"
      },
      success: ({ data }) => {
        if (data.success && data.data.length > 0) {
          this.props.setTreeData(data.data);
        }
      }
    });
  };
  /**
   * 树节点详细信息请求
   * @param {Object} info 接口描述
   * @param {String} url 请求地址
   * @param {Object} data 请求数据
   * @param {Function} callback 成功回调
   */
  reqTreeNodeData = (info, url, data, callback) => {
    Ajax({
      url,
      data,
      info,
      success: ({ data: { data } }) => {
        if (data) {
          callback(data);
        }
      }
    });
  };
  /**
   * 数据点选择事件
   * @param {Object} obj 选中的数节点对象
   */
  handleTreeNodeSelect = obj => {
    let optype = "";
    let nodeInfo = {
      id: "",
      code: "",
      name: "",
      parentId: ""
    };
    if (obj) {
      switch (obj.flag) {
        // 对应树的前两层
        case "0":
          if (obj.moduleid.length === 2) {
            optype = "1";
          } else {
            optype = "2";
          }
          this.props.setNodeData(dataTransfer(obj));
          break;
        // 对应树的3、4层
        case "1":
          let appCallBack = data => {
            this.props.setNodeData(dataTransfer(data.appRegisterVO));
            this.props.setAppParamData(data.appParamVOs);
          };
          optype = "3";
          if (obj.parentcode.length > 4) {
            optype = "4";
          }
          this.reqTreeNodeData(
            { name: "应用注册", action: "应用查询" },
            `/nccloud/platform/appregister/query.do`,
            { pk_appregister: obj.moduleid },
            appCallBack
          );
          break;
        // 对应树的最后一层
        case "2":
          let pageCallBack = data => {
            this.props.setNodeData(dataTransfer(data.apppageVO));
            this.props.setPageButtonData(data.appButtonVOs);
            this.props.setPageTemplateData(data.pageTemplets);
          };
          this.reqTreeNodeData(
            { name: "应用注册", action: "应用页面查询" },
            `/nccloud/platform/appregister/querypagedetail.do`,
            { pk_apppage: obj.moduleid },
            pageCallBack
          );
          optype = "5";
          break;
        default:
          break;
      }
      nodeInfo = {
        id: obj.moduleid,
        code: obj.systypecode,
        name: obj.name,
        parentId: obj.parentcode
      };
    }
    this.props.setIsNew(false);
    this.props.setIsEdit(false);
    this.props.setNodeInfo(nodeInfo);
    this.props.setOptype(optype);
  };
  /**
   * 树查询
   */
  handleTreeSearch = value => {
    let searchCallback = data => {
      let expandedKeys = data.map(item => item.moduleid);
      this.props.setTreeData(data);
      this.props.setExpandedKeys(expandedKeys);
    };
    this.reqTreeNodeData(
      { name: "应用注册", action: "应用查询" },
      `/nccloud/platform/appregister/searchapps.do`,
      { search_content: value },
      searchCallback
    );
  };
  handleOk = e => {
    console.log(dataRestore(this.props.copyNodeData));
    this.setState({
      visible: false
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  componentDidMount() {
    let {
      selectedKeys,
      setSelectedKeys,
      optype,
      setOptype,
      treeData,
      nodeInfo
    } = this.props;
    if (optype !== "") {
      setSelectedKeys(selectedKeys);
      setOptype(optype);
      let historyNode = treeData.find(item => item.moduleid === nodeInfo.id);
      this.handleTreeNodeSelect(historyNode);
    } else {
      setSelectedKeys(["00"]);
      setOptype("");
    }
    this.reqTreeData();
  }
  render() {
    let optype = this.props.optype;
    let btnList = [
      {
        code: "copy",
        name: "应用复制",
        type: "primary",
        isshow: optype === "4"
      },
      {
        code: "active",
        name: "停启用",
        type: "primary",
        isshow: optype === "4"
      }
    ];
    return (
      <PageLayout
        className="nc-workbench-appRegister"
        header={
          <PageLayoutHeader>
            <div>应用管理</div>
            <ButtonCreate dataSource={btnList} onClick={this.handleClick} />
          </PageLayoutHeader>
        }
      >
        <PageLayoutLeft>
          <SearchTree
            className="appRegister-searchTree"
            onSelect={this.handleTreeNodeSelect}
            onSearch={this.handleTreeSearch}
          />
        </PageLayoutLeft>
        <PageLayoutRight>
          {this.switchFrom()}
          <Modal
            title="应用复制"
            mask={false}
            okText={"确认"}
            cancelText={"取消"}
            width={800}
            wrapClassName="vertical-center-modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <AppCopy />
          </Modal>
        </PageLayoutRight>
      </PageLayout>
    );
  }
}
AppManagement.propTypes = {
  isNew: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool.isRequired,
  nodeInfo: PropTypes.object.isRequired,
  nodeData: PropTypes.object.isRequired,
  treeData: PropTypes.array.isRequired,
  setTreeData: PropTypes.func.isRequired,
  setNodeData: PropTypes.func.isRequired,
  setPageButtonData: PropTypes.func.isRequired,
  setPageTemplateData: PropTypes.func.isRequired,
  setAppParamData: PropTypes.func.isRequired,
  setIsNew: PropTypes.func.isRequired,
  setIsEdit: PropTypes.func.isRequired,
  setExpandedKeys: PropTypes.func.isRequired,
  setSelectedKeys: PropTypes.func.isRequired,
  optype: PropTypes.string.isRequired,
  setOptype: PropTypes.func.isRequired,
  selectedKeys: PropTypes.array.isRequired,
  setCopyNodeData: PropTypes.func.isRequired,
  setMenuTreeData: PropTypes.func.isRequired
};
export default connect(
  state => ({
    nodeData: state.AppManagementData.nodeData,
    nodeInfo: state.AppManagementData.nodeInfo,
    treeData: state.AppManagementData.treeData,
    isNew: state.AppManagementData.isNew,
    isEdit: state.AppManagementData.isEdit,
    selectedKeys: state.AppManagementData.selectedKeys,
    optype: state.AppManagementData.optype
  }),
  {
    setTreeData,
    setNodeData,
    setNodeInfo,
    setPageButtonData,
    setPageTemplateData,
    setAppParamData,
    setIsNew,
    setIsEdit,
    setExpandedKeys,
    setSelectedKeys,
    setOptype,
    setCopyNodeData,
    setMenuTreeData
  }
)(AppManagement);
