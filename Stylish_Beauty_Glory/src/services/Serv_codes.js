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

    return await res.json(); // 👈 siempre retorna el json sin importar el status
  } catch (error) {
    console.error("requestVerificationCode error:", error);
    return null;
  }
}

export async function verifyCode(email, code) {
  try {
    const res = await fetch(`${API_BASE}/register/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    return await res.json();
  } catch (error) {
    console.error("verifyCode error:", error);
    return null;
  }
}
