import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import { Form } from 'antd';
import {FormCreate} from "Components/FormCreate";
import {setNodeData} from "Store/AppRegister/action";
import Ajax from "Pub/js/ajax";
class ModuleFromCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgtypecode: []
        };
    }
    /**
     * 获取组织类型 下拉数据
     *
     */
    getOrgTypeCodeOptionsData = () => {
        let {DOMDATA} = this.state;
        Ajax({
            url: `/nccloud/platform/appregister/queryorgtype.do`,
            info: {
                name: "组织类型",
                action: "查询"
            },
            success: ({data}) => {
                if (data.success && data.data) {
                    let options = data.data.rows;
                    options = options.map((option, i) => {
                        return {
                            value: option.refpk,
                            text: option.refname
                        };
                    });
                    this.setState({orgtypecode: options});
                }
            }
        });
    };
    getFromData = () => {
        const {getFieldsValue, validateFields} = this.props.form;
        let flag = false;
        validateFields((err, values) => {
            if (!err) {
                flag = true;
            }
        });
        return flag ? getFieldsValue() : null;
	};
	/**
     * 表单任一字段值改变操作
     * @param {String|Object} changedFields 改变的字段及值
     */
    handleFormChange = changedFields => {
		this.props.setNodeData({...this.props.nodeData,...changedFields});
	};
    componentDidMount() {
        this.getOrgTypeCodeOptionsData();
    }
    render() {
        let moduleFormData = [
            {
                label: "模块编码",
                type: "string",
                code: "systypecode",
				required: true,
				isedit:this.props.isedit,
                lg: 8
            },
            {
                label: "模块号",
                type: "string",
                code: "moduleid",
                required: true,
                check: (rule, value, callback) => {
                    if (value === this.props.parentData) {
                        callback("不能与父节点编码重复");
                    } else {
                        callback();
                    }
				},
				isedit:this.props.isedit,
                lg: 8
            },
            {
                label: "模块名称",
                type: "string",
                code: "systypename",
				required: true,
				isedit:this.props.isedit,
                lg: 8
            },
            {
                label: "对应模块号",
                type: "string",
                code: "devmodule",
				required: false,
				isedit:this.props.isedit,
                lg: 8
            },
            {
                label: "应用范围",
                type: "select",
                code: "appscope",
                required: false,
                options: [
                    {
                        value: "0",
                        text: "全局"
                    },
                    {
                        value: "1",
                        text: "集团"
                    }
				],
				isedit:this.props.isedit,
                lg: 8
            },
            {
                label: "组织类型",
                type: "select",
                code: "orgtypecode",
                required: false,
				options: this.state.orgtypecode,
				isedit:this.props.isedit,
                lg: 8
            },
            {
                label: "多语字段",
                type: "string",
                code: "resid",
				required: false,
				isedit:this.props.isedit,
                lg: 8
            },
            {
                label: "是否支持开关帐设置",
                type: "checkbox",
                code: "supportcloseaccbook",
				required: false,
				isedit:this.props.isedit,
                lg: 8
            },
            {
                label: "是否发送会计平台",
                type: "checkbox",
                code: "isaccount",
				required: false,
				isedit:this.props.isedit,
                lg: 8
            }
		];
        return (
            <FormCreate
                formData={moduleFormData}
                fields={this.props.nodeData}
                onChange={this.handleFormChange}
            />
        );
    }
}
ModuleFromCard = Form.create()(ModuleFromCard);
ModuleFromCard.propTypes = {
	setNodeData:PropTypes.func.isRequired,
    nodeData: PropTypes.object.isRequired,
};
export default connect(
    state => {
        let {
            nodeData,
        } = state.AppRegisterData;
        return {nodeData};
    },
    {
        setNodeData
    }
)(ModuleFromCard);
