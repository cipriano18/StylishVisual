import { useState, useEffect } from "react";

import "../../styles/Modals_CSS/modalBase.css";
import "../../styles/Table_CSS/Tablebase.css";
import "../../styles/Ui-Toolbar_CSS/Ui-toolbar.css";

import { fetchServices } from "../../services/Serv_services";
import { createAppointment, getAppointments } from "../../services/Serv_appointments";
import { FaPlus, FaEdit } from "react-icons/fa";
import { toast } from "react-hot-toast";
function ManageAppointments() {
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

  const hoy = new Date().toISOString().split("T")[0];

  // Por defecto: solo citas desde hoy en adelante y no canceladas
  filtered = filtered.filter(c => {
    const citaFecha = new Date(c.date).toISOString().split("T")[0];
    return citaFecha >= hoy && c.status !== "C";
  });

  // Filtrar por fecha
  if (filterDate) {
    filtered = filtered.filter(c => {
      const citaFecha = new Date(c.date).toISOString().split("T")[0];
      return citaFecha === filterDate;
    });
  }

  // Filtrar irrelevantes (anteriores a hoy o canceladas)
  if (filterIrrelevant === "irrelevantes") {
    filtered = appointments.filter(c => {
      const citaFecha = new Date(c.date).toISOString().split("T")[0];
      return citaFecha < hoy || c.status === "C";
    });
  }

  setFilteredAppointments(filtered);
}, [filterDate, filterIrrelevant, appointments]);



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
      Agregar Cita
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
            D: { text: "Disponible", className: "status-disponible" },
            C: { text: "Cancelada", className: "status-cancelada" },
            A: { text: "Agendada", className: "status-agendada" },
            F: { text: "Finalizada", className: "status-finalizada" },
        };

        const estado = estadoMap[cita.status] || { text: cita.status, className: "" };

        return (
            <tr key={cita.appointment_id}>
            <td>{new Date(cita.date).toLocaleDateString()}</td>
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
                onClick={() => console.log("Editar cita:", cita.appointment_id)}
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

    </>
  );
}

export default ManageAppointments;

