import { apiFetch } from "./api";

// Obtener todos los administradores
export async function fetchAdmins() {
  try {
    const res = await apiFetch("/admins");
    return await res.json();
  } catch (error) {
    console.error("fetchAdmins error:", error);
    return null;
  }
}

// Crear un nuevo administrador
export async function createAdmin(data) {
  try {
    const res = await apiFetch("/admins", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
}

// Editar datos de un administrador (por cédula)
export async function updateAdmin(identityCard, updatedData) {
  try {
    const res = await apiFetch(`/admins/${identityCard}`, {
      method: "PUT",
      body: JSON.stringify(updatedData),
    });
    return await res.json();
  } catch {
    return null;
  }
}
// Dar de baja a un administrador (por cédula)
export async function deactivateAdmin(identityCard) {
  try {
    const res = await apiFetch(`/admins/${identityCard}/inactivar`, {
      method: "PUT",
    });
    return await res.json();
  } catch {
    return null;
  }
}