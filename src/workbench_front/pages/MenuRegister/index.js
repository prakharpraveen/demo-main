import React,{Component} from 'react';
import { Button,Table,Switch,Icon  } from 'antd';
import PageLayout from 'Components/PageLayout';
class MenuRegister extends Component{
    constructor(props) {
        super(props);
        this.columns = [{
            title: '序号',
            dataIndex: 'name',
            key: 'name',
            render: text => <a href="javascript:;">{text}</a>,
        }, {
            title: '菜单编码',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: '菜单名称',
            dataIndex: 'address',
            key: 'address',
        }, {
            title: '菜单描述',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: '是否启用',
            dataIndex: 'age',
            key: 'age',
            render:(text, record)=>{
                <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} checked={text} />
            }
        }, {
            title: '是否系统内置',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: '创建人',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: '创建时间',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: '最后修改人',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: '最后修改时间',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a href="javascript:;">Action 一 {record.name}</a>
                    <Divider type="vertical" />
                    <a href="javascript:;">Delete</a>
                    <Divider type="vertical" />
                    <a href="javascript:;" className="ant-dropdown-link">
                    More actions <Icon type="down" />
                    </a>
                </span>
            ),
        }];
    }
    render() {
        return (
            <PageLayout className="nc-workbench-menuregister">
                <div className='menuregister-list'>
                    <div className='menugister-list-title'>
                        菜单
                        <Button>新增</Button>
                    </div>
                    <div className='menugister-list-table'>
                        <Table columns={this.columns} dataSource={data}/>
                    </div>
                </div>
            </PageLayout>
        );
    }
}