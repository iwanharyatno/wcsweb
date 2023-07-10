import axios from "axios";
import Cookies from "universal-cookie";
import { AppConfig } from "../constants";

const cookies = new Cookies();

function getAxios() {
    const user = cookies.get(AppConfig.USER_COOKIE_KEY) || {};
    return axios.create({
        baseURL: AppConfig.API_BASE_URL,
        headers: {
            'Authorization': 'Bearer ' + user["access_token"]
        }
    });
}

export default getAxios;