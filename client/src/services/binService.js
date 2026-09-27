import { apiGet, apiPost, apiDelete } from "./api.js";
export const createBin = (data) => apiPost("/pickups", data);
export const getBins = () => apiGet("/allBins");
export const deleteBin = (id) => apiDelete(`/deleteBin/${encodeURIComponent(id)}`);
export const deleteAllBins = () => apiDelete("/deleteAllBins");
export const collectBin = (id) => apiPost("/collect-bin", { id });
export const seedBins = (bins) => apiPost("/seed/bins", bins);
