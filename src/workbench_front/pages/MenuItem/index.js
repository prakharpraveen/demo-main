import React,{Component} from 'react';
import { Button,Table,Switch,Icon,Popconfirm  } from 'antd';
import {PageLayout} from 'Components/PageLayout';
import './index.less';
class MenuItem extends Component{
    constructor(props) {
        super(props);
        
    }
    render() {
        return (
            <PageLayout className="nc-workbench-menuitem">
                <div className="nc-workbench-menuitem-card">
                    <div className='menuitem-card-title'>
                        菜单注册
                        <Button type='primary'>保存</Button>
                    </div>
                    <div className='menuitem-card-form'>
                        
                    </div>
                    <div className='menuitem-card-table'>
                        
                    </div>
                </div>
            </PageLayout>
        );
    }
}
export default MenuItem;