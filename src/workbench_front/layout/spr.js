import Ajax from 'Pub/js/ajax';
import Notice from 'Components/Notice';
import moment from 'moment';
let resTime;
export const sprLog =(type)=>{
    if(type){
        Ajax({
            url:'/nccloud/platform/spr/start.do',
            data:{
                oprtime:moment().format('YYYY-MM-DD HH:mm:SS'),
                userid:'1001A4100000000055NR'
            },
            success:(res)=>{
                let {data} = res.data;
                if(data){
                    resTime = data;
                }else{
                    Notice({ status: 'error', msg: res.error.message });
                }
            }
        });
    }else{
        let win = window.open('','_blank');
        Ajax({
            url:'/nccloud/platform/spr/end.do',
            data:{
                oprtime:resTime,
                userid:'1001A4100000000055NR'
            },
            success:(res)=>{
                let {data} = res.data;
                if(data){
                    win.location.href = data;
                    win.focus();
                }else{
                    win.close();
                    Notice({ status: 'error', msg: res.error.message });
                }
            }
        });
    }
    return !type;
}