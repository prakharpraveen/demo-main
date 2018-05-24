import React,{Component} from 'react';
import ComLayout from './ComLayout';
class ApproveLanguage extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ComLayout className='approvelanguage' title={this.props.title}>
                <div>222</div>
            </ComLayout>
        )
    }
}
export default ApproveLanguage;