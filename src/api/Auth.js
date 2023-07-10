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
    
            cookies.set(AppConfig.USER_COOKIE_KEY, result.data.data, options);
        } catch(e) {
            result = e.response;
            dispatchFetchEvent(FETCH_FAILED_EVENT);
        }
        dispatchFetchEvent(FETCH_END_EVENT);

        return result.data;
    },
    register: (data) => {
        let result = null;

        try {
            result = getAxios().post(ApiEndpoint.Auth.CreateUser, data);
        } catch(e) {
            result = e.response;
            dispatchFetchEvent(FETCH_FAILED_EVENT);
        }

        return result.data;
    }
}

export default Auth;