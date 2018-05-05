import React,{Component} from 'react';
import { Modal, Button} from 'antd';
import './index.less';
class ChooseImage extends Component {
    constructor(props) {
        super(props);
        this.state={
            visible: false,
            selected: '',
            listData:[],
            value:''
        }
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = (e) => {
        let {value} = this.state;
        this.setState({
            visible: false,
        },this.triggerChange(value));
    };
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    };
    handleSelect = (item) => {
        let {listData,value} = this.state;
        listData = listData.map((i,index)=>{
            i.selected = false;
            if(i.value === item.value){
                i.selected = true;
            }
            return i;
        });
        value = item.value;
        this.setState({
            listData,
            value
        });
    };
    creatImgList = (listData) => {
        return listData.map((item,index)=>{
            let {name,src,selected} = item;
            return (
                <li className={selected?'img-selected':''}>
                    <span title={name} onClick={this.handleSelect.bind(this,item)}><img width='80' src={src} alt={name}/></span>
                </li>
            )
        });
    }
    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(changedValue);
        }
    }
    componentWillReceiveProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState({value});
        }
    }
    componentWillMount(){
        let {data,value} = this.props;
        let listData = data.map((item,index)=>{
            item.selected = false;
            if(item.value === value){
                item.selected = true;
            }
            return item;
        });
        this.setState({
            listData
        });
    }
    render() {
        let {listData} = this.state;
        return (
            <div className='choose-imgae'>
                <div className='choose-btn' onClick={this.showModal}>
                    <i className='iconfont icon-tianjiayingyong font-size-80'></i>
                </div>
                {/* <Button type="primary" onClick={this.showModal}>Open</Button> */}
                <Modal
                    title="Basic Modal"
                    mask = {false}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <ul className='choose-imgae-list'>
                        {this.creatImgList(listData)}
                    </ul>
                </Modal>
            </div>
        );
    }
}
export default ChooseImage;