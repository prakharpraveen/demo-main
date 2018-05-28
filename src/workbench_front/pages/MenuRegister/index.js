import React,{Component} from 'react';
import { Button,Table,Switch,Icon,Popconfirm  } from 'antd';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import {updateMenuItemData} from 'Store/MenuRegister/action';
import EditableTable from './EditableTable';
import EditableCell from 'Components/EditableCell';
import Ajax from 'Pub/js/ajax';
import {PageLayout} from 'Components/PageLayout';
import Notice from 'Components/Notice';
import './index.less';
class MenuRegister extends Component{
    constructor(props) {
        super(props);
        this.state={
            isedit:false,
            listData:[]
        },
        this.columns = [
            {
            title: '序号',
            dataIndex: 'num',
            key: 'num',
            }, {
                title: '菜单编码',
                dataIndex: 'menucode',
                key: 'menucode',
                render:(text, record)=>{
                    if(this.state.isedit){
                        return <EditableCell 
                            value = {text}
                            onChange = {this.onCellChange(record.menucode, 'menucode')}
                        />
                    }else{
                        return <div>{text}</div>
                    }
                }
            }, {
                title: '菜单名称',
                dataIndex: 'menuname',
                key: 'menuname',
                render:(text, record)=>{
                    if(this.state.isedit){
                        return <EditableCell 
                            value = {text}
                            onChange = {this.onCellChange(record.menucode, 'menuname')}
                        />
                    }else{
                        return <div>{text}</div>
                    }
                }
            }, {
                title: '菜单描述',
                dataIndex: 'menudesc',
                key: 'menudesc',
                render:(text, record)=>{
                    if(this.state.isedit){
                        return <EditableCell 
                            value = {text}
                            onChange = {this.onCellChange(record.menucode, 'menudesc')}
                        />
                    }else{
                        return <div>{text}</div>
                    }
                }
            }, {
                title: '是否启用',
                dataIndex: 'isenable',
                key: 'isenable',
                render:(text, record)=>(
                    <Switch disabled={this.state.isedit} onChange={(checked)=>{this.handleChange(checked,record)}} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} checked={text} />
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
                        {
                            this.state.isedit?'':<span onClick={()=>{this.handleListClick('menuitem',record)}}>菜单项</span>
                        }
                    </div>
                ),
            }
        ];
        this.btnList = [
            {
                name:'新增',
                code:'add',
                type:'primary',
                isedit:true
            },
            {
                name:'修改',
                code:'edit',
                type:'primary',
                isedit:false
            },
            {
                name:'取消',
                code:'cancle',
                type:'',
                isedit:true
            }
        ]
    }
    /**
     * 单元格编辑事件
     */
    onCellChange = (key, dataIndex) => {
        return (value) => {
            const listData = [...this.state.listData];
            const target = listData.find(item => item.key === key);
            if (target) {
                target[dataIndex] = value;
                this.setState({
                    listData
                });
            }
        };
    }
    /**
     * 列表行操作事件
     */
    handleListClick=(key,record)=>{
        switch (key) {
            case 'menuitem':
                this.props.updateMenuItemData(record);
                this.props.history.push(`/mi?n=菜单注册&c=102202MENU`)
                break;
            case 'edit':
                
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
    handleAdd = () => {
        const {
            count,
            listData
        } = this.state;
        const newData = {
            "menucode": "",
            "menuname": "",
            "menudesc": "",
            "isenable": false,
            "isdefault": false,
            "creationtime": "",
            "modifiedtime": ""
        };
        this.setState({
            listData: [...listData, newData],
            count: count + 1,
        });
    }
    creatBtn = ()=>{
        return this.btnList.map((item,index)=>{
            if(this.state.isedit){
                if(item.isedit){
                    return <Button key={item.code} type='primary' onClick={()=>{this.handleBtnClick(item.code)}}>{item.name}</Button>
                }else{
                    return null;
                }   
            }else{
                if(item.isedit){
                    return null;
                }else{
                    return <Button key={item.code} type='primary' onClick={()=>{this.handleBtnClick(item.code)}}>{item.name}</Button>
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
                    console.log(data);
                    
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
                        <div>
                            {this.creatBtn()}
                        </div>
                    </div>
                    <div className='menugister-list-table'>
                        <EditableTable 
                            rowKey={'pk_menu'}  
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