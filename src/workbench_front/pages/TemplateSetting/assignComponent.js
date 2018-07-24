import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Layout, Modal, Tree, Input, Select, Menu, Dropdown, Icon, Tabs } from 'antd';
import { PageLayout } from 'Components/PageLayout';
import Ajax from 'Pub/js/ajax.js';
import Item from 'antd/lib/list/Item';
import Notice from 'Components/Notice';
import BusinessUnitGroupTreeRef from 'Components/Refers/BusinessUnitGroupTreeRef';
import Svg from 'Components/Svg';
import 'nc-lightapp-front/dist/platform/nc-lightapp-front/index.css';
import { generateData, generateTemData, generateTreeData, generateRoData } from './method';
const Option = Select.Option;
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const initRoTreeData = {
    key: 'abc1234567',
    id: 'abc1234567',
    text: '角色',
    name: '角色',
    title: '角色',
    children: []
};
const initUserTreeData = {
    key: 'abc2234567',
    id: 'abc2234567',
    text: '用户',
    name: '用户',
    title: '用户',
    children: []
};
const initAbiTreeData = {
    key: 'abc3334567',
    id: 'abc3334567',
    text: '职责',
    name: '职责',
    title: '职责',
    children: []
};
class AssignComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedKeys: [ '0' ],
            selectedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            templatePks: this.props.templatePks,
            pageCode: this.props.pageCode,
            appCode: this.props.appCode,
            nodeKey: this.props.nodeKey,
            nodeKeyValue: '',
            treeRoData: [],
            treeResData: [],
            org_df_biz: {
                // 默认业务单元
                refcode: '',
                refname: '集团',
                refpk: window.businessInfo.groupId
            },
            dataRoKey: '',
            dataRoObj: {},
            roleUserDatas: {},
            allowDataArray: [],
            treeAllowedData: [],
            allowedTreeKey: '',
            orgidObj: {},
            treeRoDataObj: {},
            tabActiveKey: '1',
            activeKey: this.props.activeKey
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            templatePks: nextProps.templatePks,
            pageCode: nextProps.pageCode,
            activeKey: nextProps.activeKey,
            appCode: nextProps.appCode
        });
    }
    componentDidMount() {
        let { orgidObj, org_df_biz } = this.state;
        if (org_df_biz.refpk) {
            orgidObj['refpk'] = org_df_biz.refpk;
            this.setState(
                {
                    orgidObj
                },
                () => {
                    this.reqRoTreeData();
                }
            );
        }
    }
    //已分配用户角色和职责的数据请求
    reqAllowTreeData = () => {
        let { pageCode, templatePks, orgidObj, activeKey, appCode, nodeKeyValue } = this.state;
        let infoData = {
            pageCode: pageCode,
            orgId: orgidObj.refpk,
            templateId: templatePks,
            appCode: appCode
        };
        if (activeKey === '1') {
            infoData.templateType = 'bill';
        }  else if (activeKey === '2') {
            infoData.templateType = 'print';
            if (infoData.pageCode) {
                delete infoData.pageCode;
            }
            infoData.pageCode = nodeKeyValue;
        }
        Ajax({
            url: `/nccloud/platform/template/listAssignmentsOfTemplate.do`,
            info: {
                name: '模板设置模块',
                action: '已分配用户和职责'
            },
            data: infoData,
            success: ({ data }) => {
                if (data.success) {
                    this.setState(
                        {
                            allowDataArray: data.data
                        },
                        this.restoreAllowedTree
                    );
                }
            }
        });
    };
    //已分配用户和职责的数据的组装
    restoreAllowedTree = () => {
        let { allowDataArray, treeAllowedData } = this.state;
        allowDataArray.map((item) => {
            item.text = item.name + item.code;
            item.key = item.id;
        });
        treeAllowedData = generateTreeData(allowDataArray);
        this.setState({
            treeAllowedData
        });
    };
    //角色和用户职责的数据请求
    reqRoTreeData = () => {
        let { orgidObj } = this.state;
        let infoData = {
            orgId: orgidObj.refpk
        };
        Ajax({
            url: `/nccloud/platform/template/getAllRoleUserAndResp.do`,
            info: {
                name: '应用注册模块',
                action: '角色和用户职责'
            },
            data: infoData,
            success: ({ data }) => {
                if (data.success && data.data) {
                    if (data.data.roles || data.data.users || data.data.resps) {
                        this.setState(
                            {
                                treeRoDataObj: data.data
                            },
                            this.restoreRoTreeData
                        );
                        this.restoreResTreeData(data.data.resps);
                    }
                    this.setState({
                        roleUserDatas: data.data
                    });
                    this.reqAllowTreeData();
                }
            }
        });
    };
    //职责数据组装
    restoreResTreeData = (data) => {
        if (data && data.length) {
            let { treeResData } = this.state;
            treeResData = [];
            let initResData = initAbiTreeData;
            data.map((item, index) => {
                let { code, id, name } = item;
                item.key = id;
                item.text = name + code;
            });
            initResData.children = data;
            treeResData.push(initResData);
            treeResData = generateTreeData(treeResData);
            this.setState({
                treeResData
            });
        }
    };
    //用户和角色数据的组装
    restoreRoTreeData = (data) => {
        let { treeRoData, treeRoDataObj } = this.state;
        treeRoData = [];
        let initRolesData = initRoTreeData;
        let initUsersData = initUserTreeData;
        initRolesData.children = generateRoData(treeRoDataObj.roles);
        initUsersData.children = generateRoData(treeRoDataObj.users);
        treeRoData.push(initRolesData);
        treeRoData.push(initUsersData);
        treeRoData = generateTreeData(treeRoData);
        this.setState({
            treeRoData
        });
    };
    //用户和角色的树点击方法
    selectRoFun = (key, e) => {
        if (key.length > 0) {
            this.setState(
                {
                    selectedKeys: key,
                    dataRoKey: key[0]
                },
                this.lookDataFun
            );
        } else {
            this.setState({
                selectedKeys: key,
                dataRoKey: ''
            });
        }
    };
    //在角色和职责树中找到当前选中树数据
    lookDataFun = () => {
        let { dataRoKey, dataRoObj, roleUserDatas } = this.state;
        if (!dataRoKey) {
            Notice({ status: 'warning', msg: '请选中信息' });
            return;
        }
        for (let key in roleUserDatas) {
            roleUserDatas[key].map((item, index) => {
                if (item.id === dataRoKey) {
                    dataRoObj.id = item.id;
                    dataRoObj.name = item.name;
                    dataRoObj.code = item.code;
                    if (key === 'users') {
                        dataRoObj.type = 'user';
                    } else if (key === 'roles') {
                        dataRoObj.type = 'role';
                    } else if (key === 'resps') {
                        dataRoObj.type = 'resp';
                    }
                }
            });
        }
        this.setState({
            dataRoObj
        });
    };
    //分配和取消分配方法
    allowClick = (name) => {
        let { dataRoObj, allowDataArray, treeAllowedData, allowedTreeKey } = this.state;
        let allowDataObj = {};
        switch (name) {
            case 'allowRole':
                let indexNum = '-1';
                if (allowDataArray && allowDataArray.length > 0) {
                    for (let i = 0; i < allowDataArray.length; i++) {
                        if (allowDataArray[i].id === dataRoObj.id) {
                            indexNum = 1;
                        }
                    }
                }
                if (Number(indexNum) <= 0) {
                    allowDataObj.id = dataRoObj.id;
                    allowDataObj.name = dataRoObj.name;
                    allowDataObj.code = dataRoObj.code;
                    allowDataObj.type = dataRoObj.type;
                    allowDataArray.push(allowDataObj);
                }
                allowDataArray.map((item) => {
                    item.text = item.name + item.code;
                    item.key = item.id;
                });
                treeAllowedData = generateTreeData(allowDataArray);
                break;
            case 'allowRoleCancel':
                if (!allowedTreeKey) {
                    Notice({ status: 'warning', msg: '请选中信息' });
                    return;
                }
                Array.prototype.remove = function(val) {
                    let index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };
                for (let i = 0; i < allowDataArray.length; i++) {
                    if (allowDataArray[i].id === allowedTreeKey) {
                        allowDataArray.remove(allowDataArray[i]);
                    }
                }
                treeAllowedData = generateTreeData(allowDataArray);
                break;
            default:
                break;
        }
        this.setState({
            treeAllowedData,
            allowDataArray
        });
    };
    //已分配树节点的选中方法
    onSelectedAllow = (key) => {
        if (key.length > 0) {
            this.setState({
                selectedKeys: key,
                allowedTreeKey: key[0]
            });
        } else {
            this.setState({
                selectedKeys: key,
                allowedTreeKey: ''
            });
        }
    };
    //树点击事件的集合
    onSelect = (typeSelect, key, e) => {
        switch (typeSelect) {
            case 'resOnselect':
                this.selectRoFun(key, e);
                break;
            case 'allowedOnselect':
                this.onSelectedAllow(key, e);
            default:
                break;
        }
    };
    onExpand = (expandedKeys) => {
        this.setState({ expandedKeys, autoExpandParent: true });
    };
    onSearch = (e) => {
        const value = e.target.value;
        let { treeRoData } = this.state;
        let keyArray = [];
        const expandedKeys = treeRoData
            .map((item) => {
                if (item.children) {
                    item.children.map((ele) => {
                        if (ele.title.indexOf(value) > -1) {
                            keyArray.push(ele.key);
                        }
                    });
                    return keyArray;
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true
        });
    };
    treeResAndUser = (data, typeSelect, hideSearch) => {
        const { expandedKeys, autoExpandParent, selectedKeys, searchValue } = this.state;
        const loop = (data) => {
            return data.map((item) => {
                let { text, key, pk } = item;
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
                        <TreeNode key={key} title={text} refData={item}
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
                return <TreeNode icon={<span className='tree-dot' />} key={key} title={text} refData={item} />;
            });
        };
        return (
            <div>
                {data.length > 0 &&
                    (hideSearch ? (
                        ''
                    ) : (
                        <Search placeholder='Search' onChange={this.onSearch} />
                    ))}
                {data.length > 0 && (
                    <Tree
                        showLine
                        //showIcon
                        onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        onSelect={this.onSelect.bind(this, typeSelect)}
                        autoExpandParent={autoExpandParent}
                        selectedKeys={selectedKeys}
                    >
                        {loop(data)}
                    </Tree>
                )}
            </div>
        );
    };
    //模态框确定按钮方法
    handleAlloOk = () => {
        let { templatePks, pageCode, treeAllowedData, orgidObj, activeKey, appCode, nodeKeyValue } = this.state;
        if (!treeAllowedData) {
            Notice({ status: 'warning', msg: '请选中信息' });
            return;
        }
        let targets = {};
        for (let i = 0; i < treeAllowedData.length; i++) {
            let allowedData = treeAllowedData[i];
            for (let key in allowedData) {
                if (key === 'id') {
                    targets[allowedData[key]] = allowedData.type;
                }
            }
        }
        let newTargets = '';
        for (let key in targets) {
            newTargets = newTargets + `${key}:${targets[key]},`;
        }
        const newTargetsLen = newTargets.length;
        newTargets = newTargets.substr(0, newTargetsLen - 1);
        let infoData = {
            pageCode: pageCode,
            templateId: templatePks,
            orgId: orgidObj.refpk,
            appCode: appCode
        };
        infoData.targets = newTargets;
        if (activeKey === '1') {
            infoData.templateType = 'bill';
        } else if (activeKey === '2') {
            infoData.templateType = 'print';
            if (infoData.pageCode) {
                delete infoData.pageCode;
            }
            if (nodeKeyValue) {
                infoData.pageCode = nodeKeyValue;
            }
        }
        Ajax({
            url: `/nccloud/platform/template/assignTemplate.do`,
            data: infoData,
            info: {
                name: '模板设置',
                action: '模板分配保存'
            },
            success: ({ data }) => {
                if (data.success) {
                    Notice({ status: 'success', msg: '分配成功' });
                    this.props.setAssignModalVisible(false);
                }
            }
        });
    };
    //摸态框取消按钮方法
    handleOrlCancel = () => {
        this.props.setAssignModalVisible(false);
    };
    //业务单元参照回调方法
    handdleRefChange = (value) => {
        let { orgidObj } = this.state;
        let { refname, refcode, refpk } = value;
        orgidObj = {};
        orgidObj['refname'] = refname;
        orgidObj['refcode'] = refcode;
        orgidObj['refpk'] = refpk;
        this.setState(
            {
                orgidObj
            },
            this.reqRoTreeData
        );
    };
    render() {
        const {
            alloVisible,
            pageCode,
            org_df_biz,
            treeRoData,
            treeResData,
            allowDataArray,
            treeAllowedData,
            templatePks,
            nodeKey,
            activeKey,
            tabActiveKey
        } = this.state;
        return (
            <Modal
                title='多角色和用户模板分配'
                visible={this.props.alloVisible}
                onOk={this.handleAlloOk}
                onCancel={this.handleOrlCancel}
                okText={'确认'}
                cancelText={'取消'}
                width={720}
                keyboard={true}
                bodyStyle={{ padding: '15px' }}
            >
                <div className='allocationPage'>
                    <div className='pageCode-show'>
                        <p className='pageCodeName'>
                            <span>功能节点：</span>
                            <span>{pageCode ? pageCode : ''}</span>
                        </p>
                        {activeKey === '2' && (
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder='节点标识符'
                                optionFilterProp='children'
                                onSelect={(e) => {
                                    this.setState({
                                        nodeKeyValue: e
                                    });
                                }}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {nodeKey &&
                                    nodeKey.length > 0 &&
                                    nodeKey.map((item, index) => {
                                        if (item) {
                                            return <Option value={item}>{item}</Option>;
                                        }
                                    })}
                            </Select>
                        )}
                    </div>
                    <div className='allocationPage-content'>
                        <div className='allocationPage-content-tree'>
                            <div className='allocation-treeCom'>
                                <Tabs
                                    defaultActiveKey='1'
                                    onChange={(tabActiveKey) => {
                                        this.setState({ tabActiveKey });
                                    }}
                                    type='card'
                                    activeKey={tabActiveKey}
                                >
                                    <TabPane tab='按角色和用户分配' key='1'>
                                        <div className='allocation-treeScrollName'>
                                            {this.treeResAndUser(treeRoData, 'resOnselect')}
                                        </div>
                                    </TabPane>
                                    <TabPane tab='按职责分配' key='2'>
                                        <div className='allocation-treeScrollResp'>
                                            {this.treeResAndUser(treeResData, 'resOnselect')}
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                            <div className='allocation-button'>
                                <p>
                                    <Button onClick={this.allowClick.bind(this, 'allowRole')}>分配</Button>
                                </p>
                                <p>
                                    <Button onClick={this.allowClick.bind(this, 'allowRoleCancel')}>取消</Button>
                                </p>
                            </div>
                            <div className='allocation-treeContainer'>
                                <div className='allocation-select'>
                                    <BusinessUnitGroupTreeRef
                                        value={org_df_biz}
                                        placeholder={'默认业务单元'}
                                        onChange={(value) => {
                                            this.handdleRefChange(value);
                                        }}
                                    />
                                </div>
                                <div className='allocation-tree'>
                                    {treeAllowedData.length > 0 &&
                                        this.treeResAndUser(treeAllowedData, 'allowedOnselect', 'hideSearch')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
export default AssignComponent;
