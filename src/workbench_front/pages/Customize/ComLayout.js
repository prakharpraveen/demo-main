import React,{Component} from 'react';
class ComLayout extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={`customize-page ${this.props.className?this.props.className:''}`}>
                <div className='customize-title'>{this.props.title}</div>
                <div className='customize-content'>{this.props.children}</div>
            </div>
        );
    }
}
export default ComLayout;