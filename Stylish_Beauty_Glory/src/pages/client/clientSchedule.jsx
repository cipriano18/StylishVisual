import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaArrowLeft, FaFilter } from "react-icons/fa";

import {
  cancelAppointmentByClient,
  getAppointmentsByClient,
} from "../../services/Serv_appointments";
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

function ClientSchedule() {
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [clientId, setClientId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleCancel = (cita) => {
    setSelectedAppointment(cita);
    setShowModal(true);
  };

  const handleCancelAppointment = async () => {
    if (!clientId || !selectedAppointment) return;

    try {
      const res = await cancelAppointmentByClient(selectedAppointment.appointment_id, clientId);

      if (res && !res.error) {
        toast.success(res.message || "¡Cita cancelada con éxito!");
        setFilteredAppointments((prev) =>
          prev.filter((cita) => cita.appointment_id !== selectedAppointment.appointment_id)
        );
      } else {
        toast.error(res?.error || "No se pudo cancelar la cita.");
      }
    } catch (error) {
      console.error("Error cancelando cita:", error);
      toast.error("Error al cancelar la cita. Intenta de nuevo más tarde.");
    } finally {
      setShowModal(false);
      setSelectedAppointment(null);
    }
  };

  const handleCancelDeletion = () => {
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
    const fetchClientAppointments = async () => {
      try {
        setLoading(true);
        if (!clientId) return;

        const res = await getAppointmentsByClient(clientId);
        if (Array.isArray(res.appointments)) {
          const hoy = new Date().toLocaleDateString("sv-SE");
          const futuras = res.appointments.filter((cita) => cita.date.split("T")[0] >= hoy);
          const ordenadas = futuras.sort((a, b) => new Date(a.date) - new Date(b.date));

          setAppointments(ordenadas);
          setFilteredAppointments(ordenadas);
        } else {
          toast.error(res.error || "Error al cargar tus citas.");
        }
      } catch (error) {
        console.error("Error cargando citas del cliente:", error);
        toast.error("No se pudieron cargar tus citas. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchClientAppointments();
  }, [clientId]);

  useEffect(() => {
    if (selectedDate) {
      const filtradas = appointments.filter((cita) => {
        const citaFecha = cita.date.split("T")[0];
        return citaFecha === selectedDate;
      });
      setFilteredAppointments(filtradas);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [selectedDate, appointments]);

  return (
    <div className="client-appointments client-appointments--agenda">
      {loading && <LoaderOverlay message="Cargando tu información..." />}

      <section className="search-section">
        <div className="ui-toolbar">
          <div className="ui-toolbar-title">Mi agenda</div>
          <div className="ui-toolbar-controls">
            <div className="ui-toolbar-filter ui-toolbar-filter-desktop">
              <span className="filter-label">Fecha:</span>
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
                    <span className="filter-label">Fecha:</span>
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
            <strong>No tienes citas agendadas en este momento.</strong>
            <span>Cuando reserves una nueva cita, aparecerá aquí con sus detalles.</span>
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
                    {citasPorFecha[fecha].length} agendadas
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
                      <div
                        className={`appointment-card appointment-card--agenda ${cita.status.toLowerCase()}`}
                      >
                        <span className="appointment-card-accent" aria-hidden="true" />

                        <div className="appointment-card-body">
                          <span className="appointment-card-caption">Tu próxima experiencia</span>
                          <h4>{cita.service?.name}</h4>

                          <div className="appointment-card-meta">
                            <div className="appointment-card-meta-item">
                              <span className="appointment-card-meta-label">Hora</span>
                              <strong>
                                {new Date(`1970-01-01T${cita.time}`).toLocaleTimeString("es-ES", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </strong>
                            </div>

                            <div className="appointment-card-meta-item">
                              <span className="appointment-card-meta-label">Duración</span>
                              <strong>{formatAppointmentDuration(cita.duration)}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="appointment-card-footer">
                          {cita.status !== "Agendada" && (
                            <span className={`appointment-tag ${cita.status.toLowerCase()}`}>
                              {cita.status}
                            </span>
                          )}
                          {cita.status === "Agendada" && (
                            <span className="appointment-tag pendiente">Pendiente</span>
                          )}

                          {cita.status === "Agendada" && (
                            <button className="appointment-btn" onClick={() => handleCancel(cita)}>
                              Cancelar cita
                            </button>
                          )}
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
            <h2>Cancelar cita</h2>
            <p>¿Estás seguro de que deseas cancelar esta cita?</p>
            <div className="modal-actions">
              <button className="modal-btn confirm" onClick={handleCancelAppointment}>
                Confirmar
              </button>
              <button className="modal-btn cancel" onClick={handleCancelDeletion}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientSchedule;
