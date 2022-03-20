import Taro from '@tarojs/taro';

// set

export const setLoginInfo = (data: any) => {
    return Taro.setStorageSync('wx-login-info', data);
};
