import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Button,
  Layout,
  Modal,
  Tree,
  Input,
  Select,
  Menu,
  Dropdown,
  Icon,
  Tabs
} from "antd";
import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutLeft,
  PageLayoutRight
} from "Components/PageLayout";
import { createTree } from "Pub/js/createTree";
import Ajax from "Pub/js/ajax.js";
import Item from "antd/lib/list/Item";
import Notice from "Components/Notice";
import BusinessUnitTreeRef from "Components/Refers/BusinessUnitTreeRef";
import "nc-lightapp-front/dist/platform/nc-lightapp-front/index.css";
import PreviewModal from "./showPreview";
import AssignComponent from "./assignComponent";
import { openPage } from "Pub/js/superJump";
import { generateTemData, generateTreeData, generateRoData } from "./method";
import "./index.less";
const Option = Select.Option;
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const { Header, Footer, Sider, Content } = Layout;

const Btns = [
  {
    name: "修改",
    type: "primary"
  },
  {
    name: "删除",
    type: "primary"
  },
  {
    name: "复制",
    type: "primary"
  },
  {
    name: "分配",
    type: "primary"
  },
  {
    name: "浏览",
    type: "primary"
  },
  {
    name: "刷新",
    type: "primary"
  }
];
class TemplateSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siderHeight: "280",
      expandedKeys: ["0"],
      selectedKeys: [],
      treeDataArray: [],
      treeData: [],
      searchValue: "",
      autoExpandParent: true,
      treeTemBillData: [], //单据模板数据
      treeTemQueryData: [], //查询模板数据
      treePrintTemData: [],
      treeTemBillDataArray: [],
      treeTemQueryDataArray: [],
      templatePks: "",
      visible: false,
      templateNameVal: "",
      pageCode: "",
      appCode: "",
      alloVisible: false,
      org_df_biz: {
        // 默认业务单元
        refcode: "",
        refname: "",
        refpk: ""
      },
      orgidObj: {},
      parentIdcon: "", //树节点的key
      activeKey: "1",
      batchSettingModalVisibel: false //控制预览摸态框的显隐属性
    };
  }
  // 按钮显隐性控制
  setBtnsShow = item => {
    let { parentIdcon, activeKey } = this.state;
    let { name } = item;
    let isShow = false;
    switch (name) {
      case "修改":
        if (activeKey === "3") {
          isShow = false;
        } else {
          if (parentIdcon === "root") {
            isShow = false;
          } else {
            isShow = true;
          }
        }
        break;
      case "删除":
        if (activeKey === "3") {
          isShow = false;
        } else {
          if (parentIdcon === "root") {
            isShow = false;
          } else {
            isShow = true;
          }
        }
        break;
      case "复制":
        isShow = true;
        break;
      case "分配":
        if (parentIdcon === "root") {
          isShow = false;
        } else {
          isShow = true;
        }
        break;
      case "设置默认模板":
        isShow = true;
        break;
      case "浏览":
        isShow = true;
        break;
      case "刷新":
        if (activeKey === "3") {
          isShow = true;
        }
        break;
      default:
        break;
    }
    return { ...item, isShow };
  };
  //生成按钮方法
  creatBtn = btnObj => {
    let { name, isShow, type } = btnObj;
    if (isShow) {
      return (
        <Button
          key={name}
          className="margin-left-10"
          type={type}
          onClick={this.handleClick.bind(this, name)}
        >
          {name}
        </Button>
      );
    }
  };
  //保存
  handleOk = e => {
    let {
      templateNameVal,
      templateTitleVal,
      templatePks,
      pageCode,
      activeKey,
      appCode
    } = this.state;
    if (!templateNameVal) {
      Notice({ status: "warning", msg: "请输入模板标题" });
      return;
    }
    let infoData = {
      pageCode: pageCode,
      templateId: templatePks,
      name: templateNameVal,
      appCode: appCode
    };
    if (activeKey === "1") {
      infoData.templateType = "bill";
    } else if (activeKey === "2") {
      infoData.templateType = "query";
    } else if (activeKey === "3") {
      infoData.templateType = "print";
    }
    Ajax({
      url: `/nccloud/platform/template/copyTemplate.do`,
      data: infoData,
      info: {
        name: "模板设置",
        action: "模板复制"
      },
      success: ({ data }) => {
        if (data.success) {
          Notice({ status: "success", msg: "复制成功" });
          this.reqTreeTemData();
          this.setState({
            visible: false,
            templateNameVal: ""
          });
        }
      }
    });
  };
  //取消
  handleCancel = e => {
    this.setState({
      visible: false,
      templateNameVal: ""
    });
  };
  //设置默认模板 菜单栏
  menuFun = () => {
    let { templateNameVal } = this.state;
    const len = templateNameVal.length;
    let isButton = false;
    if (templateNameVal.slice(len - 3, len - 1) === "默认") {
      isButton = true;
    }
    return (
      <Menu onClick={this.settingClick.bind(this)}>
        <Menu.Item key="设置默认">
          <button disabled={isButton}>设置默认</button>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="取消默认">
          <button disabled={!isButton}>取消默认</button>
        </Menu.Item>
      </Menu>
    );
  };
  //设置默认模板方法
  settingClick = key => {
    let { templateNameVal, templatePks, pageCode, appCode } = this.state;
    let infoDataSet = {
      templateId: templatePks,
      pageCode: pageCode,
      appCode: appCode
    };
    const btnName = key.key;
    if (!templatePks) {
      Notice({ status: "warning", msg: "请选择模板数据" });
      return;
    }
    switch (btnName) {
      case "设置默认":
        let urlSetting = "/nccloud/platform/template/setDefaultTemplate.do";
        this.setDefaultFun(urlSetting, infoDataSet, "设置成功");
        break;
      case "取消默认":
        let urlCancel = "/nccloud/platform/template/cancelDefaultTemplate.do";
        this.setDefaultFun(urlCancel, infoDataSet, "取消成功");
        break;
      default:
        break;
    }
  };
  //按钮事件的触发
  handleClick = btnName => {
    let { templateNameVal, templatePks, pageCode } = this.state;
    let infoData = {
      templateId: templatePks
    };
    switch (btnName) {
      case "复制":
        if (!templatePks) {
          Notice({ status: "warning", msg: "请选择模板数据" });
          return;
        }
        this.setState({
          visible: true
        });
        break;
      case "修改":
        if (!templatePks) {
          Notice({ status: "warning", msg: "请选择模板数据" });
          return;
        }
        openPage(
          `ZoneSetting`,
          false,
          {},
          { templetid: templatePks, status: "billTemplate" }
        );
        break;
      case "删除":
        if (!templatePks) {
          Notice({ status: "warning", msg: "请选择模板数据" });
          return;
        }
        let _this = this;
        confirm({
          title: "确认删除这个模板信息吗?",
          onOk() {
            Ajax({
              url: `/nccloud/platform/template/deleteTemplateDetail.do`,
              data: infoData,
              info: {
                name: "模板设置",
                action: "删除"
              },
              success: ({ data }) => {
                if (data.success) {
                  Notice({ status: "success", msg: "删除成功" });
                  _this.reqTreeTemData();
                }
              }
            });
          },
          onCancel() {}
        });
        break;
      case "分配":
        this.setState({
          alloVisible: true
        });
        break;
      case "浏览":
        if (!templatePks) {
          Notice({ status: "warning", msg: "请选择模板数据" });
          return;
        }
        this.setState({
          batchSettingModalVisibel: true
        });
        break;
      default:
        break;
    }
  };
  /**
   * 设置默认模板的ajax请求
   * @param url 请求路径
   * @param infoData 请求参数
   * @param textInfo 请求成功后的提示信息
   */
  setDefaultFun = (url, infoData, textInfo) => {
    let { pageCode, activeKey } = this.state;
    if (activeKey === "1") {
      infoData.templateType = "bill";
    } else if (activeKey === "2") {
      infoData.templateType = "query";
    } else if (activeKey === "3") {
      infoData.templateType = "print";
    }
    Ajax({
      url: url,
      data: infoData,
      info: {
        name: "模板设置",
        action: "参数查询"
      },
      success: ({ data }) => {
        if (data.success) {
          Notice({ status: "success", msg: textInfo });
          this.reqTreeTemData();
        }
      }
    });
  };
  componentDidMount = () => {
    this.reqTreeData();
    // 样式处理
    // window.onresize = () => {
    // 	let siderHeight = document.querySelector('.ant-layout-content').offsetHeight;
    // 	this.setState({ siderHeight });
    // };
  };
  //右侧树组装数据
  restoreTreeTemData = templateType => {
    let {
      treeTemBillData,
      treeTemBillDataArray,
      treeTemQueryDataArray,
      selectedKeys,
      parentIdcon,
      activeKey,
      treeTemQueryData
    } = this.state;
    let treeData = [];
    let treeInfo;
    if (templateType === "bill") {
      treeTemBillDataArray.map(item => {
        if (item.isDefault === "y") {
          item.name = item.name + " [默认]";
        }
      });
      treeInfo = generateTemData(treeTemBillDataArray);
    } else if (templateType === "query") {
      treeTemQueryDataArray.map(item => {
        if (item.isDefault === "y") {
          item.name = item.name + " [默认]";
        }
      });
      treeInfo = generateTemData(treeTemQueryDataArray);
    }
    let { treeArray, treeObj } = treeInfo;
    treeArray.map((item, index) => {
      for (const key in treeObj) {
        if (treeObj.hasOwnProperty(key)) {
          if (item.templateId === treeObj[key][0].parentId) {
            item.children.push(treeObj[key][0]);
          }
        }
      }
    });
    //处理树数据
    treeData = treeInfo.treeArray;
    treeData = generateTreeData(treeData);
    if (treeData.length > 0) {
      let newinitKeyArray = [];
      newinitKeyArray.push(treeData[0].key);
      this.setState({
        selectedKeys: newinitKeyArray,
        parentIdcon: treeData[0].parentId
      });
    }
    if (templateType === "bill") {
      treeTemBillData = treeData;
      this.setState({
        treeTemBillData
      });
    } else if (templateType === "query") {
      treeTemQueryData = treeData;
      this.setState({
        treeTemQueryData
      });
    }
  };
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: true
    });
  };
  //tree的查询方法
  onChange = e => {
    const value = e.target.value;
    this.setState({ searchValue: value }, () => {
      this.handleSearch(value, this.handleExpanded);
    });
  };
  handleExpanded = dataList => {
    const expandedKeys = dataList.map((item, index) => {
      return item.pk;
    });
    expandedKeys.push("00");
    this.setState({
      expandedKeys,
      autoExpandParent: true
    });
  };
  handleSearch = (value, callback) => {
    Ajax({
      url: `/nccloud/platform/appregister/searchappmenuitem.do`,
      data: {
        search_content: value,
        containAppPage: "true"
      },
      info: {
        name: "菜单项",
        action: "查询应用树"
      },
      success: res => {
        let { success, data } = res.data;
        if (success && data) {
          this.setState(
            {
              treeDataArray: data
            },
            () => {
              callback(data);
            }
          );
        }
      }
    });
  };
  //加载右侧模板数据
  onSelectQuery = (key, e) => {
    if (key.length > 0) {
      this.setState(
        {
          selectedKeys: key,
          pageCode: e.selectedNodes[0].props.refData.code,
          appCode: e.selectedNodes[0].props.refData.appCode
        },
        this.reqTreeTemData
      );
    } else {
      this.setState({
        selectedKeys: key,
        pageCode: "",
        appCode: ""
      });
    }
  };
  //请求右侧树数据
  reqTreeTemData = key => {
    let { pageCode, activeKey, appCode } = this.state;
    let infoData = {
      pageCode: pageCode,
      appCode: appCode
    };
    if (!infoData.pageCode) {
      return;
    }
    infoData.templateType = "bill";
    this.reqTreeTemAjax(infoData, "bill");
    infoData.templateType = "query";
    this.reqTreeTemAjax(infoData, "query");
    if (activeKey === "3") {
      infoData.templateType = "print";
      this.reqTreeTemAjax(infoData, "print");
    }
  };
  //请求右侧树数据ajax方法封装
  reqTreeTemAjax = (infoData, templateType) => {
    Ajax({
      url: `/nccloud/platform/template/getTemplatesOfPage.do`,
      data: infoData,
      info: {
        name: "模板设置",
        action: "参数查询"
      },
      success: ({ data }) => {
        if (data.success) {
          if (templateType === "bill") {
            this.setState(
              {
                treeTemBillDataArray: data.data
              },
              () => {
                this.restoreTreeTemData(templateType);
              }
            );
          } else if (templateType === "query") {
            this.setState(
              {
                treeTemQueryDataArray: data.data
              },
              () => {
                this.restoreTreeTemData(templateType);
              }
            );
          }
        }
      }
    });
  };
  //单据模板树的onSelect事件
  onTemSelect = (key, e) => {
    let { activeKey, templateNameVal, parentIdcon } = this.state;
    let templateType = "";
    if (activeKey === "1") {
      templateType = "bill";
    } else if (activeKey === "2") {
      templateType = "query";
    } else if (activeKey === "3") {
      templateType = "print";
    }
    if (key.length > 0) {
      this.setState({
        selectedKeys: key,
        templatePks: key[0],
        parentIdcon: e.selectedNodes[0].props.refData.parentId,
        templateNameVal: e.selectedNodes[0].props.refData.name
      });
    } else {
      this.setState({
        selectedKeys: key,
        templatePks: "",
        parentIdcon: "",
        templateNameVal: ""
      });
    }
  };
  /**
   * tree 数据请求
   */
  reqTreeData = () => {
    Ajax({
      url: `/nccloud/platform/appregister/querymenuitemstree.do`,
      info: {
        name: "应用注册模块",
        action: "查询"
      },
      success: ({ data }) => {
        if (data.success && data.data.length > 0) {
          this.setState({
            treeDataArray: data.data
          });
        }
      }
    });
  };
  //树点击事件的汇总
  onSelect = (typeSelect, key, e) => {
    switch (typeSelect) {
      case "systemOnselect":
        this.onSelectQuery(key, e);
        break;
      case "templateOnselect":
        this.onTemSelect(key, e);
        break;
      default:
        break;
    }
  };
  //树组件的封装
  treeResAndUser = (data, typeSelect, hideSearch) => {
    const {
      expandedKeys,
      autoExpandParent,
      selectedKeys,
      searchValue
    } = this.state;
    const loop = data => {
      return data.map(item => {
        let { code, name, pk } = item;
        if (code === "00") {
          text = `${name}`;
        }
        let text = `${code} ${name}`;
        const index = text.indexOf(searchValue);
        const beforeStr = text.substr(0, index);
        const afterStr = text.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: "#f50" }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <div>
              <span> {text} </span>
            </div>
          );
        if (item.children) {
          return (
            <TreeNode key={pk} title={title} refData={item}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={pk} title={title} refData={item} />;
      });
    };
    return (
      <div>
        {hideSearch ? (
          ""
        ) : (
          <Search
            style={{ marginBottom: 8 }}
            placeholder="Search"
            onChange={this.onChange}
          />
        )}
        {data.length > 0 && (
          <Tree
            showLine
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            onSelect={(key, node) => {
              this.onSelect(typeSelect, key, node);
            }}
            autoExpandParent={autoExpandParent}
            selectedKeys={selectedKeys}
          >
            {loop(data)}
          </Tree>
        )}
      </div>
    );
  };
  //预览摸态框显示方法
  setModalVisibel = visibel => {
    this.setState({ batchSettingModalVisibel: visibel });
  };
  //分配摸态框显示方法
  setAssignModalVisible = visibel => {
    this.setState({ alloVisible: visibel });
  };
  render() {
    const {
      treeData,
      treeTemBillData,
      treeTemQueryData,
      templateNameVal,
      visible,
      alloVisible,
      pageCode,
      org_df_biz,
      activeKey,
      templatePks,
      batchSettingModalVisibel,
      appCode,
      treeDataArray
    } = this.state;
    const leftTreeData = [
      {
        code: "00",
        name: "应用节点",
        pk: "",
        children: createTree(treeDataArray, "code", "pid")
      }
    ];
    return (
      <PageLayout
        className="nc-workbench-templateSetting"
        header={
          <PageLayoutHeader>
            <div>模板设置-集团</div>
            <div className="buttons-component">
              {(treeTemBillData.length > 0 || treeTemQueryData.length > 0) &&
                Btns.map((item, index) => {
                  item = this.setBtnsShow(item);
                  return this.creatBtn(item);
                })}
              {treeTemBillData.length > 0 && (
                <Dropdown overlay={this.menuFun()} trigger={["click"]}>
                  <Button key="" className="margin-left-10" type="primary">
                    设置默认模板
                  </Button>
                </Dropdown>
              )}
            </div>
          </PageLayoutHeader>
        }
      >
        <PageLayoutLeft
          width={280}
          height={"100%"}
          style={{
            background: "#fff",
            width: "500px",
            minHeight: "calc(100vh - 64px - 48px)",
            height: `${this.state.siderHeight}px`,
            overflowY: "auto",
            padding: "20px"
          }}
        >
          {this.treeResAndUser(leftTreeData, "systemOnselect")}
        </PageLayoutLeft>
        <PageLayoutRight>
          <Tabs
            defaultActiveKey="1"
            onChange={activeKey => {
              this.setState({ activeKey });
            }}
            type="card"
            activeKey={activeKey}
          >
            <TabPane tab="页面模板" key="1">
              {treeTemBillData.length > 0 &&
                this.treeResAndUser(
                  treeTemBillData,
                  "templateOnselect",
                  "hideSearch"
                )}
            </TabPane>
            <TabPane tab="查询模板" key="2">
              {treeTemQueryData.length > 0 &&
                this.treeResAndUser(
                  treeTemQueryData,
                  "templateOnselect",
                  "hideSearch"
                )}
            </TabPane>
            <TabPane tab="打印模板" key="3">
              <div>
                <p>1111111111</p>
                <p>2222222222</p>
                <p>3333333333</p>
                <p>44444444444</p>
              </div>
            </TabPane>
          </Tabs>
        </PageLayoutRight>
        {batchSettingModalVisibel && (
          <PreviewModal
            templetid={templatePks}
            batchSettingModalVisibel={batchSettingModalVisibel}
            setModalVisibel={this.setModalVisibel}
          />
        )}
        <Modal
          title="请录入正确的模板名称和标题"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div className="copyTemplate">
            <Input
              value={templateNameVal}
              onChange={e => {
                const templateNameVal = e.target.value;
                this.setState({
                  templateNameVal
                });
              }}
            />
          </div>
        </Modal>
        {alloVisible && (
          <AssignComponent
            templatePks={templatePks}
            alloVisible={alloVisible}
            setAssignModalVisible={this.setAssignModalVisible}
            pageCode={pageCode}
            activeKey={activeKey}
            appCode={appCode}
          />
        )}
      </PageLayout>
    );
  }
}
export default TemplateSetting;
