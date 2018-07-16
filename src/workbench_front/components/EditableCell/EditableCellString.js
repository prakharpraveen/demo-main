import React, { Component } from "react";
import { Input, Icon, Tooltip } from "antd";
import { cellNonempty } from "./Util";
/**
 * 表格编辑单元格 - String类型
 */
class EditableCellString extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            visible: false
        };
    }
    /**
     * 值改变
     */
    handleChange = e => {
        let value = e.target.value;
        const { cellChange, cellKey, cellIndex, cellRequired } = this.props;
        if (cellRequired) {
            if (cellNonempty(value)) {
                this.setState({ hasError: false });
            } else {
                this.setState({ hasError: true });
            }
        }
        cellChange(cellKey, cellIndex, value);
    };
    /**
     * 回车事件
     */
    handlePressEnter = () => {
        const {
            value,
            cellRequired,
            setCellEdit,
            cellCheck,
            cellKey,
            cellIndex
        } = this.props;
        if (cellRequired) {
            if (cellCheck) {
                if (cellCheck(cellKey, cellIndex, value)) {
                    this.setState({ hasError: false });
                    setCellEdit(false);
                } else {
                    this.setState({ hasError: true });
                    setCellEdit(true);
                }
            } else {
                if (cellNonempty(value)) {
                    this.setState({ hasError: false });
                    setCellEdit(false);
                } else {
                    this.setState({ hasError: true });
                    setCellEdit(true);
                }
            }
        } else {
            setCellEdit(false);
        }
    };
    /**
     * 鼠标移出事件
     */
    handleBlur = () => {
        const {
            value,
            cellRequired,
            setCellEdit,
            cellKey,
            cellIndex,
            cellCheck
        } = this.props;
        if (cellRequired) {
            if (cellCheck) {
                if (cellCheck(cellKey, cellIndex, value)) {
                    this.setState({ hasError: false });
                    setCellEdit(false);
                } else {
                    this.setState({ hasError: true });
                    setCellEdit(true);
                }
            } else {
                if (cellNonempty(value)) {
                    this.setState({ hasError: false });
                    setCellEdit(false);
                } else {
                    this.setState({ hasError: true });
                    setCellEdit(true);
                }
            }
        } else {
            setCellEdit(false);
        }
    };

    handleMouseOver = () => {
        this.setState({ visible: true });
    };
    handleMouseOut = () => {
        this.setState({ visible: false });
    };
    render() {
        let {
            cellChange,
            cellKey,
            cellIndex,
            value,
            cellErrorMsg
        } = this.props;
        // const suffix = value ? (
        //     <Icon
        //         type="close-circle"
        //         onClick={() => {
        //             cellChange(cellKey, cellIndex, "");
        //         }}
        //     />
        // ) : null;
        if (!cellErrorMsg) {
            cellErrorMsg = "不能为空！";
        }
        return (
            <div
                className={this.state.hasError ? "has-error" : ""}
                onMouseOut={this.handleMouseOut}
                onMouseOver={this.handleMouseOver}
            >
                <Tooltip
                    placement="topRight"
                    visible={this.state.hasError && this.state.visible}
                    title={cellErrorMsg}
                >
                    {/* <Input
                        suffix={suffix}
                        value={value}
                        onChange={this.handleChange}
                        onPressEnter={this.handlePressEnter}
                        onBlur={this.handleBlur}
                    /> */}
                    <Input
                        autoFocus = {true}
                        value={value}
                        onChange={this.handleChange}
                        onPressEnter={this.handlePressEnter}
                        onBlur={this.handleBlur}
                    />
                </Tooltip>
            </div>
        );
    }
}
export default EditableCellString;
