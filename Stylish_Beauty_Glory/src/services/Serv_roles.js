import { API_BASE } from "./config";

// Obtener todos los roles
export async function fetchRoles() {
  try {
    const res = await fetch(`${API_BASE}/roles`);
    return await res.json(); // El frontend decide qué hacer con el contenido
  } catch {
    return null; // No se cae, devuelve algo manejable
  }
}

// Crear un nuevo rol
export async function createRole(name) {
  try {
    const res = await fetch(`${API_BASE}/roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Editar un rol existente
export async function updateRole(id, newName) {
  try {
    const res = await fetch(`${API_BASE}/roles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Eliminar un rol
export async function deleteRole(id) {
  try {
    const res = await fetch(`${API_BASE}/roles/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch {
    return null;
  }
}
