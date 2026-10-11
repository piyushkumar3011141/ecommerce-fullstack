import api from "./axiosConfig";

const API_URL = "/api/products";

export const getProducts = () => api.get(API_URL);

export const getProductById = (id) => api.get(`${API_URL}/${id}`);

export const addProduct = (product) => api.post(API_URL, product);

export const addProductsBulk = (products) =>
  api.post(`${API_URL}/bulk`, products);

export const updateProduct = (id, product) =>
  api.put(`${API_URL}/${id}`, product);

export const deleteProduct = (id) => api.delete(`${API_URL}/${id}`);
