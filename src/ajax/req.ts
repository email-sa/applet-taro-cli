import { getLoginInfo } from '@/utils/get-storage';
import Taro from '@tarojs/taro';
import interceptorFun from './interceptor';

console.log('taro', Taro);

Taro.addInterceptor(interceptorFun);
type reqFun = (params: Taro.RequestParams) => Taro.RequestTask<any>;

const getRealUrl = url => {
    return url.indexOf('http://') > -1 || url.indexOf('https://') > -1 ? url : API_URL + url;
};
export const getReqParams = params => {
    let contentType = 'application/x-www-form-urlencoded';
    let token = getLoginInfo().token ?? '';

    contentType = params.contentType || contentType;
    if (params.url.indexOf('v1//') > -1) {
        params.url = params.url.replace('v1//', 'v1/');
    }
    let head = { 'content-type': contentType, 'User-Type': 1 };
    if (token) {
        head['X-Auth-Token'] = token;
    }
    const option: Taro.RequestParams = {
        timeout: 15000,
        header: head,
        ...params
    };
    return option;
};

export const $req: reqFun = params => {
    const option: Taro.RequestParams = getReqParams(params);
    return Taro.request(option);
};

export function get<T>(url: string, data?: T | null | {}, params?: any) {
    return $req({ url: getRealUrl(url), data, method: 'GET', ...params });
}
export function del<T>(url: string, data?: T | null | {}, params?: any) {
    return $req({ url: getRealUrl(url), data, method: 'DELETE', ...params });
}
export function post<T>(url: string, data?: T | null | {}, params?: any) {
    return $req({ url: getRealUrl(url), data, method: 'POST', ...params, contentType: 'application/json' });
}

export function put<T>(url: string, data?: T | null | {}, params?: any) {
    return $req({ url: getRealUrl(url), data, method: 'PUT', ...params, contentType: 'application/json' });
}
