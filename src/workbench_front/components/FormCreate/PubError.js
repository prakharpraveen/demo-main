import React, { Component } from "react";
import { Tooltip } from "antd";
/**
 * 表格编辑单元格 - String类型
 */

export default (WrappedComponent)=>{
    class PubError extends Component {
        constructor(props) {
            super(props);
            this.state = {
                hasError: false,
                visible: false,
                cellErrorMsg: "不能为空！"
            };
        }
        handleMouseOver = () => {
            this.setState({ visible: true });
        };
        handleMouseOut = () => {
            this.setState({ visible: false });
        };
        render() {
            let { value,onChange } = this.props;
            console.log(this.props);
            return (
                <WrappedComponent/>
            );
        }
    }
    return PubError;
};
// onPressEnter={this.handlePressEnter}
// onBlur={this.handleBlur}