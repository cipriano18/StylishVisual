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
import { parseName } from "../utils/nameParser.js";

function Register() {
  const [resendTimer, setResendTimer] = useState(120); // 2 min

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

    // Validaciones de formato (solo si el campo tiene algo escrito)

    if (cedula && !/^[A-Za-z0-9]{9,20}$/.test(cedula.trim())) {
      toast.error("La cédula debe contener entre 9 y 20 dígitos numéricos");
      return;
    }

    if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      toast.error("El correo debe tener un formato válido (ejemplo: usuario@dominio.com)");
      return;
    }

    if (telefono && !/^\d{8}$/.test(telefono.trim())) {
      toast.error("El número de teléfono debe contener exactamente 8 dígitos");
      return;
    }

    if (fechaNacimiento) {
      const MIN = "1926-01-01";
      const MAX = new Date().toISOString().split("T")[0];
      const fecha = new Date(fechaNacimiento).toISOString().split("T")[0];
      if (fecha < MIN || fecha > MAX) {
        toast.error("La fecha de ingreso no puede ser menor al límite permitido");
        return;
      }
    }

    // Validación de campos obligatorios vacíos
    const { primary_name, first_surname, second_surname } = parseName(nombre || "");
    const camposRequeridos = {
      identity_card: cedula,
      primary_name: primary_name,
      first_surname: first_surname,
      second_surname: second_surname,
      phone: telefono,
      gender: genero,
    };

    const faltantes = Object.entries(camposRequeridos)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (faltantes.length > 0) {
      toast.error(`Faltan campos obligatorios: ${faltantes.join(", ")}`);
      return;
    }

    // Enviar
    try {
      localStorage.setItem("registerData", JSON.stringify(formData));
      const res = await requestVerificationCode(correo);
      if (res && res.message) {
        toast.success(res.message);
        setStep(2);
      } else {
        toast.error(res?.error || "No se pudo enviar el código, intenta de nuevo");
      }
    } catch (err) {
      console.error(err);
      toast.error(res?.error || "Error al solicitar el código de verificación");
    }
  };

  // Enviar segundo formulario
  const handleSecondSubmit = async () => {
    const { usuario, contrasena, codigo } = secondStepData;

    // 1️⃣ Validar que todos los campos estén llenos

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
        const { primary_name, secondary_name, first_surname, second_surname } = parseName(
          initialData.nombre
        );

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
