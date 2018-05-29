import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Button, Table, Switch, Icon, Popconfirm} from "antd";
import {PageLayout} from "Components/PageLayout";
import Ajax from "Pub/js/ajax.js";
import {createTree} from "Pub/js/createTree.js";
import "./index.less";

class MenuItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount = () => {};
    render() {
        let {treeTableData} = this.state;
        return (
            <PageLayout className="nc-workbench-menuitem">
                <div className="nc-workbench-menuitem-card">
                    <div className="menuitem-card-title">
                        菜单注册
                        <Button type="primary">保存</Button>
                    </div>
                    <div className="menuitem-card-form" />
                    <div className="menuitem-card-table" />
                </div>
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
