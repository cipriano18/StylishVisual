import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import {cancelAppointmentByClient, getAppointmentsByClient } from "../../services/Serv_appointments";
import "../../styles/Carousel_CSS/appointmentsCarousel.css";
import "../../styles/Ui-Toolbar_CSS/Ui-toolbar.css";
import { API_BASE } from "../../services/config";

//swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {Pagination } from "swiper/modules";

function ClientSchedule() {
  const [clientId, setClientId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  //Modal para agendar
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

    const handleCancel = (cita) => {
        setSelectedAppointment(cita);
        setShowModal(true);
    };
    // Función para cancelar cita
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
        const fetchClientAppointments = async () => {
            try {
                if (!clientId) return;
                const res = await getAppointmentsByClient(clientId);

                if (Array.isArray(res.appointments)) {
                    const hoy = new Date().toISOString().split("T")[0];
                    const futuras = res.appointments.filter(
                    (cita) => cita.date.split("T")[0] >= hoy
                    );

                    const ordenadas = futuras.sort( (a, b) => new Date(a.date) - new Date(b.date) );
                    setAppointments(ordenadas);
                    setFilteredAppointments(ordenadas);
                } else {
                    toast.error(res.error || "Error al cargar tus citas.");
                }
            } catch (error) {
                console.error("Error cargando citas del cliente:", error);
                toast.error("No se pudieron cargar tus citas. Intenta de nuevo más tarde.");
            }
        };
        fetchClientAppointments();
    }, [clientId]);

    useEffect(() => {
        if (selectedDate) {
            const filtradas = appointments.filter((cita) => {
            const citaFecha = cita.date.split("T")[0];
            return citaFecha === selectedDate; // solo las de ese día exacto
            });
            setFilteredAppointments(filtradas);
        } else {
            setFilteredAppointments(appointments); // todas si no hay filtro
        }
    }, [selectedDate, appointments]);

    return (
        <div className="client-appointments">
        {/* Barra superior de búsqueda */}
            <section className="search-section">
                <div className="ui-toolbar">
                    <div className="ui-toolbar-title">Mi agenda</div>
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
                                        <div className={`appointment-card ${cita.status.toLowerCase()}`}>
                                            <h4>{cita.service?.name}</h4>
                                            <p>
                                                Hora: {new Date(`1970-01-01T${cita.time}`).toLocaleTimeString("es-ES", {
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}
                                            </p>
                                            <p>Duración: {cita.duration}</p>

                                            {cita.status !== "Agendada" && (
                                                <span className={`appointment-tag ${cita.status.toLowerCase()}`}>
                                                    {cita.status}
                                                </span>
                                            )}
                                            {cita.status === "Agendada" && (
                                                <span className="appointment-tag pendiente">Pendiente</span>
                                            )}
                                            {cita.status === "Agendada" && (
                                                <button
                                                    className="appointment-btn"
                                                    onClick={() => handleCancel(cita)}
                                                >
                                                    Cancelar cita
                                                </button>
                                            )}
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
                <h2>Cancelar cita</h2>
                <p>
                    ¿Estás seguro de que deseas cancelar esta cita?
                </p>
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