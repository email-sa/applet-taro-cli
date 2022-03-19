import Taro from '@tarojs/taro';
import { push } from '@/utils/router';

let HttpInfo = {
    number: 0,
    message: '',
    alertInfo: function (url, msg, type) {
        if (this.number === 0 && url === this.cacheList[this.cacheList.length - 1]) {
            const modelParams = { title: '温馨提示', content: msg };
            let showModel = true;
            console.log('type', url, msg, type);
            switch (type) {
                case 4001:
                case 4003:
                    Taro.showToast({
                        title: msg,
                        icon: 'none',
                        duration: 2000
                    });
                    push('login/index', 'redirectTo');
                    showModel = false;
                    break;
                case 500:
                    Object.assign(modelParams, {
                        showCancel: false,
                        confirmText: '知道了'
                    });
                    break;
                default:
                    Taro.showToast({
                        title: msg,
                        icon: 'none',
                        duration: 2000
                    });
                    showModel = false;
                    break;
            }
            if (showModel) {
                Taro.showModal(modelParams);
            }
            if (msg === '用户未登录') {
                push('login/index', 'redirectTo');
            }
            this.message = '';
            this.cacheList = [];
        }
    },
    cacheList: [],
    addReqCache(url) {
        this.cacheList.push(url);
    }
};

const interceptorFun = function (chain) {
    const requestParams = chain.requestParams;
    HttpInfo.number = HttpInfo.number + 1;
    let { url } = requestParams;
    HttpInfo.addReqCache(url);

    let proceed = chain.proceed(requestParams);
    const result = proceed
        .then(res => {
            HttpInfo.number = HttpInfo.number - 1;
            const { data, code, msg } = res.data;
            if (Number(code) === 0) {
                return data || null;
            } else if (Number(code) === 40001) {
                HttpInfo.alertInfo(url, '您的登录已过期，请重新登录', 4001);
            } else {
                HttpInfo.alertInfo(url, msg ? msg : '网络故障，请联系客服', 200);
                return Promise.resolve(false);
            }
        })
        .catch(err => {
            HttpInfo.alertInfo(url, '网络故障，请稍后重试', 500);
            return Promise.reject(err);
        });

    if (proceed.abort) result.abort = proceed.abort;
    return result;
};
export default interceptorFun;
