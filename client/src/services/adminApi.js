const BASE_API = "http://localhost:4000";

export const createAdmin = (data) =>
  fetch(`${BASE_API}/createAdmins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

export const getAdmins = () =>
  fetch(`${BASE_API}/allAdmins`, {
    credentials: "include",
  });

export const deleteAdmin = (id) =>
  fetch(`${BASE_API}/deleteAdmin/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

export const updateAdmin = (id, data) =>
  fetch(`${BASE_API}/updateAdmin/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

export const forgotPassword = (email) =>
  fetch(`${BASE_API}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

export const resetPassword = (data) =>
  fetch(`${BASE_API}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
