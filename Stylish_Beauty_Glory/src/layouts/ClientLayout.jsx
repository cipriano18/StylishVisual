import { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import axios from "axios";

import "../styles/Sidebar_CSS/sidebar.css";
import Logo from "../assets/Stylish_Logo_White.png";

import { Toaster } from "react-hot-toast";
import { API_BASE } from "../services/config";

// Íconos
import { FaBookOpen, FaCalendarAlt, FaHome, FaUserCircle } from "react-icons/fa";

export default function ClientLayout() {
  /* ===============================
     🔹 Estado del cliente
     =============================== */
  const [nombreUsuario, setNombreUsuario] = useState("Cargando...");
  const [loadingProfile, setLoadingProfile] = useState(true);

  /* ===============================
     🔄 Cargar perfil cliente
     =============================== */
  useEffect(() => {
    const fetchClientProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setNombreUsuario("Cliente");
          return;
        }

        const res = await axios.get(`${API_BASE}/profile/client`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const client = res.data.client;

        setNombreUsuario(`${client.primary_name} ${client.first_surname}`);
      } catch (error) {
        console.error("Error cargando perfil cliente:", error);
        setNombreUsuario("Cliente");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchClientProfile();
  }, []);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <NavLink to="/">
            <img src={Logo} alt="Logo" className="logo-sidebar" />
          </NavLink>
        </div>

        {/* Navegación */}
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink
                to="/client/home"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <span className="sidebar-icon">
                  <FaHome />
                </span>
                Inicio
              </NavLink>

              <NavLink
                to="/client/appointments"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <span className="sidebar-icon">
                  <FaCalendarAlt />
                </span>
                Citas
              </NavLink>

              <NavLink
                to="/client/schedule"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <span className="sidebar-icon">
                  <FaBookOpen />
                </span>
                Mi Agenda
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Perfil */}
        <div className="sidebar-profile">
          <NavLink to="/client/profile" className="profile-link">
            <FaUserCircle className="sidebar-icon" />
            <div className="profile-text">
              <span className="profile-name">{loadingProfile ? "Cargando..." : nombreUsuario}</span>
              <span className="profile-edit">Editar perfil</span>
            </div>
          </NavLink>
        </div>
      </aside>

      {/* Contenido */}
      <main className="admin-content">
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#ba8282",
              color: "#fff",
              borderRadius: "12px",
              fontFamily: "Poppins, sans-serif",
              zIndex: 9999,
            },
          }}
        />
        <Outlet />
      </main>
    </div>
  );
}
