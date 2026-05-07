import { apiFetch } from "./api";

/**
 * Obtiene el listado de administradores.
 * @returns {Promise<{ admins?: Array<Record<string, unknown>>, error?: string } | null>}
 */
export async function fetchAdmins() {
  try {
    const res = await apiFetch("/admins");
    return await res.json();
  } catch (error) {
    console.error("fetchAdmins error:", error);
    return null;
  }
}

/**
 * Crea un administrador.
 * @param {Record<string, unknown>} data
 * @returns {Promise<Record<string, unknown> | null>}
 */
export async function createAdmin(data) {
  try {
    const res = await apiFetch("/admins", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("createAdmin error:", error);
    return null;
  }
}

/**
 * Actualiza los datos de un administrador identificado por cédula.
 * @param {string} identityCard
 * @param {Record<string, unknown>} updatedData
 * @returns {Promise<Record<string, unknown> | null>}
 */
export async function updateAdmin(identityCard, updatedData) {
  try {
    const res = await apiFetch(`/admins/${identityCard}`, {
      method: "PUT",
      body: JSON.stringify(updatedData),
    });
    return await res.json();
  } catch (error) {
    console.error("updateAdmin error:", error);
    return null;
  }
}

/**
 * Inactiva un administrador por cédula.
 * @param {string} identityCard
 * @returns {Promise<Record<string, unknown> | null>}
 */
export async function deactivateAdmin(identityCard) {
  try {
    const res = await apiFetch(`/admins/${identityCard}/inactivar`, {
      method: "PUT",
    });
    return await res.json();
  } catch (error) {
    console.error("deactivateAdmin error:", error);
    return null;
  }
}
