import React,{Component} from 'react';
import { Breadcrumb as Bc } from 'antd';
import { withRouter } from 'react-router-dom';
import './index.less';
class Breadcrumb extends Component{
    constructor(props) {
        super(props);
        
    }
    handleHomeClick=()=>{
        this.props.history.push('/');
    }
    render() {
        return (
            <div className='workbench-breadcrumb'>
                <i className='iconfont icon-zhuye' onClick={this.handleHomeClick}></i>
                <Bc separator={<i className='iconfont icon-mianbaoxie font-size-12'></i>}>
                    <Bc.Item><a href="">Application Center</a></Bc.Item>
                    <Bc.Item><a href="">Application List</a></Bc.Item>
                    <Bc.Item>An Application</Bc.Item>
                </Bc>
            </div>
        );
    }
}
export default withRouter(Breadcrumb);