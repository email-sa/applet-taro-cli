import Taro from '@tarojs/taro';

// set

export const setUserInfo = (data: any) => {
    Taro.setStorageSync('wx-user-info', data);
};
export const setLoginInfo = (data: any) => {
    return Taro.setStorageSync('wx-login-info', data);
};
