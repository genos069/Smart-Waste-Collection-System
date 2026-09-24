const API_BASE = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data;
}

export const apiGet = (path) => request(path);
export const apiPost = (path, body) =>
  request(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
