import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../styles/Login_CSS/login.css";
import IMG2 from "../assets/IMGL.png";
import Logo from "../assets/Stylish_Logo_White.png";
import { API_BASE } from "../services/config";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
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

      // Redirigir según el rol
      if (user.role?.toLowerCase() === "administrador") {
        navigate("/admin");
      } else if (user.role?.toLowerCase() === "cliente") {
        navigate("/client");
      } else {
        setError("Rol no reconocido");
      }
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="register-section">
      <section className="register-left">
        <h2>Es hora de consentirte otra vez!</h2>
        <p>
          Tu <strong>próxima</strong> experiencia de cuidado <strong>te espera</strong>.
        </p>
        <img src={IMG2} alt="Decoración" className="hand-img" />
      </section>

      <section className="register-right">
        <form className="registerr-form" onSubmit={(e) => e.preventDefault()}>
          <img src={Logo} alt="Logo" className="logo-img-login" />

          <div className="formleft-row">
            <label>
              Usuario
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              Contraseña
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>

          <button type="button" onClick={handleLogin}>
            Enviar
          </button>

          {error && <p className="error-text">{error}</p>}

          <p className="login-text">
            ¿No tienes un usuario? <a href="/register">Registrate aquí!</a>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Login;
