import axios from "axios";
import Cookies from "js-cookie";
import { apiUrl } from "./api-url";

const apiClient = axios.create({
    baseURL: `${apiUrl}`,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Interceptor for response
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove("token");
            Cookies.remove("user_session");
            // window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default apiClient;