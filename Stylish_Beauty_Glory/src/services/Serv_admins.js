import { API_BASE } from "./config";

// Obtener todos los administradores
export async function fetchAdmins() {
  try {
    const res = await fetch(`${API_BASE}/admins`);
    return await res.json();
  } catch {
    return null;
  }
}

// Crear un nuevo administrador
export async function createAdmin(data) {
  try {
    const res = await fetch(`${API_BASE}/admins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Editar datos de un administrador (por cédula)
export async function updateAdmin(identityCard, updatedData) {
  try {
    const res = await fetch(`${API_BASE}/admins/${identityCard}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
    const res = await fetch(`${API_BASE}/admins/${identityCard}/inactivar`, {
      method: "PUT",
    });
    return await res.json();
  } catch {
    return null;
  }
}