import api from "./axiosConfig";

const API_URL = "/api/orders";

// Logged-in user ke saare orders
export const getOrders = () => api.get(API_URL);

export const getOrdersByUser = (email) =>
  api.get(`${API_URL}/user/${encodeURIComponent(email)}`);

export const createOrder = (order) => api.post(API_URL, order);

// Customer apna order cancel kar sakta hai (shipped hone se pehle)
export const cancelOrderApi = (id) => api.put(`${API_URL}/${id}/cancel`);
