import { apiFetch } from "./api";

// Obtener perfil de administrador
export async function fetchAdminProfile() {
  try {
    const res = await apiFetch("/profile/admin");
    return await res.json();
  } catch (err) {
    console.error("Error al cargar perfil:", err);
    return null;
  }
}
// Obtener perfil de cliente
export async function fetchClientProfile() {
    try {
        const res = await apiFetch("/profile/client");
        return await res.json();
        } catch (err) {
            console.error("Error al cargar perfil cliente:", err);
            return null; 
 } 
}