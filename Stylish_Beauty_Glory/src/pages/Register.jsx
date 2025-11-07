import "../styles/Register_CSS/register.css";
import IMG1 from "../assets/IMGR.png";
function Register() {
  return (
    <div className="register-section">
      
      {/* Lado izquierdo: mensaje */}
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
  <h2>Regístrate</h2>
  <form className="register-form">

    {/* Nombre completo */}
    <label>
      Nombre completo
      <input type="text" placeholder="Ingresa tu nombre completo" />
    </label>

    {/* Fecha de nacimiento y teléfono en una fila */}
    <div className="form-row">
      <label>
        Fecha de nacimiento
        <input type="date" />
      </label>
      <label>
        Teléfono
        <input type="tel" placeholder="Ingresa tu teléfono" />
      </label>
    </div>

    {/* Género y Cédula en una fila */}
    <div className="form-row">
      <label>
        Género
        <select>
          <option value="">Selecciona</option>
          <option value="femenino">Femenino</option>
          <option value="masculino">Masculino</option>
          <option value="otro">Otro</option>
        </select>
      </label>
      <label>
        Cédula
        <input type="text" placeholder="Ingresa tu cédula" />
      </label>
    </div>

    {/* Usuario y Contraseña en una fila */}
    <div className="form-row">
      <label>
        Usuario
        <input type="text" placeholder="Nombre de usuario" />
      </label>
      <label>
        Contraseña
        <input type="password" placeholder="Contraseña" />
      </label>
    </div>

    {/* Botón */}
    <button type="submit">Enviar</button>

    {/* Texto final */}
    <p className="login-text">
      ¿Ya tienes un usuario? <a href="/login">Inicia sesión aquí!</a>
    </p>

  </form>
</section>

    </div>
  );
}

export default Register;

