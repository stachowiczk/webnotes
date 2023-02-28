import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:5000/",
});

http.interceptors.request.use(
    (config) => {
        config.withCredentials = true;
        config.headers["Content-Type"] = "application/json";
        config.headers["Access-Control-Allow-Origin"] = "*";
        config.headers["Access-Control-Allow-Credentials"] = true;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            return axios.put('http://localhost:5000/auth/login', null, 
                {withCredentials: true})
                .then(res => {
                    if (res.status === 200) {
                        return http(originalRequest);
                    }
                }
            );
        }
        return Promise.reject(error);
    }
);

export default http;
