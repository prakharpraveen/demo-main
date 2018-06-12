import React, {Component} from "react";
import {DatePicker} from "antd";
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
class BusinessDate extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div field="business-date" fieldname="业务日期" title='业务日期' className='nc-workbench-businessdate'>
                <DatePicker locale={locale} defaultValue={moment()} allowClear={false} />
            </div>
        );
    }
}
export default BusinessDate;
