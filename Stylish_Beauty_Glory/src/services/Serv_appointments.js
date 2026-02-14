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

// Obtener citas por cliente 
export async function getAppointmentsByClient(clientId) {
  try { 
    const res = await apiFetch(`/appointments/client/${clientId}`, { 
      method: "GET", }); 
      return await res.json(); 
    } catch { 
      return null; 
    }
}

// Obtener citas disponibles
export async function getAvailableAppointments() {
  try {
    const res = await apiFetch("/appointments/available", {
      method: "GET",
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Agendar una cita
export async function bookAppointment(appointmentId, clientId) {
  try {
    const res = await apiFetch(`/appointments/${appointmentId}/agendar`, {
      method: "PUT",
      body: JSON.stringify({ client_id: clientId }),
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Cancelar una cita (cliente)
export async function cancelAppointmentByClient(appointmentId) {
  try {
    const res = await apiFetch(`/appointments/${appointmentId}/cancelar-cliente`, {
      method: "PUT",
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Cancelar cita por (administrador)
export async function cancelAppointmentByAdmin(appointmentId) {
  try {
    const res = await apiFetch(`/appointments/${appointmentId}/cancelar`, {
      method: "PUT",
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Finalizar cita
export async function finalizeAppointment(appointmentId) {
  try {
    const res = await apiFetch(`/appointments/${appointmentId}/finalizar`, {
      method: "PUT",
    });
    return await res.json();
  } catch {
    return null;
  }
}
