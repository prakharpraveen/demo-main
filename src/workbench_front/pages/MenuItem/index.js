import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Button, Table, Switch, Icon, Popconfirm} from "antd";
import {
    PageLayout,
    PageLayoutHeader,
    PageLayoutLeft,
    PageLayoutRight
} from "Components/PageLayout";
import Ajax from "Pub/js/ajax.js";
import {GetQuery} from "Pub/js/utils.js";
import TreeSearch from "./TreeSearch";
import {
    FormContent as FormCreate,
    getFormData,
    setFormData
} from "./FormCreate";
import "./index.less";
class MenuItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            mt: "",
            mn: "",
            isedit: false,
            treeData: []
        };
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
        this.menuFormData = [
            {
                code: "menuitemcode",
                type: "input",
                label: "菜单项编码",
                isRequired: true
            },
            {
                code: "menuitemname",
                type: "input",
                label: "菜单项名称",
                isRequired: true
            },
            {
                placeholder: "应用编码",
                refName: "关联应用编码",
                refCode: "appcode",
                refType: "tree",
                isTreelazyLoad: false,
                queryTreeUrl: "/nccloud/platform/appregister/appregref.do",
                onChange: val => {
                    console.log(val);
                    // this.setFieldsValue({ cont: val });
                },
                columnConfig: [
                    {
                        name: ["编码", "名称"],
                        code: ["refcode", "refname"]
                    }
                ],
                isMultiSelectedEnabled: false
            },
            {
                code: "resid",
                type: "input",
                label: "多语字段",
                isRequired: false
            }
        ];
    }
    creatBtn = () => {
        // if (this.state.mt) {
        //     return;
        // }
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
    handleBtnClick = key => {
        switch (key) {
            case "edit":
                this.setState({isedit: true});
                break;
            case "save":
                console.log(getFormData());
                // Ajax({
                //     url:`/nccloud/platform/appregister/editappmenuitem.do`,
                //     data:{

                //     },
                //     info:{
                //         name:'菜单注册菜单项',
                //         action:'修改'
                //     },
                //     success:(res)=>{
                //         let { success, data } = res.data;
                //         if(success&&data){

                //         }
                //     }
                // });
                this.setState({isedit: true});
                break;
            case "cancle":
                this.setState({isedit: false});
                break;
            default:
                break;
        }
    };
    handleSearch = (value, callback) => {
        Ajax({
            url: `/nccloud/platform/appregister/searchappmenuitem.do`,
            data: {
                search_content: value,
                pk_menu: this.state.id
            },
            info: {
                name: "菜单项",
                action: "查询应用树"
            },
            success: res => {
                let {success, data} = res.data;
                if (success && data) {
                    this.setState(
                        {
                            treeData: data
                        },
                        () => {
                            callback(data);
                        }
                    );
                }
            }
        });
    };
    handleSelect = selectedKey => {
        console.log(selectedKey);
        let treeData = this.state.treeData;
        let treeItem = treeData.find(item => item.menuitemcode === selectedKey);
        treeItem.appcode = {};
        setFormData()(treeItem);
        // this.setState({treeItem});
    };
    componentWillMount() {
        let {id, mn, mt} = GetQuery(this.props.location.search);
        this.setState({id, mn: decodeURIComponent(mn), mt: mt - 0});
    }
    componentDidMount() {
        Ajax({
            url: `/nccloud/platform/appregister/queryappmenus.do`,
            data: {
                pk_menu: this.state.id
            },
            info: {
                name: "菜单项",
                action: "查询应用树"
            },
            success: res => {
                let {success, data} = res.data;
                if (success && data) {
                    this.setState({
                        treeData: data
                    });
                }
            }
        });
    }

    render() {
        console.log(1111);

        let {treeData, mn, isedit} = this.state;
        return (
            <PageLayout
                header={
                    <PageLayoutHeader>
                        <div>{mn}</div>
                        <div>{this.creatBtn()}</div>
                    </PageLayoutHeader>
                }
                className="nc-workbench-menuitem">
                <PageLayoutLeft>
                    <TreeSearch
                        onSelect={this.handleSelect}
                        onSearch={this.handleSearch}
                        dataSource={treeData}
                    />
                </PageLayoutLeft>
                <PageLayoutRight>
                    <div className="nc-workbench-menuitem-form">
                        <FormCreate
                            isedit={isedit}
                            formData={this.menuFormData}
                            getFormData={getFormData}
                            setFormData={setFormData}
                        />
                    </div>
                </PageLayoutRight>
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
