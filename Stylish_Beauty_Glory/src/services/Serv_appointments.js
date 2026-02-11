import { apiFetch } from "./api";

// Crear una nueva cita
export async function createAppointment(data) {
  try {
    const res = await apiFetch("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Obtener todas las citas
export async function getAppointments() {
  try {
    const res = await apiFetch("/appointments", {
      method: "GET",
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Editar una cita
export async function updateAppointment(id, data) { 
  try { 
    const res = await apiFetch(`/appointments/${id}`, { 
      method: "PUT", 
      body: JSON.stringify(data), }); 
    return await res.json();
  } catch {
    return null; 
  } 
}