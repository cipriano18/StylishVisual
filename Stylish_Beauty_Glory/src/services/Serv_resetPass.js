import { apiFetch } from "./api";

// Recuperación de contraseña por correo
export async function recoverPasswordByEmail(email) {
  try {
    const res = await apiFetch("/password/init", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Recuperación de contraseña por nombre de usuario
export async function recoverPasswordByUsername(username) {
  try {
    const res = await apiFetch("/password/init", {
      method: "POST",
      body: JSON.stringify({ username }),
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Validar código de recuperación
export async function verifyRecoveryCode(email, code) {
  try {
    const res = await apiFetch("/password/verify", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Restablecer contraseña
export async function resetPassword(email, newPassword, resetToken) {
  try {
    const res = await apiFetch("/password/reset", {
      method: "POST",
      body: JSON.stringify({
        email,
        new_password: newPassword,
        reset_token: resetToken,
      }),
    });
    return await res.json();
  } catch {
    return null;
  }
}
