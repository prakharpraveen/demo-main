import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {animateScroll, scrollSpy, Element} from "react-scroll";
import Ajax from "Pub/js/ajax";
import Svg from "Components/Svg";
import "./index.less";
import _ from "lodash";
import {updateGroupList} from "Store/home/action";
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
                let {groups, layout} = this.state;
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
                this.setState({groups, layout}, () => {
                    animateScroll.scrollTo(0);
                    scrollSpy.update();
                });
            }, 500);
        }
    };

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleHomeLoad);
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleHomeLoad);
        Ajax({
            url: `/nccloud/platform/appregister/queryapp.do`,
            info: {
                name: "首页",
                action: "首页加载"
            },
            data: {
                relateid: this.props.userID,
                isuser: "1"
            },
            success: ({data: {data, success, error}}) => {
                if (success && data) {
                    _.forEach(data[0].groups, g => {
                        g.type = "group";
                        _.forEach(g.apps, a => {
                            a.gridx = Number(a.gridx);
                            a.gridy = Number(a.gridy);
                            a.height = Number(a.height);
                            a.width = Number(a.width);
                        });
                    });
                    this.setState({groups: data[0].groups});
                    this.props.updateGroupList(data[0].groups);
                    this.handleHomeLoad();
                }
            }
        });
    }

    createScript = () => {
        let {groups} = this.state;
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
                let {path, apptype} = item;
                if (apptype === "2") {
                    let scriptPath = path;
                    // 查找后台提供的小部件 js 路径是否已经加载到 dom 中
                    let flag = scriptsArray.find(scriptsSrc => {
                        return scriptsSrc === scriptPath;
                    });
                    // 如果没有，进行 script 标签创建及加载指定 js 文件
                    if (typeof flag === "undefined") {
                        let script = document.createElement("script");
                        script.type = "text/javascript";
                        script.src = path;
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
     * @param {Number} domWidth // 小应用宽度
     * @param {Number} domHeight // 小应用高度
     * @param {Boolean} isOwn //是否为系统预置应用 默认为 false 非系统预置应用
     */
    createApp = (appOption, isOwn = false) => {
        const {gridx, gridy, width, height} = appOption;
        const {margin, rowHeight, calWidth} = this.state.layout;
        const {x, y} = calGridItemPosition(
            gridx,
            gridy,
            margin,
            rowHeight,
            calWidth
        );
        const {wPx, hPx} = calWHtoPx(
            width,
            height,
            margin,
            rowHeight,
            calWidth
        );

        const {
            image_src,
            name,
            mountid,
            target_path,
            pk_appregister
        } = appOption;
        return (
            <div
                className="grid-item"
                key={pk_appregister}
                id={mountid}
                style={{
                    width: wPx,
                    height: hPx,
                    transform: `translate(${x}px, ${y}px)`
                }}
                onClick={() => {
                    window.openNew(appOption);
                }}>
                <div field="app-item" fieldname={name} className="app-item">
                    <span className="title">{name}</span>
                    <div className="app-content">
                        {/* <img className='icon' src={image_src} alt={name} /> */}
                        {image_src.indexOf("/") === -1 ? (
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
     * 动态创建小部件挂载容器
     * @param {Object} widgets // 小部件类型
     */
    createWidgetMountPoint = widgets => {
        return widgets.map((item, index) => {
            if (item) {
                let {apptype, width, height, name} = item;
                switch (Number(apptype)) {
                    case 1:
                        // 系统预置的应用打开需要特殊处理
                        if (name === "应用注册") {
                            return this.createApp(item, true);
                        }
                        return this.createApp(item);
                        break;
                    case 2:
                        // 目前先不渲染小部件
                        // return (
                        // 	<div className={`grid-item`} style={{ width: domWidth, height: domHeight }} id={item.mountid} />
                        // );
                        break;
                    // case 3:
                    // return this.createApp(item, domWidth, domHeight, true);
                    // break;
                    default:
                        break;
                }
            }
        });
    };

    render() {
        let {groups, layout} = this.state;
        console.log(groups);
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
                                className="n-col padding-left-70 padding-right-60">
                                <div className="title">{g.groupname}</div>
                                <div
                                    className="grid"
                                    style={{height: containerHeight}}>
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

Home.propTypes = {};
export default connect(
    state => ({
        userID: state.appData.userID
    }),
    {
        updateGroupList
    }
)(Home);
