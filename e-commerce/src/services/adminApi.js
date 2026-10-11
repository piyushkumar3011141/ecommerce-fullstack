import api from "./axiosConfig";

export const getAdminStats = () => api.get("/api/admin/stats");

export const getAdminOrders = () => api.get("/api/admin/orders");

export const setOrderStatus = (id, status) =>
  api.put(`/api/admin/orders/${id}/status`, { status });

export const getAdminUsers = () => api.get("/api/admin/users");

export const getAdminMessages = () => api.get("/api/admin/messages");

export const toggleMessageResolved = (id) =>
  api.put(`/api/admin/messages/${id}/resolve`);
