import { apiFetch } from "./api";
import { API_BASE } from "./config";

// Actualizar datos de un cliente (por cédula)
export async function updateClient(identityCard, updatedData) {
  try {
    const res = await apiFetch(`/clients/${identityCard}`, {
      method: "PUT",
      body: JSON.stringify(updatedData),
    });
    return await res.json();
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    return null;
  }
}

// Crear un nuevo cliente (registro público)
export async function createClient(data) {
  try {
    const res = await fetch(`${API_BASE}/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // 🔑 Siempre retornamos el JSON, aunque sea error
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("createClient error:", error);
    return null;
  }
}

