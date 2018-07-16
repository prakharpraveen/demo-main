import React, { Component } from "react";
import { connect } from "react-redux";
import { Select, AutoComplete, Icon, Popover } from "antd";
import PropTypes from "prop-types";
import moment from "moment";
import { GetQuery } from "Pub/js/utils";
import { withRouter } from "react-router-dom";
import { changeDrawer, setAccountInfo } from "Store/appStore/action";
import AllApps from "Pages/AllApps/index";
import SideDrawer from "./SideDrawer";
import Breadcrumb from "Components/Breadcrumb";
// 工作桌面单页通用布局
import TabsLink from "Components/TabsLink";
import BusinessDate from "./BusinessDate";
import { sprLog } from "./spr";
import UserLogo from "Assets/images/userLogo.jpg";
import "./index.less";
import Ajax from "Pub/js/ajax";
const Option = Select.Option;
let resizeWaiter = false;
/**
 * 工作桌面整体布局组件
 */
class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodeName: "首页",
            isShowSearch: false,
            sprType: true,
            dataSource: [],
            // 所属集团
            currentData: [],
            selectedKey: "",
            newDate: moment(),
            allAppsVisible: false
        };
    }
    /**
     * 组织切换
     * @param {String} value 选中组织的value值
     */
    handleChange = value => {
        Ajax({
            url: `/nccloud/platform/appregister/switchgroup.do`,
            data: {
                pk_group: value
            },
            info: {
                name: "工作桌面",
                action: "集团切换"
            },
            success: ({ data: { data } }) => {
                if (data.msg) {
                    this.setState(
                        { selectedKey: value },
                        this.props.updateHomePage
                    );
                }
            }
        });
    };
    /**
     * 业务日期切换
     */
    handleDateChange = newDate => {
        Ajax({
            url: `/nccloud/platform/appregister/setbizdate.do`,
            info: {
                name: "业务日期",
                action: "更改业务日期"
            },
            data: {
                bizDateTime: `${newDate.valueOf()}`
            },
            success: ({ data: { data } }) => {
                if (data) {
                    this.setState({ newDate });
                }
            }
        });
    };
    /**
     * 更新标题名称
     */
    handleUpdateTitleName = () => {
        let { n } = GetQuery(this.props.location.search);
        if (n && n !== "null") {
            let nodeName = n;
            this.setState(
                {
                    nodeName
                },
                () => {
                    this.updateTitle(`${nodeName}`);
                }
            );
        } else {
            this.setState(
                {
                    nodeName: "首页"
                },
                () => {
                    this.updateTitle("首页");
                }
            );
        }
    };
    /**
     * 更新title显示名称
     */
    updateTitle = title => {
        document.title = title;
    };
    /**
     * 搜索全部应用 输入框展开
     */
    changeSearchInput = () => {
        const { isShowSearch } = this.state;
        this.setState({ isShowSearch: !isShowSearch }, () => {
            if (this.state.isShowSearch) {
                this.autoCompleteInput.focus();
            }
        });
    };
    /**
     * 搜索全部应用选中应用操作
     */
    onSelect = value => {
        const { dataSource } = this.state;
        let targetApp = {};
        dataSource.map(d => {
            if (d.value === value) {
                targetApp = d;
            }
        });
        window.openNew(targetApp);
    };
    /**
     * 搜索全部应用 查询操作
     */
    handleSearch = value => {
        if (value === "") {
            return;
        }
        if (!resizeWaiter) {
            resizeWaiter = true;
            setTimeout(() => {
                resizeWaiter = false;
                Ajax({
                    url: `/nccloud/platform/appregister/searchmenuitem.do`,
                    info: {
                        name: "应用搜索",
                        action: "模糊搜索应用"
                    },
                    data: {
                        search_content: value,
                        apptype: "1"
                    },
                    success: res => {
                        const { data, success } = res.data;
                        if (
                            success &&
                            data &&
                            data.children &&
                            data.children.length > 0
                        ) {
                            const dataSource = [];
                            data.children.map(c => {
                                dataSource.push({
                                    value: c.value,
                                    text: c.label,
                                    code: c.code,
                                    appcode: c.appcode,
                                    label: c.label,
                                    appid: c.appid
                                });
                            });
                            this.setState({ dataSource });
                        }
                    }
                });
            }, 100);
        }
    };
    /**
     * 创建搜索全部应用
     */
    getSearchDom = () => {
        const { isShowSearch } = this.state;
        if (isShowSearch) {
            const { dataSource } = this.state;
            return (
                <span
                    field="global-search"
                    fieldname="全局搜索"
                    className="margin-right-10 autocomplete"
                >
                    <AutoComplete
                        ref={input => (this[`autoCompleteInput`] = input)}
                        dataSource={dataSource}
                        dropdownClassName={"field_global-search"}
                        style={{ width: 200, height: 30 }}
                        onSelect={this.onSelect}
                        onSearch={this.handleSearch}
                        placeholder="请输入应用名称"
                    />
                    <i
                        field="search"
                        fieldname="查询"
                        className="iconfont icon-sousuo"
                        onClick={this.changeSearchInput}
                    />
                </span>
            );
        } else {
            return (
                <span
                    field="global-search"
                    fieldname="全局搜索"
                    className="margin-right-10"
                >
                    <i
                        title="应用搜索"
                        field="search"
                        fieldname="查询"
                        className="iconfont icon-sousuo"
                        onClick={this.changeSearchInput}
                    />
                </span>
            );
        }
    };
    /**
     * spr录制
     */
    handleSprClick = () => {
        let { sprType } = this.state;
        sprType = sprLog(sprType, sprType => {
            this.setState({ sprType });
        });
    };
    /**
     * 用户信息查询
     */
    reqInfoData = () => {
        Ajax({
            url: `/nccloud/platform/appregister/querypersonsettings.do`,
            info: {
                name: "工作桌面",
                action: "业务日期|集团|个人头像|用户名称"
            },
            success: ({ data: { data } }) => {
                if (data.length > 0) {
                    let { pk_group, bizDateTime, userName, userId } = data.find(
                        item => item.is_selected
                    );
                    let newDate = moment(bizDateTime - 0 * 1000);
                    this.props.setAccountInfo({
                        newDate,
                        selectedKey: pk_group,
                        userName: userName ? userName : "用户名",
                        userID: userId
                    });
                    this.setState(
                        {
                            newDate,
                            currentData: data,
                            selectedKey: pk_group
                        },
                        () => {
                            this.businessInfoSetting(bizDateTime, userId, pk_group);
                        }
                    );
                }
            }
        });
    };
    /**
     * 为全局添加业务信息
     * 如： 业务日期 业务集团信息 用户id
     * @param {String}  businessDate 业务日期
     * @param {String} userId 用户id
     * @param {String} groupId 集团id
     */
    businessInfoSetting = (businessDate, userId, groupId) => {
        window.businessInfo = {
            businessDate,
            userId,
            groupId
        };
    };
    /**
     * 页签激活重新查询用户信息
     */
    handleVisibilityChange = () => {
        if (document.visibilityState !== "hidden") {
            this.reqInfoData();
        }
    };
    componentDidMount() {
        this.handleUpdateTitleName();
        this.reqInfoData();
        window.addEventListener("hashchange", this.handleUpdateTitleName);
        window.addEventListener(
            "visibilitychange",
            this.handleVisibilityChange
        );
    }
    componentWillUnmount() {
        window.removeEventListener("hashchange", this.handleUpdateTitleName);
        window.removeEventListener(
            "visibilitychange",
            this.handleVisibilityChange
        );
    }
    render() {
        let {
            nodeName,
            sprType,
            newDate,
            currentData,
            selectedKey
        } = this.state;
        let { isOpen } = this.props;
        return (
            <div className="nc-workbench-layout">
                <div
                    className="nc-workbench-top-container  nccwb-header"
                    onClick={() => {
                        if (isOpen) {
                            this.props.changeDrawer(!isOpen);
                        } else {
                            return;
                        }
                    }}
                    ref="ncWorkbenchTopContainer"
                    style={{ zIndex: "1" }}
                >
                    <nav
                        field="top-area"
                        fieldname={nodeName}
                        className="nc-workbench-nav"
                    >
                        <div className="nav-left n-left n-v-middle">
                            <div
                                className="nc-workbench-hp margin-right-10"
                                onClick={() => {
                                    this.props.changeDrawer(!isOpen);
                                }}
                            >
                                <img
                                    field="logo"
                                    fieldname="标识"
                                    src={UserLogo}
                                    alt="logo"
                                />
                            </div>
                            <div field="group-switch" fieldname="集团切换">
                                <Select
                                    dropdownClassName="field_group-switch"
                                    value={selectedKey}
                                    style={{ width: 234 }}
                                    onChange={this.handleChange}
                                >
                                    {currentData.map((item, index) => {
                                        return (
                                            <Option
                                                key={item.pk_group}
                                                value={item.pk_group}
                                            >
                                                {item.name}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="nav-middle">
                            {/* <Link to='/'>首页</Link> */}
                            <span>{nodeName}</span>
                        </div>
                        <div className="nav-right n-right n-v-middle">
                            <span
                                className="margin-right-10"
                                field="spr"
                                fieldname="录制SPR"
                                onClick={this.handleSprClick}
                            >
                                {sprType ? (
                                    <Icon
                                        title="开始录制SPR"
                                        type="play-circle-o"
                                        className="iconfont"
                                    />
                                ) : (
                                    <Icon
                                        title="结束录制SPR"
                                        type="pause-circle-o"
                                        className="iconfont"
                                    />
                                )}
                            </span>
                            {this.getSearchDom()}
                            <span className="margin-right-10">
                                <Popover
                                    overlayClassName="all-apps-popover"
                                    getPopupContainer={() => {
                                        return this.refs
                                            .ncWorkbenchTopContainer;
                                    }}
                                    content={<AllApps />}
                                    placement="bottomRight"
                                    arrowPointAtCenter={true}
                                    onVisibleChange={isVisible => {
                                        this.setState({
                                            allAppsVisible: isVisible
                                        });
                                    }}
                                    trigger="click"
                                >
                                    <i
                                        title="全部应用"
                                        field="application"
                                        fieldname="全部应用"
                                        className={
                                            this.state.allAppsVisible
                                                ? "iconfont icon-shituliebiaoqiehuan"
                                                : "iconfont icon-quanbuyingyong"
                                        }
                                    />
                                </Popover>
                            </span>
                            <span className="margin-right-10">
                                <i
                                    field="message"
                                    fieldname="消息"
                                    className="iconfont icon-xiaoxi"
                                />
                            </span>
                        </div>
                    </nav>
                    <div
                        field="top-info"
                        fieldname="顶栏信息"
                        className="nccwb-header-info"
                    >
                        {this.props.location.pathname === "/" ? (
                            <TabsLink />
                        ) : (
                            <Breadcrumb />
                        )}
                        <BusinessDate
                            onChange={this.handleDateChange}
                            date={newDate}
                        />
                    </div>
                </div>
                <div className="nc-workbench-container">
                    {this.props.children}
                </div>
                <SideDrawer />
            </div>
        );
    }
}
Layout.propTypes = {
    appData: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    changeDrawer: PropTypes.func.isRequired,
    updateHomePage: PropTypes.func.isRequired,
    setAccountInfo: PropTypes.func.isRequired
};
export default withRouter(
    connect(
        state => ({
            appData: state.appData,
            isOpen: state.appData.isOpen,
            updateHomePage: state.homeData.updateHomePage
        }),
        { changeDrawer, setAccountInfo }
    )(Layout)
);
