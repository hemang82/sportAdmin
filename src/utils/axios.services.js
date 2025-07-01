import axios from 'axios';
import Constatnt, { Codes } from '../config/constant';
import { Decryption, Encryption, logoutRedirection, ManageTokan } from '../config/commonFunction';

const AxiosClientApi = axios.create({
    baseURL: Constatnt.API_BASE_URL,
});

// request AxiosClient
AxiosClientApi.interceptors.request.use(function (request) {
    request.headers['token'] = localStorage.getItem(Constatnt?.ACCESS_TOKEN_KEY) || 'bjrr8m04xkdvj521f0sub0qnl2q47xmv52l0lcv7eysynul7so04ybfmhpfmtmb1';
    request.headers['accept-language'] = Constatnt.LANGUAGE;
    request.headers['role'] = Constatnt.ROLE;
    request.headers['api-key'] = Constatnt.API_KEY;
    request.headers['content-type'] = Constatnt.CONTENT_TYPE;
    request.headers['is_encript'] = Constatnt.IS_ENCREPT;
    request.headers['platform'] = Constatnt.PLATFORM;
    return request;
});

// Response AxiosClient
AxiosClientApi.interceptors.response.use(
    function (response) {
        if (response?.data?.code === Codes?.UNAUTHORIZED) {
            // ManageTokan();
            logoutRedirection();
        }
        return response.data;
    },
    function (error) {
        if (error?.response?.status === 401) {
            logoutRedirection();
        }
        return Promise.reject(error);
    }
);

export default AxiosClientApi;
