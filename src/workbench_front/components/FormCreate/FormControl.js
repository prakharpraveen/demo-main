import { Form } from "antd";
export const FormControl = (Com) => {
    let fieldsObj = {};
    return Form.create({
        onFieldsChange(props, changedFields) {
            props.onChange(changedFields);
        },
        mapPropsToFields(props) {
            let formData = [...props.formData];
            formData.map((item, index) => {
                fieldsObj[item.code] = {};
                if (props.hasOwnProperty(item.code)) {
                    fieldsObj[item.code] = Form.createFormField({
                        ...props[item.code],
                        value: props[item.code].value
                    });
                } else {
                    let value = "";
                    if (item.type === "refer") {
                        value = {};
                    }
                    if (item.type === "checkbox") {
                        value = false;
                    }
                    fieldsObj[item.code] = Form.createFormField({
                        value: value
                    });
                }
            });
            return fieldsObj;
        }
    })(Com);
};
