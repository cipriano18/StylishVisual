import { useState, useEffect } from "react";
import "../../styles/Ui-Toolbar_CSS/Ui-toolbar.css";
import "../../styles/Table_CSS/TableBase.css";
import "../../styles/Modals_CSS/modalBase.css";
import { fetchUsers } from "../../services/Serv_users";
import { toast } from "react-hot-toast";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    user_id: "",
    username: "",
    role_id: "",
    status: "",
  });
  const [filteredUsers, setFilteredUsers] = useState([]);

  // --- Cargar usuarios desde la API ---
  useEffect(() => {
    const cargarUsuarios = async () => {
      const data = await fetchUsers();
      if (Array.isArray(data)) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error("No se pudo cargar la lista de usuarios, algún problema de red o con la API.");
        toast.error(data.error || "Hubo un error al cargar la lista de usuarios");
      }
    };
    cargarUsuarios();
  }, []);

  // --- Filtrado automático ---
  useEffect(() => {
    const filtered = users.filter((user) => {
      return (
        (filters.user_id === "" ||
          user.user_id.toString().includes(filters.user_id)) &&
        (filters.username === "" ||
          user.username.toLowerCase().includes(filters.username.toLowerCase())) &&
        (filters.role_id === "" ||
          user.role_id.toString().includes(filters.role_id)) &&
        (filters.status === "" ||
          user.status.toLowerCase().includes(filters.status.toLowerCase()))
      );
    });
    setFilteredUsers(filtered);
  }, [filters, users]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="manage-users-container">
      {/* 🔹 Toolbar modular */}
      <div className="ui-toolbar">
        <h1 className="ui-toolbar-title">Gestión de Usuarios</h1>

        <div className="ui-toolbar-controls">
          <div className="ui-toolbar-filter">
            <input
              type="text"
              name="user_id"
              placeholder="Filtrar por ID"
              value={filters.user_id}
              onChange={handleFilterChange}
            />
          </div>
          <div className="ui-toolbar-filter">
            <input
              type="text"
              name="username"
              placeholder="Filtrar por nombre"
              value={filters.username}
              onChange={handleFilterChange}
            />
          </div>
          <div className="ui-toolbar-filter">
            <input
              type="text"
              name="role_id"
              placeholder="Filtrar por rol"
              value={filters.role_id}
              onChange={handleFilterChange}
            />
          </div>
          <div className="ui-toolbar-filter">
            <input
              type="text"
              name="status"
              placeholder="Filtrar por estado"
              value={filters.status}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* 🔹 Tabla modular */}
      <div className="ui-table-wrapper">
        {filteredUsers.length > 0 ? (
          <table className="ui-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre de Usuario</th>
                <th>ID Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.username}</td>
                  <td>{user.role_id}</td>
                  <td>
                    <span className={`status-label status-${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-info">No se encontraron usuarios</p>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;