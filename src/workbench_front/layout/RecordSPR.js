import React, { Component } from "react";
import { sprLog } from "./spr";
import RecordIMG from "Assets/images/record.gif";
class RecordSPR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sprType: true,
            hoverType: false
        };
    }
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
     * spr悬停
     */
    handleSprOver = () => {
        let { hoverType } = this.state;
        this.setState({ hoverType: true });
    };
    handleSprOut = () => {
        let { hoverType } = this.state;
        this.setState({ hoverType: false });
    };
    render() {
        let { sprType, hoverType } = this.state;
        return (
            <span
                className="spr-record margin-left-6"
                field="spr"
                fieldname="录制SPR"
                onClick={this.handleSprClick}
                onMouseOver={this.handleSprOver}
                onMouseOut={this.handleSprOut}
            >
                {sprType ? (
                    <i title="开始录制SPR" className="iconfont icon-kaishi1" />
                ) : hoverType ? (
                    <i title="结束录制SPR" className="iconfont icon-zanting" />
                ) : (
                    <img
                        src={RecordIMG}
                        width="16px"
                        title="SPR录制中"
                    />
                )}
            </span>
        );
    }
}
export default RecordSPR;
