import api, { publicApi } from "./axiosConfig";

// SIGNUP (public) -> user + token milta hai
export const signupUser = (user) => publicApi.post("/api/users/signup", user);

// LOGIN (public) -> user + token milta hai
export const loginUser = (user) => publicApi.post("/api/users/login", user);

// CURRENT USER (JWT required)
export const getMe = () => api.get("/api/users/me");

// UPDATE PROFILE (JWT required). password optional hai.
export const updateUser = (id, user) => api.put(`/api/users/${id}`, user);
