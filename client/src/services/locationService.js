import { apiPost } from "./api.js";
export const seedLocations = (locations) => apiPost("/seed/locations", locations);
