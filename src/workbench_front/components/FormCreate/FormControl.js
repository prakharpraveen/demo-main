import React, { Component } from "react";
import { Form } from "antd";
export const FormControl = Com => {
    return Form.create({
        onFieldsChange(props, changedFields) {
            // let newChangeData = {};
            // for (const key in changedFields) {
            //     if (changedFields.hasOwnProperty(key)) {
            //         newChangeData[key] = changedFields[key]["value"];
            //     }
            // }
            // props.onChange(newChangeData);
        },
        mapPropsToFields(props) {
            let fields = { ...props.fields };
            let fieldsObj = {};
            for (const key in fields) {
                if (fields.hasOwnProperty(key)) {
                    fieldsObj[key] = {};
                    fieldsObj[key] = Form.createFormField({
                        value: fields[key]
                    });
                }
            }
            return fieldsObj;
        },
        onValuesChange(props, values) {
            props.onChange(values);
        }
    })(Com);
};
