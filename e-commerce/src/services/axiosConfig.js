import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export const TOKEN_KEY = "ecom_token";
export const SESSION_KEY = "ecom_session";

// Bina login wali calls (login / signup) ke liye
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
});

// Login ke baad wali saari calls ke liye (JWT automatically lagta hai)
const api = axios.create({
  baseURL: API_BASE_URL,
});

// =========================
// JWT INTERCEPTOR
// =========================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Token expire / galat ho to user ko logout kar do
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      window.dispatchEvent(new Event("ecom:unauthorized"));
    }
    return Promise.reject(error);
  }
);

// Backend ka error message nikalne ka helper
export const getErrorMessage = (error, fallback = "Something went wrong.") => {
  if (!error.response) {
    return "";
  }
  return error.response.data?.message || fallback;
};

export default api;
