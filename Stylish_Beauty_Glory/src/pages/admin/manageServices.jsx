import { useState, useEffect } from "react";
import "../../styles/Modals_CSS/modalBase.css";
import "../../styles/Table_CSS/TableBase.css";
import "../../styles/Ui-Toolbar_CSS/Ui-toolbar.css";

import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "../../services/Serv_services";

function ManageServices() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal crear
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");

  // Modal eliminar
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Modal ver
  const [showViewModal, setShowViewModal] = useState(false);
  const [serviceToView, setServiceToView] = useState(null);

  // Modal editar
  const [showEditModal, setShowEditModal] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // eliminar servicio
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      const data = await deleteService(serviceToDelete.service_id);

      if (!data || data.error) {
        toast.error(data?.error || "Error al eliminar el servicio");
        return;
      }

      // Actualizar lista quitando el eliminado
      const updatedServices = services.filter((s) => s.service_id !== serviceToDelete.service_id);
      setServices(updatedServices);
      setFilteredServices(updatedServices);

      toast.success(data.message || "Servicio eliminado correctamente");
      setServiceToDelete(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("handleDeleteService error:", error);
      toast.error("Error de red al eliminar el servicio");
    }
  };

  //crear servicio
  const handleAddService = async () => {
    const nombreLimpio = newServiceName.trim();
    const descripcionLimpia = newServiceDescription.trim();

    if (!nombreLimpio) {
      toast.error("Por favor escribe un nombre válido");
      return;
    }

    try {
      const data = await createService({
        name: nombreLimpio,
        description: descripcionLimpia,
      });

      if (!data || data.error) {
        toast.error(data?.error || "Error al crear el servicio");
        return;
      }

      // Extraer el servicio creado de la respuesta
      const newService = data.service || data;

      // Actualizar lista
      setServices((prev) => [...prev, newService]);
      setFilteredServices((prev) => [...prev, newService]);

      toast.success(`Servicio creado: ${newService.name}`);
      setNewServiceName("");
      setNewServiceDescription("");
      setShowCreateModal(false);
    } catch (error) {
      console.error("handleAddService error:", error);
      toast.error("Error de red al crear el servicio");
    }
  };

  // Cargar servicios
  useEffect(() => {
    const cargarServicios = async () => {
      const data = await fetchServices();
      if (data && Array.isArray(data.services)) {
        setServices(data.services);
        setFilteredServices(data.services);
      } else {
        console.error("Error cargando servicios:", data);
        toast.error(data?.error || "Hubo un error al cargar los servicios");
      }
    };

    cargarServicios();
  }, []);
  // actualizar servicio
  const handleUpdateService = async () => {
    if (!serviceToEdit) return;

    const nombreLimpio = editName.trim();
    const descripcionLimpia = editDescription.trim();

    if (!nombreLimpio) {
      toast.error("Por favor escribe un nombre válido");
      return;
    }

    try {
      const data = await updateService(serviceToEdit.service_id, {
        name: nombreLimpio,
        description: descripcionLimpia,
      });

      if (!data || data.error) {
        toast.error(data?.error || "Error al actualizar el servicio");
        return;
      }

      const updatedService = data.service || data;

      // Actualizar lista
      const updatedServices = services.map((s) =>
        s.service_id === serviceToEdit.service_id ? updatedService : s
      );
      setServices(updatedServices);
      setFilteredServices(updatedServices);

      toast.success(`Servicio actualizado: ${updatedService.name}`);
      setShowEditModal(false);
      setServiceToEdit(null);
    } catch (error) {
      console.error("handleUpdateService error:", error);
      toast.error("Error de red al actualizar el servicio");
    }
  };

  // Filtrar por nombre
  useEffect(() => {
    if (!searchTerm) {
      setFilteredServices(services);
    } else {
      setFilteredServices(
        services.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  }, [searchTerm, services]);

  // Acciones
  const startEditing = (service) => {
    setServiceToEdit(service);
    setEditName(service.name);
    setEditDescription(service.description);
    setShowEditModal(true);
  };

  const confirmDelete = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const viewService = (service) => {
    setServiceToView(service);
    setShowViewModal(true);
  };

  return (
    <>
      {/* Toolbar */}
      <div className="ui-toolbar">
        <h1 className="ui-toolbar-title">Gestión de servicios</h1>
        <div className="ui-toolbar-controls">
          <button className="ui-toolbar-btn" onClick={() => setShowCreateModal(true)}>
            <FaPlus className="ui-toolbar-btn-icon" />
            Nuevo servicio
          </button>
          <div className="ui-toolbar-filter">
            <input
              type="text"
              placeholder="Filtrar por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-list">
        {filteredServices.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.service_id}>
                  <td>{service.name}</td>
                  <td>
                    <button
                      className="icon-btn view"
                      title="Ver"
                      onClick={() => viewService(service)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="icon-btn edit"
                      title="Editar"
                      onClick={() => startEditing(service)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-btn delete"
                      title="Eliminar"
                      onClick={() => confirmDelete(service)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-info">No se encontraron servicios</p>
        )}
      </div>

      {/* Modal crear */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content medium">
            <h2>Agregar nuevo servicio</h2>
            <p>Nombre del servicio</p>
            <input
              type="text"
              placeholder="Nombre del servicio"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
            />
            <p>Descripción del servicio</p>
            <textarea
              rows="3"
              placeholder="Descripción del servicio"
              value={newServiceDescription}
              onChange={(e) => setNewServiceDescription(e.target.value)}
            />
            <div className="modal-actions">
              <button className="modal-btn confirm" onClick={handleAddService}>
                Agregar
              </button>
              <button className="modal-btn cancel" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ver */}
      {showViewModal && serviceToView && (
        <div className="modal-overlay">
          <div className="modal-content medium">
            <h2 style={{ marginBottom: "1rem", color: "#4a2e2e" }}>Detalle del servicio</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div>
                <strong>Nombre:</strong>
                <p>{serviceToView.name || "—"}</p>
              </div>
              <div>
                <strong>Descripción:</strong>
                <p style={{ whiteSpace: "pre-wrap" }}>{serviceToView.description || "—"}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowViewModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content medium">
            <h2>¿Eliminar servicio?</h2>
            <p>
              ¿Seguro que deseas eliminar <strong>{serviceToDelete?.name}</strong>?
            </p>
            <div className="modal-actions">
              <button className="modal-btn confirm" onClick={handleDeleteService}>
                Sí, eliminar
              </button>
              <button className="modal-btn cancel" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal editar */}
      {showEditModal && serviceToEdit && (
        <div className="modal-overlay">
          <div className="modal-content medium">
            <h2>Editar servicio</h2>
            <p>Nombre del servicio</p>
            <input
              type="text"
              placeholder="Nombre del servicio"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <p>Descripción del servicio</p>
            <textarea
              rows="3"
              placeholder="Descripción del servicio"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <div className="modal-actions">
              <button className="modal-btn confirm" onClick={handleUpdateService}>
                Guardar
              </button>
              <button className="modal-btn cancel" onClick={() => setShowEditModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageServices;
