import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import "../styles/Login_CSS/login.css";
import IMG2 from "../assets/IMGL.png";
import Logo from "../assets/Stylish_Logo_White.png";
import resetIcon from "../assets/reset_icon.png";
import LoaderOverlay from "./overlay/UniversalOverlay";
import { login } from "../services/Serv_login";
import {
  recoverPasswordByEmail,
  recoverPasswordByUsername,
  verifyRecoveryCode,
  resetPassword,
} from "../services/Serv_resetPass";

function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mail, setMail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({
    login: false,
    reset: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field) => {
    setVisiblePasswords((previousValue) => ({
      ...previousValue,
      [field]: !previousValue[field],
    }));
  };

  const resetRecoveryState = () => {
    setStep(1);
    setMail("");
    setUsername("");
    setNewPassword("");
    setConfirmPassword("");
    setVerificationCode("");
  };

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const { user } = await login(username, password);

      if (user.role?.toLowerCase() === "administrador") {
        navigate("/admin");
        return;
      }

      if (user.role?.toLowerCase() === "cliente") {
        navigate("/client");
        return;
      }

      toast.error("Rol no reconocido");
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      toast.error(error.message || "No se pudo iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoveryRequest = async () => {
    setIsLoading(true);

    try {
      const response = username.includes("@")
        ? await recoverPasswordByEmail(username)
        : await recoverPasswordByUsername(username);

      if (response?.message) {
        toast.success(response.message);
        setMail(response.email || username);
        setStep(3);
        return;
      }

      toast.error(response?.error || "No se pudo iniciar la recuperación");
    } catch (error) {
      console.error("Error en recuperación:", error);
      toast.error("Error al iniciar la recuperación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    try {
      const verifyResponse = await verifyRecoveryCode(mail, verificationCode);
      if (!verifyResponse?.message) {
        toast.error(verifyResponse?.error || "No se pudo validar el código");
        return;
      }

      const resetResponse = await resetPassword(mail, newPassword, verifyResponse.reset_token);
      if (resetResponse?.message) {
        toast.success(resetResponse.message);
        resetRecoveryState();
        return;
      }

      toast.error(resetResponse?.error || "No se pudo restablecer la contraseña");
    } catch (error) {
      console.error("Error en el flujo de reset:", error);
      toast.error("Error en la comunicación con el servidor.");
    }
  };

  return (
    <div className="register-section">
      {isLoading && <LoaderOverlay message="Cargando..." />}

      <section className="register-left">
        <h2>Es hora de consentirte otra vez!</h2>
        <p>
          Tu <strong>proxima</strong> experiencia de cuidado <strong>te espera</strong>.
        </p>
        <img src={IMG2} alt="Decoración" className="hand-img" />
      </section>

      <section className="register-right">
        {step === 1 && (
          <form className="registerr-form" onSubmit={(event) => event.preventDefault()}>
            <img src={Logo} alt="Logo" className="logo-img-login" />

            <div className="formleft-row">
              <label>
                Usuario
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </label>

              <label>
                Contraseña
                <div className="password-input-wrapper">
                  <input
                    type={visiblePasswords.login ? "text" : "password"}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => togglePasswordVisibility("login")}
                    aria-label={
                      visiblePasswords.login ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {visiblePasswords.login ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>

              <p className="forgot-password">
                <span onClick={() => setStep(2)}>Olvidaste tu contraseña?</span>
              </p>
            </div>

            <button type="button" onClick={handleLogin}>
              Entrar
            </button>

            <p className="login-text">
              No tienes un usuario? <a href="/register">Regístrate aquí!</a>
            </p>
          </form>
        )}

        {step === 2 && (
          <form className="registerr-form" onSubmit={(event) => event.preventDefault()}>
            <img src={resetIcon} alt="Icon" className="icon-img" />
            <h2>Restablecer contraseña</h2>
            <p className="login-text">
              Ingresa tu nombre de usuario o tu correo electrónico para identificar tu cuenta.
            </p>

            <div className="formleft-row">
              <label>
                Usuario o correo electrónico
                <input
                  type="text"
                  placeholder="Usuario o correo electrónico"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </label>
            </div>

            <button type="button" onClick={handleRecoveryRequest}>
              Continuar
            </button>

            <button type="button" onClick={resetRecoveryState}>
              Volver
            </button>
          </form>
        )}

        {step === 3 && (
          <form className="registerr-form" onSubmit={(event) => event.preventDefault()}>
            <img src={resetIcon} alt="Icon" className="icon-img" />
            <h2>Restablecer contraseña</h2>
            <p className="login-text">
              Ingresa tu nueva contraseña, confírmala y escribe el código que recibiste en "{mail}
              ".
            </p>

            <div className="formleft-row">
              <label>
                Nueva contraseña
                <div className="password-input-wrapper">
                  <input
                    type={visiblePasswords.reset ? "text" : "password"}
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => togglePasswordVisibility("reset")}
                    aria-label={
                      visiblePasswords.reset ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {visiblePasswords.reset ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>

              <label>
                Confirmar contraseña
                <div className="password-input-wrapper">
                  <input
                    type={visiblePasswords.confirm ? "text" : "password"}
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => togglePasswordVisibility("confirm")}
                    aria-label={
                      visiblePasswords.confirm ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {visiblePasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>

              <label>
                Código de verificación
                <input
                  type="text"
                  placeholder="Código"
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                />
              </label>
            </div>

            <button type="button" onClick={handleResetPassword}>
              Confirmar
            </button>

            <button type="button" onClick={resetRecoveryState}>
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
