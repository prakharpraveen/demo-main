import React,{Component} from 'react';
import ComLayout from './ComLayout';

class DefaultSetting extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ComLayout className='defaultSetting' title={this.props.title}>
                <div className='default-title'>默认设置</div>
                <div className='dafault-form'>
                    123
                </div>
                <div className='default-title'>默认语言格式</div>
                <div className='dafault-form'>
                    22222
                </div>
            </ComLayout>
        )
    }
}
export default DefaultSetting;