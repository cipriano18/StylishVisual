import { API_BASE } from "./config";

// Solicitar código de verificación (registro público)
export async function requestVerificationCode(email) {
  try {
    const res = await fetch(`${API_BASE}/register/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      throw new Error("Error al solicitar el código de verificación");
    }

    return await res.json();
  } catch (error) {
    console.error("requestVerificationCode error:", error);
    return null;
  }
}

// Verificar código de registro (registro público)
export async function verifyCode(email, code) {
  try {
    const res = await fetch(`${API_BASE}/register/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    if (!res.ok) {
      throw new Error("Error al verificar el código");
    }

    return await res.json();
  } catch (error) {
    console.error("verifyCode error:", error);
    return null;
  }
}
