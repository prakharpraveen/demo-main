import React, {Component} from "react";
import {Breadcrumb as Bc} from "antd";
import {withRouter} from "react-router-dom";
import {GetQuery} from "Pub/js/utils.js";
import "./index.less";
class Breadcrumb extends Component {
    constructor(props) {
        super(props);
    }
    handleHomeClick = () => {
        this.props.history.push("/");
    };

    render() {
        let {b1, b2, b3, n} = GetQuery(this.props.location.search);
        b1 = decodeURIComponent(b1);
        b2 = decodeURIComponent(b2);
        b3 = decodeURIComponent(b3);
        n = decodeURIComponent(n);
        return (
            <div className="workbench-breadcrumb">
                <i
                    className="iconfont icon-zhuye"
                    onClick={this.handleHomeClick}
                />
                <Bc
                    separator={
                        <i className="iconfont icon-mianbaoxie font-size-12" />
                    }>
                    <Bc.Item>{b1 === "undefined" ? null : b1}</Bc.Item>
                    <Bc.Item>{b2 === "undefined" ? null : b2}</Bc.Item>
                    <Bc.Item>{b3 === "undefined" ? null : b3}</Bc.Item>
                    <Bc.Item>{n === "undefined" ? null : n}</Bc.Item>
                </Bc>
            </div>
        );
    }
}
export default withRouter(Breadcrumb);
