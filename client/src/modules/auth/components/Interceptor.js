import axios from "axios";
import * as cfg from "../../../config.js";

const http = axios.create({
  baseURL: `${cfg.API_BASE_URL}/`,
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const res = await axios.get(
        `${cfg.API_BASE_URL}${cfg.AUTH_REFRESH_ENDPOINT}`,
        error.config,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        return http(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default http;
