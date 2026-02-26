import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { requestVerificationCode, verifyCode } from "../services/Serv_codes";
import { createClient } from "../services/Serv_clients";
import "../styles/Register_CSS/register.css";
import IMG1 from "../assets/IMGR.png";
import Logo from "../assets/Stylish_Logo_White.png";
import { login } from "../services/Serv_login";
import { FaArrowLeft } from "react-icons/fa";

function Register() {
  //contador para reenvío de código
  const [resendTimer, setResendTimer] = useState(120); // 2 minutos en segundos

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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
    if (step === 2 && resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, resendTimer]);

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecondChange = (e) => {
    const { name, value } = e.target;
    setSecondStepData((prev) => ({ ...prev, [name]: value }));
  };

  // Enviar primer formulario
  const handleFirstSubmit = async () => {
    const { nombre, fechaNacimiento, genero, telefono, cedula, correo } = formData;

    if (!nombre || !fechaNacimiento || !genero || !telefono || !cedula || !correo) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    try {
      localStorage.setItem("registerData", JSON.stringify(formData));

      const res = await requestVerificationCode(correo);

      if (res && res.message) {
        toast.success(res.message);
        setStep(2);
      } else {
        toast.error(res.error || "No se pudo enviar el código, intenta de nuevo");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al solicitar el código de verificación");
    }
  };

  // Enviar segundo formulario
  const handleSecondSubmit = async () => {
    const { usuario, contrasena, codigo } = secondStepData;

    // 1️⃣ Validar que todos los campos estén llenos
    if (!usuario || !contrasena || !codigo) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    try {
      // Recuperar datos del primer paso
      const initialData = JSON.parse(localStorage.getItem("registerData"));
      const email = initialData?.correo;

      if (!email) {
        toast.error("No se encontró el correo del registro");
        return;
      }

      // 2️⃣ Verificar el código con la API
      const res = await verifyCode(email, codigo);

      // La API devuelve un objeto con "message"
      if (res && res.message && res.message.includes("Correo verificado correctamente")) {
        toast.success(res.message);

        // 3️⃣ Preparar datos finales con la estructura que espera la API
        const parts = initialData.nombre.trim().split(" ");

        let primary_name = "";
        let secondary_name = "";
        let first_surname = "";
        let second_surname = "";

        if (parts.length === 1) {
          primary_name = parts[0];
        } else if (parts.length === 2) {
          primary_name = parts[0];
          first_surname = parts[1];
        } else if (parts.length === 3) {
          primary_name = parts[0];
          second_surname = parts[1];
          first_surname = parts[2];
        } else if (parts.length >= 4) {
          primary_name = parts[0];
          secondary_name = parts[1];
          first_surname = parts[2];
          second_surname = parts[3];
        }

        const finalData = {
          username: usuario,
          password: contrasena,
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

        // 4️⃣ Enviar datos a la API de clientes
        const clientRes = await createClient(finalData);
        if (clientRes && clientRes.message) {
          toast.success(clientRes.message);

          try {
            // Hacer login automático con los datos recién creados
            const { user } = await login(finalData.username, finalData.password);

            // Si el login funciona, limpiar datos de registro
            localStorage.removeItem("registerData");

            // Redirigir siempre al cliente
            if (user.role?.toLowerCase() === "cliente") {
              navigate("/client");
            }
          } catch (err) {
            toast.error("Error al iniciar sesión automáticamente");
            // Si falla el login automático, limpiar igual y mandar al login manual
            localStorage.removeItem("registerData");
            navigate("/login");
          }
        } else {
          toast.error(clientRes?.error || "Error al crear el cliente, intenta de nuevo");
          if (clientRes.missing_fields) {
            toast.error(`Campos faltantes: ${clientRes.missing_fields.join(", ")}`);
          }
        }
      } else {
        toast.error(res.error || "El código de verificación no es válido");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al verificar el código");
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
        <img src={Logo} alt="Logo" className="logo-img-login" />
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
                Género
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
              Correo Electrónico
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="Ingresa tu correo electrónico"
              />
            </label>
            <button type="button" onClick={handleFirstSubmit}>
              Obtener Código de Verificación
            </button>

            {/* Texto final */}
            <p className="login-text">
              ¿Ya tienes un usuario? <a href="/login">Inicia sesión aquí!</a>
            </p>
          </form>
        )}

        {step === 2 && (
          <form className="register-form">
            <div className="back-container">
              {/* Botón para volver al Step 1 */}
              <button
                type="button"
                className="back-btn"
                onClick={() => {
                  const savedData = JSON.parse(localStorage.getItem("registerData"));
                  if (savedData) {
                    setFormData(savedData); // 👈 restaura los datos previos al Step 1
                  }
                  setStep(1); // 👈 vuelve al Step 1
                }}
              >
                <FaArrowLeft />
                Paso anterior
              </button>
            </div>
            {/* Usuario y contraseña en una sola fila */}
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

            {/* Mini leyenda */}
            <small className="legend-text">
              No olvides estos datos, serán necesarios para iniciar sesión cada vez que entres a la
              página.
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
              <span>¿Aún no te llega el código?</span>
              <button
                type="button"
                className="resend-btn"
                disabled={resendTimer > 0}
                onClick={async () => {
                  try {
                    const res = await requestVerificationCode(formData.correo);
                    if (res && res.message) {
                      toast.success(res.message);
                      setResendTimer(120); // reiniciar contador
                    }
                  } catch (err) {
                    toast.error("Error al solicitar nuevamente el código");
                  }
                }}
              >
                {resendTimer > 0
                  ? `Solicitar de nuevo (${Math.floor(resendTimer / 60)}:${(resendTimer % 60)
                      .toString()
                      .padStart(2, "0")})`
                  : "Solicitar de nuevo"}
              </button>
            </div>
            <button type="button" onClick={handleSecondSubmit}>
              Confirmar Registro
            </button>

            {/* Texto final */}
            <p className="login-text">
              ¿Ya tienes un usuario? <a href="/login">Inicia sesión aquí!</a>
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
