import axios from "axios";

const baseURL = import.meta.env.VITE_REACT_APP_URL;

const AxiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});


export default AxiosInstance;