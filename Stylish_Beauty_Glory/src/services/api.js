import { API_BASE } from "./config"; //"https://stylish-8dn8.vercel.app/api"

export async function apiFetch(endpoint, options = {}) {
  let token = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  // Si el body es FormData, no seteamos Content-Type
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
    ...(!isFormData && { "Content-Type": "application/json" }),
  };

  const config = {
    ...options,
    headers,
  };

  let res = await fetch(`${API_BASE}${endpoint}`, config);

  // Manejo de refresh token
  if ((res.status === 401 || res.status === 403) && refreshToken) {
    console.warn("Access token expirado, intentando refrescar...");

    const refreshRes = await fetch(`${API_BASE}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      const newAccessToken = data.access_token;
      localStorage.setItem("access_token", newAccessToken);
      token = newAccessToken;

      const retryHeaders = {
        ...(headers || {}),
        Authorization: `Bearer ${newAccessToken}`,
      };

      res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: retryHeaders,
      });
    } else {
      console.error("Refresh token inválido o expirado, cerrando sesión...");
      localStorage.clear();
      window.location.href = "/login";
    }
  }

  return res;
}
