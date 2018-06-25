import React, {Component} from "react";
import {Input, Icon, Button, Popconfirm} from "antd";
import Notice from "Components/Notice";
import "./index.less";
class EditableCell extends Component {
    constructor(props) {
        super(props);
        this.state={
            value: this.props.value,
            editable: false
        }
    }
    handleChange = e => {
        const value = e.target.value;
        this.setState({
            value
        });
    };
    check = () => {
        if(this.props.onCheck){
            if(this.props.onCheck(this.state.value)){
                return;
            }
        }
        this.setState({
            editable: false
        });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    };
    edit = () => {
        if(this.props.hasError){
            Notice({
                status: "warning",
                msg: "当前输入项有误请在次确认！（不能为空或编码重复）"
            });
            return;
        }
        this.setState({
            editable: true
        });
    };
    render() {
        const {value, editable} = this.state;
        return (
            <div className="editable-cell">
                {editable ? (
                    <Input
                        value={value}
                        onChange={this.handleChange}
                        onPressEnter={this.check}
                        onMouseOut={this.check}
                    />
                ) : (
                    <div style={{paddingRight: 24}}>
                        {value || ""}
                        <Icon
                            type="edit"
                            className="editable-cell-icon"
                            onClick={this.edit}
                        />
                    </div>
                )}
            </div>
        );
    }
}
export default EditableCell;
