export default  getUrlParam = (pop) => {
    if (!pop) return;
    let result;
    let params = window.location.hash && window.location.hash.split('?');
    if (params) {
        params = params[1] && params[1].split('&');
        params &&
            params.find((item) => {
                if (item.indexOf(pop) != -1) {
                    result = item.split('=')[1];
                }
            });
        return result;
    }
};