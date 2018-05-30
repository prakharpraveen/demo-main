
import Ajax from 'Pub/js/ajax';
export default function (props) {
    let url, data;
    url = '/nccloud/platform/templet/previewtemplet.do';
    data = {
        templetid: ''
    };
    Ajax({
        url: url,
        data: data,
        info: {
            name: '区域设置',
            action: '传递区域数值'
        },
        success: ({ data }) => {
            if (data.success && data.data) {
                let meta = data;
                meta.data.items[0].visible = true;
                  meta.data.items.push( {
                "attrcode": "age",
                 "label": "年龄",
                "itemtype": "datepicker",
                visible:true,
            })
              //  meta.data.items[0].visible=true; 得有visible属性 才能显示 
                props.meta.setMeta(meta);

         //       this.setState({ newSource: data.data })
                //	this.props.setZoneData(data.data);
            } else {
                Notice({ status: 'error', msg: data.data.true });
            }
        }
    });
/* let res = {
    "data": {
        "moduletype": "search",
        "items": [
            {
                "attrcode": "name",
                "label": "姓名",
                "itemtype": "input"
            }
        ]
    },
    "success": true
}
props.meta.setMeta(res); */

}

