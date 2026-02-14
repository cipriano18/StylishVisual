import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../../services/config";
import { toast } from "react-hot-toast";
import "../../styles/Carousel_CSS/appointmentsCarousel.css";
import "../../styles/Ui-Toolbar_CSS/Ui-toolbar.css";
import "../../styles/Modals_CSS/modalBase.css";

import {getAppointments, cancelAppointmentByAdmin, finalizeAppointment } from "../../services/Serv_appointments";
import { createSale }from "../../services/Serv_sales";
import {notifyAppointmentCanceled} from "../../services/Serv_notifications";

//swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {Pagination } from "swiper/modules";

function AdminSchedule() {
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [cancelReason, setCancelReason] = useState("");
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [finalizeAmount, setFinalizeAmount] = useState("");

  //Modal para agendar
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);


    // Función para cancelar cita
    const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
        // Cancelar en backend
        const res = await cancelAppointmentByAdmin(selectedAppointment.appointment_id);

        if (res && !res.error) {
        toast.success(res.message || "¡Cita cancelada con éxito!");

        // 🔹 Actualizar estado en la interfaz
        setFilteredAppointments((prev) =>
            prev.map((cita) =>
            cita.appointment_id === selectedAppointment.appointment_id
                ? { ...cita, status: "Cancelada" }
                : cita
            )
        );

        // 🔹 Obtener admin_id desde el perfil del admin logueado
        const token = localStorage.getItem("access_token");
        if (token) {
            const resAdmin = await axios.get(`${API_BASE}/profile/admin`, {
            headers: { Authorization: `Bearer ${token}` },
            });

            const admin = resAdmin.data.admin;

            // 🔹 Notificar al cliente con todos los datos
            const res = await notifyAppointmentCanceled({
            client_id: selectedAppointment.client.client_id,
            appointment_id: selectedAppointment.appointment_id,
            admin_id: admin.admin_id,
            reason: cancelReason, // puedes personalizar el motivo
            });
            if (res && !res.error) {
                toast.success(res.message || "Notificación enviada al cliente.");
            }
        }
        } else {
        toast.error(res?.error || "No se pudo cancelar la cita.");
        }
    } catch (error) {
        console.error("Error cancelando cita:", error);
        toast.error("Error al cancelar la cita. Intenta de nuevo más tarde.");
    } finally {
        setShowModal(false);
        setSelectedAppointment(null);
        setCancelReason("");
    }
    };

//Finalizar cita y registrar venta
const handleFinalizeAppointment = async (cita, amount) => {
  try {
    // 1. Finalizar cita en backend
    const res = await finalizeAppointment(cita.appointment_id);

    if (res && !res.error) {
      toast.success(res.message || "¡Cita finalizada con éxito!");

      // 2. Crear venta asociada
      const newSaleData = {
        client_id: cita.client.client_id, 
        amount: parseFloat(amount),
        date: new Date(cita.date).toISOString(), 
        appointment_id: cita.appointment_id, 
      };

      const saleRes = await createSale(newSaleData);

      if (saleRes && !saleRes.error) {
        toast.success(saleRes.message || "Venta registrada correctamente");
        // Aquí podrías actualizar un estado de ventas si lo tienes
      } else {
        toast.error(saleRes?.error || "No se pudo registrar la venta.");
      }

      // 3. Actualizar estado en la interfaz
      setFilteredAppointments((prev) =>
        prev.map((item) =>
          item.appointment_id === cita.appointment_id
            ? { ...item, status: "Finalizada", amount }
            : item
        )
      );
    } else {
      toast.error(res?.error || "No se pudo finalizar la cita.");
    }
  } catch (error) {
    console.error("Error finalizando cita:", error);
    toast.error("Error al finalizar la cita. Intenta de nuevo más tarde.");
  } finally {
    setShowFinalizeModal(false);
    setSelectedAppointment(null);
    setFinalizeAmount("");
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
  const fetchAppointments = async () => {
    try {
      const res = await getAppointments();

      if (Array.isArray(res.appointments)) {
        const ordenadas = res.appointments.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setAppointments(ordenadas);
        setFilteredAppointments(ordenadas);
      } else {
        toast.error(res.error || "Error al cargar las citas.");
      }
    } catch (error) {
      console.error("Error cargando citas:", error);
      toast.error("No se pudieron cargar las citas. Intenta de nuevo más tarde.");
    }
  };

  fetchAppointments();
}, []);


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
    <div className="client-appointments">
      {/* Barra superior de búsqueda */}
        <section className="search-section">
            <div className="ui-toolbar">
                <div className="ui-toolbar-title">Agenda</div>
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
                                        <span className={`appointment-tag ${cita.status.toLowerCase()}`}>
                                            {cita.status}
                                        </span>

                                    {cita.status === "Agendada" && (
                                        <>
                                            <button
                                                className="appointment-btn"
                                                onClick={() => {
                                                    setSelectedAppointment(cita);
                                                    setShowModal(true);
                                                }}
                                                >
                                                Cancelar cita
                                            </button>
                                            <button
                                                className="appointment-btn"
                                                onClick={() => {
                                                    setSelectedAppointment(cita);
                                                    setShowFinalizeModal(true);
                                                }}
                                            >
                                                Finalizar cita
                                            </button>
                                        </>
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
            <p>Por favor, escribe la razón de la cancelación:</p>
            
            <textarea
                className="modal-textarea"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ejemplo: El administrador no podrá atender en este horario"
            />

            <div className="modal-actions">
                <button
                className="modal-btn confirm"
                onClick={handleCancelAppointment}
                disabled={!cancelReason.trim()} // 🔹 evita confirmar sin razón
                >
                Confirmar
                </button>
                <button className="modal-btn cancel" onClick={handleCancelDeletion}>
                Cancelar
                </button>
            </div>
            </div>
        </div>
        )}
        {/* Modal para finalizar cita */}
        {showFinalizeModal && selectedAppointment && (
            <div className="modal-overlay">
                <div className="modal-content small">
                <h2>Finalizar cita</h2>
                <p>Monto cobrado por el servicio:</p>

                <input
                    type="number"
                    className="modal-input"
                    value={finalizeAmount}
                    onChange={(e) => setFinalizeAmount(e.target.value)}
                    placeholder="Monto en colones"
                />

                <div className="modal-actions">
                    <button
                    className="modal-btn confirm"
                    onClick={() => handleFinalizeAppointment(selectedAppointment, finalizeAmount)}
                    disabled={!finalizeAmount.trim()}
                    >
                    Confirmar
                    </button>
                    <button
                    className="modal-btn cancel"
                    onClick={() => {
                        setShowFinalizeModal(false);
                        setSelectedAppointment(null);
                        setFinalizeAmount("");
                    }}
                    >
                    Cancelar
                    </button>
                </div>
                </div>
            </div>
            )}


    </div>
  );
}

export default AdminSchedule;