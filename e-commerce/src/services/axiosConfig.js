import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export const TOKEN_KEY = "ecom_token";
export const SESSION_KEY = "ecom_session";

// For requests that do not need login (login / signup)
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
});

// For all requests after login (the JWT is attached automatically)
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

// If the token is invalid or expired, log the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      window.dispatchEvent(new Event("ecom:unauthorized"));
    }
    return Promise.reject(error);
  }
);

// Helper to get a readable error message from a failed request
export const getErrorMessage = (error, fallback = "Something went wrong.") => {
  // No response at all: the server is down or unreachable
  if (!error.response) {
    return "Cannot connect to the server. Please make sure the backend is running.";
  }
  return error.response.data?.message || fallback;
};

export default api;