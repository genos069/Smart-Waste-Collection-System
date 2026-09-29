export function normalizeApiBase(value) {
  const base = (value?.trim() || "http://localhost:4000").replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
}

const API_BASE = normalizeApiBase(import.meta.env?.VITE_API_URL);

export async function request(path, options = {}) {
  let response;
  try { response = await fetch(`${API_BASE}/${path.replace(/^\/+/, "")}`, {
    ...options,
    credentials: "include",
    signal: options.signal || AbortSignal.timeout(15000),
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  }); } catch (error) {
    if (error.name === "TimeoutError") throw new Error("The server took too long to respond. Please try again.");
    if (error.name === "TypeError") throw new Error("Could not reach the server. Check your connection and try again.");
    throw error;
  }
  if (response.status === 204) return null;
  let data;
  try { data = await response.json(); }
  catch {
    if (response.ok) throw new Error("The API returned an invalid response. Check VITE_API_URL and backend routing.");
    data = {};
  }
  if (!response.ok) {
    const error = new Error(data.message || data.error || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return data;
}

export const apiGet = (path) => request(path);
export const apiPost = (path, body) => request(path, { method: "POST", body: JSON.stringify(body) });
export const apiPut = (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) });
export const apiDelete = (path) => request(path, { method: "DELETE" });
