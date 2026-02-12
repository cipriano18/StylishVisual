import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import StylishLogo from "../assets/Stylish_Logo_Black.png";
import IMG2 from "../assets/Glori.png";
import "../styles/Home_CSS/App.css";
import "../styles/Home_CSS/wave.css";
import "../styles/Home_CSS/about.css";
import "../styles/Home_CSS/mis-vis.css";
import "../styles/Home_CSS/footer.css";
import "../styles/Carousel_CSS/carousel.css";
import "../styles/Home_CSS/portFolio.css";
import {fetchPortfolios} from "../services/Serv_portFolio"

import portIcon from "../assets/PortIcon.png";
//swiper
// Importa los componentes de Swiper
import { Swiper, SwiperSlide } from "swiper/react";

// Importa los estilos básicos de Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Opcional: módulos extra
import { Navigation, Pagination, Autoplay } from "swiper/modules";


function App() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  // Datos de servicios para el carrusel
  useEffect(() => {
  const cargarPortafolios = async () => {
    const data = await fetchPortfolios();
    if (data?.portfolios) {
      setServices(data.portfolios);
    } else {
      toast.error("Error cargando portafolios");
    }
  };
  cargarPortafolios();
}, []);



  return (
    <>

      {/* Header principal */}
      <header className="header">
        <img src={StylishLogo} alt="Stylish Logo" className="logo" />

        <nav className="nav">
          <a href="#home" className="link">Inicio</a>
          <a href="#services" className="link">Servicios</a>
          <a href="#about" className="link">Sobre Nosotros</a>
          <a href="#contact" className="link">Contacto</a>
        </nav>

        <div className="header-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>
          <button className="register-btn" onClick={() => navigate("/register")}>
            Regístrate
          </button>
        </div>
      </header>

      {/* Main / Bienvenida */}
      <main className="main" id="home">
        <div className="main-content">
          <div className="text">
            <h1>¡Bienvenida a nuestro rincón de inspiración y cuidado!</h1>
            <p>
              En Stylish Beauty Glori creemos que cada mujer merece consentirse, brillar y sentirse segura de sí misma. 
              Somos un espacio creado con amor, pensado para realzar tu belleza y cuidar de ti en cada detalle. 
              Aquí no solo se trata de uñas hermosas, se trata de vivir una experiencia donde el cariño, la dedicación y la creatividad se reflejan en cada servicio.
            </p>
          </div>

        </div>
          <svg
          className="wave-bottom"
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
      </main>

{/* Portfolio / Servicios */}
<section className="portfolio" id="services">
  <div className="portfolio-header-img"> <img src= {portIcon} alt="Portafolio" /> </div>
  <h2>¡Trabajos que inspiran confianza!</h2>
  <p>Porque no hay mejor recompensa que ver a nuestros clientes felices con los resultados.</p>

<div className="divider">
<Swiper
  modules={[Navigation, Pagination, Autoplay]}
  spaceBetween={8}
  slidesPerView={3}
  navigation
  pagination={{
    clickable: true,
    el: ".swiper-pagination",   // contenedor de paginación
  }}
  autoplay={{ delay: 4000 }}
  breakpoints={{
    640: { slidesPerView: 3 },
    768: { slidesPerView: 3 }, 
    1024: { slidesPerView: 3 },
  }}
>
  {services.slice(0, 7).map((service, index) => (
    <SwiperSlide key={index}>
      <div
        className="portfolio-item"
        style={{ backgroundImage: `url(${service.image_url})` }} 
      >
        <p>{service.description}</p>
        <span className="service-tag">{service.service_name}</span>
      </div>
    </SwiperSlide>
  ))}

  <SwiperSlide>
    <div className="portfolio-item cta-slide">
      <h2>¿Todavía no te convencemos?</h2>
      <p>Inicia sesión o regístrate y déjate inspirar por nuestro portafolio completo.</p>
      <button className="cta-btn" onClick={() => navigate("/login")}>
        ¡Llevame allí!
      </button>
    </div>
  </SwiperSlide>

  {/* contenedor de paginación */}
  <div className="swiper-pagination"></div>
</Swiper>
</div>
</section>




      {/* About / Acerca de nosotros */}
      <section className="about-section" id="about">
        <svg className="wave-top" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
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

        <div className="about-container">
          <div className="about-image">
            <img src={IMG2} alt="Dueña del salón" />
          </div>

          <div className="about-text">
            <h2>¿Quiénes somos?</h2>
            <p> 
              Stylish Beauty Glori es mucho más que un salón de uñas. Somos un emprendimiento costarricense 
              liderado por Gloriana Méndez, manicurista con más de 10 años de experiencia, apasionada por la belleza, 
              el arte en las uñas y el trato humano cercano.
            </p>
            <p>
              Nacimos con el sueño de ofrecer un espacio donde cada persona pueda consentirse, expresarse y sentirse
              única. Después de años de trabajo en diferentes rincones de salones, Stylish Beauty Glori abrió su 
              propio local, convirtiéndose en un lugar de confianza, innovación y estilo.
            </p>
            <p>
              Cada diseño, set de uñas y servicio es realizado con amor, detalle y profesionalismo, priorizando siempre
              la salud de tus uñas y tu bienestar. Creemos en el poder del cuidado personal, en la belleza auténtica y
              en la importancia de brindar una experiencia que marque la diferencia.
            </p>
          </div>
        </div>

        <svg className="wave-bottom" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="#ba8282">
            <animate
              attributeName="d"
              dur="12s"
              repeatCount="indefinite"
              values="
                M0,55 C180,75 360,35 540,55 C720,75 900,35 1080,55 C1260,75 1440,35 1440,55 L1440,0 L0,0 Z;
                M0,60 C180,40 360,70 540,45 C720,30 900,70 1080,45 C1260,40 1440,60 1440,60 L1440,0 L0,0 Z;
                M0,55 C180,75 360,35 540,55 C720,75 900,35 1080,55 C1260,75 1440,35 1440,55 L1440,0 L0,0 Z
              "
            />
          </path>
        </svg>
      </section>

{/* Sección Misión y Visión */}
<section className="mission-vision" id="mission-vision">
  <svg className="wave-bottom" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
    <path fill="#875858">
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

  <div className="container">
    <div className="mission-vision-grid">
      
      {/* Misión */}
      <div className="mv-item">
        <div className="mv-header">
          <div className="icon">
            <i className="fas fa-bullseye"></i>
          </div>
          <h3>Misión</h3>
        </div>
        <p>
          Brindamos servicios de belleza personalizados, innovadores y de alta calidad, 
          cuidando la salud y estética de tus uñas en un ambiente acogedor.
        </p>
      </div>

      {/* Visión */}
      <div className="mv-item">
        <div className="mv-header">
          <div className="icon">
            <i className="fas fa-eye"></i>
          </div>
          <h3>Visión</h3>
        </div>
        <p>
          Ser reconocidos como líderes en el sector por nuestra innovación, compromiso social 
          y excelencia en cada servicio que ofrecemos.
        </p>
      </div>

    </div>
  </div>
</section>

{/* Footer */}
<footer className="footer" id="contact">
  <div className="footer-container">
    
    {/* Redes sociales */}
    <div className="footer-socials">
      <a href="https://instagram.com/stylishbeautyglori" target="_blank" rel="noreferrer">
        <i className="fab fa-instagram"></i>
      </a>
      <a href="https://www.tiktok.com/@stylishbeautyglori" target="_blank" rel="noreferrer">
        <i className="fab fa-tiktok"></i>
      </a>
      <a href="https://wa.me/50671338429" target="_blank" rel="noreferrer">
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>

    {/* Información del local */}
    <div className="footer-info">
      <p>Dirección: San José, Goicoechea, Purral, 25 Mts este del Super Purral #1.</p>
      <p>Teléfono: +506 7133 8429</p>
    </div>

    {/* Derechos */}
  <div className="footer-copy">
    <p>
      © 2025 - {new Date().getFullYear()} Stylish Beauty Glori. Todos los derechos reservados.
    </p>
  </div>
  </div>
</footer>

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
    </>
  );
}

export default App;


