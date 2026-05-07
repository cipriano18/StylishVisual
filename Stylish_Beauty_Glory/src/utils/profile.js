/**
 * Normalizes profile contacts so the UI can work with a stable { type, value } shape.
 * @param {Array<{ type?: string, value?: string, contact_type?: string, contact_value?: string }>} contacts
 * @returns {Array<{ type: string, value: string }>}
 */
export function normalizeContacts(contacts = []) {
  return contacts.map((contact) => ({
    type: contact.type ?? contact.contact_type ?? "",
    value: contact.value ?? contact.contact_value ?? "",
  }));
}

/**
 * Returns the value for a specific contact type from either normalized or raw API contacts.
 * @param {Array<{ type?: string, value?: string, contact_type?: string, contact_value?: string }>} contacts
 * @param {string} type
 * @returns {string}
 */
export function getContactValue(contacts = [], type) {
  const normalizedContacts = normalizeContacts(contacts);
  return normalizedContacts.find((contact) => contact.type === type)?.value || "";
}

/**
 * Formats an ISO date string to YYYY-MM-DD for inputs and comparisons.
 * @param {string | undefined | null} value
 * @returns {string}
 */
export function formatIsoDate(value) {
  return value ? value.split("T")[0] : "";
}

/**
 * Builds a readable display name from profile fields while skipping empty parts.
 * @param {{ primary_name?: string, secondary_name?: string, first_surname?: string, second_surname?: string }} profile
 * @param {string} [fallback]
 * @returns {string}
 */
export function buildDisplayName(profile = {}, fallback = "") {
  const displayName = [
    profile.primary_name,
    profile.secondary_name,
    profile.first_surname,
    profile.second_surname,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return displayName || fallback;
}

/**
 * Returns today's date in the YYYY-MM-DD format used across filters and comparisons.
 * @returns {string}
 */
export function getTodayIsoDate() {
  return new Date().toLocaleDateString("sv-SE");
}
