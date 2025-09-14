import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Skip adding auth header for registration and login endpoints
    if (config.url.includes('/auth/register') || config.url.includes('/auth/login')) {
      return config;
    }

    const accessToken = sessionStorage.getItem("accessToken");

    if (accessToken) {
      // Parse the stored token (it's stored as JSON string)
      const token = JSON.parse(accessToken);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
