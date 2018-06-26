import React, { Component } from "react";
import { Row, Col } from "antd";
class InfoForm extends Component {
  constructor(props) {
    super(props);
  }
  handleClick = infoType => {
    this.props.infoSetting(infoType);
  };
  render() {
    return (
      <div className="userinfo-container">
        <Row className="userinfo-item userinfo-name">
          <span>用户名</span>
        </Row>
        <Row className="userinfo-item">
          <Col className="userinfo-item-label" span={6}>
            <label>密码:</label>
          </Col>
          <Col className="userinfo-item-content" span={12}>
            <span>******</span>
            <span
              onClick={() => {
                this.handleClick("0");
              }}
            >
              设置
            </span>
          </Col>
        </Row>
        <Row className="userinfo-item">
          <Col className="userinfo-item-label" span={6}>
            <label>手机:</label>
          </Col>
          <Col className="userinfo-item-content" span={12}>
            <div>
              <i className="iconfont icon-jinggao" />
              <span>未设置</span>
            </div>
            <span
              onClick={() => {
                this.handleClick("1");
              }}
            >
              设置
            </span>
          </Col>
        </Row>
        <Row className="userinfo-item">
          <Col className="userinfo-item-label" span={6}>
            <label>邮箱:</label>
          </Col>
          <Col className="userinfo-item-content" span={12}>
            <div>
              <i className="iconfont icon-jinggao" />
              <span>未设置</span>
            </div>
            <span
              onClick={() => {
                this.handleClick("2");
              }}
            >
              设置
            </span>
          </Col>
        </Row>
      </div>
    );
  }
}
export default InfoForm;