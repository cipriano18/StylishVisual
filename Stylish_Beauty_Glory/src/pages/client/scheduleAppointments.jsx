import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import { getAvailableAppointments, bookAppointment } from "../../services/Serv_appointments";
import "../../styles/Client_CSS/scheduleAppointments.css";
import "../../styles/Ui-Toolbar_CSS/Ui-toolbar.css";
import { API_BASE } from "../../services/config";

//swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {Pagination } from "swiper/modules";

function ClientAppointments() {
  const [clientId, setClientId] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [availableAppointments, setAvailableAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  //Modal para agendar
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

    const handleAgendar = (cita) => {
    setSelectedAppointment(cita);
    setShowModal(true);
    };
    // Función para confirmar agendar cita
    const handleConfirmAgendar = async () => {
    if (!clientId) {
        toast.error("No se pudo identificar al cliente.");
        return;
    }
    try {
        const res = await bookAppointment(selectedAppointment.appointment_id, clientId);
        if (res && !res.error) {
            toast.success( res.message || "¡Cita agendada con éxito! Revisa tu agenda para más detalles.");
            setAvailableAppointments(
                (prev) => prev.filter(
                    (cita) => cita.appointment_id !== selectedAppointment.appointment_id
                ) 
            ); 
        } else {
            toast.error(res?.error || "No se pudo agendar la cita.");
        }
    } catch (error) {
        console.error("Error agendando cita:", error);
        toast.error("Error al agendar la cita. Intenta de nuevo más tarde.");
    } finally {
        setShowModal(false);
        setSelectedAppointment(null);
    }
    };


    const handleCancelAppointment = () => {
    setSelectedAppointment(null);
    setShowModal(false);
    };

  // Agrupar citas por fecha
const citasPorFecha = filteredAppointments.reduce((acc, cita) => {
  const fecha = cita.date.split("T")[0];
  if (!acc[fecha]) {
    acc[fecha] = [];
  }
  acc[fecha].push(cita);
  return acc;
}, {});
useEffect(() => {
  const fetchClientId = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await axios.get(`${API_BASE}/profile/client`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const client = res.data.client;
      setClientId(client.client_id);
    } catch (error) {
      console.error("Error obteniendo client_id:", error);
      toast.error("No se pudo obtener tu perfil. Intenta de nuevo más tarde.");
    }
  };

  fetchClientId();
}, []);

useEffect(() => { 
  const fetchAvailableAppointments = async () => { 
    try { 
      const res = await getAvailableAppointments(); 

      if (Array.isArray(res.appointments)) { 
        const hoy = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD
        //hoy en adelante
        const filtradas = res.appointments.filter((cita) => {
          const citaFecha = cita.date.split("T")[0];
          return citaFecha >= hoy;
        });
        setAvailableAppointments(filtradas); 
      } else { 
        toast.error(res.error||"Error al cargar citas disponibles");
      } 
    } catch (error) { 
      console.error("Error cargando citas disponibles:", error);
      toast.error("No se pudieron cargar las citas disponibles. Intenta de nuevo más tarde.");
    } 
  }; 

  fetchAvailableAppointments(); 
}, []);

useEffect(() => {
  if (selectedDate) {
      const filtradas = availableAppointments.filter((cita) => {
      const citaFecha = cita.date.split("T")[0];
      return citaFecha === selectedDate; // solo las de ese día exacto
    });
    setFilteredAppointments(filtradas);
  } else {
    setFilteredAppointments(availableAppointments);
  }
}, [selectedDate, availableAppointments]);




  return (
    <div className="client-appointments">
      {/* Barra superior de búsqueda */}
        <section className="search-section">
            <div className="ui-toolbar">
                <div className="ui-toolbar-title">Citas disponibles</div>
                <div className="ui-toolbar-controls">
                    <div className="ui-toolbar-filter">
                        <span className="filter-label">Filtrar:</span>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* Sección de citas */}
        <section className="appointments-section">
            {Object.keys(citasPorFecha).length === 0 ? (
                <p className="no-appointments">Parece que no hay citas disponibles.</p>
                ) : (
                Object.keys(citasPorFecha).map((fecha) => {
                const [year, month, day] = fecha.split("-");
                const fechaObj = new Date(year, month - 1, day);
                const formattedDate = fechaObj.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                });

                return (
                    <div key={fecha} className="appointment-section">
                    <h3>{formattedDate}</h3>
                        <Swiper
                        modules={[Pagination]}
                        spaceBetween={12}
                        slidesPerView={2}          
                        slidesPerGroup={2}         
                        navigation
                        pagination={{ clickable: true, type: "bullets" }}
                        breakpoints={{
                            340: { slidesPerView: 2, slidesPerGroup: 2 },
                            590: { slidesPerView: 3, slidesPerGroup: 3 },
                            770: { slidesPerView: 4, slidesPerGroup: 4 },
                            1214: { slidesPerView: 5, slidesPerGroup: 5 },
                            1524: { slidesPerView: 6, slidesPerGroup: 6 },
                        }}
                        >
                        {citasPorFecha[fecha].map((cita) => (
                        <SwiperSlide key={cita.appointment_id}>
                            <div className="appointment-card">
                                <h4>{cita.service?.name}</h4>
                                <p>
                                    Hora: {new Date(`1970-01-01T${cita.time}`).toLocaleTimeString("es-ES", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </p>
                                <p>Duración: {cita.duration}</p>
                                <span className="appointment-tag">{cita.status}</span>

                                {/* Botón para agendar */}
                                <button 
                                    className="appointment-btn" 
                                    onClick={() => handleAgendar(cita)}
                                    >
                                    Agendar
                                </button>
                            </div>
                        </SwiperSlide>
                        ))}
                    </Swiper>
                    </div>
                );
                })
            )}
        </section>

        {/* Modal de confirmación */}
        {showModal && selectedAppointment && (
        <div className="modal-overlay">
            <div className="modal-content medium">
            <h2>Confirmar cita</h2>
                <p>
                Estás a punto de agendar tu cita de{" "}
                <strong>{selectedAppointment.service?.name}</strong>{" "}
                para el{" "}
                <strong>{new Date(selectedAppointment.date).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })}</strong>{" "}
                a las{" "}
                <strong>{new Date(`1970-01-01T${selectedAppointment.time}`).toLocaleTimeString("es-ES", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                })}</strong>. ¿Deseas continuar?
                </p>

            <div className="modal-actions">
                <button className="modal-btn confirm" onClick={handleConfirmAgendar}>
                Confirmar
                </button>
                <button className="modal-btn cancel" onClick={handleCancelAppointment}>
                Cancelar
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
  );
}

export default ClientAppointments;
