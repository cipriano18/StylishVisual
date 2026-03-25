import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaFilter, FaUserCheck } from "react-icons/fa";

import { getPageNumbers } from "../../utils/pagination.js";
//CSS
import "../../styles/Ui-Toolbar_CSS/Ui-toolbar.css";
import "../../styles/Table_CSS/TableBase.css";
import "../../styles/Modals_CSS/modalBase.css";

//Servicios
import { fetchUsers, updateUser } from "../../services/Serv_users";

function ManageUsers() {
  //Paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [pendingReactivateUser, setPendingReactivateUser] = useState(null);

  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    username: "",
    role: "",
    status: "",
  });
  const [filteredUsers, setFilteredUsers] = useState([]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
    const cargarUsuarios = async () => {
      const data = await fetchUsers();
      if (Array.isArray(data)) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        toast.error(data.error || "Hubo un error al cargar la lista de usuarios");
      }
    };
    cargarUsuarios();
  }, []);

  // Filtrado automático
  useEffect(() => {
    const filtered = users.filter((user) => {
      const fullName =
        `${user.primary_name} ${user.secondary_name} ${user.first_surname} ${user.second_surname}`.toLowerCase();
      return (
        (filters.username === "" ||
          fullName.includes(filters.username.toLowerCase()) ||
          user.username.toLowerCase().includes(filters.username.toLowerCase())) &&
        (filters.role === "" || user.role === filters.role) &&
        (filters.status === "" || user.status === filters.status)
      );
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [filters, users]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getFullName = (user) => {
    return [user.primary_name, user.secondary_name, user.first_surname, user.second_surname]
      .filter(Boolean)
      .join(" ");
  };

  const handleReactivate = async (user) => {
    const res = await updateUser(user.user_id, { status: "A" });
    if (res?.error) {
      toast.error(res.error || "Error al reactivar el usuario");
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.user_id === user.user_id ? { ...u, status: "Activo" } : u))
      );
      toast.success(`${getFullName(user)} fue reactivado correctamente`);
    }
  };

  return (
    <>
      <div className="manage-users-container">
        <div className="ui-toolbar">
          <h1 className="ui-toolbar-title">Gestión de Usuarios</h1>

          <div className="ui-toolbar-controls">
            {/* Filtros desktop */}
            <div className="ui-toolbar-filter ui-toolbar-filter-desktop">
              <label>Nombre:</label>
              <input
                type="text"
                name="username"
                placeholder="Filtrar por nombre"
                value={filters.username}
                onChange={handleFilterChange}
              />
              <label>Rol:</label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="ui-toolbar-select"
              >
                <option value="">Todos</option>
                <option value="Cliente">Cliente</option>
                <option value="Administrador">Administrador</option>
              </select>
              <label>Estado:</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="ui-toolbar-select"
              >
                <option value="">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            {/* Botón filtro - móvil/tablet */}
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
                    <label>Nombre:</label>
                    <input
                      type="text"
                      name="username"
                      placeholder="Filtrar por nombre"
                      value={filters.username}
                      onChange={handleFilterChange}
                    />
                    <label>Rol:</label>
                    <select
                      name="role"
                      value={filters.role}
                      onChange={handleFilterChange}
                      className="ui-toolbar-select"
                    >
                      <option value="">Todos</option>
                      <option value="Cliente">Cliente</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                    <label>Estado:</label>
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="ui-toolbar-select"
                    >
                      <option value="">Todos</option>
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="ui-table-wrapper">
          {filteredUsers.length > 0 ? (
            <table className="ui-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user) => (
                  <tr key={user.user_id}>
                    <td data-label="Nombre">{getFullName(user)}</td>
                    <td data-label="Usuario">{user.username}</td>
                    <td data-label="Rol">{user.role}</td>
                    <td data-label="Estado">
                      <span className={`status-label status-${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td data-label="Acciones">
                      {user.status === "Inactivo" && (
                        <button
                          className="icon-btn-text"
                          onClick={() => {
                            setPendingReactivateUser(user);
                            setShowReactivateModal(true);
                          }}
                          title="Reactivar usuario"
                        >
                          <FaUserCheck />
                          Reactivar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-info">No se encontraron usuarios</p>
          )}
        </div>
        {totalPages > 1 && (
          <div className="ui-pagination">
            <button
              className="ui-pagination-btn"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            {getPageNumbers(currentPage, totalPages).map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="ui-pagination-ellipsis">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  className={`ui-pagination-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="ui-pagination-btn"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
      {showReactivateModal && (
        <div className="modal-overlay">
          <div className="modal-content medium">
            <h3>¿Reactivar usuario?</h3>
            <p>
              ¿Estás seguro que deseas reactivar a{" "}
              <strong>{getFullName(pendingReactivateUser)}</strong>?
            </p>
            <div className="modal-actions">
              <button
                className="modal-btn confirm"
                onClick={async () => {
                  await handleReactivate(pendingReactivateUser);
                  setShowReactivateModal(false);
                  setPendingReactivateUser(null);
                }}
              >
                Sí, reactivar
              </button>
              <button
                className="modal-btn cancel"
                onClick={() => {
                  setShowReactivateModal(false);
                  setPendingReactivateUser(null);
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

export default ManageUsers;
