import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import StylishLogo from "../assets/Stylish_Logo_White.png";
import IMG2 from "../assets/Glori.png";
import "../styles/Home_CSS/App.css";
import "../styles/Home_CSS/wave.css";
import "../styles/Home_CSS/about.css";
import "../styles/Home_CSS/mis-vis.css";
import "../styles/Home_CSS/footer.css";
import "../styles/Carousel_CSS/carousel.css";
import "../styles/Home_CSS/portFolio.css";
import { fetchPortfolios } from "../services/Serv_portFolio";

import portIcon from "../assets/PortIcon.png";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Pagination, Autoplay } from "swiper/modules";

function App() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

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

  const primaryServices = services.slice(0, 4);
  const secondaryServices = services.slice(4, 7);

  return (
    <>
      {/* Header principal */}
      <header className="header">
        <img src={StylishLogo} alt="Stylish Logo" className="logo" />

        <nav className="nav nav-desktop">
          <a href="#home" className="link">
            Inicio
          </a>
          <a href="#services" className="link">
            Servicios
          </a>
          <a href="#about" className="link">
            Sobre Nosotros
          </a>
          <a href="#contact" className="link">
            Contacto
          </a>
        </nav>

        <div className="header-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Iniciar sesion
          </button>
          <button className="register-btn" onClick={() => navigate("/register")}>
            Registrate
          </button>
        </div>
      </header>

      {/* Main / Bienvenida */}
      <main className="main" id="home">
        <div className="main-content">
          <div className="text">
            <h1>Bienvenida a nuestro rincon de inspiracion y cuidado</h1>
            <p>
              En Stylish Beauty Glori creemos que cada mujer merece consentirse, brillar y sentirse
              segura de si misma. Somos un espacio creado con amor, pensado para realzar tu belleza
              y cuidar de ti en cada detalle. Aqui no solo se trata de unas hermosas, se trata de
              vivir una experiencia donde el carino, la dedicacion y la creatividad se reflejan en
              cada servicio.
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
        <div className="portfolio-header-img">
          <img src={portIcon} alt="Portafolio" />
        </div>
        <h2>Trabajos que inspiran confianza</h2>
        <p>
          Porque no hay mejor recompensa que ver a nuestros clientes felices con los resultados.
        </p>

        <div className="divider portfolio-swiper-stack">
          {primaryServices.length > 0 && (
            <div className="portfolio-swiper-shell primary">
              <Swiper
                key={`primary-${primaryServices.length}`}
                className="portfolio-swiper primary-carousel"
                modules={[Pagination, Autoplay]}
                spaceBetween={8}
                slidesPerView={1}
                loop={primaryServices.length + 1 > 3}
                speed={9000}
                allowTouchMove
                pagination={{
                  clickable: true,
                  el: ".swiper-pagination-primary",
                }}
                autoplay={{
                  delay: 1,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: false,
                }}
                breakpoints={{
                  340: { slidesPerView: 1, slidesPerGroup: 1 },
                  590: { slidesPerView: 2, slidesPerGroup: 1 },
                  770: { slidesPerView: 3, slidesPerGroup: 1 },
                  1214: { slidesPerView: 3, slidesPerGroup: 1 },
                  1524: { slidesPerView: 3, slidesPerGroup: 1 },
                }}
              >
                {primaryServices.map((service, index) => (
                  <SwiperSlide key={index}>
                    <article className="portfolio-story-card">
                      <div
                        className="portfolio-story-media"
                        style={{ backgroundImage: `url(${service.image_url})` }}
                      />

                      <div className="portfolio-story-divider" aria-hidden="true">
                        <svg viewBox="0 0 100 32" preserveAspectRatio="none">
                          <path
                            className="portfolio-story-divider-path"
                            d="M0 32V18C10 18 12 8 20 8C28 8 30 18 38 18C46 18 48 8 56 8C64 8 66 18 74 18C82 18 84 8 92 8C96 8 98 12 100 14V32H0Z"
                          />
                        </svg>
                      </div>

                      <div className="portfolio-story-content">
                        <p>{service.description}</p>
                        <span className="portfolio-story-tag">{service.service.service_name}</span>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}

                <SwiperSlide>
                  <div className="portfolio-item cta-slide">
                    <h2>Todavia no te convencemos</h2>
                    <p>
                      Inicia sesion o registrate y dejate inspirar por nuestro portafolio completo.
                    </p>
                    <button className="cta-btn" onClick={() => navigate("/login")}>
                      Llevame alli
                    </button>
                  </div>
                </SwiperSlide>
              </Swiper>
              <div className="swiper-pagination swiper-pagination-primary"></div>
            </div>
          )}

          {secondaryServices.length > 0 && (
            <div className="portfolio-swiper-shell secondary">
              <Swiper
                key={`secondary-${secondaryServices.length}`}
                className="portfolio-swiper secondary-carousel"
                modules={[Pagination, Autoplay]}
                spaceBetween={8}
                slidesPerView={1}
                loop={secondaryServices.length > 2}
                speed={15000}
                allowTouchMove
                pagination={{
                  clickable: true,
                  el: ".swiper-pagination-secondary",
                }}
                autoplay={{
                  delay: 1,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: false,
                  reverseDirection: true,
                }}
                breakpoints={{
                  340: { slidesPerView: 1, slidesPerGroup: 1 },
                  590: { slidesPerView: 2, slidesPerGroup: 1 },
                  770: { slidesPerView: 2, slidesPerGroup: 1 },
                  1214: { slidesPerView: 2, slidesPerGroup: 1 },
                  1524: { slidesPerView: 2, slidesPerGroup: 1 },
                }}
              >
                {secondaryServices.map((service, index) => (
                  <SwiperSlide key={`secondary-${index}`}>
                    <article className="portfolio-feature-card">
                      <div
                        className="portfolio-feature-media"
                        style={{ backgroundImage: `url(${service.image_url})` }}
                      />

                      <div className="portfolio-feature-divider" aria-hidden="true">
                        <svg viewBox="0 0 120 100" preserveAspectRatio="none">
                          <path
                            className="portfolio-feature-divider-path"
                            d="M120 0H70C42 10 48 23 72 34C96 46 88 58 56 70C26 82 34 92 70 100H120V0Z"
                          />
                        </svg>
                      </div>

                      <div className="portfolio-feature-content">
                        <p>{service.description}</p>
                        <span className="portfolio-feature-tag">
                          {service.service.service_name}
                        </span>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="swiper-pagination swiper-pagination-secondary"></div>
            </div>
          )}
        </div>
      </section>

      {/* About / Acerca de nosotros */}
      <section className="about-section" id="about">
        <svg
          className="wave-top"
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

        <div className="about-container">
          <div className="about-image">
            <img src={IMG2} alt="Duena del salon" />
          </div>

          <div className="about-text">
            <h2>Quienes somos</h2>
            <p>
              Stylish Beauty Glori es mucho mas que un salon de unas. Somos un emprendimiento
              costarricense liderado por Gloriana Mendez, manicurista con mas de 10 anios de
              experiencia, apasionada por la belleza, el arte en las unas y el trato humano cercano.
            </p>
            <p>
              Nacimos con el suenio de ofrecer un espacio donde cada persona pueda consentirse,
              expresarse y sentirse unica. Despues de anios de trabajo en diferentes rincones de
              salones, Stylish Beauty Glori abrio su propio local, convirtiendose en un lugar de
              confianza, innovacion y estilo.
            </p>
            <p>
              Cada disenio, set de unas y servicio es realizado con amor, detalle y profesionalismo,
              priorizando siempre la salud de tus unas y tu bienestar. Creemos en el poder del
              cuidado personal, en la belleza autentica y en la importancia de brindar una
              experiencia que marque la diferencia.
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
                M0,55 C180,75 360,35 540,55 C720,75 900,35 1080,55 C1260,75 1440,35 1440,55 L1440,0 L0,0 Z;
                M0,60 C180,40 360,70 540,45 C720,30 900,70 1080,45 C1260,40 1440,60 1440,60 L1440,0 L0,0 Z;
                M0,55 C180,75 360,35 540,55 C720,75 900,35 1080,55 C1260,75 1440,35 1440,55 L1440,0 L0,0 Z
              "
            />
          </path>
        </svg>
      </section>

      {/* Seccion Mision y Vision */}
      <section className="mission-vision" id="mission-vision">
        <svg
          className="wave-bottom"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path fill="#4a2e2e">
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
            <div className="mv-item">
              <div className="mv-header">
                <div className="icon">
                  <i className="fas fa-bullseye"></i>
                </div>
                <h3>Mision</h3>
              </div>
              <p>
                Brindamos servicios de belleza personalizados, innovadores y de alta calidad,
                cuidando la salud y estetica de tus unas en un ambiente acogedor.
              </p>
            </div>

            <div className="mv-item">
              <div className="mv-header">
                <div className="icon">
                  <i className="fas fa-eye"></i>
                </div>
                <h3>Vision</h3>
              </div>
              <p>
                Ser reconocidos como lideres en el sector por nuestra innovacion, compromiso social
                y excelencia en cada servicio que ofrecemos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="footer-container">
          <div className="footer-socials">
            <a href="https://www.instagram.com/dondeglori.bc" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.tiktok.com/@dondeglori.bc" target="_blank" rel="noreferrer">
              <i className="fab fa-tiktok"></i>
            </a>
            <a href="https://wa.me/50671338429" target="_blank" rel="noreferrer">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>

          <div className="footer-info">
            <p>Direccion: San Jose, Goicoechea, Purral, 25 Mts este del Super Purral #1.</p>
            <p>Telefono: +506 7133 8429</p>
          </div>

          <div className="footer-copy">
            <p>
              © 2025 - {new Date().getFullYear()} Stylish Beauty Glori. Todos los derechos
              reservados.
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
