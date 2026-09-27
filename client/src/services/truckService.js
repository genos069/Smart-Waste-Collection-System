import { apiPost } from "./api.js";
export const updateLocation = (location) => apiPost("/location", location);
