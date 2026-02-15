import { apiFetch } from "./api";

// Obtener todos los usuarios
export async function fetchUsers() {
  try {
    const response = await apiFetch("/users");
    return await response.json();
  } catch {
    return null;
  }
}

// Actualizar un usuario existente
export async function updateUser(id, updatedData) {
  try {
    const res = await apiFetch(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedData),
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Inactivar un usuario
export async function inactivateUser(id) {
  try {
    const res = await apiFetch(`/users/${id}/inactivar`, {
      method: "PUT",
    });
    return await res.json();
  } catch {
    return null;
  }
}
