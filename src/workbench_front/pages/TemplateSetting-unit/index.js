import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Layout, Modal, Tree, Input, Select, Menu, Dropdown, Icon, Tabs } from 'antd';
import { PageLayout, PageLayoutHeader, PageLayoutLeft, PageLayoutRight } from 'Components/PageLayout';
import { createTree } from 'Pub/js/createTree';
import Ajax from 'Pub/js/ajax.js';
import Item from 'antd/lib/list/Item';
import Notice from 'Components/Notice';
import BusinessUnitTreeRefUnit from 'Components/Refers/BusinessUnitTreeRefUnit';
import 'nc-lightapp-front/dist/platform/nc-lightapp-front/index.css';
import PreviewModal from './showPreview';
import AssignComponent from './assignComponent';
import { openPage } from 'Pub/js/superJump';
import Svg from 'Components/Svg';
import { generateData, generateTemData, generateTreeData, generateRoData } from './method';
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
            selectedKeys: [],
            selectedTemKeys: [],
            treeDataArray: [],
            treeData: [],
            searchValue: '',
            autoExpandParent: true,
            autoExpandTemParent: true,
            treeTemBillData: [], //单据模板数据
            treeTemPrintData: [],
            treePrintTemData: [],
            treeTemBillDataArray: [],
            treeTemPrintDataArray: [],
            templatePks: '',
            visible: false,
            templateNameVal: '',
            pageCode: '',
            appCode: '',
            nodeKey: '',
            alloVisible: false,
            org_df_biz: {
                // 默认业务单元
                refcode: '',
                refname: '',
                refpk: ''
            },
            orgidObj: {},
            parentIdcon: '', //树节点的key
            templateType: '',
            previewPrintVisible: false,
            def1: '',
            previewPrintContent: '',
            batchSettingModalVisibel: false //控制预览摸态框的显隐属性
        };
    }
    // 按钮显隐性控制
    setBtnsShow = (item) => {
        let { parentIdcon, def1, templateType } = this.state;
        let { name } = item;
        let isShow = false;
        switch (name) {
            case '修改':
                if (parentIdcon === 'root' || parentIdcon === 'groupRoot' || templateType === 'group') {
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
                if (parentIdcon === 'root' || parentIdcon === 'groupRoot' || templateType === 'group') {
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
                if (parentIdcon === 'groupRoot') {
                    isShow = false;
                } else {
                    if (parentIdcon) {
                        isShow = true;
                    } else {
                        isShow = false;
                    }
                }
                break;
            case '分配':
                if (parentIdcon === 'root' || parentIdcon === 'groupRoot' || templateType === 'group') {
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
                if (parentIdcon === 'groupRoot') {
                    isShow = false;
                } else {
                    if (parentIdcon) {
                        isShow = true;
                    } else {
                        isShow = false;
                    }
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
                <Button key={name} className='margin-left-6' type={type} onClick={this.handleClick.bind(this, name)}>
                    {name}
                </Button>
            );
        }
    };
    //保存
    handleOk = (e) => {
        let { templateNameVal, templateTitleVal, templatePks, pageCode, def1, appCode, orgidObj } = this.state;
        if (!templateNameVal) {
            Notice({ status: 'warning', msg: '请输入模板标题' });
            return;
        }
        let infoData = {
            pageCode: pageCode,
            templateId: templatePks,
            name: templateNameVal,
            appCode: appCode,
            orgId: orgidObj.refpk
        };
        let url;
        if (def1 === 'apppage') {
            infoData.templateType = 'bill';
            url = `/nccloud/platform/template/copyTemplate.do`;
        } else if (def1 === 'menuitem') {
            if (!templateTitleVal) {
                Notice({ status: 'warning', msg: '请输入模板标题' });
                return;
            }
            infoData.templateType = 'print';
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
    //按钮事件的触发
    handleClick = (btnName) => {
        let { templateNameVal, templatePks, appCode, pageCode, def1, orgidObj } = this.state;
        let infoData = {
            templateId: templatePks
        };
        if (!orgidObj.refpk) {
            Notice({ status: 'warning', msg: '请选中业务单元' });
            return;
        }
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
                if (def1 === 'menuitem') {
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
                    openPage(`ZoneSetting`, false, {
                        templetid: templatePks,
                        status: 'templateSetting-unit'
                    });
                }
                break;
            case '删除':
                let url;
                let _this = this;
                if (def1 === 'menuitem') {
                    url = `/nccloud/platform/template/deletePrintTemplate.do`;
                } else {
                    url = `/nccloud/platform/template/deleteTemplateDetail.do`;
                }
                confirm({
                    closable: false,
                    title: '是否要删除?',
                    content: '',
                    okText: '确认',
                    okType: 'danger',
                    cancelText: '取消',
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
                                    Notice({
                                        status: 'success',
                                        msg: '删除成功'
                                    });
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
                if (def1 === 'menuitem') {
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
            treeTemPrintData,
            treeTemBillDataArray,
            treeTemPrintDataArray,
            selectedKeys,
            parentIdcon,
            def1
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
        } else if (templateType === 'print') {
            treeTemPrintDataArray.map((item) => {
                if (item.isDefault === 'y') {
                    item.name = item.name + ' [默认]';
                }
            });
            treeInfo = generateTemData(treeTemPrintDataArray);
        }
        let { treeArray, treeObj } = treeInfo;
        treeArray.map((item, index) => {
            const groupObj = {
                name: '集团模板',
                title: '集团模板',
                pk: 'qazwsxedc1' + item.pk,
                code: '1001',
                parentId: 'groupRoot',
                children: []
            };
            const orgIdObj = {
                title: '组织模板',
                name: '组织模板',
                pk: 'qazwsxedc2' + item.pk,
                code: '1002',
                parentId: 'groupRoot',
                children: []
            };
            item.children.push(groupObj);
            item.children.push(orgIdObj);
            for (const key in treeObj) {
                if (treeObj.hasOwnProperty(key)) {
                    if (item.templateId === treeObj[key][0].parentId) {
                        if (treeObj[key][0].type === 'group') {
                            item.children[0].children.push(treeObj[key][0]);
                        } else if (treeObj[key][0].type === 'org') {
                            item.children[1].children.push(treeObj[key][0]);
                        }
                    }
                }
            }
        });
        //处理树数据
        treeData = treeInfo.treeArray;
        treeData = generateTreeData(treeData);
        if (templateType === 'bill') {
            if (def1 === 'apppage') {
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
        } else if (templateType === 'print') {
            if (def1 === 'menuitem') {
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
    //加载右侧模板数据
    onSelectQuery = (key, e) => {
        const { orgidObj } = this.state;
        if (!orgidObj.refpk) {
            Notice({ status: 'warning', msg: '请选中业务单元' });
            return;
        }
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
        let { pageCode, appCode, orgidObj } = this.state;
        let infoData = {
            pageCode: pageCode,
            appCode: appCode,
            orgId: orgidObj.refpk
        };
        if (!infoData.pageCode) {
            return;
        }
        infoData.templateType = 'bill';
        this.reqTreeTemAjax(infoData, 'bill');
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
        let { def1 } = this.state;
        let templateType = '';
        if (def1 === 'apppage') {
            templateType = 'bill';
        } else if (def1 === 'menuitem') {
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
                templatePks: e.selectedNodes[0].props.refData.templateId,
                parentIdcon: e.selectedNodes[0].props.refData.parentId,
                templateNameVal: e.selectedNodes[0].props.refData.name,
                templateTitleVal: e.selectedNodes[0].props.refData.code,
                templateType: e.selectedNodes[0].props.refData.type
            });
        } else {
            this.setState({
                selectedTemKeys: key,
                templatePks: '',
                templateNameVal: '',
                parentIdcon: '',
                templateTitleVal: '',
                templateType: ''
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
    //树组件的封装
    treeResAndUser = (data, typeSelect, hideSearch, selectedKeys, expandedKeys, autoExpandParent, typeClass) => {
        const { searchValue } = this.state;
        const loop = (data) => {
            return data.map((item) => {
                let { code, name, pk } = item;
                let text = `${code} ${name}`;
                if (code === '00') {
                    text = `${name}`;
                }
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
                        <span>
                            <span> {text} </span>
                        </span>
                    );
                if (item.children) {
                    return (
                        <TreeNode
                            key={pk}
                            title={title}
                            refData={item}
                            icon={
                                <Svg
                                    width={15}
                                    height={13}
                                    xlinkHref={
                                        expandedKeys.indexOf(item.pk) === -1 ? (
                                            '#icon-wenjianjia'
                                        ) : (
                                            '#icon-wenjianjiadakai'
                                        )
                                    }
                                />
                            }
                        >
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode icon={<span className='tree-dot' />} key={pk} title={title} refData={item} />;
            });
        };
        return (
            <div className={typeClass ? typeClass : ''}>
                {hideSearch ? (
                    ''
                ) : (
                    <div className='fixed-search-input'>
                        <Search
                            style={{ marginBottom: 8 }}
                            placeholder='菜单查询'
                            onChange={this.onChange}
                            value={searchValue}
                        />
                    </div>
                )}
                {data.length > 0 && (
                    <Tree
                        showLine
                        showIcon
                        onExpand={(key, node) => {
                            this.onExpand(typeSelect, key);
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
        0;
    };
    //参照的回调函数
    handdleRefChange = (value) => {
        let { orgidObj } = this.state;
        let { refname, refcode, refpk } = value;
        orgidObj = {};
        orgidObj['refname'] = refname;
        orgidObj['refcode'] = refcode;
        orgidObj['refpk'] = refpk;
        this.setState({
            orgidObj,
            org_df_biz: value
        });
    };
    showModal = () => {
        this.setState({ previewPrintVisible: true }, () => {
            this.printModalAjax(this.state.templatePks);
        });
    };
    hideModal = () => {
        this.setState({ previewPrintVisible: false });
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
                    document.getElementsByClassName('printContent')[0].innerHTML = data.data;
                }
            }
        });
    };
    render() {
        const {
            treeData,
            treeTemBillData,
            treeTemPrintData,
            templateNameVal,
            visible,
            alloVisible,
            pageCode,
            org_df_biz,
            def1,
            templatePks,
            batchSettingModalVisibel,
            appCode,
            nodeKey,
            templateTitleVal,
            treeDataArray,
            selectedKeys,
            selectedTemKeys,
            expandedKeys,
            expandedTemKeys,
            autoExpandParent,
            autoExpandTemParent,
            orgidObj,
            previewPrintContent,
            previewPrintVisible
        } = this.state;
        const leftTreeData = [
            {
                code: '00',
                name: '菜单树',
                pk: '00',
                children: createTree(treeDataArray, 'code', 'pid')
            }
        ];
        return (
            <PageLayout
                className='nc-workbench-templateSetting'
                header={
                    <PageLayoutHeader>
                        <BusinessUnitTreeRefUnit
                            value={org_df_biz}
                            placeholder={'默认业务单元'}
                            onChange={(value) => {
                                this.handdleRefChange(value);
                            }}
                        />
                        <div className='buttons-component'>
                            {(treeTemBillData.length > 0 || treeTemPrintData.length > 0) &&
                                Btns.map((item, index) => {
                                    item = this.setBtnsShow(item);
                                    return this.creatBtn(item);
                                })}
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
                        autoExpandParent,
                        'templateSetting-searchTree'
                    )}
                </PageLayoutLeft>
                <PageLayoutRight>
                    {def1 == 'apppage' ? (
                        <div>
                            <p className='template-title'>页面模板</p>
                            {treeTemBillData.length > 0 &&
                                this.treeResAndUser(
                                    treeTemBillData,
                                    'templateOnselect',
                                    'hideSearch',
                                    selectedTemKeys,
                                    expandedTemKeys,
                                    autoExpandTemParent
                                )}
                        </div>
                    ) : def1 == 'menuitem' ? (
                        <div>
                            <p className='template-title'>打印模板</p>
                            {treeTemPrintData.length > 0 &&
                                this.treeResAndUser(
                                    treeTemPrintData,
                                    'templateOnselect',
                                    'hideSearch',
                                    selectedTemKeys,
                                    expandedTemKeys,
                                    autoExpandTemParent
                                )}
                        </div>
                    ) : (
                        ''
                    )}
                </PageLayoutRight>
                {batchSettingModalVisibel && (
                    <PreviewModal
                        templetid={templatePks}
                        batchSettingModalVisibel={batchSettingModalVisibel}
                        setModalVisibel={this.setModalVisibel}
                    />
                )}
                <Modal
                    closable={false}
                    title='请录入正确的模板名称和标题'
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText={'确认'}
                    cancelText={'取消'}
                >
                    <div className='copyTemplate'>
                        <div>
                            <label htmlFor=''>模板名称：</label>
                            <Input
                                value={templateNameVal}
                                style={{ width: '80%' }}
                                placeholder='请输入名称'
                                onChange={(e) => {
                                    const templateNameVal = e.target.value;
                                    this.setState({
                                        templateNameVal
                                    });
                                }}
                            />
                        </div>
                        {def1 === 'menuitem' &&
                        treeTemPrintData.length > 0 && (
                            <div>
                                <label htmlFor=''>模板标题：</label>
                                <Input
                                    style={{ width: '80%' }}
                                    value={templateTitleVal}
                                    placeholder='请输入标题'
                                    onChange={(e) => {
                                        const templateTitleVal = e.target.value;
                                        this.setState({
                                            templateTitleVal
                                        });
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </Modal>
                <Modal
                    closable={false}
                    title='打印模板预览'
                    visible={previewPrintVisible}
                    onCancel={this.hideModal}
                    footer={null}
                >
                    <div className='printContent' />
                </Modal>
                {alloVisible && (
                    <AssignComponent
                        templatePks={templatePks}
                        alloVisible={alloVisible}
                        setAssignModalVisible={this.setAssignModalVisible}
                        pageCode={pageCode}
                        def1={def1}
                        appCode={appCode}
                        nodeKey={nodeKey}
                        orgidObj={orgidObj}
                    />
                )}
            </PageLayout>
        );
    }
}
export default TemplateSetting;
