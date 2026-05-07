import { apiFetch } from "./api";

async function fetchProfile(endpoint, errorLabel) {
  try {
    const res = await apiFetch(endpoint);
    return await res.json();
  } catch (err) {
    console.error(`Error al cargar perfil de ${errorLabel}:`, err);
    return null;
  }
}

/**
 * Obtiene el perfil completo del administrador autenticado.
 * @returns {Promise<{ admin?: Record<string, unknown>, error?: string } | null>}
 */
export async function fetchAdminProfile() {
  return fetchProfile("/profile/admin", "administrador");
}

/**
 * Obtiene el perfil completo del cliente autenticado.
 * @returns {Promise<{ client?: Record<string, unknown>, error?: string } | null>}
 */
export async function fetchClientProfile() {
  return fetchProfile("/profile/client", "cliente");
}
