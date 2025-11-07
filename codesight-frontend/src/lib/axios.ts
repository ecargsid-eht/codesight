import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});


export function setAuthToken(token?: string | null) {
  if (token) {
    axiosInstance.defaults.headers.common =
      axiosInstance.defaults.headers.common || {};
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    if (axiosInstance.defaults.headers?.common) {
      delete axiosInstance.defaults.headers.common.Authorization;
    }
  }
}

export default axiosInstance;
