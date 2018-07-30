import { Component } from "react";
import { base } from "nc-lightapp-front";
import moment from "moment";
import "nc-lightapp-front/dist/platform/nc-lightapp-front/index.css";
const NCTZDatePickClientTime = base.NCTZDatePickClientTime;
const format = "YYYY-MM-DD";
const dateInputPlaceholder = "选择日期";
class MTZBDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
    }
    onChange = d => {
        this.setState({
            value: moment(d).format(format)
        });
    };
    clear = d => {
        this.setState({
            value: ""
        });
    };
    onSelect = d => {
        console.log(d);
    };
    /**
     * 取消日期
     */
    handleCancel = () => {
        this.setState({
            isOpen: false,
            value: this.props.date
        });
    };
    /**
     * 确定事件
     */
    handleOk = () => {
        this.props.onOk(moment(this.state.value));
        this.setState({
            isOpen: false
        });
    };
    /**
     * 今天事件
     */
    handleToday = () => {
        this.setState(
            {
                value: moment().format("YYYY-MM-DD hh:mm:ss"),
                isOpen: false
            },
            () => {
                this.props.onOk(moment(this.state.value));
            }
        );
    };
    render() {
        console.log(this.state.value);
        const ExtraFooter = (
            <div className="workbench-ExtraFooter">
                <div className="left">
                    <span className="btn" onClick={this.handleToday}>
                        今天
                    </span>
                </div>
                <div className="right">
                    <span className="btn" onClick={this.handleOk}>
                        确定
                    </span>
                    <span
                        className="btn margin-left-8"
                        onClick={this.handleCancel}
                    >
                        取消
                    </span>
                </div>
            </div>
        );
        return (
            <div style={{ display: "none" }}>
                <NCTZDatePickClientTime
                    format={format}
                    onSelect={this.onSelect}
                    onChange={this.onChange}
                    value={this.state.value}
                    placeholder={dateInputPlaceholder}
                    showToday={false}
                    renderFooter={() => ExtraFooter}
                    autofocus={false}
                />
            </div>
        );
    }
}
export default MTZBDate;
