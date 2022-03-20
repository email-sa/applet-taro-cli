import Taro from '@tarojs/taro';

// get

export const getLoginInfo = () => {
    return Taro.getStorageSync('wx-login-info');
};
