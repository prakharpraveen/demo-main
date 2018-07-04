import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "lodash";
import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutLeft,
  PageLayoutRight
} from "Components/PageLayout";
import Ajax from "Pub/js/ajax.js";
import { GetQuery, Pad } from "Pub/js/utils.js";
import TreeSearch from "./TreeSearch";
import {
  FormCreate,
  dataTransfer,
  dataRestore,
  dataCheck
} from "Components/FormCreate";
import ButtonCreate from "Components/ButtonCreate";
import Notice from "Components/Notice";
import "./index.less";
class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      mt: "",
      mn: "",
      parentKey: "",
      isedit: false,
      isNew: false,
      treeData: [],
      fields: {}
    };
    this.newFormData = {
      menuitemcode: "",
      menuitemname: "",
      appcodeRef: {},
      resid: ""
    };
    this.historyData;
  }
  handleBtnClick = key => {
    switch (key) {
      case "add":
        this.add();
        break;
      case "edit":
        this.setState({ isedit: true });
        break;
      case "save":
        this.save();
        break;
      case "cancle":
        if (this.state.isNew) {
          this.historyData = dataTransfer(this.newFormData);
        }
        this.setState({
          isedit: false,
          isNew: false,
          fields: { ...this.historyData }
        });
        break;
      case "del":
        this.del();
        break;
      default:
        break;
    }
  };
  add = () => {
    let fields = dataRestore(this.state.fields);
    let newCode;
    if (this.state.parentKey === "" || this.state.parentKey === "00") {
      let treeArrayData = this.state.treeData.filter(
        item => item.menuitemcode.length === 2
      );
      newCode = `${treeArrayData[treeArrayData.length - 1]["menuitemcode"] -
        0 +
        1}`;
    } else {
      let fieldsChildren = fields.children;
      if (!fieldsChildren || fieldsChildren.length === 0) {
        let fieldsItem = fields;
        newCode = fieldsItem["menuitemcode"]
          ? fieldsItem["menuitemcode"] + "01"
          : "01";
      } else {
        newCode = `${fieldsChildren[fieldsChildren.length - 1]["menuitemcode"] -
          0 +
          1}`;
        newCode = Pad(
          newCode,
          fieldsChildren[fieldsChildren.length - 1]["menuitemcode"].length
        );
      }
    }
    this.setState({
      isedit: true,
      isNew: true,
      fields: dataTransfer({
        pk_menu: this.state.id,
        menuitemcode: newCode,
        menuitemname: "",
        menudes: "",
        resid: "",
        appcodeRef: {
          refcode: "",
          refname: "",
          refpk: ""
        }
      })
    });
  };
  save = () => {
    let { fields, isNew, parentKey } = this.state;
    if (dataCheck(fields)) {
      Notice({
        status: "warning",
        msg: "请将必输项输入完整！"
      });
      return;
    }
    fields = dataRestore(fields);
    let {
      appcodeRef,
      pk_menuitem,
      menuitemcode,
      menuitemname,
      menudes,
      pk_menu,
      parentcode,
      resid
    } = fields;
    let resData, urlData;
    if (isNew) {
      if (parentKey === "" || parentKey === "00") {
        resData = {
          menuitemcode,
          menuitemname,
          menudes,
          pk_menu,
          resid
        };
      } else {
        resData = {
          menuitemcode,
          menuitemname,
          menudes,
          pk_menu,
          parentcode: parentKey,
          resid
        };
      }
      urlData = `/nccloud/platform/appregister/insertappmenuitem.do`;
      if (fields.appcodeRef) {
        resData.appcode = appcodeRef.refcode;
        resData.appid = appcodeRef.refpk;
      }
    } else {
      urlData = `/nccloud/platform/appregister/editappmenuitem.do`;
      resData = {
        pk_menuitem,
        menuitemcode,
        menuitemname,
        menudes,
        pk_menu,
        parentcode,
        resid
      };
      if (fields.appcodeRef) {
        resData.appcode = appcodeRef.refcode;
        resData.appid = appcodeRef.refpk;
      }
    }
    Ajax({
      url: urlData,
      data: resData,
      info: {
        name: "菜单注册菜单项",
        action: "保存"
      },
      success: res => {
        let { success, data } = res.data;
        if (success && data) {
          let treeData = [...this.state.treeData];
          if (isNew) {
            treeData = _.concat(treeData, data);
          } else {
            let dataIndex = _.findIndex(
              treeData,
              item => item.pk_menuitem === fields.pk_menuitem
            );
            treeData[dataIndex] = fields;
          }
          this.setState({
            isedit: false,
            isNew: false,
            treeData,
            fields: dataTransfer(data)
          });
          Notice({
            status: "success",
            msg: data.true
          });
        } else {
          Notice({
            status: "error",
            msg: data.false
          });
        }
      }
    });
  };
  del = () => {
    let fields = this.state.fields;
    fields = dataRestore(fields);
    if (fields.children) {
      Notice({
        status: "warning",
        msg: "不是叶子节点不能删除！"
      });
      return;
    }
    Ajax({
      url: `/nccloud/platform/appregister/deleteappmenuitem.do`,
      data: {
        pk_menuitem: fields.pk_menuitem
      },
      info: {
        name: "菜单注册菜单项",
        action: "删除"
      },
      success: res => {
        let { success, data } = res.data;
        if (success && data) {
          let treeData = this.state.treeData;
          _.remove(treeData, item => item.pk_menuitem === fields.pk_menuitem);
          this.setState({
            isedit: false,
            isNew: false,
            treeData,
            parentKey: ""
          });
          Notice({
            status: "success",
            msg: data.true
          });
        } else {
          Notice({
            status: "error",
            msg: data.false
          });
        }
      }
    });
  };
  handleSearch = (value, callback) => {
    Ajax({
      url: `/nccloud/platform/appregister/searchappmenuitem.do`,
      data: {
        search_content: value,
        pk_menu: this.state.id
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
              treeData: data
            },
            () => {
              callback(data);
            }
          );
        }
      }
    });
  };
  handleSelect = selectedKey => {
    if (selectedKey === "00" || selectedKey === undefined) {
      this.setState({
        isedit: false,
        isNew: false,
        parentKey: selectedKey ? selectedKey : "",
        fields: dataTransfer(this.newFormData)
      });
      return;
    }
    let treeData = this.state.treeData;
    let treeItem = treeData.find(item => item.menuitemcode === selectedKey);
    treeItem = dataTransfer(treeItem);
    this.historyData = { ...treeItem };
    this.setState({
      isedit: false,
      parentKey: selectedKey,
      fields: { ...treeItem }
    });
  };
  /**
   * 表单任一字段值改变操作
   * @param {String|Object} changedFields 改变的字段及值
   */
  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields }
    }));
  };
  componentWillMount() {
    let { id, mn, mt } = GetQuery(this.props.location.search);
    this.setState({ id, mn: mn && mn != "null" ? mn : "", mt: mt - 0 });
  }
  componentDidMount() {
    Ajax({
      url: `/nccloud/platform/appregister/queryappmenus.do`,
      data: {
        pk_menu: this.state.id
      },
      info: {
        name: "菜单项",
        action: "查询应用树"
      },
      success: res => {
        let { success, data } = res.data;
        if (success && data) {
          this.setState({
            treeData: data
          });
        }
      }
    });
  }

  render() {
    let { treeData, mn, mt, isedit, isNew, fields } = this.state;
    let menuFormData = [
      {
        code: "menuitemcode",
        type: "string",
        label: "菜单项编码",
        isRequired: true,
        isedit: isedit,
        xs: 24,
        md: 12,
        lg: 12
      },
      {
        code: "menuitemname",
        type: "string",
        label: "菜单项名称",
        isRequired: true,
        isedit: isedit,
        xs: 24,
        md: 12,
        lg: 12
      },
      {
        type: "refer",
        code: "appcodeRef",
        label: "关联应用编码",
        options: {
          placeholder: "应用编码",
          refName: "关联应用编码",
          refCode: "appcodeRef",
          refType: "tree",
          isTreelazyLoad: false,
          onlyLeafCanSelect: true,
          queryTreeUrl: "/nccloud/platform/appregister/appregref.do",
          onChange: val => {
            console.log(val);
            // this.setFieldsValue({ cont: val });
          },
          disabled:
            this.state.fields.menuitemcode &&
            this.state.fields.menuitemcode.value.length < 8 &&
            isedit,
          columnConfig: [
            {
              name: ["编码", "名称"],
              code: ["refcode", "refname"]
            }
          ],
          isMultiSelectedEnabled: false
        },
        isedit: isedit,
        xs: 24,
        md: 12,
        lg: 12
      },
      {
        code: "resid",
        type: "string",
        label: "多语字段",
        isRequired: false,
        isedit: isedit,
        xs: 24,
        md: 12,
        lg: 12
      }
    ];
    let btnList = [
      {
        name: "新增",
        code: "add",
        type: "primary",
        isshow:
          ((fields.menuitemcode && fields.menuitemcode.value.length < 8) ||
            this.state.parentKey === "" ||
            this.state.parentKey === "00") &&
          !isedit &&
          !mt
      },
      {
        name: "修改",
        code: "edit",
        type: "primary",
        isshow:
          this.state.parentKey !== "" &&
          this.state.parentKey !== "00" &&
          !isedit &&
          !mt
      },
      {
        name: "删除",
        code: "del",
        type: "primary",
        isshow:
          this.state.parentKey !== "" &&
          this.state.parentKey !== "00" &&
          !isedit &&
          !mt
      },
      {
        name: "保存",
        code: "save",
        type: "primary",
        isshow: isedit
      },
      {
        name: "取消",
        code: "cancle",
        type: "",
        isshow: isedit
      }
    ];
    return (
      <PageLayout
        header={
          <PageLayoutHeader>
            <div>{mn}</div>
            <ButtonCreate dataSource={btnList} onClick={this.handleBtnClick} />
          </PageLayoutHeader>
        }
        className="nc-workbench-menuitem"
      >
        <PageLayoutLeft>
          <TreeSearch
            onSelect={this.handleSelect}
            onSearch={this.handleSearch}
            dataSource={treeData}
          />
        </PageLayoutLeft>
        <PageLayoutRight>
          <div className="nc-workbench-menuitem-form">
            {(this.state.parentKey === "" || this.state.parentKey === "00") &&
            !isNew ? (
              ""
            ) : (
              <FormCreate
                formData={menuFormData}
                fields={fields}
                onChange={this.handleFormChange}
              />
            )}
          </div>
        </PageLayoutRight>
      </PageLayout>
    );
  }
}
MenuItem.propTypes = {
  menuItemData: PropTypes.object.isRequired
};
export default connect(
  state => {
    return {
      menuItemData: state.menuRegisterData.menuItemData
    };
  },
  {}
)(MenuItem);
