import React, { Component } from "react";
import { DatePicker } from "antd";
import locale from "antd/lib/date-picker/locale/zh_CN";
class BusinessDate extends Component {
  constructor(props) {
    super(props);
  }
  /**
   * 业务日期切换
   */
  onChange = (newDate) => {
    this.props.onChange(newDate);
  };
  render() {
    return (
      <div
        field="business-date"
        fieldname="业务日期"
        title="业务日期"
        className="nc-workbench-businessdate"
      >
        <DatePicker
          dropdownClassName={"field_business-date"}
          locale={locale}
          value={this.props.date}
          onChange={this.onChange}
          allowClear={false}
        />
      </div>
    );
  }
}
export default BusinessDate;
