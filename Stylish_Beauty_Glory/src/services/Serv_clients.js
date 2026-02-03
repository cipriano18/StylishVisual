import { apiFetch } from "./api";

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
