import { ApiEndpoint, FETCH_END_EVENT, FETCH_FAILED_EVENT, FETCH_START_EVENT } from "../constants";
import { dispatchFetchEvent } from "../events/fetchEvents";
import getAxios from "../network/getAxios";

const Banner = {
    all: async (params) => {
        let result = null;
        try {
            dispatchFetchEvent(FETCH_START_EVENT);
            result = await getAxios().get(ApiEndpoint.Banner.All(params));
            result = result.data;
        } catch(e) {
            dispatchFetchEvent(FETCH_FAILED_EVENT);
            result = e.response;
        }
        dispatchFetchEvent(FETCH_END_EVENT);

        return result;
    }
}

export default Banner;