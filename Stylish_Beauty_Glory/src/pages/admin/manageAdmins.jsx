import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaUser,
  FaBriefcase,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

//CSS
import "../../styles/Modals_CSS/modalBase.css";
import "../../styles/Ui-Toolbar_CSS/Ui-toolbar.css";
import "../../styles/Table_CSS/TableBase.css";

//Servicios
import { fetchAdmins, createAdmin, updateAdmin, deactivateAdmin } from "../../services/Serv_admins";

function ManageAdmins() {
  //estado de overlay

  // --- ESTADOS PRINCIPALES ---
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [searchId, setSearchId] = useState("");

  // --- CARGAR ADMINISTRADORES ---
  useEffect(() => {
    const cargarAdmins = async () => {
      const data = await fetchAdmins();
      if (!data || !Array.isArray(data.admins)) {
        console.error("Error al cargar administradores");
        toast.error(data?.error || "Error al cargar administradores");
        return;
      }

      const mappedAdmins = data.admins.map((a) => ({
        admin_id: a.admin_id,
        identity_card: a.identity_card,
        primary_name: a.primary_name,
        secondary_name: a.secondary_name,
        first_surname: a.first_surname,
        second_surname: a.second_surname,
        specialty: a.specialty,
        entry_date: a.entry_date,
        certifications: a.certifications,
        working_days: a.working_days,
        contacts: a.contacts,
        user: {
          user_id: a.user.user_id,
          username: a.user.username,
          status: a.user.status,
          role_id: a.user.role_id,
        },
      }));

      setAdmins(mappedAdmins);
      setFilteredAdmins(mappedAdmins);
    };

    cargarAdmins();
  }, []);

  //Crear administrador
  const handleCreateAdmin = async (newAdminData) => {
    const result = await createAdmin(newAdminData);

    if (!result || result.error) {
      if (result.missing_fields && Array.isArray(result.missing_fields)) {
        toast.error(`Faltan campos: ${result.missing_fields.join(", ")}`);
      } else {
        toast.error(result.error || "Error al crear administrador");
      }
      return;
    }

    toast.success(result.message || "Administrador creado exitosamente");

    const updated = await fetchAdmins();
    if (updated?.admins) {
      const mapped = updated.admins.map((a) => ({
        admin_id: a.admin_id,
        identity_card: a.identity_card,
        primary_name: a.primary_name,
        secondary_name: a.secondary_name,
        first_surname: a.first_surname,
        second_surname: a.second_surname,
        specialty: a.specialty,
        entry_date: a.entry_date,
        certifications: a.certifications,
        working_days: a.working_days,
        contacts: a.contacts,
        user: {
          user_id: a.user.user_id,
          username: a.user.username,
          status: a.user.status,
          role_id: a.user.role_id,
        },
      }));

      setAdmins(mapped);
      setFilteredAdmins(mapped);
    }

    setShowCreateModal(false);
    setNewAdmin({
      username: "",
      password: "",
      role_id: 1,
      primary_name: "",
      secondary_name: "",
      first_surname: "",
      second_surname: "",
      identity_card: "",
      specialty: "",
      entry_date: "",
      certifications: "",
      working_days: "",
      email: "",
      phone: "",
    });
  };
  //editar administrador
  const handleUpdateAdmin = async (admin_id, updatedData) => {
    const result = await updateAdmin(editAdminIdentityCard, updatedData);

    if (!result || result.error) {
      toast.error(result.error || "Error al actualizar administrador");
      return;
    }

    toast.success(result.message || "Administrador actualizado correctamente");

    const updated = await fetchAdmins();
    if (updated?.admins) {
      const mapped = updated.admins.map((a) => ({
        admin_id: a.admin_id,
        identity_card: a.identity_card,
        primary_name: a.primary_name,
        secondary_name: a.secondary_name,
        first_surname: a.first_surname,
        second_surname: a.second_surname,
        specialty: a.specialty,
        entry_date: a.entry_date,
        certifications: a.certifications,
        working_days: a.working_days,
        contacts: a.contacts,
        user: {
          user_id: a.user.user_id,
          username: a.user.username,
          status: a.user.status,
          role_id: a.user.role_id,
        },
      }));

      setAdmins(mapped);
      setFilteredAdmins(mapped);
    }

    setShowEditModal(false);
  };

  // --- BUSQUEDA AUTOMÁTICA ---
  useEffect(() => {
    if (searchId.trim() === "") {
      setFilteredAdmins(admins);
    } else {
      setFilteredAdmins(
        admins.filter((a) => a.identity_card.toLowerCase().includes(searchId.toLowerCase()))
      );
    }
  }, [searchId, admins]);

  // --- DAR DE BAJA ADMINISTRADOR ---
  const handleDeactivate = async (identityCard) => {
    const result = await deactivateAdmin(identityCard);

    if (!result || result.error) {
      toast.error(result?.error || "Error al dar de baja al administrador");
      return;
    }

    toast.success(result.message || "Administrador dado de baja correctamente");

    const updated = await fetchAdmins();
    if (updated?.admins) {
      const mapped = updated.admins.map((a) => ({
        admin_id: a.admin_id,
        identity_card: a.identity_card,
        primary_name: a.primary_name,
        secondary_name: a.secondary_name,
        first_surname: a.first_surname,
        second_surname: a.second_surname,
        specialty: a.specialty,
        entry_date: a.entry_date,
        certifications: a.certifications,
        working_days: a.working_days,
        contacts: a.contacts,
        user: {
          user_id: a.user.user_id,
          username: a.user.username,
          status: a.user.status,
          role_id: a.user.role_id,
        },
      }));

      setAdmins(mapped);
      setFilteredAdmins(mapped);
    }

    setShowConfirmModal(false);
    setPendingDeactivationId(null);
  };

  //Controles de modal de ver
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const handleView = (admin) => {
    setSelectedAdmin(admin);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setSelectedAdmin(null);
    setShowViewModal(false);
  };
  //Controles de modal de agregar
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    password: "",
    role_id: 1,
    primary_name: "",
    secondary_name: "",
    first_surname: "",
    second_surname: "",
    identity_card: "",
    specialty: "",
    entry_date: "",
    certifications: "",
    working_days: "",
    email: "",
    phone: "",
  });
  //controles de modal de editar
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAdminIdentityCard, setEditAdminIdentityCard] = useState(null);
  const [editAdmin, setEditAdmin] = useState({
    primary_name: "",
    secondary_name: "",
    first_surname: "",
    second_surname: "",
    specialty: "",
    entry_date: "",
    certifications: "",
    working_days: "",
    email: "",
    phone: "",
  });
  const openEditModal = (admin) => {
    setEditAdminIdentityCard(admin.identity_card);
    setEditAdmin({
      primary_name: admin.primary_name || "",
      secondary_name: admin.secondary_name || "",
      first_surname: admin.first_surname || "",
      second_surname: admin.second_surname || "",
      specialty: admin.specialty || "",
      entry_date: admin.entry_date?.split("T")[0] || "",
      certifications: admin.certifications || "",
      working_days: admin.working_days || "",
      email: admin.contacts?.find((c) => c.contact_type === "EMAIL")?.contact_value || "",
      phone: admin.contacts?.find((c) => c.contact_type === "TELEFONO")?.contact_value || "",
    });
    setShowEditModal(true);
  };
  //controles de modal de dar de baja
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingDeactivationId, setPendingDeactivationId] = useState(null);
  const requestDeactivation = (identityCard) => {
    setPendingDeactivationId(identityCard);
    setShowConfirmModal(true);
  };
  // --- RENDER ---
  return (
    <>
      <div className="ui-toolbar">
        <div className="ui-toolbar-title">Gestión de Administradores</div>

        <div className="ui-toolbar-controls">
          <button className="ui-toolbar-btn" onClick={() => setShowCreateModal(true)}>
            <FaPlus className="ui-toolbar-btn-icon" />
            Nuevo administrador
          </button>
          <div className="ui-toolbar-filter">
            <input
              type="text"
              placeholder="Filtrar por cédula..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdmins.map((a, i) => (
            <tr key={i}>
              <td>{a.identity_card}</td>
              <td>{`${a.primary_name} ${a.first_surname}`}</td>
              <td>{a.specialty}</td>
              <td>
                <span
                  className={`status-label ${
                    a.user.status === "Activo" ? "status-activo" : "status-inactivo"
                  }`}
                >
                  {a.user.status}
                </span>
              </td>
              <td>
                <button className="icon-btn" onClick={() => handleView(a)}>
                  <FaEye />
                </button>
                <button className="icon-btn" onClick={() => openEditModal(a)}>
                  <FaEdit />
                </button>
                <button className="icon-btn" onClick={() => requestDeactivation(a.identity_card)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modales de ver*/}
      {showViewModal && selectedAdmin && (
        <div className="modal-overlay">
          <div className="modal-content xlarge">
            <h2 style={{ marginBottom: "1.5rem", color: "#4a2e2e" }}>Detalles del Administrador</h2>

            {/* 🧍 Información personal */}
            <div
              style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <FaUser style={{ color: "#4a2e2e" }} />
              <h3 style={{ color: "#4a2e2e", margin: 0 }}>Información personal</h3>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div>
                <strong>ID</strong>
                <p>{selectedAdmin.admin_id}</p>
              </div>
              <div>
                <strong>Cédula</strong>
                <p>{selectedAdmin.identity_card}</p>
              </div>
              <div>
                <strong>Nombre completo</strong>
                <p>{`${selectedAdmin.primary_name} ${selectedAdmin.secondary_name || ""} ${selectedAdmin.first_surname} ${selectedAdmin.second_surname || ""}`}</p>
              </div>
            </div>
            {/* 🧠 Información profesional */}
            <div
              style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <FaBriefcase style={{ color: "#4a2e2e" }} />
              <h3 style={{ color: "#4a2e2e", margin: 0 }}>Información profesional</h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div>
                <strong>Especialidad</strong>
                <p>{selectedAdmin.specialty || "—"}</p>
              </div>
              <div>
                <strong>Fecha de ingreso</strong>
                <p>{selectedAdmin.entry_date?.slice(0, 10) || "—"}</p>
              </div>
              <div>
                <strong>Certificaciones</strong>
                <p>{selectedAdmin.certifications || "—"}</p>
              </div>
              <div>
                <strong>Días laborales</strong>
                <p>{selectedAdmin.working_days || "—"}</p>
              </div>
            </div>
            {/* 📞 Contacto */}
            <div
              style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <FaEnvelope style={{ color: "#4a2e2e" }} />
              <h3 style={{ color: "#4a2e2e", margin: 0 }}>Contacto</h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div>
                <strong>Correo electrónico</strong>
                <p>
                  {selectedAdmin.contacts?.find((c) => c.contact_type === "EMAIL")?.contact_value ||
                    "—"}
                </p>
              </div>
              <div>
                <strong>Teléfono</strong>
                <p>
                  {selectedAdmin.contacts?.find((c) => c.contact_type === "TELEFONO")
                    ?.contact_value || "—"}
                </p>
              </div>
            </div>
            {/* 🔐 Datos de usuario */}
            <div
              style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <FaLock style={{ color: "#4a2e2e" }} />
              <h3 style={{ color: "#4a2e2e", margin: 0 }}>Datos de usuario</h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div>
                <strong>Usuario</strong>
                <p>{selectedAdmin.user?.username}</p>
              </div>
              <div>
                <strong>Estado</strong>
                <p>{selectedAdmin.user?.status}</p>
              </div>
              <div>
                <strong>Rol</strong>
                <p>
                  {selectedAdmin.user?.role_id === 1
                    ? "Admin"
                    : selectedAdmin.user?.role_id === 2
                      ? "Cliente"
                      : "Desconocido"}
                </p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={closeViewModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modales de agregar */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content xlarge">
            <h2 style={{ marginBottom: "1.5rem", color: "#4a2e2e" }}>Crear nuevo administrador</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "2rem",
              }}
            >
              {/* 🧍 Datos personales */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#4a2e2e" }}
                >
                  <FaUser />
                  <strong>Datos personales</strong>
                </div>
                <div>
                  <label>Cédula *</label>
                  <input
                    type="text"
                    value={newAdmin.identity_card}
                    onChange={(e) => setNewAdmin({ ...newAdmin, identity_card: e.target.value })}
                  />
                </div>
                <div>
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={newAdmin.primary_name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, primary_name: e.target.value })}
                  />
                </div>
                <div>
                  <label>Segundo nombre</label>
                  <input
                    type="text"
                    value={newAdmin.secondary_name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, secondary_name: e.target.value })}
                  />
                </div>
                <div>
                  <label>Primer apellido *</label>
                  <input
                    type="text"
                    value={newAdmin.first_surname}
                    onChange={(e) => setNewAdmin({ ...newAdmin, first_surname: e.target.value })}
                  />
                </div>
                <div>
                  <label>Segundo apellido *</label>
                  <input
                    type="text"
                    value={newAdmin.second_surname}
                    onChange={(e) => setNewAdmin({ ...newAdmin, second_surname: e.target.value })}
                  />
                </div>
              </div>

              {/* 🧠 Datos profesionales */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#4a2e2e" }}
                >
                  <FaBriefcase />
                  <strong>Datos profesionales</strong>
                </div>

                <div>
                  <label>Fecha de ingreso</label>
                  <input
                    type="date"
                    value={newAdmin.entry_date}
                    onChange={(e) => setNewAdmin({ ...newAdmin, entry_date: e.target.value })}
                  />
                </div>

                <div>
                  <label>Especialidad</label>
                  <textarea
                    rows="2"
                    value={newAdmin.specialty}
                    onChange={(e) => setNewAdmin({ ...newAdmin, specialty: e.target.value })}
                    placeholder="Ej: Gestión, Administración, etc."
                  />
                </div>

                <div>
                  <label>Certificaciones</label>
                  <textarea
                    rows="3"
                    value={newAdmin.certifications}
                    onChange={(e) => setNewAdmin({ ...newAdmin, certifications: e.target.value })}
                    placeholder="Ej: ISO 9001, PMP, etc."
                  />
                </div>

                <div>
                  <label>Días laborales</label>
                  <textarea
                    rows="2"
                    value={newAdmin.working_days}
                    onChange={(e) => setNewAdmin({ ...newAdmin, working_days: e.target.value })}
                    placeholder="Ej: Lunes a Viernes"
                  />
                </div>
              </div>

              {/* 📞 Contacto */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#4a2e2e" }}
                >
                  <FaEnvelope />
                  <strong>Contacto</strong>
                </div>
                <div>
                  <label>Correo electrónico</label>
                  <input
                    type="text"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  />
                </div>
                <div>
                  <label>Teléfono *</label>
                  <input
                    type="text"
                    value={newAdmin.phone}
                    onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* 🔐 Usuario */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#4a2e2e" }}
                >
                  <FaLock />
                  <strong>Usuario</strong>
                </div>
                <div>
                  <label>Nombre de usuario *</label>
                  <input
                    type="text"
                    value={newAdmin.username}
                    onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                  />
                </div>
                <div>
                  <label>Contraseña *</label>
                  <input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <p>Los campos marcados con * son obligatorios.</p>
            <div className="modal-actions">
              <button
                className="modal-btn confirm"
                onClick={() => {
                  const payload = { ...newAdmin, role_id: 1 };
                  handleCreateAdmin(payload);
                }}
              >
                Crear
              </button>
              <button className="modal-btn cancel" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de editar */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content xlarge">
            <h2 style={{ marginBottom: "1.5rem", color: "#4a2e2e" }}>Editar administrador</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "2rem",
              }}
            >
              {/* 🧍 Datos personales */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#4a2e2e" }}
                >
                  <FaUser />
                  <strong>Datos personales</strong>
                </div>
                <div>
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={editAdmin.primary_name}
                    onChange={(e) => setEditAdmin({ ...editAdmin, primary_name: e.target.value })}
                  />
                </div>
                <div>
                  <label>Segundo nombre</label>
                  <input
                    type="text"
                    value={editAdmin.secondary_name}
                    onChange={(e) => setEditAdmin({ ...editAdmin, secondary_name: e.target.value })}
                  />
                </div>
                <div>
                  <label>Primer apellido</label>
                  <input
                    type="text"
                    value={editAdmin.first_surname}
                    onChange={(e) => setEditAdmin({ ...editAdmin, first_surname: e.target.value })}
                  />
                </div>
                <div>
                  <label>Segundo apellido</label>
                  <input
                    type="text"
                    value={editAdmin.second_surname}
                    onChange={(e) => setEditAdmin({ ...editAdmin, second_surname: e.target.value })}
                  />
                </div>
              </div>

              {/* 🧠 Datos profesionales */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#4a2e2e" }}
                >
                  <FaBriefcase />
                  <strong>Datos profesionales</strong>
                </div>
                <div>
                  <label>Fecha de ingreso</label>
                  <input
                    type="date"
                    value={editAdmin.entry_date}
                    max={new Date().toISOString().split("T")[0]} // 🔒 Limita al día actual
                    onChange={(e) => setEditAdmin({ ...editAdmin, entry_date: e.target.value })}
                  />
                </div>
                <div>
                  <label>Especialidad</label>
                  <textarea
                    rows="2"
                    value={editAdmin.specialty}
                    onChange={(e) => setEditAdmin({ ...editAdmin, specialty: e.target.value })}
                  />
                </div>
                <div>
                  <label>Certificaciones</label>
                  <textarea
                    rows="2"
                    value={editAdmin.certifications}
                    onChange={(e) => setEditAdmin({ ...editAdmin, certifications: e.target.value })}
                  />
                </div>
                <div>
                  <label>Días laborales</label>
                  <textarea
                    rows="2"
                    value={editAdmin.working_days}
                    onChange={(e) => setEditAdmin({ ...editAdmin, working_days: e.target.value })}
                  />
                </div>
              </div>

              {/* 📞 Contacto */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#4a2e2e" }}
                >
                  <FaEnvelope />
                  <strong>Contacto</strong>
                </div>
                <div>
                  <label>Correo electrónico</label>
                  <input
                    type="text"
                    value={editAdmin.email}
                    onChange={(e) => setEditAdmin({ ...editAdmin, email: e.target.value })}
                  />
                </div>
                <div>
                  <label>Teléfono</label>
                  <input
                    type="text"
                    value={editAdmin.phone}
                    onChange={(e) => setEditAdmin({ ...editAdmin, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="modal-btn confirm"
                onClick={() => handleUpdateAdmin(editAdminIdentityCard, editAdmin)}
              >
                Guardar cambios
              </button>
              <button className="modal-btn cancel" onClick={() => setShowEditModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de confirmar dar de baja */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content medium">
            <h3>¿Estás seguro que deseas dar de baja al administrador?</h3>
            <p>Esta acción no se puede deshacer.</p>
            <div className="modal-actions">
              <button
                className="modal-btn confirm"
                onClick={async () => {
                  await handleDeactivate(pendingDeactivationId);
                  setShowConfirmModal(false);
                  setPendingDeactivationId(null);
                }}
              >
                Sí, dar de baja
              </button>
              <button
                className="modal-btn cancel"
                onClick={() => {
                  setShowConfirmModal(false);
                  setPendingDeactivationId(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageAdmins;
