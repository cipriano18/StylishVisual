import { useState, useEffect } from "react";
import "../../styles/Client_CSS/ClientHome.css";
import { FaArrowRight } from "react-icons/fa";
function ClientHome() {
  // Estado para citas pendientes
  const [pendingAppointments, setPendingAppointments] = useState(0);

  // Estado para consejos
const [tips, setTips] = useState([
  "Mantén tu piel hidratada diariamente. Mantén tu piel hidratada diariamente. Mantén tu piel hidratada diariamente. Mantén tu piel hidratada diariamente.  Mantén tu piel hidratada diariamente. Mantén tu piel hidratada diariamente. Mantén tu piel hidratada diariamente. Mantén tu piel hidratada diariamente. Mantén tu piel hidratada diariamente. Mantén tu piel hidratada diariamente.",
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

  // Simulación de carga de citas pendientes (ejemplo)
  useEffect(() => {
    // Aquí luego harás la consulta real a la API
    setPendingAppointments(3);
  }, []);

  // Rotar consejos cada cierto tiempo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 5000); // cambia cada 5 segundos
    return () => clearInterval(interval);
  }, [tips]);

  return (
    <div className="client-home">
      {/* Sección superior */}
        <section className="top-section">
        <div className="left-column">
            <span className="bubble small" style={{ top: "20%", left: "30%" }}></span>
            <span className="bubble medium" style={{ top: "60%", left: "70%" }}></span>
            <span className="bubble large" style={{ top: "80%", left: "40%" }}></span>

            <div className="appointments-header">
            <h2>Citas pendientes</h2>
            <button className="circle-btn" title="Ir a agenda">
                <FaArrowRight />
            </button>
            </div>
            <p className="appointments-count">{pendingAppointments}</p>
        </div>

        <div className="right-column">

            <h2>Consejos de cuidado</h2>
            <p>{tips[currentTipIndex]}</p>
        </div>
        </section>




      {/* Sección inferior */}
      <section className="bottom-section">
        <h2>Portafolio</h2>
        <p>Aquí se cargarán los portafolios más adelante.</p>
      </section>
    </div>
  );
}

export default ClientHome;
