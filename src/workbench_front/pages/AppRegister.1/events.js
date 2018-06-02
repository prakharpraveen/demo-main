import Ajax from "Pub/js/ajax";
// import getUrlParam from 'Components/getUrlParam';
export default function(props) {
    console.log(props);

    // 获取templetId
    // let templetid = getUrlParam('templetid');
    let url, data;
    url = "/nccloud/platform/templet/previewtemplet.do";
    data = {
        //    previewList: array
        templetid: props.templetid
    };
    Ajax({
        url: url,
        data: data,
        info: {
            name: "模板",
            action: "模板预览"
        },
        success: ({data}) => {
            if (data.success && data.data) {
                let meta = data.data.reduce((pre, cur, i) => {
                    if (
                        cur[Object.keys(cur)[0]] &&
                        cur[Object.keys(cur)[0]].moduletype === "form"
                    ) {
                        cur[Object.keys(cur)[0]].status = "edit";
                    }
                    return {...pre, ...cur}; // 数组拆开 展开为模板数据格式
                }, {});
                props.meta.setMeta(meta);
                props.updatePreviewData(data.data);
            } else {
                Notice({status: "error", msg: data.data.true});
            }
        }
    });
}
