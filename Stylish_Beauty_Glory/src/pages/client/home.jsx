import { useState, useEffect } from "react";
import "../../styles/Client_CSS/ClientHome.css";
import "../../styles/Portfolio_CSS/normalCard.css";
import LoaderOverlay from "../overlay/UniversalOverlay";
import { FaArrowRight, FaCalendarAlt, FaHandSparkles, FaSpa, FaInstagram, FaTiktok } from "react-icons/fa";
import {getAppointmentsByClient} from "../../services/Serv_appointments";
import { fetchPortfolios} from "../../services/Serv_portFolio";
import axios from "axios";
import { API_BASE } from "../../services/config";
import toast from "react-hot-toast";

function PortfolioCard({ portfolio, onClick }) {
  return (
    <div
      className="portfolio-card tall"
      style={{
        backgroundImage: `url(${portfolio.image_url})`, 
      }}
      onClick={() => onClick(portfolio.image_url)}
    >
      <div className="portfolio-card-content">
        <div className="portfolio-info">
          <p className="portfolio-description">{portfolio.description}</p>
          <span className="portfolio-service"> {portfolio.service?.service_name || portfolio.service_name} </span>
        </div>
      </div>
    </div>
  );
}

function ClientHome() {
  //estado de overlay
  const [loading, setLoading] = useState(true);

  //Ampliar imagen
  const [selectedImage, setSelectedImage] = useState(null);
  // Estado para citas pendientes
  const [pendingAppointments, setPendingAppointments] = useState(0);
  //Fechas importantes
  const [importantDates, setImportantDates] = useState([]);
  //Portafolios
  const [portfolios, setPortfolios] = useState([]);

useEffect(() => {
  const cargarPortafolios = async () => {
    try {
      setLoading(true); // 🔹 mostrar overlay
      const result = await fetchPortfolios();
      console.log("Portafolios obtenidos:", result.portfolios);
      if (result?.error) {
        console.error("Error al obtener portafolios:", result.error);
      } else if (Array.isArray(result.portfolios)) {
        const ordenados = result.portfolios.sort(
          (a, b) => b.portfolio_id - a.portfolio_id
        );
        setPortfolios(ordenados);
      }
    } catch (error) {
      console.error("Error cargando portafolios:", error);
    }finally {
      setLoading(false);
    }
  };

  cargarPortafolios();
}, []);


useEffect(() => {
  const fetchClientAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await axios.get(`${API_BASE}/profile/client`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const client = res.data.client;
      const citasRes = await getAppointmentsByClient(client.client_id);
      if (Array.isArray(citasRes.appointments)) {
        const pendientes = citasRes.appointments.filter(
          (c) => c.status === "Agendada"
        ).length;
        setPendingAppointments(pendientes);

        if (Array.isArray(citasRes.appointments)) {
          const hoy = new Date().toLocaleDateString("sv-SE");
          // Contar pendientes
          const pendientes = citasRes.appointments.filter(
            (c) => c.status === "Agendada" && c.date.split("T")[0] >= hoy
          ).length;
          setPendingAppointments(pendientes);

          //Filtrar agendadas
          const agendadas = citasRes.appointments.filter(
            (c) => c.status === "Agendada" && c.date.split("T")[0] >= hoy
          );

          //Ordenar por fecha ascendente
          const ordenadas = agendadas.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );
          console.log("Citas ordenadas:", ordenadas);
          //Primeras 3
          setImportantDates(ordenadas.slice(0, 3));
        }

      }
    } catch (error) {
      console.error("Error cargando citas cliente:", error);
      toast.error("No se pudieron cargar tus citas. Intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  fetchClientAppointments();
}, []);

  // Estado para consejos
const [tips, setTips] = useState([
  "Mantén tu piel hidratada diariamente.",
  "Usa protector solar incluso en días nublados.",
  "Aplica crema para manos después de lavarlas.",
  "Evita morder tus uñas para mantenerlas fuertes.",
  "Lima tus uñas en una sola dirección para evitar que se quiebren.",
  "Aplica aceite de cutícula para mantenerlas flexibles y saludables.",
  "Evita usar tus uñas como herramientas para abrir o raspar cosas.",
  "Descansa de esmalte al menos una semana al mes para que respiren.",
  "Usa guantes al limpiar o lavar platos para proteger manos y uñas.",
  "Hidrata tus manos con mascarillas caseras de miel o aloe vera.",
  "No cortes las cutículas, solo empújalas suavemente.",
  "Prefiere removedores de esmalte sin acetona para evitar resequedad."
]);

  const [currentTipIndex, setCurrentTipIndex] = useState(0);


  // Rotar consejos cada cierto tiempo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 5000); // cambia cada 5 segundos
    return () => clearInterval(interval);
  }, [tips]);

  return (
    <div className="client-home">
      {loading && <LoaderOverlay message="Cargando tu información..." />}
      {/* Sección superior */}
        <section className="top-section">
        <div className="left-column">
            <span className="bubble small" style={{ top: "20%", left: "20%" }}></span>
            <span className="bubble medium" style={{ top: "60%", left: "70%" }}></span>
            <span className="bubble large" style={{ top: "75%", left: "10%" }}></span>

            <div className="appointments-header">
            <h2>Citas pendientes</h2>
            <button className="circle-btn" title="Ir a agenda">
                <FaArrowRight />
            </button>
            </div>
            <p className="appointments-count">{pendingAppointments}</p>
        </div>
          <div className="middle-column">
            <p className="hoy">{new Date().toLocaleDateString("es-CR")}</p>
              <h2>
                <FaCalendarAlt style={{ marginRight: "0.5rem", color: "#875858" }} />
                Agenda cercana
              </h2>
            <ul>
              {importantDates.length > 0 ? (
              importantDates.map((cita) => (
                <li key={cita.appointment_id}>
                  {cita.date.split("T")[0]} - {cita.service?.name}
                </li>
              ))
            ):(
              <li>¡Aún no has programado ninguna cita!</li>
            )}
            </ul>
            
          </div>

        <div className="right-column">
            <h2>
              <FaHandSparkles style={{ marginRight: "0.5rem", color: "#875858" }} />
              Consejos de cuidado
            </h2>
            <p>{tips[currentTipIndex]}</p>
        </div>
        </section>




    {/* Sección inferior */}
    <section className="bottom-section">
      <h2>
        <FaSpa style={{ marginRight: "0.5rem", color: "#875858" }} />
        Portafolio
      </h2>
      <p>
        Descubre nuestros mejores trabajos y diseños pensados para resaltar tu
        belleza y bienestar. Cada detalle refleja dedicación, estilo y cuidado
        profesional.
      </p> 
        
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginTop: "1.5rem",
        }}
      >
        {portfolios.map((p) => (
          <PortfolioCard
            key={p.portfolio_id}
            portfolio={p}
            onClick={setSelectedImage}
          />
        ))}
      </div>

       {/* Redes sociales */}
  <div className="social-section">
    <p> Si quieres conocernos mejor y ver videos sobre muchos más servicios, visítanos en nuestras redes: </p>
    <div className="social-icons">
      <a href="https://instagram.com/stylishbeautyglori" target="_blank" rel="noopener noreferrer">
        <FaInstagram size={28} style={{ color: "#000000" }} />
      </a>
      <a href="https://www.tiktok.com/@stylishbeautyglori" target="_blank" rel="noopener noreferrer">
        <FaTiktok size={28} style={{ color: "#000" }} />
      </a>
    </div>
  </div>
  {/* Modal del portafolio */}
  {selectedImage && (
    <div className="client-portfolio-modal-overlay" onClick={() => setSelectedImage(null)}>
      <div className="client-portfolio-modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={selectedImage} alt="Portafolio ampliado" />
      </div>
    </div>
  )}
    </section>
    </div>
  );
}

export default ClientHome;
