import React,{Component} from 'react';
import { Button,Table,Switch,Icon,Popconfirm  } from 'antd';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import {updateMenuItemData} from 'Store/MenuRegister/action';
import Ajax from 'Pub/js/ajax';
import {PageLayout} from 'Components/PageLayout';
import Notice from 'Components/Notice';
import './index.less';
class MenuRegister extends Component{
    constructor(props) {
        super(props);
        this.state={
            listData:[]
        },
        this.columns = [{
            title: '序号',
            dataIndex: 'num',
            key: 'num',
        }, {
            title: '菜单编码',
            dataIndex: 'menucode',
            key: 'menucode',
        }, {
            title: '菜单名称',
            dataIndex: 'menuname',
            key: 'menuname',
        }, {
            title: '菜单描述',
            dataIndex: 'menudesc',
            key: 'menudesc',
        }, {
            title: '是否启用',
            dataIndex: 'isenable',
            key: 'isenable',
            render:(text, record)=>(
                <Switch onChange={(checked)=>{this.handleChange(checked,record)}} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} checked={text} />
            )
        }, {
            title: '是否系统内置',
            dataIndex: 'isdefault',
            key: 'isdefault',
            render:(text, record)=>(
                <Switch disabled checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} checked={text} />
            )
        }, {
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator',
        }, {
            title: '创建时间',
            dataIndex: 'creationtime',
            key: 'creationtime',
        }, {
            title: '最后修改人',
            dataIndex: 'modifier',
            key: 'modifier',
        }, {
            title: '最后修改时间',
            dataIndex: 'modifiedtime',
            key: 'modifiedtime',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <div className='menugister-list-action'>
                    <span onClick={()=>{this.handleListClick('edit',record)}}>修改</span>
                    <Popconfirm title='确定删除?' cancelText={'取消'} okText={'确定'} onConfirm={()=>{this.handleListClick('del',record)}}>
                        <span>删除</span>
					</Popconfirm>
                    <span onClick={()=>{this.handleListClick('copy',record)}}>复制</span>
                </div>
            ),
        }];
    }
    handleListClick=(key,record)=>{
        switch (key) {
            case 'edit':
                this.props.updateMenuItemData(record);
                this.props.history.push(`/mi?n=菜单注册&c=102202MENU`)
                break;
            case 'del':
                if(record.isdefault){
                    Notice({ status: 'warning', msg: '系统预置的菜单不能删除！' });
                    return; 
                }
                if(record.isenable){
                    Notice({ status: 'warning', msg: '已经启用的菜单不能删除！' });
                    return; 
                }
                Ajax({
                    url:`/nccloud/platform/appregister/deleteappmenu.do`,
                    info:{
                        name:'菜单注册',
                        action:'删除菜单'
                    },
                    data:{
                        pk_menu:record.pk_menu
                    },
                    success:(res)=>{
                        let {data,success} = res.data;
                        if(success){
                            let {listData} = this.state;
                            listData = listData.filter((item)=>item.pk_menu!==record.pk_menu);
                            this.setState({listData});
                        }
                    }
                });
                break;
            case 'copy':
                Ajax({
                    url:`/nccloud/platform/appregister/copyappmenu.do`,
                    info:{
                        name:'菜单注册',
                        action:'复制菜单'
                    },
                    data:{
                        pk_menu:record.pk_menu
                    },
                    success:(res)=>{
                        let {data,success} = res.data;
                        if(success){
                            let {listData} = this.state;
                            listData.push(data);
                            this.setState({listData});
                        }
                    }
                });
                break;
            default:
                break;
        }
    }
    /**
     * 菜单停起用
     * @param {Boole} checked 停启用状态
     *  @param {Object} record 停启用状态
     */
    handleChange = (checked,record)=>{
        let {pk_menu,menucode,menuname,menudesc,isenable,isdefault} = record;
        let {listData} = this.state;
        if(!checked){
            Notice({ status: 'warning', msg: '必须要有启用状态的菜单！' });
            return;
        }
        Ajax({
            url:`/nccloud/platform/appregister/editappmenu.do`,
            info:{
                name:'菜单注册',
                action:'菜单停启用'
            },
            data:{
                pk_menu,
                menucode,
                menuname,
                menudesc,
                isenable:checked,
                isdefault
            },
            success:(res)=>{
                let {success,data} = res.data;
                if(success){
                    listData = listData.map((item)=>{
                        item.isenable = false;
                        if(record.pk_menu === item.pk_menu){
                            item.isenable = checked;
                        }
                        return item;
                    });
                    this.setState({...listData});
                }
            }
        });
    }
    componentDidMount() {
        Ajax({
            url:`/nccloud/platform/appregister/queryappmenus.do`,
            info:{
                name:'菜单注册',
                action:'菜单列表查询'
            },
            success:(res)=>{
                let {data,success} = res.data;
                if(success){
                    this.setState({listData:data});
                }
            }
        });
    }
    
    render() {
        let {listData} = this.state;
        return (
            <PageLayout className="nc-workbench-menuregister">
                <div className='menuregister-list'>
                    <div className='menugister-list-title'>
                        菜单注册
                    </div>
                    <div className='menugister-list-table'>
                        <Table 
                            bordered
                            pagination={false} 
                            rowKey={'pk_menu'} 
                            size="middle" 
                            columns={this.columns} 
                            dataSource={
                                listData.map((item,index)=>{
                                item.num = index+1;
                                return item;
                            })}
                        />
                    </div>
                </div>
            </PageLayout>
        );
    }
}
MenuRegister.propTypes = {
	updateMenuItemData: PropTypes.func.isRequired,
};
export default withRouter(connect((state)=>{return {}},{updateMenuItemData})(MenuRegister));