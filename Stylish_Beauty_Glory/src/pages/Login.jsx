import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "../styles/Login_CSS/login.css";
import IMG2 from "../assets/IMGL.png";
import Logo from "../assets/Stylish_Logo_White.png";
import reset_icon from "../assets/reset_icon.png";
import LoaderOverlay from "./overlay/UniversalOverlay";
import { login } from "../services/Serv_login";
import {
  recoverPasswordByEmail,
  recoverPasswordByUsername,
  verifyRecoveryCode,
  resetPassword,
} from "../services/Serv_resetPass";

function Login() {
  const [step, setStep] = useState(1);
  // 1 = login normal
  // 2 = solicitar usuario
  // 3 = ingresar nueva contraseña + código

  //paso 3
  const [mail, setMail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { user } = await login(username, password);

      if (user.role?.toLowerCase() === "administrador") {
        navigate("/admin");
      } else if (user.role?.toLowerCase() === "cliente") {
        navigate("/client");
      } else {
        toast.error("Rol no reconocido");
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        toast.error("Las contraseñas no coinciden.");
        return;
      }

      // Paso 1: verificar el código
      const verifyResponse = await verifyRecoveryCode(mail, verificationCode);
      console.log("Respuesta verificación:", verifyResponse);

      if (!verifyResponse.message) {
        toast.error(verifyResponse?.error);
        return;
      }

      // Paso 2: restablecer la contraseña usando el token devuelto
      const resetResponse = await resetPassword(mail, newPassword, verifyResponse.reset_token);
      console.log("Respuesta reset:", resetResponse);

      if (resetResponse && resetResponse.message) {
        toast.success(resetResponse.message);
        setStep(1);
      } else {
        toast.error(resetResponse.error);
      }
    } catch (err) {
      console.error("Error en el flujo de reset:", err);
      toast.error("Error en la comunicación con el servidor.");
    }
  };

  return (
    <div className="register-section">
      {isLoading && <LoaderOverlay message="Cargando..." />}
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
        {step === 1 && (
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
              <p className="forgot-password">
                <span onClick={() => setStep(2)}>¿Olvidaste tu contraseña?</span>
              </p>
            </div>

            <button type="button" onClick={handleLogin}>
              Entrar
            </button>

            <p className="login-text">
              ¿No tienes un usuario? <a href="/register">Registrate aquí!</a>
            </p>
          </form>
        )}

        {step === 2 && (
          <form className="registerr-form" onSubmit={(e) => e.preventDefault()}>
            <img src={reset_icon} alt="Icon" className="icon-img" />
            <h2>Restablecer contraseña</h2>
            <p className="login-text">
              Ingresa tu nombre de usuario o tu correo electrónico. Estas credenciales son
              necesarias para identificar tu usuario.
            </p>

            <div className="formleft-row">
              <label>
                Usuario o correo electrónico
                <input
                  type="text"
                  placeholder="Usuario o correo electrónico"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
            </div>

            <button
              type="button"
              onClick={async () => {
                try {
                  setIsLoading(true);
                  let response;

                  if (username.includes("@")) {
                    response = await recoverPasswordByEmail(username);
                    console.log("Respuesta API (email):", response);
                  } else {
                    response = await recoverPasswordByUsername(username);
                    console.log("Respuesta API (username):", response);
                  }

                  if (response && response.message) {
                    toast.success(response.message);
                    setMail(response.email);
                    setIsLoading(false);
                    setStep(3);
                  } else {
                    toast.error(response.error);
                  }
                } catch (err) {
                  console.error("Error en recuperación:", err);
                  toast.error(response.error);
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              Continuar
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setUsername("");
              }}
            >
              Volver
            </button>
          </form>
        )}

        {step === 3 && (
          <form className="registerr-form" onSubmit={(e) => e.preventDefault()}>
            <img src={reset_icon} alt="Icon" className="icon-img" />
            <h2>Restablecer contraseña</h2>
            <p className="login-text">
              Ingresa tu nueva contraseña, confírmala y escribe el código de verificación que
              recibiste en "{mail}". Este paso asegura que solo tú puedas recuperar el acceso.
            </p>

            <div className="formleft-row">
              <label>
                Nueva contraseña
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>

              <label>
                Confirmar contraseña
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>

              <label>
                Código de verificación
                <input
                  type="text"
                  placeholder="Código"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </label>
            </div>

            <button type="button" onClick={handleResetPassword}>
              Confirmar
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setUsername("");
              }}
            >
              Volver
            </button>
          </form>
        )}
      </section>
      <Toaster
        position="center-top"
        toastOptions={{
          style: {
            background: "#875858",
            color: "#fff",
            borderRadius: "12px",
            fontFamily: "Poppins, sans-serif",
            zIndex: 9999,
          },
        }}
      />
    </div>
  );
}

export default Login;
