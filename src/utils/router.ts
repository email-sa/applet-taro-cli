import Taro, { getCurrentInstance, getCurrentPages } from '@tarojs/taro';

import { typeOf } from './tool';

// 根据参数生成路由地址
const routeParams = (url, params) => {
    let paramsStr: string = '';
    if (params) {
        paramsStr = '?';
        for (let key in params) {
            paramsStr += `&${key}=${params[key]}`;
        }
    }
    return `${url}${paramsStr}`;
};

// 获取当前路由是 路由栈的第几个
const getUrlIndex = path => {
    let newPath = path.indexOf('/pages') > -1 ? path.slice(1) : 'pages/' + path;
    let pages: any = getCurrentPages();
    let i = 1;
    let prevPage = pages[pages.length - 1 - i];
    while (prevPage?.route !== newPath) {
        if (i > pages.length) {
            return {
                index: pages.length - 1,
                page: pages[0]
            };
        }
        i++;
        prevPage = pages[pages.length - 1 - i];
    }

    return {
        index: i,
        page: prevPage
    };
};
// 获取 push的地址的类型,如果是 tabbar 对应 switchTab
const getPushArgs = args => {
    let argsObj: any = {};
    if (args?.length) {
        args.forEach(el => {
            if (typeOf(el) === 'string' && el.indexOf('event-') > -1) {
                argsObj.eventName = el;
            }
            if (typeOf(el) === 'object' || typeOf(el) === 'null') {
                argsObj.params = el;
            }
            if (typeOf(el) === 'string' && ['redirectTo', 'reLaunch', 'switchTab', 'navigateTo'].indexOf(el) > -1) {
                argsObj.routeType = el;
            }
        });
    }
    return argsObj;
};
/**
 * 前进页面
 * @param url  路由
 * @param args obj形式的就是params ,string 可能是eventName / routeType
 */
export const push: any = (url: string, ...args: any[]) => {
    let newUrl = url.indexOf('/pages') > -1 ? url : '/pages/' + url;
    let { params, eventName, routeType } = getPushArgs(args);
    const router = getCurrentInstance().router;
    // 更新历史记录
    Taro.setStorageSync('last-router', {
        params: router?.params || '',
        path: router?.path || '/pages/tabBar/home/index'
    });

    let path = routeParams(newUrl, params);
    let newRouteType = routeType ? routeType : 'navigateTo';
    Taro[newRouteType]({
        url: eventName ? newUrl : path,
        success(res) {
            if (eventName) {
                res.eventChannel.emit(eventName, params);
            }
        }
    });
};
// 参数类型的兼容处理
const getBackArgs = args => {
    let argsObj: any = {};
    if (args?.length) {
        args.forEach(el => {
            if (typeOf(el) === 'number' || el > 0) {
                argsObj.delta = el;
            }
            if (typeOf(el) === 'string' && el.indexOf('/') > -1) {
                argsObj.url = el;
            }
            if (typeOf(el) === 'object' || typeOf(el) === 'null') {
                argsObj.params = el;
            }
        });
    }
    return argsObj;
};
// 返回指定页面
export const nativeBack = (...args) => {
    const { delta, url, params } = getBackArgs(args);
    if (url && typeOf(url) === 'string') {
        let preObj = getUrlIndex(url);
        if (params) {
            preObj.page.setData(params);
        }
        Taro.navigateBack({
            delta: preObj.index
        });
    } else {
        let pages: any = getCurrentPages();
        let index = 1;
        if (delta && typeOf(delta) === 'number') {
            index = delta;
        }
        let prevPage = pages[pages.length - 1 - index];
        if (params) {
            prevPage.setData(params);
        }
        Taro.navigateBack({
            delta: index
        });
    }
};
// 跳转到上一页
export const toBack = (url, isFresh = false) => {
    let route = Taro.getStorageSync('last-router');
    let path = routeParams(route.path, route.params);
    if (url.indexOf('tabBar') > -1) {
        if (isFresh) {
            Taro.reLaunch({
                url: `${path}`
            });
        } else {
            Taro.switchTab({
                url: `${path}`
            });
        }
    } else {
        Taro.navigateTo({
            url: `${path}`
        });
    }
};
