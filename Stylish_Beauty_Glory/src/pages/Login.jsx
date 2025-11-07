import "../styles/Login_CSS/login.css";
import IMG2 from "../assets/IMGL.png";
import Logo from "../assets/Stylish_Logo_White.png";
function Login() {
  return (
    <div className="register-section">
      
      {/* Lado izquierdo: mensaje */}
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
  <form className="registerr-form">
    <img src={Logo} alt="Logo" className="logo-img-login" />

    {/* Usuario y Contraseña en una fila */}
    <div className="formleft-row">
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
      ¿No tienes un usuario? <a href="/register">Registrate aquí!</a>
    </p>

  </form>
</section>

    </div>
  );
}

export default Login;
