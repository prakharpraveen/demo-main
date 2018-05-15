import React,{Component} from 'react';
import { Modal, Button} from 'antd';
import Svg from 'Components/Svg';
import './index.less';
class ChooseImageForForm extends Component {
    constructor(props) {
        super(props);
        this.state={
            visible: false,
            selected: '',
            listData:[],
            value:''
        }
        this.value='';
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = (e) => {
        let {value} = this.state;
        this.value = value;
        this.setState({
            visible: false,
        },this.triggerChange(value));
    };
    handleCancel = (e) => {
        let {listData,value} = this.state;
        value = this.value;
        listData = this.updateListData(listData,value);
        this.setState({
            visible: false,
            value,
            listData
        });
    };
    handleSelect = (item) => {
        let {listData,value} = this.state;
        value = item.value;
        listData = this.updateListData(listData,value);
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
                    <div title={name} onClick={()=>{this.handleSelect(item)}}>
                        {src.indexOf('/')===-1?<Svg width={80} height={80} xlinkHref={`#icon-${src}`}></Svg>:<img width='80' src={src} alt={name}/>}
                    </div>
                </li>
            )
        });
    }
    /**
     * 与 antd form 表单传递数据的方法
     * @param {String} changeValue  改变的 value 值
     */
    triggerChange = (changedValue) => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(changedValue);
        }
    }
    /**
     * 更新图标列表数据
     * @param {Array} listData 旧的图标列表数据
     * @param {String} value 选中的图标value值
     */
    updateListData = (listData,value)=>{
        return listData = listData.map((item,index)=>{
            item.selected = false;
            if(item.value === value){
                item.selected = true;
            }
            return item;
        });
    }
    // componentWillReceiveProps(nextProps) {
    //     // Should be a controlled component.
    //     if ('value' in nextProps) {
    //         const value = nextProps.value;
    //         this.setState({value});
    //     }
    // }
    componentWillMount(){
        let {data,value} = this.props;
        this.value = value;
        let listData = this.updateListData(data,value);
        this.setState({
            listData,
            value
        });
    }
    render() {
        let {listData,value} = this.state;
        return (
            <div className='choose-imgae'>
                {value.indexOf('/')===-1?<div onClick={this.showModal}  className='choose-btn'><i className='iconfont icon-tianjiayingyong font-size-80'></i><Svg width={98} height={93} xlinkHref={`#icon-${value}`}></Svg></div>:<div className='choose-btn' style={value.length>0?{ background: `url(${value}) no-repeat 0px 0px`, 'background-size': 'contain' }:null} onClick={this.showModal}>
                    <i className='iconfont icon-tianjiayingyong font-size-80'></i>
                </div>}
                
                {/* <Button type="primary" onClick={this.showModal}>Open</Button> */}
                <Modal
                    title={this.props.title}
                    mask = {false}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText={'取消'}
                    okText={'确认'}
                >
                    <ul className='choose-imgae-list'>
                        {this.creatImgList(listData)}
                    </ul>
                </Modal>
            </div>
        );
    }
}
export default ChooseImageForForm;