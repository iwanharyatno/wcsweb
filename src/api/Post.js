import { ApiEndpoint, FETCH_END_EVENT, FETCH_FAILED_EVENT, FETCH_START_EVENT } from "../constants";
import { dispatchFetchEvent } from "../events/fetchEvents";
import getAxios from "../network/getAxios";

const Post = {
    all: async (params) => {
        let result = null;

        try {
            dispatchFetchEvent(FETCH_START_EVENT);
            result = await getAxios().get(ApiEndpoint.Post.All(params));
            result = result.data;
            dispatchFetchEvent(FETCH_END_EVENT);
        } catch(e) {
            dispatchFetchEvent(FETCH_FAILED_EVENT);
            result = e.response;
        }

        return result;
    },
    main: async (params) => {
        let result = null;

        try {
            dispatchFetchEvent(FETCH_START_EVENT);
            result = await getAxios().get(ApiEndpoint.Post.Main(params));
            result = result.data;
            dispatchFetchEvent(FETCH_END_EVENT);
        } catch(e) {
            dispatchFetchEvent(FETCH_FAILED_EVENT);
            result = e.response;
        }

        return result;
    },
    create: async (data, onProgress) => {
        const formData = new FormData();
        const keys = Object.keys(data);

        keys.forEach(k => {
            formData.append(k, data[k]);
        });
        
        let result = null;

        try {
            dispatchFetchEvent(FETCH_START_EVENT);
            result = await getAxios().post(ApiEndpoint.Post.Create, formData, {
                onUploadProgress: (e) => {
                    if (onProgress) onProgress(e);
                }
            });
            result = result.data;
            dispatchFetchEvent(FETCH_END_EVENT);
        } catch(e) {
            dispatchFetchEvent(FETCH_FAILED_EVENT);
            result = e.response;
        }

        return result;
    },
    single: async (id) => {
        let result = null;

        try {
            dispatchFetchEvent(FETCH_START_EVENT);
            result = await getAxios().get(ApiEndpoint.Post.Single(id));
            result = result.data;
            dispatchFetchEvent(FETCH_END_EVENT);
        } catch(e) {
            dispatchFetchEvent(FETCH_FAILED_EVENT);
            result = e.response;
        }

        return result;
    }
}

export default Post;