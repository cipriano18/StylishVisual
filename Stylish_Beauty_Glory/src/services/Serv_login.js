import { API_BASE } from "./config";
import axios from "axios";

// Login de usuario
export async function login(username, password) {
  try {
    const res = await axios.post(`${API_BASE}/login`, {
      username,
      password,
    });

    const { access_token, refresh_token, user } = res.data;

    // Guardar tokens y usuario en localStorage
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));

    return { access_token, refresh_token, user };
  } catch (error) {
    console.error("login error:", error);
    throw new Error("Credenciales inválidas");
  }
}
