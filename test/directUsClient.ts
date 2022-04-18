import { Directus } from "@directus/sdk";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const url = "https://2befv7yw.directus.app/"
axios.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request
})

const directus = new Directus(url, {
    auth: {
        staticToken: 'QUM5T15SdxPtzJPch04Qg76TQIXpFBIM'
    },
    transport: axios
});
axios.interceptors
export { url };
export default directus;
