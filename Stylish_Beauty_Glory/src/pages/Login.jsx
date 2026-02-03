import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../styles/Login_CSS/login.css";
import IMG2 from "../assets/IMGL.png";
import Logo from "../assets/Stylish_Logo_White.png";
import { API_BASE } from "../services/config";
import LoaderOverlay from "./overlay/UniversalOverlay";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 👈 nuevo estado

  const handleLogin = async () => {
    setIsLoading(true); // 👈 activar loader
    try {
      const res = await axios.post(`${API_BASE}/login`, {
        username,
        password,
      });
      console.log("Respuesta completa de login:", res.data);
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
    } finally {
      setIsLoading(false); // 👈 desactivar loader
    }
  };

  return (
    <div className="register-section">
      {isLoading && <LoaderOverlay message="Iniciando sesión..." />} {/* 👈 mostrar loader */}
      <section className="register-left">
        <h2>Es hora de consentirte otra vez!</h2>
        <p>
          Tu <strong>próxima</strong> experiencia de cuidado <strong>te espera</strong>.
        </p>
        <img src={IMG2} alt="Decoración" className="hand-img" />

        <svg
          className="wave-left"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path fill="#ba8282">
            <animate
              attributeName="d"
              dur="12s"
              repeatCount="indefinite"
              values="
                M0,50 C180,90 360,10 540,50 C720,90 900,10 1080,50 C1260,90 1440,10 1440,50 L1440,0 L0,0 Z;
                M0,60 C180,40 360,90 540,40 C720,10 900,90 1080,40 C1260,0 1440,20 1440,60 L1440,0 L0,0 Z;
                M0,50 C180,90 360,10 540,50 C720,90 900,10 1080,50 C1260,90 1440,10 1440,50 L1440,0 L0,0 Z
              "
            />
          </path>
        </svg>
      </section>

      <section className="register-right">
        <form className="registerr-form" onSubmit={(e) => e.preventDefault()}>
          <img src={Logo} alt="Logo" className="logo-img-login" />
           <svg
          className="wave-left"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path fill="#ba8282">
            <animate
              attributeName="d"
              dur="12s"
              repeatCount="indefinite"
              values="
                M0,50 C180,90 360,10 540,50 C720,90 900,10 1080,50 C1260,90 1440,10 1440,50 L1440,0 L0,0 Z;
                M0,60 C180,40 360,90 540,40 C720,10 900,90 1080,40 C1260,0 1440,20 1440,60 L1440,0 L0,0 Z;
                M0,50 C180,90 360,10 540,50 C720,90 900,10 1080,50 C1260,90 1440,10 1440,50 L1440,0 L0,0 Z
              "
            />
          </path>
        </svg>
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
            Entrar
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
