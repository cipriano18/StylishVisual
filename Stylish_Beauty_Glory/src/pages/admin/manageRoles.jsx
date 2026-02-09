import { useState, useEffect } from "react";
import "../../styles/Modals_CSS/modalBase.css";
import "../../styles/Table_CSS/TableBase.css";
import "../../styles/Ui-Toolbar_CSS/Ui-toolbar.css";

import { createRole, deleteRole, updateRole, fetchRoles } from "../../services/Serv_roles";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-hot-toast";


function ManageRoles() {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal agregar
  const [showModal, setShowModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  // Modal eliminar
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  // Edición
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");

  // Cargar roles
  useEffect(() => {
    const cargarRoles = async () => {
      const data = await fetchRoles();
      if (Array.isArray(data)) {
        setRoles(data);
        setFilteredRoles(data);
      } else {
        console.error("Error cargando roles:", data);
        toast.error("Hubo un error al cargar todos los roles");
      }
    };
    cargarRoles();
  }, []);

  // Filtrar por ID
  useEffect(() => {
    const term = parseInt(searchTerm);
    if (isNaN(term)) {
      setFilteredRoles(roles);
    } else {
      setFilteredRoles(roles.filter(r => r.role_id === term));
    }
  }, [searchTerm, roles]);

  // Agregar rol
  const handleAddRole = async () => {
    const nombreLimpio = newRoleName.trim();
    if (!nombreLimpio) {
      toast.error("Por favor escribe un nombre válido");
      return;
    }

    try {
      const data = await createRole(nombreLimpio);
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setRoles(prev => [...prev, data]);
      setFilteredRoles(prev => [...prev, data]);
      toast.success(`Rol creado: ${data.name}`);
      setNewRoleName("");
      setShowModal(false);
    } catch (error) {
      toast.error("Error de red al crear el rol");
    }
  };

  // Eliminar rol
  const handleDeleteRole = async () => {
    if (!roleToDelete) return;

    try {
      const data = await deleteRole(roleToDelete.role_id);
      if (data.error) {
        toast.error(data.error);
        return;
      }

      const updatedRoles = roles.filter(r => r.role_id !== roleToDelete.role_id);
      setRoles(updatedRoles);
      setFilteredRoles(updatedRoles);
      setRoleToDelete(null);
      setShowDeleteModal(false);
      toast.success(data.mensaje || "Rol eliminado correctamente");
    } catch (error) {
      toast.error("Error de red al eliminar el rol");
    }
  };

  // Activar edición
  const startEditing = (role) => {
    setEditingId(role.role_id);
    setEditedName(role.name);
  };

  // Guardar edición
  const saveEdit = async () => {
    const nombreLimpio = editedName.trim();
    if (!nombreLimpio || !editingId) return;

    try {
      const data = await updateRole(editingId, nombreLimpio);
      if (data.error) {
        toast.error(data.error);
        return;
      }

      const updatedRoles = roles.map(r =>
        r.role_id === editingId ? { ...r, name: data.name } : r
      );
      setRoles(updatedRoles);
      setFilteredRoles(updatedRoles);
      setEditingId(null);
      setEditedName("");
      toast.success(`Rol actualizado: Id: ${data.role_id} Nombre: ${data.name}`);
    } catch (error) {
      toast.error("Error de red al editar el rol");
    }
  };

  // Confirmar eliminación
  const confirmDelete = (role) => {
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  return (
    <>
      <div className="ui-toolbar">
        <h1 className="ui-toolbar-title">Gestión de roles de usuario</h1>
        <div className="ui-toolbar-controls">
          <button className="ui-toolbar-btn" onClick={() => setShowModal(true)}>
            <FaPlus className="ui-toolbar-btn-icon" />
            Nuevo Rol
          </button>
          <div className="ui-toolbar-filter">
            <input
              type="text"
              placeholder="Filtrar por ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabla de roles */}
      <div className="table-list">
        {filteredRoles.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr key={role.role_id}>
                  <td>{role.role_id}</td>
                  <td>
                    {editingId === role.role_id ? (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                        autoFocus
                      />
                    ) : (
                      role.name
                    )}
                  </td>
                  <td>
                    <button
                      className="icon-btn edit"
                      title="Editar"
                      onClick={() => startEditing(role)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-btn delete"
                      title="Eliminar"
                      onClick={() => confirmDelete(role)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-info">No se encontraron roles</p>
        )}
      </div>

      {/* Modal agregar */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <h2>Agregar nuevo rol</h2>
            <input
              type="text"
              placeholder="Nombre del rol"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
            <div className="modal-actions">
              <button className="modal-btn confirm" onClick={handleAddRole}>Agregar</button>
              <button className="modal-btn cancel" onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content medium">
            <h2>¿Eliminar rol?</h2>
            <p>¿Estás seguro de que deseas eliminar el rol <strong>{roleToDelete?.name}</strong>?</p>
            <div className="modal-actions">
              <button className="modal-btn confirm" onClick={handleDeleteRole}>Sí, eliminar</button>
              <button className="modal-btn cancel" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageRoles;






