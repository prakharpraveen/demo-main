import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Layout, Modal, Tree, Input, Select, Menu, Dropdown, Icon, Tabs } from 'antd';
import { PageLayout, PageLayoutHeader, PageLayoutLeft, PageLayoutRight } from 'Components/PageLayout';
import { createTree } from 'Pub/js/createTree';
import Ajax from 'Pub/js/ajax.js';
import Item from 'antd/lib/list/Item';
import Notice from 'Components/Notice';
import BusinessUnitTreeRef from 'Components/Refers/BusinessUnitTreeRef';
import 'nc-lightapp-front/dist/platform/nc-lightapp-front/index.css';
import PreviewModal from './showPreview';
import AssignComponent from './assignComponent';
import { openPage } from 'Pub/js/superJump';
import { generateTemData, generateTreeData, generateRoData } from './method';
import './index.less';
const Option = Select.Option;
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const { Header, Footer, Sider, Content } = Layout;

const Btns = [
    {
        name: '修改',
        type: 'primary'
    },
    {
        name: '删除',
        type: 'primary'
    },
    {
        name: '复制',
        type: 'primary'
    },
    {
        name: '分配',
        type: 'primary'
    },
    {
        name: '浏览',
        type: 'primary'
    }
];
class TemplateSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            siderHeight: '280',
            expandedKeys: [ '00' ],
            expandedTemKeys: [],
            selectedTemKeys: [],
            selectedKeys: [],
            treeDataArray: [],
            treeData: [],
            searchValue: '',
            autoExpandParent: true,
            autoExpandTemParent: true,
            treeTemBillData: [], //单据模板数据
            treeTemQueryData: [], //查询模板数据
            treeTemPrintData: [],
            treeTemBillDataArray: [],
            treeTemQueryDataArray: [],
            treeTemPrintDataArray: [],
            templatePks: '',
            visible: false,
            templateNameVal: '',
            templateTitleVal: '',
            pageCode: '',
            appCode: '',
            nodeKey: [],
            alloVisible: false,
            org_df_biz: {
                // 默认业务单元
                refcode: '',
                refname: '',
                refpk: ''
            },
            orgidObj: {},
            parentIdcon: '', //树节点的key
            activeKey: '1',
            batchSettingModalVisibel: false, //控制预览摸态框的显隐属性
            isDefaultTem: '',
            def1: '',
            previewPrintContent: '',
            previewPrintVisible: false
        };
    }
    // 按钮显隐性控制
    setBtnsShow = (item) => {
        let { parentIdcon, activeKey } = this.state;
        let { name } = item;
        let isShow = false;
        switch (name) {
            case '修改':
                if (parentIdcon === 'root') {
                    isShow = false;
                } else {
                    if (parentIdcon) {
                        isShow = true;
                    } else {
                        isShow = false;
                    }
                }
                break;
            case '删除':
                if (parentIdcon === 'root') {
                    isShow = false;
                } else {
                    if (parentIdcon) {
                        isShow = true;
                    } else {
                        isShow = false;
                    }
                }
                break;
            case '复制':
                if (parentIdcon) {
                    isShow = true;
                } else {
                    isShow = false;
                }
                break;
            case '分配':
                if (parentIdcon === 'root') {
                    isShow = false;
                } else {
                    if (parentIdcon) {
                        isShow = true;
                    } else {
                        isShow = false;
                    }
                }
                break;
            case '浏览':
                if (parentIdcon) {
                    isShow = true;
                } else {
                    isShow = false;
                }
                break;
            default:
                break;
        }
        return { ...item, isShow };
    };
    //生成按钮方法
    creatBtn = (btnObj) => {
        let { name, isShow, type } = btnObj;
        if (isShow) {
            return (
                <Button key={name} className='margin-left-10' type={type} onClick={this.handleClick.bind(this, name)}>
                    {name}
                </Button>
            );
        }
    };
    //保存
    handleOk = (e) => {
        let { templateNameVal, templateTitleVal, templatePks, pageCode, activeKey, appCode } = this.state;
        if (!templateNameVal) {
            Notice({ status: 'warning', msg: '请输入模板名称' });
            return;
        }
        let infoData = {
            pageCode: pageCode,
            templateId: templatePks,
            name: templateNameVal,
            appCode: appCode
        };
        let url;
        if (activeKey === '1') {
            infoData.templateType = 'bill';
            url = `/nccloud/platform/template/copyTemplate.do`;
        } else if (activeKey === '2') {
            infoData.templateType = 'query';
            url = `/nccloud/platform/template/copyTemplate.do`;
        } else if (activeKey === '3') {
            if (!templateTitleVal) {
                Notice({ status: 'warning', msg: '请输入模板标题' });
                return;
            }
            infoData.templateCode = templateTitleVal;
            url = `/nccloud/platform/template/copyPrintTemplate.do`;
        }
        Ajax({
            url: url,
            data: infoData,
            info: {
                name: '模板设置',
                action: '模板复制'
            },
            success: ({ data }) => {
                if (data.success) {
                    Notice({ status: 'success', msg: '复制成功' });
                    this.reqTreeTemData();
                    this.setState({
                        visible: false
                    });
                }
            }
        });
    };
    //取消
    handleCancel = (e) => {
        this.setState({
            visible: false
        });
    };
    //设置默认模板 菜单栏
    menuFun = () => {
        let { isDefaultTem } = this.state;
        let isButton = false;
        if (isDefaultTem === 'y') {
            isButton = true;
        }
        return (
            <Menu onClick={this.settingClick.bind(this)}>
                <Menu.Item key='设置默认'>
                    <button disabled={isButton}>设置默认</button>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key='取消默认'>
                    <button disabled={!isButton}>取消默认</button>
                </Menu.Item>
            </Menu>
        );
    };
    //设置默认模板方法
    settingClick = (key) => {
        let { templateNameVal, templatePks, pageCode, appCode } = this.state;
        let infoDataSet = {
            templateId: templatePks,
            pageCode: pageCode,
            appCode: appCode
        };
        const btnName = key.key;
        if (!templatePks) {
            Notice({ status: 'warning', msg: '请选择模板数据' });
            return;
        }
        let url;
        switch (btnName) {
            case '设置默认':
                url = '/nccloud/platform/template/setDefaultTemplate.do';
                this.setDefaultFun(url, infoDataSet, '设置默认');
                break;
            case '取消默认':
                url = '/nccloud/platform/template/cancelDefaultTemplate.do';
                this.setDefaultFun(url, infoDataSet, '取消默认');
                break;
            default:
                break;
        }
    };
    //按钮事件的触发
    handleClick = (btnName) => {
        let { templatePks, pageCode, activeKey, appCode } = this.state;
        let infoData = {
            templateId: templatePks
        };
        if (!templatePks) {
            Notice({ status: 'warning', msg: '请选择模板数据' });
            return;
        }
        switch (btnName) {
            case '复制':
                this.setState({
                    visible: true
                });
                break;
            case '修改':
                if (activeKey === '3') {
                    Ajax({
                        loading: true,
                        url: '/nccloud/riart/template/edittemplate.do',
                        data: { appcode: appCode, templateid: templatePks },
                        success: function(res) {
                            if (location.port) {
                                window.open(
                                    'uclient://start/' +
                                        'http://' +
                                        location.hostname +
                                        ':' +
                                        location.port +
                                        res.data.data
                                );
                            } else {
                                window.open('uclient://start/' + 'http://' + location.hostname + res.data.data);
                            }
                        },
                        error: function(res) {
                            alert('lm:' + res.message);
                        }
                    });
                } else {
                    //openPage(`TemplateSetting`, false, { pk: templateId });
                    openPage(`ZoneSetting`, false, { templetid: templatePks, status: 'templateSetting' });
                }
                break;
            case '删除':
                let url;
                if (activeKey === '3') {
                    url = `/nccloud/platform/template/deletePrintTemplate.do`;
                } else {
                    url = `/nccloud/platform/template/deleteTemplateDetail.do`;
                }
                let _this = this;
                confirm({
                    title: '确认删除这个模板信息吗?',
                    onOk() {
                        Ajax({
                            url: url,
                            data: infoData,
                            info: {
                                name: '模板设置',
                                action: '删除'
                            },
                            success: ({ data }) => {
                                if (data.success) {
                                    Notice({ status: 'success', msg: '删除成功' });
                                    _this.reqTreeTemData();
                                }
                            }
                        });
                    },
                    onCancel() {}
                });
                break;
            case '分配':
                this.setState({
                    alloVisible: true
                });
                break;
            case '浏览':
                if (activeKey === '3') {
                    this.showModal();
                } else {
                    this.setState({
                        batchSettingModalVisibel: true
                    });
                }
                break;
            default:
                break;
        }
    };
    printModalAjax = (templateId) => {
        let infoData = {};
        infoData.templateId = templateId;
        const url = `/nccloud/platform/template/previewPrintTemplate.do`;
        Ajax({
            url: url,
            data: infoData,
            info: {
                name: '模板设置',
                action: '打印模板预览'
            },
            success: ({ data }) => {
                if (data.success) {
                    document.getElementsByClassName("printContent")[0].innerHTML=data.data;
                }
            }
        });
    };
    /**
   * 设置默认模板的ajax请求
   * @param url 请求路径
   * @param infoData 请求参数
   * @param textInfo 请求成功后的提示信息
   */
    setDefaultFun = (url, infoData, textInfo) => {
        let { pageCode, activeKey, parentIdcon } = this.state;
        if (activeKey === '1') {
            infoData.templateType = 'bill';
        } else if (activeKey === '2') {
            infoData.templateType = 'query';
        } else if (activeKey === '3') {
            if (textInfo === '取消默认') {
                if (infoData.pageCode) {
                    delete infoData.pageCode;
                }
                url = `/nccloud/platform/template/cancelDefaultPrintTemplate.do`;
            } else if (textInfo === '设置默认') {
                infoData.parentId = parentIdcon;
                url = `/nccloud/platform/template/setDefaultPrintTemplate.do`;
            }
            if (infoData.templateType) {
                delete infoData.templateType;
            }
        }
        Ajax({
            url: url,
            data: infoData,
            info: {
                name: '模板设置',
                action: '参数查询'
            },
            success: ({ data }) => {
                if (data.success) {
                    Notice({ status: 'success', msg: data.msg });
                    this.reqTreeTemData();
                }
            }
        });
    };
    componentDidMount = () => {
        this.reqTreeData();
        // 样式处理
        // window.onresize = () => {
        // 	let siderHeight = document.querySelector('.ant-layout-content').offsetHeight;
        // 	this.setState({ siderHeight });
        // };
    };
    //右侧树组装数据
    restoreTreeTemData = (templateType) => {
        let {
            treeTemBillData,
            treeTemBillDataArray,
            treeTemPrintData,
            treeTemPrintDataArray,
            treeTemQueryDataArray,
            selectedTemKeys,
            parentIdcon,
            activeKey,
            treeTemQueryData
        } = this.state;
        let treeData = [];
        let treeInfo;
        if (templateType === 'bill') {
            treeTemBillDataArray.map((item) => {
                if (item.isDefault === 'y') {
                    item.name = item.name + ' [默认]';
                }
            });
            treeInfo = generateTemData(treeTemBillDataArray);
        } else if (templateType === 'query') {
            treeTemQueryDataArray.map((item) => {
                if (item.isDefault === 'y') {
                    item.name = item.name + ' [默认]';
                }
            });
            treeInfo = generateTemData(treeTemQueryDataArray);
        } else if (templateType === 'print') {
            treeTemPrintDataArray.map((item) => {
                if (item.isDefault === 'y') {
                    item.name = item.name + ' [默认]';
                }
            });
            treeInfo = generateTemData(treeTemPrintDataArray); //treeTemPrintDataArray
        }
        let { treeArray, treeObj } = treeInfo;
        treeArray.map((item, index) => {
            for (const key in treeObj) {
                if (treeObj.hasOwnProperty(key)) {
                    if (item.templateId === treeObj[key][0].parentId) {
                        item.children.push(treeObj[key][0]);
                    }
                }
            }
        });
        //处理树数据
        treeData = treeInfo.treeArray;
        treeData = generateTreeData(treeData);
        if (templateType === 'bill') {
            if (activeKey === '1') {
                if (treeData.length > 0) {
                    let newinitKeyArray = [];
                    newinitKeyArray.push(treeData[0].key);
                    this.setState({
                        selectedTemKeys: newinitKeyArray,
                        parentIdcon: treeData[0].parentId,
                        templatePks: treeData[0].pk,
                        templateNameVal: treeData[0].name
                    });
                }
            }
            treeTemBillData = treeData;
            this.setState({
                treeTemBillData
            });
        } else if (templateType === 'query') {
            if (activeKey === '2') {
                if (treeData.length > 0) {
                    let newinitKeyArray = [];
                    newinitKeyArray.push(treeData[0].key);
                    this.setState({
                        selectedTemKeys: newinitKeyArray,
                        parentIdcon: treeData[0].parentId,
                        templatePks: treeData[0].pk,
                        templateNameVal: treeData[0].name
                    });
                }
            }
            treeTemQueryData = treeData;
            this.setState({
                treeTemQueryData
            });
        } else if (templateType === 'print') {
            if (activeKey === '3') {
                if (treeData.length > 0) {
                    let newinitKeyArray = [];
                    newinitKeyArray.push(treeData[0].key);
                    this.setState({
                        selectedTemKeys: newinitKeyArray,
                        parentIdcon: treeData[0].parentId,
                        templatePks: treeData[0].pk,
                        templateNameVal: treeData[0].name,
                        templateTitleVal: treeData[0].code
                    });
                }
            }
            treeTemPrintData = treeData;
            this.setState({
                treeTemPrintData
            });
        }
    };
    onExpand = (typeSelect, expandedKeys) => {
        switch (typeSelect) {
            case 'systemOnselect':
                this.setState({
                    expandedKeys: expandedKeys,
                    autoExpandParent: false
                });
                break;
            case 'templateOnselect':
                this.setState({
                    expandedTemKeys: expandedKeys,
                    autoExpandTemParent: false
                });
                break;
            default:
                break;
        }
    };
    //tree的查询方法
    onChange = (e) => {
        const value = e.target.value;
        this.setState({ searchValue: value }, () => {
            this.handleSearch(value, this.handleExpanded);
        });
    };
    handleExpanded = (dataList) => {
        const expandedKeys = dataList.map((item, index) => {
            return item.pk;
        });
        expandedKeys.push('00');
        this.setState({
            expandedKeys,
            autoExpandParent: true
        });
    };
    handleSearch = (value, callback) => {
        Ajax({
            url: `/nccloud/platform/appregister/searchappmenuitem.do`,
            data: {
                search_content: value,
                containAppPage: true
            },
            info: {
                name: '菜单项',
                action: '查询应用树'
            },
            success: (res) => {
                let { success, data } = res.data;
                if (success && data) {
                    this.setState(
                        {
                            treeDataArray: data
                        },
                        () => {
                            callback(data);
                        }
                    );
                }
            }
        });
    };
    //加载右侧模板数据
    onSelectQuery = (key, e) => {
        if (key.length > 0) {
            this.setState(
                {
                    selectedKeys: key,
                    pageCode: e.selectedNodes[0].props.refData.code,
                    appCode: e.selectedNodes[0].props.refData.appCode,
                    def1: e.selectedNodes[0].props.refData.def1
                },
                this.reqTreeTemData
            );
        } else {
            this.setState({
                selectedKeys: key,
                pageCode: '',
                appCode: ''
            });
        }
    };
    //请求右侧树数据
    reqTreeTemData = (key) => {
        let { pageCode, activeKey, appCode } = this.state;
        let infoData = {
            pageCode: pageCode,
            appCode: appCode
        };
        if (!infoData.pageCode) {
            return;
        }
        infoData.templateType = 'bill';
        this.reqTreeTemAjax(infoData, 'bill');
        infoData.templateType = 'query';
        this.reqTreeTemAjax(infoData, 'query');
        if (infoData.pageCode) {
            delete infoData.pageCode;
        }
        infoData.templateType = 'print';
        this.reqTreeTemAjax(infoData, 'print');
    };
    //请求右侧树数据ajax方法封装
    reqTreeTemAjax = (infoData, templateType) => {
        Ajax({
            url: `/nccloud/platform/template/getTemplatesOfPage.do`,
            data: infoData,
            info: {
                name: '模板设置',
                action: '参数查询'
            },
            success: ({ data }) => {
                if (data.success) {
                    if (templateType === 'bill') {
                        this.setState(
                            {
                                treeTemBillDataArray: data.data
                            },
                            () => {
                                this.restoreTreeTemData(templateType);
                            }
                        );
                    } else if (templateType === 'query') {
                        this.setState(
                            {
                                treeTemQueryDataArray: data.data
                            },
                            () => {
                                this.restoreTreeTemData(templateType);
                            }
                        );
                    } else if (templateType === 'print') {
                        this.setState(
                            {
                                treeTemPrintDataArray: data.data
                            },
                            () => {
                                this.restoreTreeTemData(templateType);
                            }
                        );
                    }
                }
            }
        });
    };
    //单据模板树的onSelect事件
    onTemSelect = (key, e) => {
        let { activeKey, templateNameVal, parentIdcon } = this.state;
        let templateType = '';
        if (activeKey === '1') {
            templateType = 'bill';
        } else if (activeKey === '2') {
            templateType = 'query';
        } else if (activeKey === '3') {
            templateType = 'print';
            if (key.length > 0) {
                this.setState({
                    nodeKey: e.selectedNodes[0].props.refData.nodeKey
                });
            }
        }
        if (key.length > 0) {
            this.setState({
                selectedTemKeys: key,
                templatePks: key[0],
                parentIdcon: e.selectedNodes[0].props.refData.parentId,
                templateNameVal: e.selectedNodes[0].props.refData.name,
                isDefaultTem: e.selectedNodes[0].props.refData.isDefault,
                templateTitleVal: e.selectedNodes[0].props.refData.code
            });
        } else {
            this.setState({
                selectedTemKeys: key,
                templatePks: '',
                parentIdcon: '',
                templateNameVal: '',
                isDefaultTem: '',
                templateTitleVal: ''
            });
        }
    };
    /**
   * tree 数据请求
   */
    reqTreeData = () => {
        Ajax({
            url: `/nccloud/platform/appregister/querymenuitemstree.do`,
            info: {
                name: '应用注册模块',
                action: '查询'
            },
            success: ({ data }) => {
                if (data.success && data.data.length > 0) {
                    this.setState({
                        treeDataArray: data.data
                    });
                }
            }
        });
    };
    //树点击事件的汇总
    onSelect = (typeSelect, key, e) => {
        switch (typeSelect) {
            case 'systemOnselect':
                this.onSelectQuery(key, e);
                break;
            case 'templateOnselect':
                this.onTemSelect(key, e);
                break;
            default:
                break;
        }
    };
    //树组件的封装
    treeResAndUser = (data, typeSelect, hideSearch, selectedKeys, expandedKeys, autoExpandParent) => {
        const { searchValue } = this.state;
        const loop = (data) => {
            return data.map((item) => {
                let { code, name, pk } = item;
                if (code === '00') {
                    text = `${name}`;
                }
                let text = `${code} ${name}`;
                const index = text.indexOf(searchValue);
                const beforeStr = text.substr(0, index);
                const afterStr = text.substr(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span style={{ color: '#f50' }}>{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <div>
                            <span> {text} </span>
                        </div>
                    );
                if (item.children) {
                    return (
                        <TreeNode key={pk} title={title} refData={item}>
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={pk} title={title} refData={item} />;
            });
        };
        return (
            <div>
                {hideSearch ? '' : <Search style={{ marginBottom: 8 }} placeholder='Search' onChange={this.onChange} />}
                {data.length > 0 && (
                    <Tree
                        showLine
                        onExpand={(key, node) => {
                            this.onExpand(typeSelect, key, node);
                        }}
                        expandedKeys={expandedKeys}
                        onSelect={(key, node) => {
                            this.onSelect(typeSelect, key, node);
                        }}
                        autoExpandParent={autoExpandParent}
                        selectedKeys={selectedKeys}
                    >
                        {loop(data)}
                    </Tree>
                )}
            </div>
        );
    };
    //预览摸态框显示方法
    setModalVisibel = (visibel) => {
        this.setState({ batchSettingModalVisibel: visibel });
    };
    //分配摸态框显示方法
    setAssignModalVisible = (visibel) => {
        this.setState({ alloVisible: visibel });
    };
    showModal = () => {
        this.setState({ previewPrintVisible: true },()=>{
            this.printModalAjax(this.state.templatePks);
        });
    };
    hideModal = () => {
        this.setState({ previewPrintVisible: false });
    }
    render() {
        const {
            treeData,
            treeTemBillData,
            treeTemPrintData,
            treeTemQueryData,
            templateNameVal,
            templateTitleVal,
            visible,
            alloVisible,
            pageCode,
            org_df_biz,
            activeKey,
            templatePks,
            batchSettingModalVisibel,
            appCode,
            nodeKey,
            treeDataArray,
            selectedKeys,
            selectedTemKeys,
            parentIdcon,
            expandedKeys,
            expandedTemKeys,
            autoExpandParent,
            autoExpandTemParent,
            previewPrintContent,
            previewPrintVisible
        } = this.state;
        const leftTreeData = [
            {
                code: '00',
                name: '菜单树',
                pk: '',
                children: createTree(treeDataArray, 'code', 'pid')
            }
        ];
        return (
            <PageLayout
                className='nc-workbench-templateSetting'
                header={
                    <PageLayoutHeader>
                        <div>模板设置-集团</div>
                        <div className='buttons-component'>
                            {(treeTemBillData.length > 0 ||
                                treeTemQueryData.length > 0 ||
                                treeTemPrintData.length > 0) &&
                                Btns.map((item, index) => {
                                    item = this.setBtnsShow(item);
                                    return this.creatBtn(item);
                                })}
                            {(treeTemBillData.length > 0 || treeTemPrintData.length > 0) &&
                            parentIdcon &&
                            parentIdcon !== 'root' && (
                                <Dropdown overlay={this.menuFun()} trigger={[ 'click' ]}>
                                    <Button key='' className='margin-left-10' type='primary'>
                                        设置默认模板
                                    </Button>
                                </Dropdown>
                            )}
                        </div>
                    </PageLayoutHeader>
                }
            >
                <PageLayoutLeft
                    width={280}
                    height={'100%'}
                    style={{
                        background: '#fff',
                        width: '500px',
                        minHeight: 'calc(100vh - 64px - 48px)',
                        height: `${this.state.siderHeight}px`,
                        overflowY: 'auto',
                        padding: '20px'
                    }}
                >
                    {this.treeResAndUser(
                        leftTreeData,
                        'systemOnselect',
                        null,
                        selectedKeys,
                        expandedKeys,
                        autoExpandParent
                    )}
                </PageLayoutLeft>
                <PageLayoutRight>
                    <Tabs
                        defaultActiveKey='1'
                        onChange={(activeKey) => {
                            this.setState({ activeKey });
                        }}
                        type='card'
                        activeKey={activeKey}
                    >
                        <TabPane tab='页面模板' key='1'>
                            {treeTemBillData.length > 0 &&
                                this.treeResAndUser(
                                    treeTemBillData,
                                    'templateOnselect',
                                    'hideSearch',
                                    selectedTemKeys,
                                    expandedTemKeys,
                                    autoExpandTemParent
                                )}
                        </TabPane>
                        <TabPane tab='查询模板' key='2'>
                            {treeTemQueryData.length > 0 &&
                                this.treeResAndUser(
                                    treeTemQueryData,
                                    'templateOnselect',
                                    'hideSearch',
                                    selectedTemKeys,
                                    expandedTemKeys,
                                    autoExpandTemParent
                                )}
                        </TabPane>
                        <TabPane tab='打印模板' key='3'>
                            {treeTemPrintData.length > 0 &&
                                this.treeResAndUser(
                                    treeTemPrintData,
                                    'templateOnselect',
                                    'hideSearch',
                                    selectedTemKeys,
                                    expandedTemKeys,
                                    autoExpandTemParent
                                )}
                        </TabPane>
                    </Tabs>
                </PageLayoutRight>
                {batchSettingModalVisibel && (
                    <PreviewModal
                        templetid={templatePks}
                        batchSettingModalVisibel={batchSettingModalVisibel}
                        setModalVisibel={this.setModalVisibel}
                    />
                )}
                <Modal title='请录入正确的模板名称和编码' visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <div className='copyTemplate'>
                        <Input
                            value={templateNameVal}
                            placeholder='请输入名称'
                            onChange={(e) => {
                                const templateNameVal = e.target.value;
                                this.setState({
                                    templateNameVal
                                });
                            }}
                        />
                        {activeKey === '3' &&
                        treeTemPrintData.length > 0 && (
                            <Input
                                value={templateTitleVal}
                                placeholder='请输入标题'
                                onChange={(e) => {
                                    const templateTitleVal = e.target.value;
                                    this.setState({
                                        templateTitleVal
                                    });
                                }}
                            />
                        )}
                    </div>
                </Modal>
                <Modal
                        title='打印模板预览'
                        visible={previewPrintVisible}
                        onCancel={this.hideModal}
                        footer={null}
                    >
                        <div className='printContent'></div>
                    </Modal>
                {alloVisible && (
                    <AssignComponent
                        templatePks={templatePks}
                        alloVisible={alloVisible}
                        setAssignModalVisible={this.setAssignModalVisible}
                        pageCode={pageCode}
                        activeKey={activeKey}
                        appCode={appCode}
                        nodeKey={nodeKey}
                    />
                )}
            </PageLayout>
        );
    }
}
export default TemplateSetting;
