/**
 * Convierte duraciones tipo HH:MM o HH:MM:SS en un texto amigable.
 * Ejemplos:
 * - 01:30 -> 1h 30min
 * - 00:20 -> 20min
 * - 02:00 -> 2h
 */
export function formatAppointmentDuration(durationValue = "") {
  if (!durationValue || typeof durationValue !== "string") {
    return durationValue;
  }

  const [rawHours = "0", rawMinutes = "0"] = durationValue.split(":");
  const hours = Number.parseInt(rawHours, 10);
  const minutes = Number.parseInt(rawMinutes, 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return durationValue;
  }

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}min`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${minutes}min`;
}
