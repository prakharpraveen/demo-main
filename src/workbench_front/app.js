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
 * @param {String} appcode - 应用编码
 * @param {String} appid - 应用主键
 * @param {String} pagecode - 应用编码
 * @param {Object} win -  新页面 window
 * @param {String} query - 需要传递的参数
 * @param {Object} appInfo - 应用信息
 */
const openApp = (win, appcode, appid, pagecode, type, query, appInfo) => {
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
    appcode === "102202APP" ||
    appcode === "102202MENU" ||
    appcode === "1022PREGI" ||
    appcode === "10180TM" ||
    appcode === "10181TM" ||
    appcode === "101818AM"
  ) {
    type = "own";
  }
  b4 = encodeURIComponent(encodeURIComponent(b4));
  b3 = encodeURIComponent(encodeURIComponent(b3));
  b2 = encodeURIComponent(encodeURIComponent(b2));
  b1 = encodeURIComponent(encodeURIComponent(b1));
  appcode = encodeURIComponent(encodeURIComponent(appcode));
  pagecode = encodeURIComponent(encodeURIComponent(pagecode));
  appid = encodeURIComponent(encodeURIComponent(appid));
  // 面包屑信息及应用编码
  let breadcrumbInfo = `&c=${appcode}&p=${pagecode}&ar=${appid}&n=${b4}&b1=${b1}&b2=${b2}&b3=${b3}`;
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
   * @param {Object} appOption - 应用对象
   * @param {String} type - 打开类型 current - 当前页面打开
   * @param {String} query - 需要传递的参数
   */
  openNewApp = (appOption, type, query) => {
    let win;
    if (type !== "current") {
      win = window.open("", "_blank");
    }
    let { appcode, appid, menuitemcode } = appOption;
    Ajax({
      url: `/nccloud/platform/appregister/openapp.do`,
      info: {
        name: "工作桌面",
        action: "权限校验"
      },
      data: {
        appcode,
        menucode: menuitemcode
      },
      success: ({ data: { data } }) => {
        if (data) {
          // if (!data.is_haspower) {
          //   Notice({
          //     status: "error",
          //     msg: data.hint_message
          //   });
          //   win.close();
          //   return;
          // }
          if (data.pageurl && data.pageurl.length > 0) {
            // 应用菜单名
            window.peData.nodeName = data.menu;
            // 应用编码
            window.peData.nodeCode = appcode;
            // 打开应用
            proxyAction(openApp, this, "打开应用")(
              win,
              appcode,
              appid,
              data.pagecode,
              type,
              query,
              data
            );
          } else {
            win.close();
            Notice({
              status: "error",
              msg: "请确认当前应用是否设置默认页面！"
            });
            return;
          }
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
    window.openNew = (appOption, type, query) => {
      if (typeof appOption === "object") {
        this.openNewApp(appOption, type, query);
      }
    };
    /**
     * 跳转检查
     * 调用此方法去修改URL地址时需要encodeURIComponent两次
     * 获取URL参数时需要decodeURIComponent两次
     * @param {String|undefined|null} appcode - 应用编码 值为""/undefined/null 则不会校验权限  需要工作台容器
     * @param {Function} callback - 检查之后的回调
     * @param {String} tab - 新页签
     */
    window.openCheck = (appcode, callback, type) => {
      let win = window;
      // 新页签跳转
      if (type === "tab") {
        win = window.open("", "_blank");
      }
      // 需要校验权限
      if (appcode && appcode.length) {
        Ajax({
          url: `/nccloud/platform/appregister/openapp.do`,
          info: {
            name: "工作桌面",
            action: "权限校验"
          },
          data: {
            appcode
          },
          success: ({ data }) => {
            if (data.data && data.data.is_haspower) {
              // 应用菜单名
              window.peData.nodeName = data.data.menu;
              // 应用编码
              window.peData.nodeCode = appcode;
              /**
               * 校验回调
               * @param {Object} win - 窗口对象
               * @param {Object} data - 检验之后的参数
               */
              proxyAction(callback, this, "打开应用")(win, data);
            } else {
              Notice({
                status: "error",
                msg: data.data.hint_message
              });
              win.close();
              return;
            }
          }
        });
      } else {
        // 不需要校验跳转权限且需要工作台容器
        /**
         * 校验回调
         * @param {Object} win - 窗口对象
         */
        callback(win);
      }
    };
    /////////////////////////////////////////////////////////////
    // 已经弃用
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
    ////////////////////////////////////////////////////////////////
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
