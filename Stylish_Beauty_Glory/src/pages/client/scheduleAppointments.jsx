import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaArrowLeft, FaFilter } from "react-icons/fa";

import { getAvailableAppointments, bookAppointment } from "../../services/Serv_appointments";
import { API_BASE } from "../../services/config";
import { formatAppointmentDuration } from "../../utils/appointmentFormat";
import LoaderOverlay from "../overlay/UniversalOverlay";

import "../../styles/Carousel_CSS/appointmentsCarousel.css";
import "../../styles/Ui-Toolbar_CSS/Ui-toolbar.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function ClientAppointments() {
  const [clientId, setClientId] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [availableAppointments, setAvailableAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleAgendar = (cita) => {
    setSelectedAppointment(cita);
    setShowModal(true);
  };

  const handleConfirmAgendar = async () => {
    if (!clientId) {
      toast.error("No se pudo identificar al cliente.");
      return;
    }

    try {
      setLoading(true);
      const res = await bookAppointment(selectedAppointment.appointment_id, clientId);

      if (res && !res.error) {
        toast.success(
          res.message || "¡Cita agendada con éxito! Revisa tu agenda para más detalles."
        );
        setAvailableAppointments((prev) =>
          prev.filter((cita) => cita.appointment_id !== selectedAppointment.appointment_id)
        );
      } else {
        toast.error(res?.error || "No se pudo agendar la cita.");
      }
    } catch (error) {
      console.error("Error agendando cita:", error);
      toast.error("Error al agendar la cita. Intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
      setShowModal(false);
      setSelectedAppointment(null);
    }
  };

  const handleCancelAppointment = () => {
    setSelectedAppointment(null);
    setShowModal(false);
  };

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
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchClientId();
  }, []);

  useEffect(() => {
    const fetchAvailableAppointments = async () => {
      try {
        setLoading(true);
        const res = await getAvailableAppointments();

        if (Array.isArray(res.appointments)) {
          const hoy = new Date().toLocaleDateString("sv-SE");
          const filtradas = res.appointments.filter((cita) => {
            const citaFecha = cita.date.split("T")[0];
            return citaFecha >= hoy;
          });

          const ordenadas = filtradas.sort((a, b) => new Date(a.date) - new Date(b.date));
          setAvailableAppointments(ordenadas);
        } else {
          toast.error(res.error || "Error al cargar citas disponibles");
        }
      } catch (error) {
        console.error("Error cargando citas disponibles:", error);
        toast.error("No se pudieron cargar las citas disponibles. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableAppointments();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const filtradas = availableAppointments.filter((cita) => {
        const citaFecha = cita.date.split("T")[0];
        return citaFecha === selectedDate;
      });
      setFilteredAppointments(filtradas);
    } else {
      setFilteredAppointments(availableAppointments);
    }
  }, [selectedDate, availableAppointments]);

  return (
    <div className="client-appointments client-appointments--available">
      {loading && <LoaderOverlay message="Cargando tu información..." />}

      <section className="search-section">
        <div className="ui-toolbar">
          <div className="ui-toolbar-title">Citas disponibles</div>
          <div className="ui-toolbar-controls">
            <div className="ui-toolbar-filter ui-toolbar-filter-desktop">
              <span className="filter-label">Filtrar:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="ui-toolbar-filter-wrapper">
              <button
                className="ui-toolbar-btn ui-toolbar-filter-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="ui-toolbar-btn-icon" />
                Filtros
              </button>

              {showFilters && (
                <>
                  <div
                    className="ui-toolbar-popover-overlay"
                    onClick={() => setShowFilters(false)}
                  />
                  <div className="ui-toolbar-popover">
                    <span className="filter-label">Filtrar:</span>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="appointments-section">
        {Object.keys(citasPorFecha).length === 0 ? (
          <div className="no-appointments">
            <strong>No hay citas disponibles por ahora.</strong>
            <span>Cuando se habiliten nuevos espacios, aparecerán aquí listos para reservar.</span>
          </div>
        ) : (
          Object.keys(citasPorFecha).map((fecha) => {
            const [year, month, day] = fecha.split("-");
            const fechaObj = new Date(year, month - 1, day);
            const formattedDate = fechaObj.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return (
              <div key={fecha} className="appointment-section">
                <div className="appointment-section-header">
                  <h3 className="appointment-section-date">{formattedDate}</h3>
                  <span className="appointment-section-count">
                    {citasPorFecha[fecha].length} disponibles
                  </span>
                </div>

                <Swiper
                  className="appointments-swiper"
                  modules={[Pagination]}
                  spaceBetween={14}
                  slidesPerView="auto"
                  slidesPerGroup={1}
                  navigation
                  pagination={{ clickable: true, type: "bullets" }}
                >
                  {citasPorFecha[fecha].map((cita) => (
                    <SwiperSlide key={cita.appointment_id} className="appointment-slide">
                      <div className="appointment-card appointment-card--available">
                        <span className="appointment-card-accent" aria-hidden="true" />

                        <div className="appointment-card-body">
                          <span className="appointment-card-caption">Reserva disponible</span>
                          <h4>{cita.service?.name}</h4>

                          <div className="appointment-card-meta">
                            <div className="appointment-card-meta-item">
                              <span className="appointment-card-meta-label">Hora</span>
                              <strong>
                                {new Date(`1970-01-01T${cita.time}`).toLocaleTimeString(
                                  "es-ES",
                                  {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )}
                              </strong>
                            </div>

                            <div className="appointment-card-meta-item">
                              <span className="appointment-card-meta-label">Duración</span>
                              <strong>{formatAppointmentDuration(cita.duration)}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="appointment-card-footer">
                          <span className="appointment-tag">{cita.status}</span>
                          <button className="appointment-btn" onClick={() => handleAgendar(cita)}>
                            Agendar
                          </button>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {citasPorFecha[fecha].length > 1 && (
                  <p className="appointment-swipe-hint">
                    <FaArrowLeft className="appointment-swipe-hint-icon" />
                    <span>Desliza para ver mas</span>
                  </p>
                )}
              </div>
            );
          })
        )}
      </section>

      {showModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal-content medium">
            <h2>Confirmar cita</h2>
            <p>Estás a punto de agendar esta cita. ¿Deseas continuar?</p>
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
