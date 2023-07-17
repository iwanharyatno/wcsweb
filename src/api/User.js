import { ApiEndpoint, FETCH_END_EVENT, FETCH_FAILED_EVENT, FETCH_START_EVENT } from "../constants";
import { dispatchFetchEvent } from "../events/fetchEvents";
import getAxios from "../network/getAxios";

const User = {
    all: async (params) => {
        let result = null;

        try {
            dispatchFetchEvent(FETCH_START_EVENT);
            result = await getAxios().get(ApiEndpoint.User.All(params));
            result = result.data;
        } catch(e) {
            dispatchFetchEvent(FETCH_FAILED_EVENT);
            result = e.response;
        }
        dispatchFetchEvent(FETCH_END_EVENT);

        return result;
    },
    update: async (id, data) => {
        let result = null;

        try {
            dispatchFetchEvent(FETCH_START_EVENT);
            result = await getAxios().delete(ApiEndpoint.User.Update(id), data);
            result = result.data;
        } catch(e) {
            dispatchFetchEvent(FETCH_FAILED_EVENT);
            result = e.response;
        }
        dispatchFetchEvent(FETCH_END_EVENT);

        return result;
    },
    delete: async (id) => {
        let result = null;

        try {
            dispatchFetchEvent(FETCH_START_EVENT);
            result = await getAxios().delete(ApiEndpoint.User.Delete(id));
            result = result.data;
        } catch(e) {
            dispatchFetchEvent(FETCH_FAILED_EVENT);
            result = e.response;
        }
        dispatchFetchEvent(FETCH_END_EVENT);

        return result;
    },
    detail: async (id) => {
        let result = null;

        try {
            dispatchFetchEvent(FETCH_START_EVENT);
            result = await getAxios().get(ApiEndpoint.User.Detail(id));
            result = result.data;
        } catch(e) {
            dispatchFetchEvent(FETCH_FAILED_EVENT);
            result = e.response;
        }
        dispatchFetchEvent(FETCH_END_EVENT);

        return result;
    }
}

export default User;