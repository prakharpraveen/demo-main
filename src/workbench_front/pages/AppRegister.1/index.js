import React, {Component} from "react";
import {Modal} from "antd";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {
    setTreeData,
    setNodeData,
    setPageButtonData,
    setPageTemplateData,
    setAppParamData
} from "Store/AppRegister/action";
import Ajax from "Pub/js/ajax";
import SearchTree from "./SearchTree";
import ModuleFormCard from "./ModuleFormCard";
import ClassFormCard from "./ClassFormCard";
import AppFormCard from "./AppFormCard";
import PageFromCard from "./PageFromCard";
import {dataTransfer, dataRestore, dataCheck} from "Components/FormCreate";
import {
    PageLayout,
    PageLayoutHeader,
    PageLayoutLeft,
    PageLayoutRight
} from "Components/PageLayout";
import ButtonCreate from "Components/ButtonCreate";
import Notice from "Components/Notice";
import "./index.less";
const confirm = Modal.confirm;
/**
 * 工作桌面 首页 页面
 * 各个此贴应用及工作台中的小部件 通过 js 片段进行加载渲染
 */

class AppRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optype: "",
            isedit: false,
            isNew: false
        };
        this.nodeData;
        this.optype;
        this.actionType;
    }
    /**
     * 按钮点击事件
     * @param {String} code
     */
    handleClick = code => {
        switch (code) {
            case "addModule":
                this.addModule();
                break;
            case "addAppClass":
                this.addAppClass();
                break;
            case "addApp":
                this.addApp();
                break;
            case "addPage":
                this.addPage();
                break;
            case "save":
                this.save();
                break;
            case "cancel":
                this.props.setOpType(this.optype);
                this.props.setNodeData(this.nodeData);
                this.props.setBillStatus({
                    isEdit: false,
                    isNew: false
                });
                break;
            case "del":
                this.del();
                break;
            case "edit":
                this.nodeData = this.props.nodeData;
                this.optype = this.props.optype;
                switch (this.optype) {
                    case "module":
                        this.actionType = 1;
                        break;
                    case "classify":
                        this.actionType = 2;
                        break;
                    case "app":
                        this.actionType = 3;
                        break;
                    case "page":
                        this.actionType = 4;
                        break;
                    default:
                        break;
                }
                this.props.setBillStatus({
                    isEdit: true,
                    isNew: false
                });
                break;
            default:
                break;
        }
    };
    /**
     * 添加模块
     */
    addModule = () => {
        this.actionType = 1;
        this.nodeData = this.props.nodeData;
        if (!this.props.parentData) {
            this.props.setParentData(this.nodeData.moduleid);
        }
        this.optype = this.props.optype;
        let moduleData = {
            systypecode: "",
            moduleid: "",
            systypename: "",
            orgtypecode: undefined,
            appscope: undefined,
            isaccount: false,
            supportcloseaccbook: false,
            resid: "",
            dr: 0
        };
        this.props.setNodeData(moduleData);
        this.props.setOpType("module");
        this.props.setBillStatus({
            isEdit: true,
            isNew: true
        });
    };
    /**
     * 添加应用分类
     */
    addAppClass = () => {
        this.actionType = 2;
        this.nodeData = this.props.nodeData;
        if (this.props.parentData === this.nodeData.parentcode) {
            this.props.setParentData(this.nodeData.moduleid);
        }
        this.optype = this.props.optype;
        let classData = {
            apptype: 0,
            isenable: true,
            code: "",
            name: "",
            app_desc: "",
            resid: "",
            help_name: ""
        };
        this.props.setNodeData(classData);
        this.props.setOpType("classify");
        this.props.setBillStatus({
            isEdit: true,
            isNew: true
        });
    };
    /**
     * 添加页面
     */
    addApp = () => {
        this.actionType = 3;
        this.nodeData = this.props.nodeData;
        this.props.setParentData(this.nodeData.pk_appregister);

        this.optype = this.props.optype;
        let appData = {
            code: "",
            name: "",
            orgtypecode: undefined,
            funtype: undefined,
            app_desc: "",
            help_name: "",
            isenable: true,
            iscauserusable: false,
            uselicense_load: true,
            pk_group: "",
            width: "1",
            height: "1",
            target_path: "",
            apptype: 1,
            resid: "",
            image_src: ""
        };
        this.props.setAppParamData([]);
        this.props.setNodeData(appData);
        this.props.setOpType("app");
        this.props.setBillStatus({
            isEdit: true,
            isNew: true
        });
    };
    /**
     * 添加页面
     */
    addPage = () => {
        this.actionType = 4;
        this.optype = this.props.optype;
        this.nodeData = this.props.nodeData;
        this.props.setParentData(this.nodeData.pk_appregister);
        let pageData = {
            pagecode: "",
            pagename: "",
            pagedesc: "",
            pageurl: "",
            resid: "",
            isdefault: false
        };
        this.props.setPageButtonData([]);
        this.props.setPageTemplateData([]);
        this.props.setNodeData(pageData);
        this.props.setOpType("page");
        this.props.setBillStatus({
            isEdit: true,
            isNew: true
        });
    };
    /**
     * 保存
     */
    save = () => {
        let url;
        let fromData = this.props.getFromData();
        if (!fromData) {
            return;
        }

        let isNew = this.props.billStatus.isNew;
        let reqData, info;
        /**
         * @param {Number} this.actionType
         *
         * 1 -> 模块
         * 2 -> 应用分类
         * 3 -> 应用
         * 4 -> 页面
         */
        switch (this.actionType) {
            case 1:
                if (isNew) {
                    url = `/nccloud/platform/appregister/insertmodule.do`;
                    info = {
                        name: "模块",
                        action: "新增"
                    };
                } else {
                    url = `/nccloud/platform/appregister/editmodule.do`;
                    info = {
                        name: "模块",
                        action: "编辑"
                    };
                }
                if (this.props.parentData) {
                    fromData.parentcode = this.props.parentData;
                }
                reqData = fromData;
                break;
            case 2:
                if (isNew) {
                    url = `/nccloud/platform/appregister/insertapp.do`;
                    info = {
                        name: "应用",
                        action: "新增"
                    };
                } else {
                    url = `/nccloud/platform/appregister/editapp.do`;
                    info = {
                        name: "应用",
                        action: "编辑"
                    };
                }
                if (this.optype === "module") {
                    fromData.parent_id = this.nodeData.moduleid;
                } else {
                    fromData.parent_id = this.props.parentData;
                }
                reqData = {...this.props.nodeData, ...fromData};
                break;
            case 3:
                if (isNew) {
                    url = `/nccloud/platform/appregister/insertapp.do`;
                    info = {
                        name: "应用",
                        action: "新增"
                    };
                } else {
                    url = `/nccloud/platform/appregister/editapp.do`;
                    info = {
                        name: "应用",
                        action: "编辑"
                    };
                }
                fromData.parent_id = this.props.parentData;
                reqData = {...this.props.nodeData, ...fromData};
                break;
            case 4:
                if (isNew) {
                    url = `/nccloud/platform/appregister/insertpage.do`;
                    info = {
                        name: "页面",
                        action: "新增"
                    };
                } else {
                    url = `/nccloud/platform/appregister/editpage.do`;
                    info = {
                        name: "页面",
                        action: "编辑"
                    };
                }
                fromData.parent_id = this.props.parentData;
                reqData = {...this.props.nodeData, ...fromData};
                break;
            default:
                break;
        }
        Ajax({
            url: url,
            data: reqData,
            info: info,
            alert: true,
            success: ({data}) => {
                if (data.success && data.data) {
                    Notice({status: "success"});
                    this.props.setBillStatus({
                        isEdit: false,
                        isNew: false
                    });
                    if (isNew) {
                        this.props.reqTreeData();
                        this.props.setNodeData(data.data);
                    } else {
                        if (
                            this.props.optype === "classify" ||
                            this.props.optype === "app"
                        ) {
                            let treeData = {
                                moduleid: reqData.pk_appregister,
                                parentcode: this.props.parentData,
                                systypecode: reqData.code,
                                systypename: reqData.name,
                                flag: "1"
                            };
                            this.props.updateTreeData(treeData);
                        } else if (this.props.optype === "page") {
                            let treeData = {
                                moduleid: data.data.pk_apppage,
                                parentcode: this.props.parentData,
                                systypecode: data.data.pagecode,
                                systypename: data.data.pagename,
                                flag: "2"
                            };
                            this.props.updateTreeData(treeData);
                        } else {
                            this.props.updateTreeData({
                                ...reqData,
                                flag: "0"
                            });
                        }
                        this.props.setNodeData(reqData);
                    }
                } else {
                    Notice({status: "error", msg: res.error.message});
                }
            }
        });
        // 保存成功之后记得更新数据 获取到当前节点id 之后 选中 新增的节点
        // console.log(reqData);
    };
    /**
     * 删除
     */
    del = () => {
        let _this = this;
        confirm({
            title: "是否要删除?",
            content: "",
            okText: "确认",
            okType: "danger",
            cancelText: "取消",
            onOk() {
                let data, nodeData;
                let {pk_appregister, code, name} = _this.props.nodeData;
                switch (_this.props.optype) {
                    case "module":
                        url = `/nccloud/platform/appregister/deletemodule.do`;
                        info = {
                            name: "模块",
                            action: "删除"
                        };
                        data = {
                            moduleid: _this.props.nodeData.moduleid
                        };
                        nodeData = _this.props.nodeData;
                        break;
                    case "classify":
                        url = `/nccloud/platform/appregister/deleteapp.do`;
                        info = {
                            name: "应用",
                            action: "删除"
                        };
                        data = {
                            pk_appregister: pk_appregister
                        };
                        nodeData = {
                            moduleid: pk_appregister,
                            parentcode: _this.props.parentData,
                            systypecode: code,
                            systypename: name
                        };
                        break;
                    case "app":
                        url = `/nccloud/platform/appregister/deleteapp.do`;
                        info = {
                            name: "应用",
                            action: "删除"
                        };
                        data = {
                            pk_appregister: pk_appregister
                        };
                        nodeData = {
                            moduleid: pk_appregister,
                            parentcode: _this.props.parentData,
                            systypecode: code,
                            systypename: name
                        };
                        break;
                    case "page":
                        url = `/nccloud/platform/appregister/deletepage.do`;
                        info = {
                            name: "页面",
                            action: "删除"
                        };
                        data = {
                            pk_apppage: _this.props.nodeData.pk_apppage
                        };
                        nodeData = {
                            moduleid: _this.props.nodeData.pk_apppage,
                            parentcode: _this.props.parentData,
                            systypecode: _this.props.nodeData.pagecode,
                            systypename: _this.props.nodeData.pagename
                        };
                        break;
                    default:
                        break;
                }
                Ajax({
                    url: url,
                    data: data,
                    info: info,
                    success: ({data}) => {
                        if (data.success && data.data) {
                            Notice({
                                status: "success",
                                msg: data.data.true
                            });
                            _this.props.delTreeData(nodeData);
                            _this.props.setOpType(null);
                        } else {
                            Notice({
                                status: "error",
                                msg: data.data.true
                            });
                        }
                    }
                });
            },
            onCancel() {
                console.log("Cancel");
            }
        });
    };
    /**
     * 右侧表单选择
     */
    switchFrom = () => {
        switch (this.state.optype) {
            // 对应树结构中的前两层
            case "12":
                return <ModuleFormCard isedit={this.state.isedit} />;
            // 对应树结构的第三层
            case "3":
                return <ClassFormCard isedit={this.state.isedit} />;
            // 对应树结构的第四层
            case "4":
                return <AppFormCard isedit={this.state.isedit} />;
            // 对应树结构的第五层
            case "5":
                return <PageFromCard isedit={this.state.isedit} />;
            default:
                return "";
        }
    };
    /**
     * tree 数据请求
     */
    reqTreeData = () => {
        Ajax({
            url: `/nccloud/platform/appregister/querymodules.do`,
            info: {
                name: "应用注册模块",
                action: "查询"
            },
            success: ({data}) => {
                if (data.success && data.data.length > 0) {
                    this.props.setTreeData(data.data);
                }
            }
        });
    };
    /**
     * 树节点详细信息请求
     * @param {Object} info 接口描述
     * @param {String} url 请求地址
     * @param {Object} data 请求数据
     * @param {Function} callback 成功回调
     */
    reqTreeNodeData = (info, url, data, callback) => {
        Ajax({
            url,
            data,
            info,
            success: ({data: {success, data}}) => {
                if (success && data) {
                    callback(data);
                } else {
                    Notice({status: "error", msg: res.error.message});
                }
            }
        });
    };
    /**
     * 数据点选择事件
     * @param {Object} obj 选中的数节点对象
     */
    handleTreeNodeSelect = obj => {
        let optype = "";
        if (obj) {
            switch (obj.flag) {
                // 对应树的前两层
                case "0":
                    console.log(obj);
                    this.props.setNodeData(dataTransfer(obj));
                    optype = "12";
                    break;
                // 对应树的3、4层
                case "1":
                    let appCallBack = data => {
                        this.props.setNodeData(
                            dataTransfer(data.appRegisterVO)
                        );
                        this.props.setAppParamData(data.appParamVOs);
                    };
                    optype = "3";
                    if (obj.parentcode.length > 4) {
                        optype = "4";
                    }
                    this.reqTreeNodeData(
                        {name: "应用注册", action: "应用查询"},
                        `/nccloud/platform/appregister/query.do`,
                        {pk_appregister: obj.moduleid},
                        appCallBack
                    );
                    break;
                // 对应树的最后一层
                case "2":
                    let pageCallBack = data => {
                        this.props.setNodeData(dataTransfer(data.apppageVO));
                        this.props.setPageButtonData(data.appButtonVOs);
                        this.props.setPageTemplateData(data.pageTemplets);
                    };
                    this.reqTreeNodeData(
                        {name: "应用注册", action: "应用页面查询"},
                        `/nccloud/platform/appregister/querypagedetail.do`,
                        {pk_apppage: obj.moduleid},
                        pageCallBack
                    );
                    optype = "5";
                    break;
                default:
                    break;
            }
        }
        this.setState({
            optype
        });
        console.log(obj);
    };
    componentDidMount() {
        this.reqTreeData();
    }
    render() {
        let {isedit, optype} = this.state;
        let btnList = [
            {
                code: "addModule",
                name: "增加模块",
                type: "primary",
                isshow: !isedit && (optype === "" || optype === "12")
            },
            {
                code: "addAppClass",
                name: "增加应用分类",
                type: "primary",
                isshow: !isedit && optype === "3"
            },
            {
                code: "addApp",
                name: "增加应用",
                type: "primary",
                isshow: !isedit && optype === "4"
            },
            {
                code: "addPage",
                name: "增加页面",
                type: "primary",
                isshow: !isedit && optype === "5"
            },
            {
                code: "cancel",
                name: "取消",
                type: "",
                isshow: isedit
            },
            {
                code: "save",
                name: "保存",
                type: "primary",
                isshow: isedit
            },
            {
                code: "del",
                name: "删除",
                type: "primary",
                isshow: !isedit
            },
            {
                code: "edit",
                name: "修改",
                type: "primary",
                isshow: !isedit
            }
        ];
        return (
            <PageLayout
                className="nc-workbench-appRegister"
                header={
                    <PageLayoutHeader>
                        <div>应用注册</div>
                        <ButtonCreate
                            dataSource={btnList}
                            onClick={this.handleClick}
                        />
                    </PageLayoutHeader>
                }>
                <PageLayoutLeft>
                    <SearchTree onSelect={this.handleTreeNodeSelect} />
                </PageLayoutLeft>
                <PageLayoutRight>{this.switchFrom()}</PageLayoutRight>
            </PageLayout>
        );
    }
}
AppRegister.propTypes = {
    setTreeData: PropTypes.func.isRequired,
    setNodeData: PropTypes.func.isRequired,
    setPageButtonData: PropTypes.func.isRequired,
    setPageTemplateData: PropTypes.func.isRequired,
    setAppParamData: PropTypes.func.isRequired
};
export default connect(
    state => ({}),
    {
        setTreeData,
        setNodeData,
        setPageButtonData,
        setPageTemplateData,
        setAppParamData
    }
)(AppRegister);
