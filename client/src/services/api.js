export function normalizeApiBase(value) {
  const base = (value?.trim() || "http://localhost:4000").replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
}

const API_BASE = normalizeApiBase(import.meta.env?.VITE_API_URL);

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}/${path.replace(/^\/+/, "")}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
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
