import React, { Component } from "react";
import { Input, Select, Checkbox, Button } from "antd";
import _ from "lodash";
const Option = Select.Option;
// 可编辑表格input
export class EditableCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.value };
    }
    handleChange = e => {
        const value = e.target.value;
        this.setState({ value });
    };
    updateCellInTable = () => {
        this.props.onChange(this.state.value);
    };
    onPressEnter = () => {
        this[`input`].blur();
    };
    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {},
            thisState = this.state || {};
        if (this.props.value !== nextProps.value) {
            return true;
        }
        if (this.state.value !== nextState.value) {
            return true;
        }
        return false;
    }
    render() {
        const { value } = this.state;
        return (
            <Input
                size="small"
                value={value}
                onChange={this.handleChange}
                onBlur={e => {
                    this.updateCellInTable();
                }}
                ref={input => (this[`input`] = input)}
                onPressEnter={e => {
                    this.onPressEnter(e.target.value);
                }}
            />
        );
    }
}
// 可编辑一纵列单元格
export class EditAllCell extends React.Component {
    constructor(props) {
        super(props);
    }
    handleClick = e => {
        this.props.onChange("6666");
    };
    render() {
        return (
            <div className="custom-filter-dropdown">
            <Input size="small" ref={`customInput`} />
            <Button
                type="primary"
                onClick={this.handleClick}
            >
                确定
            </Button>
            <Button>取消</Button>
        </div>
        );
    }
}
// 可编辑表格复选框
export class EditableCheck extends React.Component {
    constructor(props) {
        super(props);
    }
    handleChange = e => {
        this.props.onChange(e.target.checked);
    };
    render() {
        const { value } = this.props;
        return (
            <Checkbox checked={Boolean(value)} onChange={this.handleChange} />
        );
    }
}
//批量设置查询区
export class SelectCell extends Component {
    constructor(props) {
        super(props);
    }
    handleSelectChange = value => {
        this.props.onChange(value);
    };
    render() {
        const { selectValue, selectObj, property } = this.props;
        return (
            <Select
                value={
                    _.isEmpty(selectValue) ? selectObj[0].value : selectValue
                }
                onChange={value => {
                    this.handleSelectChange(value);
                }}
                style={{ width: 176 }}
                size={"small"}
            >
                {(() => {
                    if (property === "color") {
                        return selectObj.map((c, index) => {
                            return (
                                <Option key={index} value={c.value}>
                                    <span className="template-setting-color-select">
                                        <span>{c.name}</span>
                                        <span
                                            className="color-select-color"
                                            style={{ backgroundColor: c.value }}
                                        />
                                    </span>
                                </Option>
                            );
                        });
                    } else {
                        return selectObj.map((c, index) => {
                            return (
                                <Option key={index} value={c.value}>
                                    {c.name}
                                </Option>
                            );
                        });
                    }
                })()}
            </Select>
        );
    }
}
