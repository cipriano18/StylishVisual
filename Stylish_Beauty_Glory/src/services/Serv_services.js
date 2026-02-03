import { apiFetch } from "./api";

// Obtener todos los servicios
export async function fetchServices() {
  try {
    const res = await apiFetch("/services");
    return await res.json();
  } catch (error) {
    console.error("fetchServices error:", error);
    return null;
  }
}

// Crear un nuevo servicio
export async function createService(data) {
  try {
    const res = await apiFetch("/services", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("createService error:", error);
    return null;
  }
}

// Editar un servicio por ID
export async function updateService(id, updatedData) {
  try {
    const res = await apiFetch(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedData),
    });
    return await res.json();
  } catch (error) {
    console.error("updateService error:", error);
    return null;
  }
}

// Eliminar un servicio por ID
export async function deleteService(id) {
  try {
    const res = await apiFetch(`/services/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("deleteService error:", error);
    return null;
  }
}
