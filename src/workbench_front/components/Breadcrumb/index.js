import React,{Component} from 'react';
import { Breadcrumb as Bc } from 'antd';
class Breadcrumb extends Component{
    constructor(props) {
        super(props);
        
    }
    render() {
        return (
            <div>
                <Bc separator={<i className='iconfont icon-mianbaoxie font-size-12'></i>}>
                    <Bc.Item><a href="">Application Center</a></Bc.Item>
                    <Bc.Item><a href="">Application List</a></Bc.Item>
                    <Bc.Item>An Application</Bc.Item>
                </Bc>
            </div>
        );
    }
}
export default Breadcrumb;