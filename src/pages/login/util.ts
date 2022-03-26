import { push } from '@/utils/router';
import Taro from '@tarojs/taro';

//清除登录信息
export const clearLoginLout = async () => {
    Taro.removeStorageSync('wx-login-info');
    Taro.removeStorageSync('wx-user-info');
};
export const exitLoginLout = async () => {
    clearLoginLout();
    push('login/index', 'redirectTo');
};

// 获取微信登录code
export const getWxCode = () => {
    return new Promise(resolve => {
        Taro.login({
            success: function (res) {
                if (res.code) {
                    resolve(res.code);
                } else {
                    Taro.showToast({
                        title: '登录失败' + res.errMsg,
                        icon: 'none',
                        duration: 2000
                    });
                    resolve(false);
                }
            }
        });
    });
};
// 获取用户信息
export const getWxUserInfo = () => {
    return new Promise(resolve => {
        Taro.getUserInfo({
            success: function (res) {
                if (res) {
                    resolve(res);
                } else {
                    resolve(false);
                }
            }
        });
    });
};
// 判断 session
export const checkSession = () => {
    return new Promise(resolve => {
        Taro.checkSession({
            success: function () {
                resolve(true);
            },
            fail: function () {
                resolve(false);
            }
        });
    });
};
