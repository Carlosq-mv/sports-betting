import axios from "axios";

const baseURL = import.meta.env.VITE_REACT_APP_URL;

const AxiosInstance = axios.create({
    baseURL: baseURL,
});

AxiosInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        // console.log(config);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default AxiosInstance;