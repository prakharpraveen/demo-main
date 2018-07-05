import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { animateScroll, scrollSpy, Element } from "react-scroll";
import Ajax from "Pub/js/ajax";
import Svg from "Components/Svg";
import "./index.less";
import _ from "lodash";
import { updateGroupList } from "Store/home/action";
import {
    compactLayout,
    compactLayoutHorizontal
} from "Pages/DesktopSetting/compact";
import {
    getContainerMaxHeight,
    calWHtoPx,
    calGridItemPosition,
    calColCount
} from "Pages/DesktopSetting/utilService";
import Notice from "Components/Notice";
/**
 * 工作桌面 首页 页面
 * 各个此贴应用及工作台中的小部件 通过 js 片段进行加载渲染
 */
let resizeWaiter = false;

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layout: {
                margin: [10, 10],
                containerPadding: [0, 0],
                rowHeight: 175,
                calWidth: 175
            },
            groups: []
        };
    }

    handleHomeLoad = () => {
        if (!resizeWaiter) {
            resizeWaiter = true;
            setTimeout(() => {
                resizeWaiter = false;
                let { groups, layout } = this.state;
                const windowWidth = window.innerWidth - 60 * 2;
                const col = calColCount(
                    layout.calWidth,
                    windowWidth,
                    layout.containerPadding,
                    layout.margin
                );
                _.forEach(groups, g => {
                    let compactedLayout = compactLayoutHorizontal(g.apps, col);
                    // const firstCard = compactedLayout[0];
                    // compactedLayout = compactLayout(compactedLayout, firstCard);
                    g.apps = compactedLayout;
                });
                this.setState({ groups, layout }, () => {
                    animateScroll.scrollTo(0);
                    scrollSpy.update();
                });
            }, 500);
        }
    };

    /**
     * 创建 小部件 script 标签
     */
    createScript = () => {
        let { groups } = this.state;
        let scripts = document.getElementsByTagName("script");
        // 将 HTMLCollection 类数组对象转换成真正的数组
        let scriptsArray = Array.prototype.slice.call(scripts, 0);
        let bodyDOM = document.getElementsByTagName("body")[0];
        // 将所有的 script 标签 src 值数组
        scriptsArray = scriptsArray.map(scriptItem => {
            // script 标签上真正书写的 src 字符串
            if (scriptItem.attributes.src) {
                return scriptItem.attributes.src.value;
            }
        });
        // paths 后台返回的当前用户首页所有小部件相关内容
        groups.map((group, i) => {
            group.apps.map((item, index) => {
                let { target_path, apptype } = item;
                if (apptype === "2") {
                    // 查找后台提供的小部件 js 路径是否已经加载到 dom 中
                    let flag = scriptsArray.find(scriptsSrc => {
                        return scriptsSrc === target_path;
                    });
                    // 如果没有，进行 script 标签创建及加载指定 js 文件
                    if (typeof flag === "undefined") {
                        let script = document.createElement("script");
                        script.type = "text/javascript";
                        script.src = target_path;
                        bodyDOM.appendChild(script);
                    } else {
                        for (
                            let scriptIndex = 0;
                            scriptIndex < scripts.length;
                            scriptIndex++
                        ) {
                            const element = scripts[scriptIndex];
                            if (
                                element.attributes.src &&
                                element.attributes.src.value === flag
                            ) {
                                bodyDOM.removeChild(element);
                                let script = document.createElement("script");
                                script.type = "text/javascript";
                                script.src = flag;
                                bodyDOM.appendChild(script);
                            }
                        }
                    }
                }
            });
        });
    };

    /**
     * 动态创建小应用
     * @param {Object} appOption // 小部件类型
     */
    createApp = appOption => {
        const {
            gridx,
            gridy,
            width,
            height,
            haspower,
            image_src,
            name,
            cardid
        } = appOption;
        const { margin, rowHeight, calWidth } = this.state.layout;
        const { x, y } = calGridItemPosition(
            gridx,
            gridy,
            margin,
            rowHeight,
            calWidth
        );
        const { wPx, hPx } = calWHtoPx(
            width,
            height,
            margin,
            rowHeight,
            calWidth
        );
        const opacity = haspower === false ? 0.6 : 1;
        return (
            <div
                className="grid-item"
                key={cardid}
                style={{
                    width: wPx,
                    height: hPx,
                    opacity: opacity,
                    transform: `translate(${x}px, ${y}px)`
                }}
                onClick={() => {
                    window.openNew(appOption);
                }}
            >
                <div field="app-item" fieldname={name} className="app-item">
                    <span className="title">{name}</span>
                    <div className="app-content">
                        {image_src && image_src.indexOf("/") === -1 ? (
                            <div>
                                <Svg
                                    width={100}
                                    height={100}
                                    xlinkHref={`#icon-${image_src}`}
                                />
                            </div>
                        ) : (
                            <div
                                className="icon"
                                style={{
                                    background: `url(${image_src}) no-repeat 0px 0px`,
                                    backgroundSize: "contain"
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };
    /**
     * 动态创建小部件
     * @param {Object} appOption // 小部件类型
     */
    createWidget = appOption => {
        const {
            gridx,
            gridy,
            width,
            height,
            haspower,
            name,
            target_path,
            cardid
        } = appOption;
        const { margin, rowHeight, calWidth } = this.state.layout;
        const { x, y } = calGridItemPosition(
            gridx,
            gridy,
            margin,
            rowHeight,
            calWidth
        );
        const { wPx, hPx } = calWHtoPx(
            width,
            height,
            margin,
            rowHeight,
            calWidth
        );
        const opacity = haspower === false ? 0.6 : 1;
        return (
            <div
                className="grid-item"
                key={cardid}
                style={{
                    width: wPx,
                    height: hPx,
                    opacity: opacity,
                    transform: `translate(${x}px, ${y}px)`
                }}
            >
                <iframe
                    field="app-item"
                    fieldname={name}
                    src={target_path}
                    style={{ width: "100%", height: "100%" }}
                    frameBorder="0"
                    scrolling="no"
                    className="app-item"
                />
            </div>
        );
    };
    /**
     * 动态创建小部件挂载容器
     * @param {Object} widgets // 小部件类型
     */
    createWidgetMountPoint = widgets => {
        return widgets.map(item => {
            if (item) {
                let { apptype, name } = item;
                switch (Number(apptype)) {
                    case 1:
                        return this.createApp(item);
                    case 2:
                        return this.createWidget(item);
                    default:
                        break;
                }
            }
        });
    };
    componentWillUnmount() {
        window.removeEventListener("resize", this.handleHomeLoad);
    }
    componentDidMount() {
        window.addEventListener("resize", this.handleHomeLoad);
        Ajax({
            url: `/nccloud/platform/appregister/queryworkbench.do`,
            info: {
                name: "首页",
                action: "首页加载"
            },
            data: {
                relateid: "",
                isuser: "1"
            },
            success: ({ data: { data, success, error } }) => {
                if (success && data && data.length > 0) {
                    if (data[0].groups.length === 0) {
                        Notice({
                            status: "error",
                            msg: "工作桌面为空，请配置"
                        });
                    }
                    _.forEach(data[0].groups, g => {
                        g.type = "group";
                        _.forEach(g.apps, a => {
                            a.gridx = Number(a.gridx);
                            a.gridy = Number(a.gridy);
                            a.height = Number(a.height);
                            a.width = Number(a.width);
                        });
                    });
                    this.setState(
                        { groups: data[0].groups },
                        this.createScript
                    );
                    this.props.updateGroupList(data[0].groups);
                    this.handleHomeLoad();
                } else {
                    if (success && data && data.length === 0) {
                        Notice({
                            status: "error",
                            msg: "工作桌面为空，请配置"
                        });
                    } else {
                        Notice({ status: "error", msg: data });
                    }
                }
            }
        });
    }
    render() {
        let { groups, layout } = this.state;
        return (
            <div className="nc-workbench-home-page">
                <div className="nc-workbench-home-container">
                    {groups.map((g, index) => {
                        const containerHeight = getContainerMaxHeight(
                            g.apps,
                            layout.rowHeight,
                            layout.margin
                        );
                        return (
                            <Element
                                name={g.pk_app_group}
                                key={index}
                                className="n-col padding-left-70 padding-right-60"
                            >
                                <div className="title">{g.groupname}</div>
                                <div
                                    className="grid"
                                    style={{ height: containerHeight }}
                                >
                                    {this.createWidgetMountPoint(g.apps)}
                                </div>
                            </Element>
                        );
                    })}
                </div>
            </div>
        );
    }
}

Home.propTypes = { updateGroupList: PropTypes.func.isRequired };
export default connect(
    state => ({}),
    {
        updateGroupList
    }
)(Home);
