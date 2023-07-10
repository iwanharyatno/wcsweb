import { ApiEndpoint, FETCH_END_EVENT, FETCH_FAILED_EVENT, FETCH_START_EVENT } from "../constants";
import { dispatchFetchEvent } from "../events/fetchEvents";
import getAxios from "../network/getAxios";

const Post = {
    all: async (params) => {
        let result = null;

        try {
            dispatchFetchEvent(FETCH_START_EVENT);
            result = await getAxios().get(ApiEndpoint.Post.All(params));
            dispatchFetchEvent(FETCH_END_EVENT);
        } catch(e) {
            dispatchFetchEvent(FETCH_FAILED_EVENT);
            result = e.response.data;
        }

        return result?.data;
    },
    main: async (params) => {
        let result = null;

        try {
            dispatchFetchEvent(FETCH_START_EVENT);
            result = await getAxios().get(ApiEndpoint.Post.Main(params));
            dispatchFetchEvent(FETCH_END_EVENT);
        } catch(e) {
            dispatchFetchEvent(FETCH_FAILED_EVENT);
            result = e.response.data;
        }

        return result?.data;
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
            dispatchFetchEvent(FETCH_END_EVENT);
        } catch(e) {
            dispatchFetchEvent(FETCH_FAILED_EVENT);
            result = e.response.data;
        }

        return result.data;
    }
}

export default Post;