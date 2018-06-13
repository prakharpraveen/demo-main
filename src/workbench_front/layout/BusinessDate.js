import React, {Component} from "react";
import {DatePicker} from "antd";
import {Ajax} from 'Pub/js/ajax';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
class BusinessDate extends Component {
    constructor(props) {
        super(props);
    }
    onChange = (date,dataString)=>{
        console.log(date,dataString);
        // Ajax({
        //     url:`/nccloud/platform/appregister/setbizdate.do`,
        //     info:{
        //         name:'业务日期',
        //         action:'更改业务日期'
        //     },
        //     data:{
        //         bizDateTime:''
        //     },
        //     success:({data:{data}})=>{

        //     }
        // });
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
