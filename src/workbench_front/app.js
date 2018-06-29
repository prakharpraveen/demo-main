import "babel-polyfill";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import PropTypes from "prop-types";
import Ajax from "Pub/js/ajax";
import $NCPE from "Pub/js/pe";
import { initAppData } from "Store/appStore/action";
import store from "./store";
import Routes from "./routes";
import Notice from "Components/Notice";
import moment from "moment";
import { CreateQuery } from "Pub/js/utils.js";
import "moment/locale/zh-cn";
import "Assets/iconfont/iconfont.js";
import "Pub/css/public.less";
import "./theme/theme.less";
moment.locale("zh-cn");
window.proxyAction = $NCPE.proxyAction;
/**
 * 应用打开
 * @param {String} code - 应用编码
 * @param {Object} win -  新页面 window
 * @param {String} query - 需要传递的参数
 * @param {Object} appInfo - 应用信息
 */
const openApp = (win, code, type, query, appInfo) => {
  /**
   * 应用信息
   * pageurl 页面url 地址
   * field 领域
   * module 模块
   * menuclass 菜单分类
   * menu 菜单
   */
  let { pageurl, menu: b4, menuclass: b3, module: b2, field: b1 } = appInfo;
  if (
    code === "102202APP" ||
    code === "102202MENU" ||
    code === "1022PREGI" ||
    code === "10180TM" ||
    code === "10181TM"
  ) {
    type = "own";
  }
  b4 = encodeURIComponent(encodeURIComponent(b4));
  b3 = encodeURIComponent(encodeURIComponent(b3));
  b2 = encodeURIComponent(encodeURIComponent(b2));
  b1 = encodeURIComponent(encodeURIComponent(b1));
  code = encodeURIComponent(encodeURIComponent(code));
  // 面包屑信息及应用编码
  let breadcrumbInfo = `&c=${code}&n=${b4}&b1=${b1}&b2=${b2}&b3=${b3}`;
  // 将参数对象转换成url参数字符串
  if (query) {
    /**
     * defParam 首字符为 &
     * searchParam 首字符为 ？
     */
    let { defParam, searchParam } = CreateQuery(query);
    if (type !== "own") {
      // 当前 URI中 包含 ？ 或者 # 和 = 时原始url+默认参数
      if (
        pageurl.indexOf("?") != -1 ||
        (pageurl.indexOf("#") != -1 && pageurl.indexOf("=") != -1)
      ) {
        pageurl = pageurl + defParam;
      }
      // 当前 URI 中不包含 ？ 或者 包含 # 但不含等号 或者不包含 #
      if (
        (pageurl.indexOf("?") === -1 && pageurl.indexOf("=") === -1) ||
        (pageurl.indexOf("#") !== -1 && pageurl.indexOf("=") === -1) ||
        (pageurl.indexOf("#") === -1 && pageurl.indexOf("=") === -1)
      ) {
        pageurl = pageurl + searchParam;
      }
      pageurl = encodeURIComponent(encodeURIComponent(pageurl));
    } else {
      // workbench 单页路由传参需要单独处理
      pageurl = pageurl + searchParam;
    }
  } else {
    if (type !== "own") {
      pageurl = encodeURIComponent(encodeURIComponent(pageurl + "?"));
    } else {
      pageurl = pageurl + "?";
    }
  }
  if (win) {
    if (type !== "own") {
      // 浏览器新页签打开业务组应用
      win.location = `#/ifr?ifr=${pageurl}${breadcrumbInfo}`;
      win.focus();
    } else {
      // 浏览器新页签打开workbench自有应用
      win.location = `#/${pageurl}${breadcrumbInfo}`;
      win.focus();
    }
  } else {
    if (type !== "own") {
      // 浏览器当前页打开
      window.location.hash = `#/ifr?ifr=${pageurl}${breadcrumbInfo}`;
    } else {
      window.location.hash = `#/${pageurl}${breadcrumbInfo}`;
    }
  }
};
class App extends Component {
  constructor(props) {
    super(props);
  }
  /**
   * 打开应用
   * @param {String} code - 应用编码
   * @param {String} type - 打开类型 current - 当前页面打开
   * @param {String} query - 需要传递的参数
   */
  openNewApp = (code, type, query) => {
    let win;
    if (type !== "current") {
      win = window.open("", "_blank");
    }
    Ajax({
      url: `/nccloud/platform/appregister/openapp.do`,
      info: {
        name: "工作桌面",
        action: "权限校验"
      },
      data: {
        appcode: code
      },
      success: ({ data: { data } }) => {
        if (data && data.pageurl) {
          // 应用菜单名
          window.peData.nodeName = data.menu;
          // 应用编码
          window.peData.nodeCode = code;
          // 打开应用
          proxyAction(openApp, this, "打开应用")(win, code, type, query, data);
        } else {
          win.close();
          Notice({
            status: "error",
            msg: "请确认当前应用是否设置默认页面！"
          });
          return;
        }
      }
    });
  };
  componentWillMount() {
    /**
     * 为spr统计提供基本信息
     */
    window.peData = {
      userID: "xxx",
      projectCode: "nccloud"
    };
    /**
     * 在新页签中打开
     * @param　{Object} appOption // 应用 描述信息 name 和 code 及 pk_appregister
     * @param　{String} type // current - 浏览器新页签打开 不传参数在当前页打开
     * @param {String} query - 需要传递的参数 需要字符串拼接 如 &a=1&b=2
     */
    window.openNew = (code, type, query) => {
      if (typeof code === "object") {
        if (code.appcode) {
          code = code.appcode;
        } else {
          code = code.code;
        }
      }
      this.openNewApp(code, type, query);
    };
    /**
     * 当前页打开新页面 不做应用校验
     * @param {String} url  目标页面 url 地址
     * @param {Object} object 需要传递的参数对象 非必输
     */
    window.openNewPage = (url, object) => {
      if (object) {
        /**
         * defParam 首字符为 &
         * searchParam 首字符为 ？
         */
        let { defParam, searchParam } = CreateQuery(query);
        window.location.hash = `#/ifr?ifr=${encodeURIComponent(
          encodeURIComponent(url + searchParam)
        )}`;
      } else {
        window.location.hash = `#/ifr?ifr=${encodeURIComponent(
          encodeURIComponent(url)
        )}`;
      }
    };
  }
  componentDidMount() {
    // 模拟数据，应该在此处进行数据请求，返回用户初始信息
    let data = {
      lang: "zh-CN",
      userInfo: "小明"
    };
    this.props.initAppData(data);
    Ajax({
      url: `/nccloud/platform/gzip/switch.do`,
      switchKey: true,
      info: {
        name: "流量压缩开关",
        action: "查询"
      },
      success: res => {
        let { success, data } = res.data;
        if (success && data) {
          sessionStorage.setItem("gzip", data ? 1 : 0);
        }
      }
    });
  }
  render() {
    return <Routes />;
  }
}
App.propTypes = {
  initAppData: PropTypes.func.isRequired
};
const AppStore = connect(
  state => ({ ifrData: state.ifrData }),
  {
    initAppData
  }
)(App);
ReactDOM.render(
  <Provider store={store}>
    <AppStore />
  </Provider>,
  document.querySelector("#ncc")
);
