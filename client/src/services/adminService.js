import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";
export const createAdmin = (data) => apiPost("/createAdmins", data);
export const getAdmins = () => apiGet("/allAdmins");
export const getAdminById = (id) => apiGet(`/adminsById/${encodeURIComponent(id)}`);
export const updateAdmin = (id, data) => apiPut(`/updateAdmin/${encodeURIComponent(id)}`, data);
export const deleteAdmin = (id) => apiDelete(`/deleteAdmin/${encodeURIComponent(id)}`);
