import { API_BASE } from "./config";

// Obtener todos los usuarios
export async function fetchUsers() {
  try {
    const response = await fetch(`${API_BASE}/users`);
    return await response.json();
  } catch {
    return null;
  }
}
// Actualizar un usuario existente
export async function updateUser(id, updatedData) {
  try {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
    const res = await fetch(`${API_BASE}/users/${id}/inactivar`, {
      method: "PUT",
    });
    return await res.json();
  } catch {
    return null; 
  }
}
