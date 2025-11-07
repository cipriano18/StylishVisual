import { Outlet, NavLink, Link } from "react-router-dom";
import "../styles/Sidebar_CSS/sidebar.css";
import Logo from "../assets/Stylish_Logo_White.png";

import { Toaster } from "react-hot-toast";
// Íconos
import {
  FaUserShield,
  FaUserTie,
  FaUsers,
  FaTruck,
  FaMoneyBillWave,
  FaUserCircle,
} from "react-icons/fa";

export default function AdminLayout() {
  const nombreUsuario = "Makin Artavia"; // Puedes reemplazar esto por una variable dinámica

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">

        {/* 🔹 Imagen con enlace al inicio */}
        <div className="sidebar-logo">
          <Link to="/">
            <img
              src={Logo}
              alt="Logo"
              className="logo-sidebar"
            />
          </Link>
        </div>

        {/* 🔹 Navegación principal */}
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/admin/roles" className={({ isActive }) => isActive ? "active-link" : ""}>
                <FaUserShield className="sidebar-icon" />
                Gestión de roles de usuario
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/admins" className={({ isActive }) => isActive ? "active-link" : ""}>
                <FaUserTie className="sidebar-icon" />
                Gestión de Administradores
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" className={({ isActive }) => isActive ? "active-link" : ""}>
                <FaUsers className="sidebar-icon" />
                Gestión de Usuarios
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/suppliers" className={({ isActive }) => isActive ? "active-link" : ""}>
                <FaTruck className="sidebar-icon" />
                Gestión de Proveedores
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/payable" className={({ isActive }) => isActive ? "active-link" : ""}>
                <FaMoneyBillWave className="sidebar-icon" />
                Gestión de Cuentas por Pagar
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* 🔹 Sección de perfil al pie */}
      <div className="sidebar-profile">
        <NavLink to="/admin/profile" className="profile-link">
          <FaUserCircle className="sidebar-icon" />
          <div className="profile-text">
            <span className="profile-name">{nombreUsuario}</span>
            <span className="profile-edit">Editar perfil</span>
          </div>
        </NavLink>
      </div>
      </aside>

      {/* Contenido dinámico */}
      <main className="admin-content">
        <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#ba8282",
            color: "#fff",
            borderRadius: "12px",
            fontFamily: "Poppins, sans-serif",
            zIndex: 9999
          },
        }}
      />
        <Outlet />
      </main>
    </div>

  );
}
