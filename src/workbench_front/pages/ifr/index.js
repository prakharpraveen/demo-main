import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { initIfrData, clearData } from "Store/ifr/action";
import { GetQuery } from "Pub/js/utils";
/**
 * 工作桌面各个应用挂载页面 统一通过 iframe 方式进行加载
 */
class Ifr extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // 为新页签打开的页面设置全局的peData对象
    //  n 为 nodeName c 为 nodeCode
    // if (this.props.location) {
    //   let { n, c } = GetQuery(this.props.location.search);
    //   if (n && c) {
    //     window.peData.nodeName = decodeURIComponent(n);
    //     window.peData.nodeCode = decodeURIComponent(c);
    //   }
    // }
  }

  render() {
    // let { ifrID, ifrName } = this.props.ifrData;
    let { ifr } = GetQuery(this.props.location.search);
    // let queryUrl;
    ifr = decodeURIComponent(decodeURIComponent(ifr));
    // if (ifr.indexOf("#") === -1 || ifr.indexOf("=") === -1) {
    //   queryUrl = `${ifr}?ar=${ar}&c=${c}`;
    // } else {
    //   queryUrl = `${ifr}&ar=${ar}&c=${c}`;
    // }
    return (
      <div className="nc-workbench-iframe">
        <iframe
          field="main-iframe"
          fieldname="主框架"
          id="mainiframe"
          src={ifr}
          frameBorder="0"
          scrolling="yes"
        />
      </div>
    );
  }
}
Ifr.propTypes = {
  ifrData: PropTypes.object.isRequired,
  initIfrData: PropTypes.func.isRequired,
  clearData: PropTypes.func.isRequired
};
export default connect(
  state => {
    return {
      ifrData: state.ifrData
    };
  },
  {
    initIfrData,
    clearData
  }
)(Ifr);
