import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Outlet, NavLink } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { FaBookOpen, FaCalendarAlt, FaHome, FaUserCircle, FaSignOutAlt } from "react-icons/fa";

import "../styles/Sidebar_CSS/sidebar.css";
import Logo from "../assets/Stylish_Logo_White.png";
import { fetchClientProfile } from "../services/Serv_profiles";
import { buildDisplayName } from "../utils/profile";

export default function ClientLayout() {
  const [nombreUsuario, setNombreUsuario] = useState("Cargando...");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loadClientProfile = async () => {
      try {
        const response = await fetchClientProfile();
        if (!response?.client) {
          setNombreUsuario("Cliente");
          return;
        }

        setNombreUsuario(buildDisplayName(response.client, "Cliente"));
      } catch (error) {
        console.error("Error cargando perfil cliente:", error);
        setNombreUsuario("Cliente");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadClientProfile();
  }, []);

  const handleToggleMenu = () => {
    setMenuOpen((currentValue) => !currentValue);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="admin-layout">
      {createPortal(
        <button className={`hamburger-btn ${menuOpen ? "open" : ""}`} onClick={handleToggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>,
        document.body
      )}

      {menuOpen &&
        createPortal(
          <>
            <div className="hamburger-overlay" onClick={handleCloseMenu} />
            <div className="hamburger-menu">
              <nav>
                <ul>
                  <li>
                    <NavLink
                      to="/client/home"
                      onClick={handleCloseMenu}
                      className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                      <FaHome className="sidebar-icon" /> Inicio
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/client/appointments"
                      onClick={handleCloseMenu}
                      className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                      <FaCalendarAlt className="sidebar-icon" /> Citas
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/client/schedule"
                      onClick={handleCloseMenu}
                      className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                      <FaBookOpen className="sidebar-icon" /> Mi Agenda
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/client/profile"
                      onClick={handleCloseMenu}
                      className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                      <FaUserCircle className="sidebar-icon" /> Perfil
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/login" onClick={handleCloseMenu}>
                      <FaSignOutAlt className="sidebar-icon" /> Cerrar sesiÃ³n
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>
          </>,
          document.body
        )}

      <aside className="sidebar">
        <div className="sidebar-logo">
          <NavLink to="/">
            <img src={Logo} alt="Logo" className="logo-sidebar" />
          </NavLink>
        </div>

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
            <li className="sidebar-profile-mobile">
              <NavLink
                to="/client/profile"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <span className="sidebar-icon">
                  <FaUserCircle />
                </span>
                Perfil
              </NavLink>
              <NavLink to="/login" className={({ isActive }) => (isActive ? "active-link" : "")}>
                <span className="sidebar-icon">
                  <FaSignOutAlt />
                </span>
              </NavLink>
            </li>
          </ul>
        </nav>

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
