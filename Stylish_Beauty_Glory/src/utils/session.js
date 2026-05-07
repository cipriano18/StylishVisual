/**
 * Reads the persisted user object from localStorage.
 * @returns {Record<string, unknown> | null}
 */
export function getStoredUser() {
  try {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    console.error("No se pudo leer el usuario almacenado:", error);
    return null;
  }
}

/**
 * Persists the latest user information after profile or credential updates.
 * @param {Record<string, unknown>} user
 */
export function setStoredUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}
