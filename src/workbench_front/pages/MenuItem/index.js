import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Button, Table, Switch, Icon, Popconfirm} from "antd";
import {PageLayout,PageLayoutLeft,PageLayoutRight} from "Components/PageLayout";
import Ajax from "Pub/js/ajax.js";
import TreeSearch from './TreeSearch';
import "./index.less";

class MenuItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.btnList = [
            {
                name: "修改",
                code: "edit",
                type: "primary",
                isedit: false
            },
            {
                name: "保存",
                code: "save",
                type: "primary",
                isedit: true
            },
            {
                name: "取消",
                code: "cancle",
                type: "",
                isedit: true
            }
        ];
    }
    creatBtn = () => {
        return this.btnList.map((item, index) => {
            if (this.state.isedit) {
                if (item.isedit) {
                    return (
                        <Button
                            className="margin-left-10"
                            key={item.code}
                            type={item.type}
                            onClick={() => {
                                this.handleBtnClick(item.code);
                            }}>
                            {item.name}
                        </Button>
                    );
                } else {
                    return null;
                }
            } else {
                if (item.isedit) {
                    return null;
                } else {
                    return (
                        <Button
                            className="margin-left-10"
                            key={item.code}
                            type={item.type}
                            onClick={() => {
                                this.handleBtnClick(item.code);
                            }}>
                            {item.name}
                        </Button>
                    );
                }
            }
        });
    };
    componentDidMount = () => {};
    render() {
        let {treeTableData} = this.state;
        return (
            <PageLayout header={
				<div>
					<div>{this.props.menuItemData.menuname}</div>
					<div>
						{this.creatBtn()}
					</div>
				</div>
			} className="nc-workbench-menuitem">
                <PageLayoutLeft>
					
				</PageLayoutLeft>
				<PageLayoutRight></PageLayoutRight>
                {/* <div className="nc-workbench-menuitem-card">
                    <div className="menuitem-card-title">
                        菜单注册
                        <Button type="primary">保存</Button>
                    </div>
                    <div className="menuitem-card-form" />
                    <div className="menuitem-card-table" >
                        <TreeSearch />
                    </div>
                </div> */}
            </PageLayout>
        );
    }
}
MenuItem.propTypes = {
    menuItemData: PropTypes.object.isRequired
};
export default connect(state => {
    return {
        menuItemData: state.menuRegisterData.menuItemData
    };
}, {})(MenuItem);
