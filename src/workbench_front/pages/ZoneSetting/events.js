
import Ajax from 'Pub/js/ajax';
export default function (props) {
    // 处理 页面数据 
    let pageResult = [...props.areaList];
    let array=[];
    array =  pageResult.reduce((prev,cur,index,self)=>{
        let tem = {};
        tem[cur.pk_area] ={};
        tem[cur.pk_area].areacode = cur.pk_area;
        tem[cur.pk_area].moduletype = cur.areatype === '0' ? 'search' : (cur.areatype==='1'?'form':'table');
        tem[cur.pk_area].name = cur.name;
        tem[cur.pk_area].items = cur.queryPropertyList && cur.queryPropertyList.map((item) => { return {
            col: item.col, leftspace:item.leftspace,rightspace:item.rightspace,
            attrcode: item.code, label: item.label, componenttype: item.componenttype, visible: item.visible,itemtype:'input', } });
            prev.push(tem);
        return prev;
    },[])
  
    let meta = array.reduce((pre, cur, i) => {
        if (cur[Object.keys(cur)[0]] && cur[Object.keys(cur)[0]].moduletype === 'form') {
            cur[Object.keys(cur)[0]].status = 'edit';
            cur[Object.keys(cur)[0]].items.forEach((element, index) => {
                element.attrcode = index + 1;
               // element.col = 4;
            });
        }
        return { ...pre, ...cur }   // 数组拆开 展开为模板数据格式 
    }, {});
    props.meta.setMeta(meta);
    props.updatePreviewData(array);

}

