import { setLoginInfo, setUserInfo } from '@/utils/set-storage';
import { useDidShow } from '@tarojs/taro';
import { checkSession, clearLoginLout, getWxCode, getWxUserInfo } from './util';

export const useLogin = (loginParams: any) => {
    const initCode = async () => {
        let code: any = await getWxCode();
        if (code) {
            loginParams.code = code;
        }
    };
    const loginOk = async result => {
        setLoginInfo(result);
        // const config: any = await api(result.userId);
        // if (config) {
        //     setUserInfo(config);
        // }
        // 清除历史记录的登陆接口
        // loginBack();
    };

    const wxLogin = async (data: { iv?: string; encryptedData?: string; [key: string]: any }) => {
        if (!loginParams.code) {
            initCode();
        }
        const userInfo: any = await getWxUserInfo();
        if (userInfo) {
            const { rawData, signature } = userInfo;
            const params = {
                code: loginParams.code,
                ...data,
                rawData,
                signature
            };
            // const api = !data.username ? login : loginPassword;
            // Taro.showToast({
            //     title: '登录中',
            //     icon: 'loading',
            //     mask: true,
            //     duration: 2000
            // });
            // let result: any = await api(params);
            // if (result !== false) {
            //     loginOk(result);
            // } else initCode();
        } else {
            await initCode();
        }
    };
    // 微信授权-登录按钮
    const loginInfo = async e => {
        const { encryptedData, iv } = e.detail;
        if (encryptedData) {
            let isSession = await checkSession();
            if (isSession) {
                wxLogin({ iv, encryptedData });
            } else {
                await initCode();
                wxLogin({ iv, encryptedData });
            }
        }
    };
    // 账号密码-按钮登录
    const loginBtn = async () => {};
    useDidShow(() => {
        clearLoginLout();
        initCode();
    });
    return { loginInfo, loginBtn };
};
