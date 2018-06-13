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
            nodeInfo: {
                id: "",
                code: "",
                name: ""
            },
            isedit: false,
            isNew: false
        };
        this.historyOptype;
        this.historyNodeData;
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
                this.props.setNodeData(this.historyNodeData);
                this.setState({
                    optype: this.historyOptype,
                    isedit: false,
                    isNew: false
                });
                break;
            case "del":
                this.del();
                break;
            case "edit":
                this.historyNodeData = this.props.nodeData;
                this.historyOptype = this.state.optype;
                this.setState({
                    isedit: true,
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
        this.historyOptype = this.state.optype;
        this.historyNodeData = this.props.nodeData;
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
        this.setState({
            isedit: true,
            isNew: true
        });
    };
    /**
     * 添加应用分类
     */
    addAppClass = () => {
        this.historyOptype = this.state.optype;
        this.historyNodeData = this.props.nodeData;
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
        this.setState({
            isedit: true,
            isNew: true
        });
    };
    /**
     * 添加页面
     */
    addApp = () => {
        this.historyOptype = this.state.optype;
        this.historyNodeData = this.props.nodeData;
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
        this.setState({
            isedit: true,
            isNew: true
        });
    };
    /**
     * 添加页面
     */
    addPage = () => {
        this.historyOptype = this.state.optype;
        this.historyNodeData = this.props.nodeData;
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
        this.setState({
            isedit: true,
            isNew: true
        });
    };
    /**
     * 保存
     */
    save = () => {
        if (dataCheck(this.props.nodeData)) {
            return;
        }
        let fromData = dataRestore(this.props.nodeData);
        if (fromData.children) {
            delete fromData.children;
        }
        let {
            optype,
            isNew,
            nodeInfo: {id, code}
        } = this.state;
        //  新增保存回调
        let newSaveFun = data => {
            this.reqTreeData();
            this.props.setNodeData(dataTransfer(data));
            this.setState({
                isedit: false,
                isNew: false
            });
            Notice({status: "success"});
        };
        //  对应树节点前两层 模块编辑保存成功回调
        let moduleEditFun = data => {
            this.reqTreeData();
            Notice({status: "success", msg: data.msg});
            this.setState({
                isedit: false,
                isNew: false
            });
        };
        //  对应树节点中间两层 应用分类 及 应用编辑后保存
        let appEditFun = data => {
            let treeData = {
                moduleid: data.pk_appregister,
                parentcode: code,
                systypecode: data.code,
                systypename: data.name,
                flag: "1"
            };
            this.updateTreeData(treeData);
            Notice({status: "success"});
            this.setState({
                isedit: false,
                isNew: false
            });
        };
        //  对应树节点中间两层 应用分类 及 应用编辑后保存
        let pageEditFun = data => {
            let treeData = {
                moduleid: data.pk_apppage,
                parentcode: data.code,
                systypecode: data.pagecode,
                systypename: data.pagename,
                flag: "2"
            };
            this.updateTreeData(treeData);
            Notice({status: "success"});
            this.setState({
                isedit: false,
                isNew: false
            });
        };
        if (isNew) {
            if (optype === "" || optype === "1") {
                if (id.length > 0) {
                    fromData.parentcode = id;
                }
                this.reqTreeNodeData(
                    {
                        name: "应用注册",
                        action: "模块新增"
                    },
                    `/nccloud/platform/appregister/insertmodule.do`,
                    fromData,
                    newSaveFun
                );
            }
            if (optype === "2" || optype === "3") {
                if (id.length > 0) {
                    fromData.parent_id = id;
                }
                this.reqTreeNodeData(
                    {
                        name: "应用注册",
                        action: "应用新增"
                    },
                    `/nccloud/platform/appregister/insertapp.do`,
                    fromData,
                    newSaveFun
                );
            }
            if (optype === "4") {
                if (id.length > 0) {
                    fromData.parent_id = id;
                    fromData.parentcode = code;
                }
                this.reqTreeNodeData(
                    {
                        name: "应用注册",
                        action: "页面新增"
                    },
                    `/nccloud/platform/appregister/insertpage.do`,
                    fromData,
                    newSaveFun
                );
            }
        } else {
            if (optype === "1" || optype === "2") {
                this.reqTreeNodeData(
                    {
                        name: "应用注册",
                        action: "模块编辑"
                    },
                    `/nccloud/platform/appregister/editmodule.do`,
                    fromData,
                    moduleEditFun
                );
            }
            if (optype === "3" || optype === "4") {
                this.reqTreeNodeData(
                    {
                        name: "应用注册",
                        action: "应用编辑"
                    },
                    `/nccloud/platform/appregister/editapp.do`,
                    fromData,
                    appEditFun
                );
            }
            if (optype === "5") {
                this.reqTreeNodeData(
                    {
                        name: "应用注册",
                        action: "页面编辑"
                    },
                    `/nccloud/platform/appregister/editpage.do`,
                    fromData,
                    pageEditFun
                );
            }
        }
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
                let {
                    optype,
                    nodeInfo: {id, code, name}
                } = _this.state;
                nodeData = dataRestore(_this.props.nodeData);
                let delFun = data => {
                    Notice({
                        status: "success",
                        msg: data.true
                    });
                    _this.props.delTreeData(nodeData);
                    _this.setState({
                        optype: this.historyOptype
                    });
                };
                if (optype === "1" || optype === "2") {
                    _this.reqTreeNodeData(
                        {
                            name: "应用注册",
                            action: "模块删除"
                        },
                        `/nccloud/platform/appregister/deletemodule.do`,
                        {
                            moduleid: id
                        },
                        delFun
                    );
                }
                if (optype === "3" || optype === "4") {
                    _this.reqTreeNodeData(
                        {
                            name: "应用注册",
                            action: "应用删除"
                        },
                        `/nccloud/platform/appregister/deleteapp.do`,
                        {
                            pk_appregister: id
                        },
                        delFun
                    );
                }
                if (optype === "5") {
                    _this.reqTreeNodeData(
                        {
                            name: "应用注册",
                            action: "页面删除"
                        },
                        `/nccloud/platform/appregister/deletepage.do`,
                        {
                            pk_apppage: id
                        },
                        delFun
                    );
                }
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
            // 对应树结构中的第一层
            case "1":
                return <ModuleFormCard isedit={this.state.isedit} />;
            // 对应树结构中的第二层
            case "2":
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
            success: ({data: {data}}) => {
                if (data) {
                    callback(data);
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
                    if (obj.moduleid.length === 2) {
                        optype = "1";
                    } else {
                        optype = "2";
                    }
                    this.props.setNodeData(dataTransfer(obj));
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
            optype,
            nodeInfo: {
                id: obj.moduleid,
                code: obj.systypecode,
                name: obj.name
            }
        });
    };
    /**
     * 更新树数组
     */
    updateTreeData = obj => {
        let treeDataArray = this.props.treeData;
        treeDataArray = treeDataArray.map((item, index) => {
            if (item.moduleid === obj.moduleid) {
                item = obj;
            }
            return item;
        });
        this.props.setTreeData(treeDataArray);
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
                isshow: !isedit && (optype === "" || optype === "1")
            },
            {
                code: "addAppClass",
                name: "增加应用分类",
                type: "primary",
                isshow: !isedit && optype === "2"
            },
            {
                code: "addApp",
                name: "增加应用",
                type: "primary",
                isshow: !isedit && optype === "3"
            },
            {
                code: "addPage",
                name: "增加页面",
                type: "primary",
                isshow: !isedit && optype === "4"
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
                isshow: !isedit && optype !== ""
            },
            {
                code: "edit",
                name: "修改",
                type: "primary",
                isshow: !isedit && optype !== ""
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
    nodeData: PropTypes.object.isRequired,
    treeData: PropTypes.array.isRequired,
    setTreeData: PropTypes.func.isRequired,
    setNodeData: PropTypes.func.isRequired,
    setPageButtonData: PropTypes.func.isRequired,
    setPageTemplateData: PropTypes.func.isRequired,
    setAppParamData: PropTypes.func.isRequired
};
export default connect(
    state => ({
        nodeData: state.AppRegisterData.nodeData,
        treeData: state.AppRegisterData.treeData
    }),
    {
        setTreeData,
        setNodeData,
        setPageButtonData,
        setPageTemplateData,
        setAppParamData
    }
)(AppRegister);
