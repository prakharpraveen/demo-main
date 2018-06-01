
import Ajax from 'Pub/js/ajax';
export default function (props) {
    // 处理 页面数据 
    let pageResult = [...props.areaList];
    let array=[];
    array =  pageResult.reduce((prev,cur,index,self)=>{
        let tem = {};
        tem.areacode = cur.pk_area;
        tem.areatype = cur.areatype;
        tem.name = cur.name;
        tem.propertyList = cur.queryPropertyList && cur.queryPropertyList.map((item) => { return {
            areacode: item.code, label: item.label, componenttype: item.componenttype, visible: item.visible } });
            prev.push(tem);
        return prev;
    },[])

    console.log(array)

    let url, data;
    url = '/nccloud/platform/templet/previewtemplet.do';
    data = {
         
     //    previewList: array
        templetid: '00011110000000075ZHA'
    };
    Ajax({
        url: url,
        data: data,
        info: {
            name: '模板',
            action: '模板预览'
        },
        success: ({ data }) => {
            if (data.success && data.data) {
                let meta = data.data.reduce((pre,cur,i)=>{
                    if (cur[Object.keys(cur)[0]] && cur[Object.keys(cur)[0]].moduletype ==='form' ){
                        cur[Object.keys(cur)[0]].status ='edit';
                    }
                    return{...pre,...cur}   // 数组拆开 展开为模板数据格式 
                 },{});
                props.meta.setMeta(meta);
                props.updatePreviewData(data.data);
            } else {
                Notice({ status: 'error', msg: data.data.true });
            }
        }
    }); 
}

