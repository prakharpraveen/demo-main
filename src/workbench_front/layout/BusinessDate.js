import React, {Component} from "react";
import {DatePicker} from "antd";
import Ajax from 'Pub/js/ajax';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
class BusinessDate extends Component {
    constructor(props) {
        super(props);
        this.state={
            businessDate:moment()
        }
    }
    onChange = (date,dataString)=>{
        console.log(date,dataString);
        Ajax({
            url:`/nccloud/platform/appregister/setbizdate.do`,
            info:{
                name:'业务日期',
                action:'更改业务日期'
            },
            data:{
                bizDateTime:''
            },
            success:({data:{data}})=>{

            }
        });
    }
    
    componentDidMount() {
        // 业务日期查询
        Ajax({
            url:`/nccloud/platform/appregister/querybizdate.do`,
            info:{
                name:'工作平台',
                action:'业务日期查询'
            },
            success:({data:{data}})=>{
                if(data){
                    console.log(moment(data));
                    
                    this.setState({businessDate:moment(data)});
                }
            }
        });
    }
    
    render() {
        return (
            <div field="business-date" fieldname="业务日期" title='业务日期' className='nc-workbench-businessdate'>
                <DatePicker dropdownClassName={'field_business-date'} locale={locale} defaultValue={moment()} onChange={this.onChange} allowClear={false} />
            </div>
        );
    }
}
export default BusinessDate;
