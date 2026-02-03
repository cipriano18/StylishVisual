import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register_CSS/register.css";
import IMG1 from "../assets/IMGR.png";
import Logo from "../assets/Stylish_Logo_White.png";

function Register() {
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
  const handleFirstSubmit = () => {
    // localStorage
    localStorage.setItem("registerData", JSON.stringify(formData));

    // API para enviar el código al correo
    // await sendCodeToEmail(formData.correo);

    // Cambiar al segundo paso
    setStep(2);
  };

  // Enviar segundo formulario
  const handleSecondSubmit = () => {
    const initialData = JSON.parse(localStorage.getItem("registerData"));
    const finalData = { ...initialData, ...secondStepData };

    // Aquí envías finalData a tu API
    // await registerUser(finalData);

    navigate("/client");
  };

  return (
    <div className="register-section">
      <section className="registerr-left">
        <h2>Estamos aquí para ayudarte!</h2>
        <p>
          <strong>Descubre </strong>tu yo interior y hazlo relucir.
        </p>
        <p className="tell">
          <strong>Contáctanos: </strong><br />+506 7133-8429
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
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                >
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
              Optener Código de Verificación
            </button>
                {/* Texto final */}
    <p className="login-text">
      ¿Ya tienes un usuario? <a href="/login">Inicia sesión aquí!</a>
    </p>
          </form>
        )}

        {step === 2 && (
  <form className="register-form">
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
      NOTA: No olvides estos datos, serán necesarios para iniciar sesión cada vez que entres a la página.
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
    </div>
  );
}

export default Register;

