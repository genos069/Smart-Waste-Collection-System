import { apiGet } from "./api.js";
export const getTasks = () => apiGet("/tasks");
