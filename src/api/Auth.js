import { ApiEndpoint, AppConfig, FETCH_END_EVENT, FETCH_FAILED_EVENT, FETCH_START_EVENT } from "../constants";
import { dispatchFetchEvent } from "../events/fetchEvents";
import getAxios from "../network/getAxios";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const Auth = {
    login: async (credentials, remember) => {
        let result = null;
        try {
            dispatchFetchEvent(FETCH_START_EVENT);
            result = await getAxios().post(ApiEndpoint.Auth.Login, credentials);
            result = result.data;

            let options = {
                path: '/'
            };
    
            if (remember) {
                const todayMillis = new Date().getTime();
                const expiredDaysMillis = 4 * 24 * 3600 * 1000;
    
                options = {
                    ...options,
                    expires: new Date(todayMillis + expiredDaysMillis)
                };
            }
    
            cookies.set(AppConfig.USER_COOKIE_KEY, result.data, options);
        } catch(e) {
            dispatchFetchEvent(FETCH_FAILED_EVENT);
            result = e.response;
        }
        dispatchFetchEvent(FETCH_END_EVENT);

        return result;
    },
    register: async (data) => {
        let result = null;

        try {
            dispatchFetchEvent(FETCH_START_EVENT);
            result = await getAxios().post(ApiEndpoint.Auth.CreateUser, data);
            result = result.data;
        } catch(e) {
            dispatchFetchEvent(FETCH_FAILED_EVENT);
            result = e.response;
        }
        dispatchFetchEvent(FETCH_END_EVENT);

        return result;
    },
    forgotpassword: async (data) => {
        let result = null;

        try {
            dispatchFetchEvent(FETCH_START_EVENT);
            result = await getAxios().post(ApiEndpoint.Auth.ForgotPassword, data);
            result = result.data;
        } catch(e) {
            dispatchFetchEvent(FETCH_FAILED_EVENT);
            result = e.response;
        }
        dispatchFetchEvent(FETCH_END_EVENT);

        return result;
    }
}

export default Auth;