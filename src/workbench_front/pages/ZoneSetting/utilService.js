export const setPropertyValueForItemInItemList = (
    itemList,
    property,
    value
) => {
    _.forEach(itemList, a => {
        a[property] = value;
    });
};
export const getDatatypeName = datatype => {
    let name = "";
    for (let i = 0; i < dataTypeObj.length; i++) {
        if (dataTypeObj[i].value === datatype) {
            name = dataTypeObj[i].name;
        }
    }
    return name;
};
export const getOpersignByDatatype = datatype => {
    let name = "";
    for (let i = 0; i < opersignObj.length; i++) {
        if (opersignObj[i].value === datatype) {
            name = opersignObj[i].name;
        }
    }
    return name;
};
export const getOpersignNameByDatatype = datatype => {
    let name = "";
    for (let i = 0; i < opersignNameObj.length; i++) {
        if (opersignNameObj[i].value === datatype) {
            name = opersignNameObj[i].name;
        }
    }
    return name;
};
export const getItemtypeByDatatype = datatype => {
    let result = getItemtypeObjByDatatype(datatype);
    return result[0].value;
};
export const getItemtypeObjByDatatype = datatype => {
    let result = {};
    result = _.find(filterItemtypeObj, f => {
        return f.datatype === datatype;
    });
    if (!result) {
        result = {};
        result.itemtypeObj = itemtypeObj;
    }
    return result.itemtypeObj;
};

export const opersignObj = [
    { name: "=@like@left like@right like@", value: "1" },
    { name: "between@=@>@>=@<@<=@", value: "2" },
    { name: "between@=@>@>=@<@<=@", value: "4" },
    { name: "=@", value: "32" },
    { name: "between@=@>@>=@<@<=@", value: "33" },
    { name: "between@=@>@>=@<@<=@", value: "34" },
    { name: "between@=@>@>=@<@<=@", value: "36" },
    { name: "between@=@>@>=@<@<=@", value: "52" },
    { name: "=@like@left like@right like@", value: "56" },
    { name: "=@like@left like@right like@", value: "58" },
    { name: "=@<>@", value: "203" },
    { name: "=", value: "204" }
];
export const opersignNameObj = [
    { name: "等于@包含@左包含@右包含@", value: "1" },
    { name: "介于@等于@大于@大于等于@小于@小于等于@", value: "2" },
    { name: "介于@等于@大于@大于等于@小于@小于等于@", value: "4" },
    { name: "等于@", value: "32" },
    { name: "介于@等于@大于@大于等于@小于@小于等于@", value: "33" },
    { name: "介于@等于@大于@大于等于@小于@小于等于@", value: "34" },
    { name: "介于@等于@大于@大于等于@小于@小于等于@", value: "36" },
    { name: "介于@等于@大于@大于等于@小于@小于等于@", value: "52" },
    { name: "等于@包含@左包含@右包含@", value: "56" },
    { name: "等于@包含@左包含@右包含@", value: "58" },
    { name: "等于@不等于@", value: "203" },
    { name: "等于@", value: "204" }
];
export const componentWidthObj = [
    { name: "3", value: "3" },
    { name: "4", value: "4" },
    { name: "6", value: "6" },
    { name: "12", value: "12" }
];
export const showType = [
    { name: "名称", value: "1" },
    { name: "编码", value: "2" }
];
export const returnType = [
    { name: "主键", value: "refpk" },
    { name: "名称", value: "refname" },
    { name: "编码", value: "refcode" }
];
export const colorObj = [
    { name: "默认", value: "#6E6E77" },
    { name: "黑色", value: "#000000" },
    { name: "白色", value: "#ffffff" },
    { name: "浅灰色", value: "#DCDCDC" },
    { name: "灰色", value: "#7C7C7C" },
    { name: "深灰色", value: "#434343" },
    { name: "红色", value: "#EC1D22" },
    { name: "粉色", value: "#F78C92" },
    { name: "橘色", value: "#F5781E" },
    { name: "黄色", value: "#F8F36F" },
    { name: "绿色", value: "#2AB566" },
    { name: "紫红色", value: "#C11B80" },
    { name: "蓝绿色", value: "#23C1C4" },
    { name: "兰色", value: "#6FCBFF" },
    { name: "深兰色", value: "#00A2FE" }
];
export const dataTypeObj = [
    { name: "字符", value: "1" },
    { name: "小数", value: "2" },
    { name: "整数", value: "4" },
    { name: "大文本", value: "30" },
    { name: "逻辑", value: "32" },
    { name: "日期", value: "33" },
    { name: "日期时间", value: "34" },
    { name: "时间", value: "36" },
    { name: "金额", value: "52" },
    { name: "自定义项", value: "56" },
    { name: "自定义档案", value: "57" },
    { name: "多语文本", value: "58" },
    { name: "下拉", value: "203" },
    { name: "参照", value: "204" },
    { name: "密码框", value: "400" }
];
export const defaultvarObj = [
    { name: "", value: "" },
    { name: "@SYSCORP", value: "@SYSCORP" },
    { name: "@SYSOPER", value: "@SYSOPER" },
    { name: "@SYSUSER", value: "@SYSUSER" },
    { name: "@SYSDEPT", value: "@SYSDEPT" }
];
export const itemtypeObj = [
    { name: "文本输入框", value: "input" },
    { name: "复选", value: "checkbox" },
    { name: "单选日期", value: "datepicker" },
    { name: "静态文本", value: "label" },
    { name: "数值输入框", value: "number" },
    { name: "单选", value: "radio" },
    { name: "参照", value: "refer" },
    { name: "下拉选择", value: "select" },
    { name: "开关", value: "switch" },
    { name: "多行文本", value: "textarea" },
    { name: "日期时间", value: "datetimepicker" },
    { name: "时间", value: "timepicker" },
    { name: "日期范围", value: "rangepicker" },
    { name: "开始日期时间", value: "NCTZDatePickerStart" },
    { name: "结束日期时间", value: "NCTZDatePickerEnd" },
    { name: "开关型复选框", value: "checkbox_switch" },
    { name: "停启用开关", value: "switch_browse" },
    { name: "多语文本", value: "residtxt" },
    { name: "密码框", value: "password" }
];
export const filterItemtypeObj = [
    {
        datatype: "203",
        itemtypeObj: [
            { name: "下拉", value: "select" },
            { name: "复选", value: "checkbox" },
            { name: "单选", value: "radio" }
        ]
    },
    {
        datatype: "204",
        itemtypeObj: [
            { name: "参照", value: "refer" },
            { name: "下拉", value: "select" }
        ]
    },
    { datatype: "52", itemtypeObj: [{ name: "数值输入框", value: "number" }] },
    { datatype: "57", itemtypeObj: [{ name: "参照", value: "refer" }] },
    { datatype: "56", itemtypeObj: [{ name: "文本输入框", value: "input" }] },
    { datatype: "4", itemtypeObj: itemtypeObj },
    {
        datatype: "1",
        itemtypeObj: [
            { name: "文本输入框", value: "input" },
            { name: "静态文本", value: "label" }
        ]
    },
    {
        datatype: "32",
        itemtypeObj: [
            { name: "开关", value: "switch" },
            { name: "复选", value: "checkbox" },
            { name: "开关型复选框", value: "checkbox_switch" },
            { name: "停启用开关", value: "switch_browse" },
            { name: "单选", value: "radio" }
        ]
    },
    { datatype: "2", itemtypeObj: [{ name: "数值输入框", value: "number" }] },
    { datatype: "58", itemtypeObj: [{ name: "多语文本", value: "residtxt" }] },
    { datatype: "30", itemtypeObj: [{ name: "多行文本", value: "textarea" }] },
    { datatype: "400", itemtypeObj: [{ name: "密码框", value: "password" }] },
    {
        datatype: "34",
        itemtypeObj: [
            { name: "日期时间", value: "datetimepicker" },
            { name: "单选日期", value: "datepicker" },
            { name: "时间", value: "timepicker" }
        ]
    },
    {
        datatype: "33",
        itemtypeObj: [
            { name: "单选日期", value: "datepicker" },
            { name: "日期时间", value: "datetimepicker" },
            { name: "日期范围", value: "rangepicker" },
            { name: "开始日期时间", value: "NCTZDatePickerStart" },
            { name: "结束日期时间", value: "NCTZDatePickerEnd" }
        ]
    },
    {
        datatype: "36",
        itemtypeObj: [
            { name: "时间", value: "timepicker" },
            { name: "日期时间", value: "datetimepicker" },
        ]
    }
];
//应该设默认值为false的组件类型
export const shouldSetDefaultValueList = [
    "switch",
    "checkbox_switch",
    "switch_browse"
];

/* 参照用 */
export function handleLoad(refcode) {
    try {
        let Item = window[refcode].default;
        const myRefDom = typeof Item === "function" ? Item() : <Item />;
        this.setState({ myRefDom: myRefDom });
    } catch (e) {
        console.error(e.message);
        console.error(
            `请检查引用的${refcode}这个文件是源码还是编译好的。源码需要在config.json/buildEntryPath配相应的路径，编译好的则不用`
        );
    }
}

/* refcode */
export function createScript(src) {
    var that = this,
        scripts = Array.from(document.getElementsByTagName("script")),
        s = src.split("/"),
        flag,
        refKey;
    refKey = s.slice(s.length - 5).join("/");
    refKey.includes(".js") && (refKey = refKey.substring(0, refKey.length - 3));
    flag = scripts.find(e => {
        return e.src.includes(refKey);
    });
    if (window[refKey]) {
        // 已经加载过script标签
        handleLoad.call(that, refKey);
    } else {
        let script;
        if (flag) {
            script = flag;
        } else {
            script = document.createElement("script");
            script.src = "../" + refKey + ".js";
            script.type = "text/javascript";
            document.body.appendChild(script);
        }

        script.onload = script.onload || handleLoad.bind(that, refKey);
        script.onerror =
            script.onerror ||
            function() {
                console.error(`找不到${src}这个文件，请检查引用路径`);
            };
    }
}
