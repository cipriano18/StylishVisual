import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../../services/config";
import "../../styles/Modals_CSS/modalBase.css";
import "../../styles/Table_CSS/TableBase.css";
import "../../styles/Ui-Toolbar_CSS/Ui-toolbar.css";

import { fetchServices } from "../../services/Serv_services";
import { createAppointment, getAppointments, updateAppointment} from "../../services/Serv_appointments";
import {notifyAppointmentMoved} from "../../services/Serv_notifications";
import { FaPlus, FaEdit } from "react-icons/fa";
import { toast } from "react-hot-toast";

function ManageAppointments() {

  //estados del modal editar cita
  const [editModal, setEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  // Modal agregar cita
  const [showModal, setShowModal] = useState(false);
    //Carga de servicios
    const [services, setServices] = useState([]);

    useEffect(() => {
        const cargarServicios = async () => {
            try {
            const result = await fetchServices();

            if (result?.error) {
                toast.error("Error al obtener servicios");
            } else if (Array.isArray(result.services)) {
                setServices(result.services);
            }
            } catch (error) {
            console.error("Error cargando servicios:", error);
            toast.error("Hubo un error al cargar los servicios");
            }
    };

    cargarServicios();
    }, []);


  // Cargar citas desde la API
  useEffect(() => {
    const cargarCitas = async () => {
      try {
        const result = await getAppointments();
        console.log("Citas obtenidas:", result);
        if (result?.error) {
          toast.error("Error al obtener citas");
        } else if (Array.isArray(result.appointments)) {
          setAppointments(result.appointments);

        }
      } catch (error) {
        console.error("Error cargando citas:", error);
        toast.error("Hubo un error al cargar las citas");
      }
    };
    cargarCitas();
  }, []);

  // Filtros
const [filterDate, setFilterDate] = useState("");
const [filterIrrelevant, setFilterIrrelevant] = useState("");

useEffect(() => {
  let filtered = appointments;

  const hoy = new Date().toLocaleDateString("sv-SE"); // fecha de hoy en YYYY-MM-DD

// 🔹 Por defecto: solo citas desde hoy en adelante y que no estén canceladas
filtered = filtered.filter(c => {
  const citaFecha = c.date.split("T")[0]; // solo la fecha, sin hora

  return citaFecha >= hoy && c.status !== "Cancelada";
});


  // 🔹 Filtrar por fecha exacta
  if (filterDate) {
    filtered = filtered.filter(c => {
      const citaFecha = c.date.split("T")[0];
      return citaFecha === filterDate;
    });
  }

  // 🔹 Filtrar irrelevantes (anteriores a hoy o canceladas)
  if (filterIrrelevant === "irrelevantes") {
    filtered = appointments.filter(c => {
      const citaFecha = c.date.split("T")[0];
      return citaFecha < hoy || c.status === "Cancelada";
    });
  }

  setFilteredAppointments(filtered);
}, [filterDate, filterIrrelevant, appointments]);



  //editar cita
  const handleUpdateAppointment = async () => {
    const updatedCita = {
      client_id: selectedAppointment.client_id,
      date: selectedAppointment.date,
      time: selectedAppointment.time,
      service_id: selectedAppointment.service_id,
      duration: selectedAppointment.duration,
    };

    try {
      const result = await updateAppointment(
        selectedAppointment.appointment_id,
        updatedCita
      );

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(result?.message || "Cita actualizada correctamente");

        // 🔹 Notificar al cliente si la cita está reservada
        console.log(selectedAppointment);
        if (selectedAppointment.client.client_id) {
          console.log("Notificando al cliente sobre la modificación...");
          try {
            const token = localStorage.getItem("access_token");
            if (token) {
              // Obtener admin_id desde el perfil del admin logueado
              const res = await axios.get(`${API_BASE}/profile/admin`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              const admin = res.data.admin;

              await notifyAppointmentMoved({
                client_id: selectedAppointment.client.client_id,
                appointment_id: selectedAppointment.appointment_id,
                admin_id: admin.admin_id, // 🔹 aquí usas el id real del admin
              });

              toast.success("Cliente notificado de la modificación");
            }
          } catch (notifyError) {
            console.error("Error notificando al cliente:", notifyError);
            toast.error("No se pudo notificar al cliente");
          }
        }

        // 🔹 Refrescar citas
        const refreshed = await getAppointments();
        if (Array.isArray(refreshed.appointments)) {
          setAppointments(refreshed.appointments);
        }
        setEditModal(false);
      }
    } catch (error) {
      console.error("Error al actualizar cita:", error);
      toast.error("Error al actualizar cita");
    }
  };



  // Crear cita
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");
    const [newServiceId, setNewServiceId] = useState("");
    const [newDuration, setNewDuration] = useState("");

    const handleCreateAppointment = async () => {
    const nuevaCita = {
        date: newDate,
        time: newTime,
        service_id: parseInt(newServiceId, 10),
        duration: newDuration,
    };

    try {
        const result = await createAppointment(nuevaCita);
        console.log("Resultado de crear cita:", result);

        if (result?.error || result?.missing_fields) {
        if (result.error) toast.error(result.error);
        if (result.missing_fields) toast.error(result.missing_fields);
        } else {
        toast.success("Cita creada correctamente");
        const updated = await getAppointments();
        if (Array.isArray(updated.appointments)) {
            setAppointments(updated.appointments);
            setFilteredAppointments(updated.appointments);
        }
        // limpiar formulario
        setNewDate("");
        setNewTime("");
        setNewServiceId("");
        setNewDuration("");
        setShowModal(false);
        }
    } catch (error) {
        console.error("Error al crear cita:", error);
        toast.error("Error al crear cita");
    }
    };



  return (
    <>
      {/* Toolbar */}
      <div className="ui-toolbar">
  <h1 className="ui-toolbar-title">Gestión de Citas</h1>
  <div className="ui-toolbar-controls">
    <button className="ui-toolbar-btn" onClick={() => setShowModal(true)}>
      <FaPlus className="ui-toolbar-btn-icon" />
      Agregar cita
    </button>

    <div className="ui-toolbar-filter">
      {/* Filtro por fecha */}
      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
      />

      {/* Selector de irrelevantes */}
      <select
        value={filterIrrelevant}
        onChange={(e) => setFilterIrrelevant(e.target.value)}
      >
        <option value="">Relevantes</option>
        <option value="irrelevantes">Irrelevantes</option>
      </select>
    </div>
  </div>
</div>


{/* Tabla de citas */}
<div className="table-list">
  {filteredAppointments.length > 0 ? (
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Duración</th>
          <th>Servicio</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
      {filteredAppointments.map((cita) => {
        const estadoMap = {
          Disponible: { text: "Disponible", className: "status-disponible" },
          Cancelada: { text: "Cancelada", className: "status-cancelada" },
          Agendada: { text: "Agendada", className: "status-agendada" },
          Finalizada: { text: "Finalizada", className: "status-finalizada" },
        };

        const estado = estadoMap[cita.status] || { text: cita.status, className: "" };

        return (
          <tr key={cita.appointment_id}>
            <td>{cita.date.split("T")[0]}</td>
            <td>{cita.time}</td>
            <td>{cita.duration}</td>
            <td>{cita.service?.name}</td>
            <td>
              <span className={`status-label ${estado.className}`}>
                {estado.text}
              </span>
            </td>
            <td>
              <button
                className="icon-btn edit"
                title="Editar cita"
                onClick={() => {
                  setSelectedAppointment(cita);
                  setEditModal(true);
                }}
              >
                <FaEdit />
              </button>
            </td>
          </tr>
        );
      })}


      </tbody>
    </table>
  ) : (
    <p className="no-info">No hay citas relevantes. Agrega citas para tus clientes!</p>
  )}
</div>


      {/* Modal agregar cita */}
        {showModal && (
        <div className="modal-overlay">
            <div className="modal-content medium">
            <h2>Agregar nueva cita</h2>

            <div className="modal-form">
                <label>
                Fecha:
                <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                />
                </label>

                <label>
                Hora:
                <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                />
                </label>

                <label>
                Duración:
                <input
                    type="text"
                    placeholder="HH:MM"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                />
                </label>

                <label>
                Servicio:
                <select
                    value={newServiceId}
                    onChange={(e) => setNewServiceId(e.target.value)}
                >
                    <option value="">Seleccione un servicio</option>
                    {services.map((serv) => (
                    <option key={serv.service_id} value={serv.service_id}>
                        {serv.name}
                    </option>
                    ))}
                </select>
                </label>
            </div>

            <div className="modal-actions">
                <button className="modal-btn confirm" onClick={handleCreateAppointment}>
                Guardar
                </button>
                <button className="modal-btn cancel" onClick={() => setShowModal(false)}>
                Cancelar
                </button>
            </div>
            </div>
        </div>
        )}

        {/* Modal editar cita */}
        {editModal && selectedAppointment && (
          <div className="modal-overlay">
            <div className="modal-content medium">
              <h2>Editar cita</h2>

              <div className="modal-form">
                <label>
                  Fecha:
                  <input
                    type="date"
                    value={selectedAppointment.date.split("T")[0]}
                    onChange={(e) =>
                      setSelectedAppointment({ ...selectedAppointment, date: e.target.value })
                    }
                  />
                </label>

                <label>
                  Hora:
                  <input
                    type="time"
                    value={selectedAppointment.time}
                    onChange={(e) =>
                      setSelectedAppointment({ ...selectedAppointment, time: e.target.value })
                    }
                  />
                </label>

                <label>
                  Duración:
                  <input
                    type="text"
                    value={selectedAppointment.duration}
                    onChange={(e) =>
                      setSelectedAppointment({ ...selectedAppointment, duration: e.target.value })
                    }
                  />
                </label>

                <label>
                  Servicio:
                  <select
                    value={selectedAppointment.service_id}
                    onChange={(e) =>
                      setSelectedAppointment({ ...selectedAppointment, service_id: parseInt(e.target.value, 10) })
                    }
                  >
                    <option value="">Seleccione un servicio</option>
                    {services.map((serv) => (
                      <option key={serv.service_id} value={serv.service_id}>
                        {serv.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="modal-actions">
                <button className="modal-btn confirm" onClick={handleUpdateAppointment}>
                  Guardar cambios
                </button>
                <button className="modal-btn cancel" onClick={() => setEditModal(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

    </>
  );
}

export default ManageAppointments;

