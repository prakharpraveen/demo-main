import React, {Component} from "react";
import {DatePicker} from "antd";
class BusinessDate extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className='nc-workbench-businessdate'>
                <DatePicker allowClear={false} renderExtraFooter={() => "extra footer"} />
            </div>
        );
    }
}
export default BusinessDate;
