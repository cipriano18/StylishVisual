import { API_BASE } from "./config";

/* ===============================
   🔐 Fetch con token automático
   =============================== */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);

  // Si el token es inválido o expiró
  if (res.status === 401 || res.status === 403) {
    console.error("No autorizado o sesión expirada");
  }

  return res;
}
