import { Outlet, NavLink } from "react-router-dom";
import "../styles/Sidebar_CSS/sidebar.css";
import Logo from "../assets/Stylish_Logo_White.png";
import { FaUser, FaBookOpen, FaCalendarAlt, FaHome } from "react-icons/fa";

import { Toaster } from "react-hot-toast";

// Íconos
import {
  FaUserCircle,
} from "react-icons/fa";

export default function ClientLayout() {
  const nombreUsuario = "Makin Artavia";
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* 🔹 Logo */}
        <div className="sidebar-logo">
          <NavLink to="/">
            <img
              src={Logo}
              alt="Logo"
              className="logo-sidebar"
            />
          </NavLink>
        </div>

        {/* 🔹 Navegación */}
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink
                to="/client/myDetails"
                className={({ isActive }) => isActive ? "active-link" : ""}
              >
                <span className="sidebar-icon"><FaHome /></span>
                Inicio
              </NavLink>
                            <NavLink
                to="/client/myDetails"
                className={({ isActive }) => isActive ? "active-link" : ""}
              >
                <span className="sidebar-icon"><FaCalendarAlt /></span>
                Citas
              </NavLink>
              <NavLink
                to="/client/myDetails"
                className={({ isActive }) => isActive ? "active-link" : ""}
              >
                <span className="sidebar-icon"><FaBookOpen /></span>
                Mi Agenda
              </NavLink>
            </li>
            {/* Puedes agregar más enlaces aquí */}
          </ul>
        </nav>

        {/* 🔹 Sección de perfil al pie */}
        <div className="sidebar-profile">
          <NavLink to="/client/profile" className="profile-link">
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