import { apiFetch } from "./api";

// Notificar cita movida
export async function notifyAppointmentMoved({ client_id, appointment_id, admin_id }) {
  try {
    const res = await apiFetch("/notify/email/cita-movida", {
      method: "POST",
      body: JSON.stringify({ client_id, appointment_id, admin_id }),
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Notificar cita cancelada
export async function notifyAppointmentCanceled({ client_id, appointment_id, admin_id, reason }) {
  try {
    const res = await apiFetch("/notify/email/cita-cancelada", {
      method: "POST",
      body: JSON.stringify({ client_id, appointment_id, admin_id, reason }),
    });
    return await res.json();
  } catch {
    return null;
  }
}
