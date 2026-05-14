import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

import { requestVerificationCode, verifyCode } from "../services/Serv_codes";
import { createClient } from "../services/Serv_clients";
import { login } from "../services/Serv_login";
import { parseName } from "../utils/nameParser";
import "../styles/Register_CSS/register.css";
import IMG1 from "../assets/IMGR.png";
import Logo from "../assets/Stylish_Logo_White.png";

const REGISTER_STORAGE_KEY = "registerData";
const RESEND_SECONDS = 120;

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const [formData, setFormData] = useState({
    nombre: "",
    fechaNacimiento: "",
    genero: "",
    telefono: "",
    cedula: "",
    correo: "",
  });
  const [secondStepData, setSecondStepData] = useState({
    usuario: "",
    contrasena: "",
    codigo: "",
  });

  useEffect(() => {
    if (step !== 2 || resendTimer <= 0) {
      return undefined;
    }

    const interval = setInterval(() => {
      setResendTimer((previousValue) => previousValue - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previousValue) => ({ ...previousValue, [name]: value }));
  };

  const handleSecondChange = (event) => {
    const { name, value } = event.target;
    setSecondStepData((previousValue) => ({ ...previousValue, [name]: value }));
  };

  const restoreFirstStep = () => {
    const savedData = JSON.parse(localStorage.getItem(REGISTER_STORAGE_KEY));
    if (savedData) {
      setFormData(savedData);
    }

    setStep(1);
  };

  const validateFirstStep = () => {
    const { nombre, fechaNacimiento, genero, telefono, cedula, correo } = formData;

    if (cedula && !/^[A-Za-z0-9]{9,20}$/.test(cedula.trim())) {
      toast.error("La cédula debe contener entre 9 y 20 caracteres.");
      return false;
    }

    if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      toast.error("El correo debe tener un formato valido.");
      return false;
    }

    if (telefono && !/^\d{8}$/.test(telefono.trim())) {
      toast.error("El teléfono debe contener exactamente 8 dígitos.");
      return false;
    }

    if (fechaNacimiento) {
      const minDate = "1926-01-01";
      const maxDate = new Date().toISOString().split("T")[0];
      const normalizedDate = new Date(fechaNacimiento).toISOString().split("T")[0];

      if (normalizedDate < minDate || normalizedDate > maxDate) {
        toast.error("La fecha de nacimiento esta fuera del rango permitido.");
        return false;
      }
    }

    const { primary_name, first_surname, second_surname } = parseName(nombre || "");
    const requiredFields = {
      primary_name,
      first_surname,
      second_surname,
      identity_card: cedula,
      phone: telefono,
      gender: genero,
    };

    const fieldLabels = {
      primary_name: "Nombre",
      first_surname: "Primer apellido",
      second_surname: "Segundo apellido",
      identity_card: "Cédula",
      phone: "Teléfono",
      gender: "Genero",
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => !value || String(value).trim() === "")
      .map(([field]) => fieldLabels[field] || field);

    if (missingFields.length > 0) {
      toast.error(`Faltan campos obligatorios: ${missingFields.join(", ")}`);
      return false;
    }

    return true;
  };

  const handleFirstSubmit = async () => {
    if (!validateFirstStep()) {
      return;
    }

    try {
      localStorage.setItem(REGISTER_STORAGE_KEY, JSON.stringify(formData));
      const response = await requestVerificationCode(formData.correo);

      if (response?.message) {
        toast.success(response.message);
        setResendTimer(RESEND_SECONDS);
        setStep(2);
        return;
      }

      toast.error(response?.error || "No se pudo enviar el código de verificación.");
    } catch (error) {
      console.error("Error al solicitar el código:", error);
      toast.error("Error al solicitar el código de verificación");
    }
  };

  const handleSecondSubmit = async () => {
    const username = secondStepData.usuario.trim();
    const password = secondStepData.contrasena.trim();
    const code = secondStepData.codigo.trim();

    if (!username || !password || !code) {
      toast.error("Completa usuario, contraseña y código.");
      return;
    }

    try {
      const initialData = JSON.parse(localStorage.getItem(REGISTER_STORAGE_KEY));
      const email = initialData?.correo;

      if (!email) {
        toast.error("No se encontró el correo del registro.");
        return;
      }

      const verificationResponse = await verifyCode(email, code);
      if (!verificationResponse?.message?.includes("Correo verificado correctamente")) {
        toast.error(verificationResponse?.error || "El código de verificación no es valido.");
        return;
      }

      toast.success(verificationResponse.message);

      const { primary_name, secondary_name, first_surname, second_surname } = parseName(
        initialData.nombre
      );

      const finalData = {
        username,
        password,
        role_id: 2,
        identity_card: initialData.cedula,
        primary_name,
        secondary_name,
        first_surname,
        second_surname,
        birth_date: initialData.fechaNacimiento,
        gender: initialData.genero.charAt(0).toUpperCase(),
        email: initialData.correo,
        phone: initialData.telefono,
      };

      const clientResponse = await createClient(finalData);
      if (!clientResponse?.message) {
        toast.error(clientResponse?.error || "Error al crear el cliente.");
        if (clientResponse?.missing_fields) {
          toast.error(`Campos faltantes: ${clientResponse.missing_fields.join(", ")}`);
        }
        return;
      }

      toast.success(clientResponse.message);

      try {
        const { user } = await login(username, password);
        localStorage.removeItem(REGISTER_STORAGE_KEY);

        if (user.role?.toLowerCase() === "cliente") {
          navigate("/client");
          return;
        }
      } catch (loginError) {
        console.error("Error en login automático:", loginError);
        toast.error("No se pudo iniciar sesión automáticamente");
      }

      localStorage.removeItem(REGISTER_STORAGE_KEY);
      navigate("/login");
    } catch (error) {
      console.error("Error al verificar el código:", error);
      toast.error("Error al verificar el código");
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await requestVerificationCode(formData.correo);
      if (response?.message) {
        toast.success(response.message);
        setResendTimer(RESEND_SECONDS);
        return;
      }

      toast.error(response?.error || "No se pudo reenviar el código");
    } catch (error) {
      console.error("Error al reenviar el código:", error);
      toast.error("Error al solicitar nuevamente el código");
    }
  };

  return (
    <div className="register-section">
      <section className="registerr-left">
        <h2>Estamos aquí para ayudarte!</h2>
        <p>
          <strong>Descubre </strong>tu yo interior y hazlo relucir.
        </p>
        <p className="tell">
          <strong>Contáctanos: </strong>
          <br />
          +506 7133-8429
        </p>
        <img src={IMG1} alt="Decoración" className="handR-img" />
      </section>

      <section className="register-right">
        <img src={Logo} alt="Logo" className="logo-img-register" />

        {step === 1 && (
          <form className="register-form">
            <label>
              Nombre completo
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingresa tu nombre completo"
              />
            </label>

            <div className="form-row">
              <label>
                Fecha de nacimiento
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                />
              </label>

              <label>
                Genero
                <select name="genero" value={formData.genero} onChange={handleChange}>
                  <option value="">Selecciona</option>
                  <option value="femenino">Femenino</option>
                  <option value="masculino">Masculino</option>
                  <option value="otro">Otro</option>
                </select>
              </label>
            </div>

            <div className="form-row">
              <label>
                Teléfono
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ingresa tu teléfono"
                />
              </label>

              <label>
                Cédula
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  placeholder="Ingresa tu cédula"
                />
              </label>
            </div>

            <label>
              Correo electrónico
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="Ingresa tu correo electrónico"
              />
            </label>

            <button type="button" onClick={handleFirstSubmit}>
              Obtener código de verificación
            </button>

            <p className="login-text">
              Ya tienes un usuario? <a href="/login">Inicia sesión aquí!</a>
            </p>
          </form>
        )}

        {step === 2 && (
          <form className="register-form">
            <div className="back-container">
              <button type="button" className="back-btn" onClick={restoreFirstStep}>
                <FaArrowLeft />
                Paso anterior
              </button>
            </div>

            <div className="form-row">
              <label>
                Nombre de usuario
                <input
                  type="text"
                  name="usuario"
                  value={secondStepData.usuario}
                  onChange={handleSecondChange}
                  placeholder="Ingresa tu usuario"
                />
              </label>

              <label>
                Contraseña
                <input
                  type="password"
                  name="contrasena"
                  value={secondStepData.contrasena}
                  onChange={handleSecondChange}
                  placeholder="Ingresa tu contraseña"
                />
              </label>
            </div>

            <small className="legend-text">
              No olvides estos datos; los necesitaras para iniciar sesión mas adelante.
            </small>

            <label>
              Código de verificación
              <input
                type="text"
                name="codigo"
                value={secondStepData.codigo}
                onChange={handleSecondChange}
                placeholder="Ingresa el código enviado"
              />
            </label>

            <div className="resend-container">
              <span>Aun no te llega el código?</span>
              <button
                type="button"
                className="resend-btn"
                disabled={resendTimer > 0}
                onClick={handleResendCode}
              >
                {resendTimer > 0
                  ? `Solicitar de nuevo (${Math.floor(resendTimer / 60)}:${(resendTimer % 60)
                      .toString()
                      .padStart(2, "0")})`
                  : "Solicitar de nuevo"}
              </button>
            </div>

            <button type="button" onClick={handleSecondSubmit}>
              Confirmar registro
            </button>

            <p className="login-text">
              Ya tienes un usuario? <a href="/login">Inicia sesión aquí!</a>
            </p>
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

export default Register;
