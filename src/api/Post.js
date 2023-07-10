import { ApiEndpoint, FETCH_END_EVENT, FETCH_FAILED_EVENT, FETCH_START_EVENT } from "../constants";
import { dispatchFetchEvent } from "../events/fetchEvents";
import getAxios from "../network/getAxios";

const Post = {
    all: async () => {
        let result = null;

        try {
            dispatchFetchEvent(FETCH_START_EVENT);
            result = await getAxios().get(ApiEndpoint.Post.All);
            dispatchFetchEvent(FETCH_END_EVENT);
        } catch(e) {
            dispatchFetchEvent(FETCH_FAILED_EVENT);
        }

        return result.data;
    }
}

export default Post;