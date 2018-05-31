/**
 * 获取url参数
 * @param {String} query 当前 url 中传递的参数
 */
export const GetQuery = (query) => {
	let theRequest = {};
	if (query.indexOf('?') != -1) {
		let str = query.substr(1);
		if (str.indexOf('&') != -1) {
			let strs = str.split('&');
			for (let i = 0; i < strs.length; i++) {
				theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
			}
		} else {
			theRequest[str.split('=')[0]] = str.split('=')[1];
		}
	}
	return theRequest;
};
/**
 * 数字补位
 * @param {Number} num 
 * @param {Number} n 
 */
export const Pad=(num, n)=> {  
	let len = num.toString().length;  
    while(len < n) {  
        num = "0" + num;  
        len++;  
    }  
    return num;    
}  