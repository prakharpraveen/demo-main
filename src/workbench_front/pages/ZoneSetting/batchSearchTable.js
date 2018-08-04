import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Input, Button, Icon, Dropdown, Popover } from "antd";
import _ from "lodash";
import * as utilService from "./utilService";
import {
    EditableCell,
    EditableCheck,
    SelectCell,
    EditAllCell
} from "./editableCell";
// const menu = (

// );
const batchSearchTableData = [
    {
        title: "显示名称",
        property: "label",
        type: "input",
        width: 150
    },
    {
        title: "非元数据条件",
        property: "isnotmeta",
        type: "checkbox",
        width: 50
    },
    {
        title: "显示类型",
        property: "showtype",
        type: "select",
        width: 50,
        selectObj: utilService.showType
    }
];
//批量设置查询区
export default class BatchSearchTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [];
        this.state = {
            wholeColEditStr: ""
        };
        _.forEach(batchSearchTableData, (data, index) => {
            let tmpColData = {
                title: (
                    <Popover
                        overlayClassName="all-apps-popover2333"
                        getPopupContainer={() => {
                            return document.querySelector(
                                ".zonesetting-batch-setting-modal"
                            );
                        }}
                        content={
                            <EditAllCell
                                property={data.property}
                                onChange={this.onAllColCellChange(
                                    data.property
                                )}
                            />
                        }
                        placement="bottomLeft"
                        trigger="click"
                    >
                        {data.title} <Icon type="down" />
                    </Popover>
                ),
                dataIndex: data.property,
                width: data.width
            };
            switch (data.type) {
                case "input":
                    tmpColData.render = (text, record, index) => {
                        return (
                            <EditableCell
                                value={text}
                                property={data.property}
                                onChange={this.onCellChange(
                                    index,
                                    data.property
                                )}
                            />
                        );
                    };
                    break;
                case "checkbox":
                    tmpColData.render = (text, record, index) => {
                        return (
                            <EditableCheck
                                value={text}
                                property={data.property}
                                onChange={this.onCellChange(
                                    index,
                                    data.property
                                )}
                            />
                        );
                    };
                    break;
                case "select":
                    tmpColData.render = (text, record, index) => {
                        return (
                            <SelectCell
                                selectValue={text}
                                property={data.property}
                                selectObj={data.selectObj}
                                onChange={this.onCellChange(
                                    index,
                                    data.property
                                )}
                            />
                        );
                    };
                    break;
            }
            this.columns.push(tmpColData);
        });
    }

    handleSearch = () => {};
    handleReset = () => {};
    // 闭包 只对具体的单元格修改
    onCellChange = (index, property) => {
        return value => {
            let { newSource } = this.props;
            newSource = _.cloneDeep(newSource);
            let target = newSource[index];
            if (target) {
                target[property] = value;
                this.props.saveNewSource(newSource);
            }
        };
    };
    // 闭包 一纵列单元格修改
    onAllColCellChange = property => {
        return value => {
            let { newSource } = this.props;
            newSource = _.cloneDeep(newSource);
            _.forEach(newSource, n => {
                n[property] = value;
            });
            this.props.saveNewSource(newSource);
        };
    };

    render() {
        let { newSource } = this.props;
        _.forEach(newSource, (n, i) => {
            n.key = i;
        });
        const columns = this.columns;
        return (
            <Table
                bordered
                dataSource={newSource}
                columns={columns}
                pagination={false}
                // scroll={{ x: 6000, y: 400 }}
            />
        );
    }
}
