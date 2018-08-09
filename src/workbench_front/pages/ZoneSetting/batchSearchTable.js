import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Input, Button, Icon, Dropdown, Popover, Checkbox } from "antd";
import _ from "lodash";
import * as utilService from "./utilService";
import {
    EditableCell,
    EditableCheck,
    SelectCell,
    EditAllCell
} from "./editableCell";
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
        width: 150
    },
    {
        title: "使用",
        property: "isuse",
        type: "checkbox",
        width: 100
    },
    {
        title: "编码",
        property: "code",
        type: "input",
        width: 150
    },
    {
        title: "操作符编码",
        property: "opersign",
        type: "input",
        width: 150
    },
    {
        title: "操作符名称",
        property: "opersignname",
        type: "input",
        width: 150
    },
    {
        title: "不可修改",
        property: "disabled",
        type: "checkbox",
        width: 150
    },
    {
        title: "默认显示",
        property: "visible",
        type: "checkbox",
        width: 150
    },
    {
        title: "默认显示字段排序",
        property: "visibleposition",
        type: "input",
        width: 150
    },
    {
        title: "多选",
        property: "ismultiselectedenabled",
        type: "checkbox",
        width: 100
    },
    {
        title: "固定条件",
        property: "isfixedcondition",
        type: "checkbox",
        width: 150
    },
    {
        title: "必输条件",
        property: "required",
        type: "checkbox",
        width: 150
    },
    {
        title: "查询条件",
        property: "isquerycondition",
        type: "checkbox",
        width: 150
    },
    {
        title: "参照名称",
        property: "refname",
        type: "input",
        width: 150
    },
    {
        title: "参照包含下级",
        property: "containlower",
        type: "checkbox",
        width: 150
    },
    {
        title: "参照自动检查",
        property: "ischeck",
        type: "checkbox",
        width: 150
    },
    {
        title: "参照跨集团",
        property: "isbeyondorg",
        type: "checkbox",
        width: 150
    },
    {
        title: "使用系统函数",
        property: "usefunc",
        type: "checkbox",
        width: 150
    },
    {
        title: "显示类型",
        property: "showtype",
        type: "select",
        width: 150,
        selectObj: utilService.showType
    },
    {
        title: "返回类型",
        property: "returntype",
        type: "select",
        width: 150,
        selectObj: utilService.returnType
    },
    // {
    //     title: "组件类型",
    //     property: "itemtype",
    //     type: "select",
    //     width: 50,
    //     selectObj: utilService.getItemtypeObjByDatatype(selectCard.datatype)
    // },
    {
        title: "自定义1",
        property: "define1",
        type: "input",
        width: 150,
    },
    {
        title: "自定义2",
        property: "define2",
        type: "input",
        width: 150,
    },
    {
        title: "自定义3",
        property: "define3",
        type: "input",
        width: 150,
    },
    {
        title: "自定义4",
        property: "define4",
        type: "input",
        width: 150,
    },
    {
        title: "自定义5",
        property: "define5",
        type: "input",
        width: 150,
    }
];
//批量设置查询区
export default class BatchSearchTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [];
        this.state = {
            visible: false
        };
    }
    //
    handleVisibleChange = (visible, index) => {
        if (visible === false) {
            return;
        }
        this.setState({ [`visible${index}`]: visible });
    };
    //隐藏
    hidePopover = index => {
        this.setState({ [`visible${index}`]: false });
    };
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
            this.saveAllCellValue(value, property);
        };
    };
    //保存一纵列单元格
    saveAllCellValue = (value, property) => {
        let { newSource } = this.props;
        newSource = _.cloneDeep(newSource);
        _.forEach(newSource, n => {
            n[property] = value;
        });
        this.props.saveNewSource(newSource);
    };

    render() {
        let { newSource } = this.props;
        _.forEach(newSource, (n, i) => {
            n.key = i;
        });
        let columns = [];
        let scrollTableWidth = 500;
        _.forEach(batchSearchTableData, (data, index) => {
            let tmpColData = {
                dataIndex: data.property,
                width: data.width
            };
            scrollTableWidth += data.width;
            // <Popover
            //     overlayClassName="all-apps-popover"
            //     getPopupContainer={() => {
            //         return document.querySelector(
            //             ".zonesetting-batch-setting-modal"
            //         );
            //     }}
            //     content={
            //         <EditAllCell
            //             property={data.property}
            //             hidePopover={()=>{this.hidePopover(index)}}
            //             onChange={this.onAllColCellChange(
            //                 data.property
            //             )}
            //         />
            //     }
            //     visible={this.state[`visible${index}`]}
            //     onVisibleChange={(visible)=>{this.handleVisibleChange(visible,index)}}
            //     placement="bottomLeft"
            //     trigger="click"
            // >
            //     {data.title} <Icon type="down" />
            // </Popover>
            if (data.type === "checkbox") {
                tmpColData.title = (
                    <Checkbox
                        onChange={e => {
                            this.saveAllCellValue(
                                e.target.checked,
                                data.property
                            );
                        }}
                    >
                        {data.title}
                    </Checkbox>
                );
            } else {
                tmpColData.title = data.title;
            }
            switch (data.type) {
                case "input":
                    tmpColData.render = (text, record, index) => {
                        return (
                            <EditableCell
                                value={text}
                                property={data.property}
                                updateValue={this.onCellChange(
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
            columns.push(tmpColData);
        });
        return (
            <Table
                bordered
                dataSource={newSource}
                columns={columns}
                pagination={false}
                scroll={{ x: scrollTableWidth, y: 400 }}
            />
        );
    }
}
