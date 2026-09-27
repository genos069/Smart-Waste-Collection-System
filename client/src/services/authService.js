import { apiGet, apiPost } from "./api.js";
export const login = (credentials) => apiPost("/login", credentials);
export const logout = () => apiPost("/logout");
export const getMe = () => apiGet("/me");
export const forgotPassword = (email) => apiPost("/forgot-password", { email });
export const resetPassword = (data) => apiPost("/reset-password", data);
