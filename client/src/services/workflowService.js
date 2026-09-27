import { apiPost } from "./api.js";
export const updateStatus = (data) => apiPost("/update-status", data);
