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

  render() {
    let { ifr } = GetQuery(this.props.location.search);
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
