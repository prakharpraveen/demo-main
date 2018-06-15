import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Tabs, Button, Table, Input, Popconfirm, Select} from "antd";
import {DragDropContext, DragSource, DropTarget} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";
import _ from "lodash";
import {setPageButtonData, setPageTemplateData} from "Store/AppRegister1/action";
import Ajax from "Pub/js/ajax";
import Notice from "Components/Notice";
import PreviewModal from "./showPreview";
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const EditableInputCell = ({editable, value, onChange}) => (
    <div>
        {editable ? (
            <Input
                style={{margin: "-5px 0"}}
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        ) : (
            value
        )}
    </div>
);
const EditableSelectCell = ({editable, value, onChange}) => (
    <div>
        {editable ? (
            <Select
                value={value}
                style={{width: 120}}
                onChange={selected => onChange(selected)}>
                <Option value="button_main">主要按钮</Option>
                <Option value="button_secondary">次要按钮</Option>
                <Option value="buttongroup">按钮组</Option>
                <Option value="dropdown">下拉按钮</Option>
                <Option value="divider">分割下拉按钮</Option>
                <Option value="more">更多按钮</Option>
            </Select>
        ) : (
            switchType(value)
        )}
    </div>
);
/**
 * 按钮类型选择
 * @param {String} value
 */
const switchType = value => {
    switch (value) {
        case "button_main":
            return "主要按钮";
        case "button_secondary":
            return "次要按钮";
        case "buttongroup":
            return "按钮组";
        case "dropdown":
            return "下拉按钮";
        case "divider":
            return "分割下拉按钮";
        case "more":
            return "更多按钮";
        default:
            break;
    }
};
function dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset
) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        return "downward";
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return "upward";
    }
}
let BodyRow = props => {
    const {
        isOver,
        connectDragSource,
        connectDropTarget,
        moveRow,
        dragRow,
        clientOffset,
        sourceClientOffset,
        initialClientOffset,
        ...restProps
    } = props;
    const style = {...restProps.style, cursor: "move"};

    let className = restProps.className;
    if (isOver && initialClientOffset) {
        const direction = dragDirection(
            dragRow.index,
            restProps.index,
            initialClientOffset,
            clientOffset,
            sourceClientOffset
        );
        if (direction === "downward") {
            className += " drop-over-downward";
        }
        if (direction === "upward") {
            className += " drop-over-upward";
        }
    }

    return connectDragSource(
        connectDropTarget(
            <tr {...restProps} className={className} style={style} />
        )
    );
};
const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }
        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    }
};
const rowSource = {
    beginDrag(props) {
        return {
            index: props.index
        };
    }
};
BodyRow = DropTarget("row", rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset()
}))(
    DragSource("row", rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset()
    }))(BodyRow)
);

class PageTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: "1",
            batchSettingModalVisibel: false,
            templetid: ""
        };
        this.columnsBtn = [
            {
                title: "序号",
                dataIndex: "btnorder",
                width: "5%",
                render: text => text + 1
            },
            {
                title: "按钮编码",
                dataIndex: "btncode",
                width: "10%",
                render: (text, record) =>
                    this.renderColumns(text, record, "btncode")
            },
            {
                title: "按钮名称",
                dataIndex: "btnname",
                width: "10%",
                render: (text, record) =>
                    this.renderColumns(text, record, "btnname")
            },
            {
                title: "按钮类型",
                dataIndex: "btntype",
                width: "15%",
                render: (text, record) =>
                    this.renderColumns(text, record, "btntype", "select")
            },
            {
                title: "父按钮编码",
                dataIndex: "parent_code",
                width: "10%",
                render: (text, record) =>
                    this.renderColumns(text, record, "parent_code")
            },
            {
                title: "按钮区域",
                dataIndex: "btnarea",
                width: "10%",
                render: (text, record) =>
                    this.renderColumns(text, record, "btnarea")
            },
            // {
            // 	title: 'pagecode',
            // 	dataIndex: 'pagecode',
            // 	width: '10%',
            // 	render: (text, record) => this.renderColumns(text, record, 'pagecode')
            // },
            {
                title: "按钮功能描述",
                dataIndex: "btndesc",
                width: "25%",
                render: (text, record) =>
                    this.renderColumns(text, record, "btndesc")
            },
            {
                title: "操作",
                dataIndex: "operation",
                render: (text, record) => {
                    const {editable} = record;
                    return (
                        <div className="editable-row-operations">
                            {editable ? (
                                <span>
                                    <a
                                        className="margin-right-5"
                                        onClick={() => this.save(record)}>
                                        保存
                                    </a>
                                    <Popconfirm
                                        title="确定取消?"
                                        cancelText={"取消"}
                                        okText={"确定"}
                                        onConfirm={() => this.cancel(record)}>
                                        <a className="margin-right-5">取消</a>
                                    </Popconfirm>
                                </span>
                            ) : (
                                <span>
                                    <a
                                        className="margin-right-5"
                                        onClick={() => this.edit(record)}>
                                        编辑
                                    </a>
                                    <Popconfirm
                                        title="确定删除?"
                                        cancelText={"取消"}
                                        okText={"确定"}
                                        onConfirm={() => this.del(record)}>
                                        <a className="margin-right-5">删除</a>
                                    </Popconfirm>
                                </span>
                            )}
                        </div>
                    );
                }
            }
        ];
        this.columnsSt = [
            {
                title: "序号",
                dataIndex: "num",
                width: "5%"
            },
            {
                title: "模板编码",
                dataIndex: "code",
                width: "25%",
                render: (text, record) =>
                    this.renderColumns(text, record, "code")
            },
            {
                title: "模板名称",
                dataIndex: "name",
                width: "15%",
                render: (text, record) =>
                    this.renderColumns(text, record, "name")
            },
            {
                title: "多语字段",
                dataIndex: "resid",
                width: "15%",
                render: (text, record) =>
                    this.renderColumns(text, record, "resid")
            },
            {
                title: "操作",
                dataIndex: "operation",
                render: (text, record) => {
                    const {editable} = record;
                    return (
                        <div className="editable-row-operations">
                            {editable ? (
                                <span>
                                    <a
                                        className="margin-right-5"
                                        onClick={() => this.save(record)}>
                                        保存
                                    </a>
                                    <Popconfirm
                                        title="确定取消?"
                                        cancelText={"取消"}
                                        okText={"确定"}
                                        onConfirm={() => this.cancel(record)}>
                                        <a className="margin-right-5">取消</a>
                                    </Popconfirm>
                                </span>
                            ) : (
                                <span>
                                    <a
                                        className="margin-right-5"
                                        onClick={() => this.edit(record)}>
                                        编辑
                                    </a>
                                    <Popconfirm
                                        title="确定删除?"
                                        cancelText={"取消"}
                                        okText={"确定"}
                                        onConfirm={() => this.del(record)}>
                                        <a className="margin-right-5">删除</a>
                                    </Popconfirm>
                                    <a
                                        className="margin-right-5"
                                        onClick={() => this.jumpPage(record)}>
                                        设置页面模板
                                    </a>
                                    <a
                                        className="margin-right-5"
                                        onClick={() => {
                                            this.showModal(record);
                                        }}>
                                        预览
                                    </a>
                                    {record.isdefault ? null : (
                                        <a
                                            className="margin-right-5"
                                            onClick={() =>
                                                this.setDefault(record)
                                            }>
                                            设置为默认模板
                                        </a>
                                    )}
                                </span>
                            )}
                        </div>
                    );
                }
            }
        ];
        this.cacheData;
    }
    components = {
        body: {
            row: BodyRow
        }
    };
    showModal = record => {
        this.setState({
            batchSettingModalVisibel: true,
            templetid: record.pk_page_templet
        });
    };
    setModalVisibel = visibel => {
        this.setState({batchSettingModalVisibel: visibel});
    };
    jumpPage = record => {
        let win = window.open("", "_blank");
        // 浏览器当前页打开
        win.location = `#/Zone?t=${record.pk_page_templet}&n=设置页面模板`;
        win.focus();
    };
    setDefault = record => {
        Ajax({
            url: `/nccloud/platform/templet/setdefaulttemplet.do`,
            info: {
                name: "应用注册",
                action: "设置默认模板"
            },
            data: {
                pageid: record.pageid,
                templetid: record.pk_page_templet
            },
            success: res => {
                let {success, data} = res.data;
                if (success && data) {
                    let newPageTemplets = this.props.pageTemplets.map(
                        (item, index) => {
                            item.isdefault = false;
                            if (
                                item.pk_page_templet === record.pk_page_templet
                            ) {
                                item.isdefault = true;
                            }
                            return item;
                        }
                    );
                    this.props.setPageTemplateData(newPageTemplets);
                    Notice({status: "success", msg: data});
                } else {
                    Notice({status: "error", msg: data.data.true});
                }
            }
        });
    };
    moveRow = (dragIndex, hoverIndex) => {
        let appButtonVOs = this.props.appButtonVOs;
        const dragRow = appButtonVOs[dragIndex];
        let sortData = update(appButtonVOs, {
            $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]
        });
        sortData.map((item, index) => (item.btnorder = index));
        Ajax({
            url: `/nccloud/platform/appregister/orderbuttons.do`,
            info: {
                name: "页面按钮",
                action: "排序"
            },
            data: sortData,
            success: ({data}) => {
                if (data.success && data.data) {
                    this.props.setPageButtonData(sortData);
                } else {
                    Notice({status: "error", msg: data.data.true});
                }
            }
        });
    };
    renderColumns(text, record, column, type = "input") {
        record = _.cloneDeep(record);
        if (type === "input") {
            return (
                <EditableInputCell
                    editable={record.editable}
                    value={text}
                    onChange={value => this.handleChange(value, record, column)}
                />
            );
        } else if (type === "select") {
            return (
                <EditableSelectCell
                    editable={record.editable}
                    value={text}
                    onChange={value => this.handleChange(value, record, column)}
                />
            );
        }
    }
    handleChange(value, record, column) {
        let newData = this.getNewData();
        const target = newData.filter(item => record.num === item.num)[0];
        if (target) {
            target[column] = value;
            this.setNewData(newData);
        }
    }
    edit(record) {
        let newData = this.getNewData();
        const dataList = newData.filter(item => item.editable === true);
        if (dataList.length > 0) {
            Notice({status: "warning", msg: "请逐条修改按钮！"});
            return;
        }
        this.cacheData = _.cloneDeep(newData);
        const target = newData.filter(item => record.num === item.num)[0];
        if (target) {
            target.editable = true;
            this.setNewData(newData);
        }
    }
    del(record) {
        if (record.pk_btn || record.pk_page_templet) {
            let url, data, info;
            let {activeKey} = this.state;
            let newData = this.getNewData();
            if (activeKey === "1") {
                url = `/nccloud/platform/appregister/deletebutton.do`;
                data = {
                    pk_btn: record.pk_btn
                };
                info = {
                    name: "页面按钮",
                    action: "删除"
                };
            } else if (activeKey === "2") {
                url = `/nccloud/platform/templet/deletetemplet.do`;
                data = {
                    templetid: record.pk_page_templet
                };
                info = {
                    name: "页面模板",
                    action: "删除"
                };
            }
            Ajax({
                url: url,
                info: info,
                data: data,
                success: ({data}) => {
                    if (data.success && data.data) {
                        if (record.pk_btn) {
                            _.remove(
                                newData,
                                item => record.pk_btn === item.pk_btn
                            );
                        } else if (record.pk_page_templet) {
                            _.remove(
                                newData,
                                item =>
                                    record.pk_page_templet ===
                                    item.pk_page_templet
                            );
                        }
                        this.setNewData(newData);
                        this.cacheData = _.cloneDeep(newData);
                        Notice({status: "success"});
                    } else {
                        Notice({status: "error", msg: data.data.true});
                    }
                }
            });
        }
    }
    save(record) {
        let {activeKey} = this.state;
        let newData = this.getNewData();
        console.log(newData);
        if (activeKey === "1") {
            let arrayBtn = newData.filter(
                item => record.btncode === item.btncode
            );
            if (arrayBtn.length > 1) {
                Notice({status: "error", msg: "按钮编码重复，请再次确认！"});
                return;
            }
        } else {
            let arrayTmp = newData.filter(item => record.code === item.code);
            if (arrayTmp.length > 1) {
                Notice({status: "error", msg: "模板编码重复，请再次确认！"});
                return;
            }
        }
        let url, listData, info;
        const target = newData.filter(item => record.num === item.num)[0];
        if (target) {
            if (target.pk_btn || target.pk_page_templet) {
                if (activeKey === "1") {
                    url = `/nccloud/platform/appregister/editbutton.do`;
                    info = {
                        name: "页面按钮",
                        action: "编辑"
                    };
                } else if (activeKey === "2") {
                    url = `/nccloud/platform/templet/edittemplet.do`;
                    info = {
                        name: "页面模板",
                        action: "编辑"
                    };
                }
            } else {
                if (activeKey === "1") {
                    url = `/nccloud/platform/appregister/insertbutton.do`;
                    info = {
                        name: "页面按钮",
                        action: "新增"
                    };
                } else if (activeKey === "2") {
                    url = `/nccloud/platform/templet/addtemplet.do`;
                    info = {
                        name: "页面模板",
                        action: "新增"
                    };
                }
            }
            listData = {
                ...target
            };
            Ajax({
                url: url,
                info: info,
                data: listData,
                success: ({data}) => {
                    if (data.success && data.data) {
                        delete target.editable;
                        if (listData.pk_btn || listData.pk_page_templet) {
                            newData.map((item, index) => {
                                if (
                                    listData.pk_btn === item.pk_btn ||
                                    listData.pk_page_templet ===
                                        item.pk_page_templet
                                ) {
                                    return {...item, ...listData};
                                } else {
                                    return item;
                                }
                            });
                            this.setNewData(newData);
                        } else {
                            newData[newData.length - 1] = data.data;
                            this.setNewData(newData);
                        }
                        this.cacheData = _.cloneDeep(newData);
                        Notice({status: "success"});
                    } else {
                        Notice({status: "error", msg: data.data.true});
                    }
                }
            });
        }
    }
    cancel(record) {
        let newData = this.getNewData();
        const target = newData.filter(item => record.num === item.num)[0];
        if (target) {
            delete target.editable;
            this.setNewData(this.cacheData);
        }
    }
    add() {
        if (this.props.isNew) {
            Notice({status: "warning", msg: "请先将页面进行保存！"});
            return;
        }
        let newData = this.getNewData();
        const target = newData.filter(item => item.editable === true);
        if (target.length > 0) {
            Notice({status: "warning", msg: "请逐条添加按钮！"});
            return;
        }
        this.cacheData = _.cloneDeep(newData);
        let {activeKey} = this.state;
        let {parent_id, pk_apppage, pagecode} = this.props.nodeData;
        if (activeKey === "1") {
            newData.push({
                editable: true,
                btntype: "button_main",
                btncode: "",
                btnname: "",
                parent_code: "",
                btnarea: "",
                btndesc: "",
                appid: parent_id,
                isenable: true,
                pagecode: pagecode,
                btnorder: newData.length
            });
        } else if (activeKey === "2") {
            newData.push({
                editable: true,
                isdefault: false,
                name: "",
                pageid: pk_apppage,
                isenable: true,
                resid: "",
                code: ""
            });
        }
        this.setNewData(newData);
    }
    getNewData() {
        let {activeKey} = this.state;
        let {appButtonVOs, pageTemplets} = this.props;
        if (activeKey === "1") {
            return _.cloneDeep(appButtonVOs);
        } else if (activeKey === "2") {
            return _.cloneDeep(pageTemplets);
        }
    }
    setNewData(newData) {
        let {activeKey} = this.state;
        if (activeKey === "1") {
            this.props.setPageButtonData(newData);
        } else if (activeKey === "2") {
            this.props.setPageTemplateData(newData);
        }
    }
    /**
     * 创建按钮
     */
    creatAddLineBtn = () => {
        return (
            <div>
                {this.state.activeKey === "1" ? (
                    <span style={{color: "#e14c46"}}>
                        提示：按钮可通过拖拽进行排序！
                    </span>
                ) : null}
                <Button onClick={() => this.add()} style={{marginLeft: "8px"}}>
                    新增行
                </Button>
            </div>
        );
    };
    render() {
        let {appButtonVOs = [], pageTemplets = []} = this.props;
        let {batchSettingModalVisibel, templetid} = this.state;
        return (
            <div>
                <Tabs
                    onChange={activeKey => {
                        if (activeKey === "3") {
                            Notice({
                                status: "warning",
                                msg: "功能正在开发中。。。"
                            });
                            return;
                        }
                        this.setState({activeKey});
                    }}
                    activeKey={this.state.activeKey}
                    type="card"
                    tabBarExtraContent={this.creatAddLineBtn()}>
                    <TabPane tab="按钮注册" key="1">
                        <Table
                            bordered
                            pagination={false}
                            rowKey="btnorder"
                            components={this.components}
                            dataSource={appButtonVOs.map((item, index) => {
                                item.num = item.btnorder;
                                return item;
                            })}
                            onRow={(record, index) => ({
                                index,
                                moveRow: this.moveRow
                            })}
                            columns={this.columnsBtn}
                            size="middle"
                        />
                    </TabPane>
                    <TabPane tab="页面模板注册" key="2">
                        <Table
                            bordered
                            pagination={false}
                            rowKey="num"
                            dataSource={pageTemplets.map((item, index) => {
                                item.num = index + 1;
                                return item;
                            })}
                            columns={this.columnsSt}
                            size="middle"
                        />
                    </TabPane>
                </Tabs>
                {batchSettingModalVisibel && (
                    <PreviewModal
                        templetid={templetid}
                        batchSettingModalVisibel={batchSettingModalVisibel}
                        setModalVisibel={this.setModalVisibel}
                    />
                )}
            </div>
        );
    }
}
PageTable.propTypes = {
    isNew: PropTypes.bool.isRequired,
    nodeData: PropTypes.object.isRequired,
    appButtonVOs: PropTypes.array.isRequired,
    pageTemplets: PropTypes.array.isRequired,
    setPageTemplateData: PropTypes.func.isRequired,
    setPageButtonData: PropTypes.func.isRequired,
};
let DragFromeTable = DragDropContext(HTML5Backend)(PageTable);
export default connect(
    state => {
        return {
            isNew: state.AppRegisterData.isNew,
            nodeData: state.AppRegisterData.nodeData,
            pageTemplets: state.AppRegisterData.pageTemplets,
            appButtonVOs: state.AppRegisterData.appButtonVOs,
        };
    },
    {setPageButtonData, setPageTemplateData}
)(DragFromeTable);
