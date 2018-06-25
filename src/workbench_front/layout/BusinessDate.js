import React, { Component } from "react";
import { DatePicker } from "antd";
import Ajax from "Pub/js/ajax";
import locale from "antd/lib/date-picker/locale/zh_CN";
import moment from "moment";
class BusinessDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newDate: moment()
    };
  }
  onChange = (newDate, dataString) => {
    console.log(newDate.valueOf(), dataString);
    Ajax({
      url: `/nccloud/platform/appregister/setbizdate.do`,
      info: {
        name: "业务日期",
        action: "更改业务日期"
      },
      data: {
        bizDateTime: `${newDate.valueOf()}`
      },
      success: ({ data: { data } }) => {
        if (data) {
          this.setState({ newDate });
        }
      }
    });
  };

  componentDidMount() {
    // 业务日期查询
    Ajax({
      url: `/nccloud/platform/appregister/querybizdate.do`,
      info: {
        name: "工作平台",
        action: "业务日期查询"
      },
      success: ({ data: { data } }) => {
        if (data) {
          let newDate = moment(data - 0 * 1000);
          this.setState({ newDate });
        }
      }
    });
  }

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
          value={this.state.newDate}
          onChange={this.onChange}
          allowClear={false}
        />
      </div>
    );
  }
}
export default BusinessDate;
