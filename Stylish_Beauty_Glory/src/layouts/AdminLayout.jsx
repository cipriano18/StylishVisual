import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Outlet, NavLink, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  FaUserTie,
  FaUsers,
  FaTruck,
  FaMoneyBillWave,
  FaUserCircle,
  FaSpa,
  FaImages,
  FaTags,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronRight,
  FaBookOpen,
  FaRegCalendarPlus,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";

import "../styles/Sidebar_CSS/sidebar.css";
import Logo from "../assets/Stylish_Logo_White.png";
import { fetchAdminProfile } from "../services/Serv_profiles";
import { buildDisplayName } from "../utils/profile";

function AdminAppointmentLinks({ openCitas, onToggle, onNavigate, isMobile = false }) {
  const subMenuClassName = isMobile ? "hamburger-submenu" : "sidebar-submenu";

  return (
    <li>
      <button className={`sidebar-toggle ${openCitas ? "active-link" : ""}`} onClick={onToggle}>
        <FaCalendarAlt className="sidebar-icon" />
        <span className={isMobile ? undefined : "sidebar-text"}>Gestión de citas</span>
        <span className="sidebar-arrow">{openCitas ? <FaChevronDown /> : <FaChevronRight />}</span>
      </button>

      {openCitas && (
        <ul className={subMenuClassName}>
          <li>
            <NavLink
              to="/admin/appointments"
              onClick={onNavigate}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaRegCalendarPlus className="sidebar-icon" />
              Citas
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/schedule"
              onClick={onNavigate}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaBookOpen className="sidebar-icon" />
              Agenda
            </NavLink>
          </li>
        </ul>
      )}
    </li>
  );
}

export default function AdminLayout() {
  const [openCitas, setOpenCitas] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("Cargando...");
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const loadAdminProfile = async () => {
      try {
        const response = await fetchAdminProfile();
        if (!response?.admin) {
          setNombreUsuario("Administrador");
          return;
        }

        setNombreUsuario(buildDisplayName(response.admin, "Administrador"));
      } catch (error) {
        console.error("Error cargando perfil admin:", error);
        setNombreUsuario("Administrador");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadAdminProfile();
  }, []);

  const handleToggleMenu = () => {
    setMenuOpen((currentValue) => !currentValue);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleToggleAppointments = () => {
    setOpenCitas((currentValue) => !currentValue);
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

      {menuOpen && <div className="hamburger-overlay" onClick={handleCloseMenu} />}

      {menuOpen && (
        <div className="hamburger-menu">
          <nav>
            <ul>
              <AdminAppointmentLinks
                openCitas={openCitas}
                onToggle={handleToggleAppointments}
                onNavigate={handleCloseMenu}
                isMobile
              />
              <li>
                <NavLink
                  to="/admin/users"
                  onClick={handleCloseMenu}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaUsers className="sidebar-icon" /> Gestión de Usuarios
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/admins"
                  onClick={handleCloseMenu}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaUserTie className="sidebar-icon" /> Gestión de Administradores
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/service"
                  onClick={handleCloseMenu}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaSpa className="sidebar-icon" /> Gestión de Servicios
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/portfolio"
                  onClick={handleCloseMenu}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaImages className="sidebar-icon" /> Gestión de Portafolio
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/sales"
                  onClick={handleCloseMenu}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaTags className="sidebar-icon" /> Gestión de Ventas
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/payable"
                  onClick={handleCloseMenu}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaMoneyBillWave className="sidebar-icon" /> Cuentas por Pagar
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/suppliers"
                  onClick={handleCloseMenu}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaTruck className="sidebar-icon" /> Gestión de Proveedores
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/reports"
                  onClick={handleCloseMenu}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaChartBar className="sidebar-icon" /> Reportes & Gráficos
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/profile"
                  onClick={handleCloseMenu}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaUserCircle className="sidebar-icon" /> Perfil
                </NavLink>
              </li>
              <li>
                <NavLink to="/" onClick={handleCloseMenu}>
                  <FaSignOutAlt className="sidebar-icon" /> Cerrar sesión
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      )}

      <aside className="sidebar">
        <div className="sidebar-logo">
          <Link to="/">
            <img src={Logo} alt="Logo" className="logo-sidebar" />
          </Link>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <AdminAppointmentLinks
              openCitas={openCitas}
              onToggle={handleToggleAppointments}
              onNavigate={handleCloseMenu}
            />
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <FaUsers className="sidebar-icon" />
                Gestión de Usuarios
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/admins"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <FaUserTie className="sidebar-icon" />
                Gestión de Administradores
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/service"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <FaSpa className="sidebar-icon" />
                Gestión de Servicios
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/portfolio"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <FaImages className="sidebar-icon" />
                Gestión de Portafolio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/sales"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <FaTags className="sidebar-icon" />
                Gestión de Ventas
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/payable"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <FaMoneyBillWave className="sidebar-icon" />
                Gestión de Cuentas por Pagar
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/suppliers"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <FaTruck className="sidebar-icon" />
                Gestión de Proveedores
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/reports"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <FaChartBar className="sidebar-icon" />
                Reportes & Gráficos
              </NavLink>
            </li>
            <li className="sidebar-profile-mobile">
              <NavLink
                to="/admin/profile"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <span className="sidebar-icon">
                  <FaUserCircle />
                </span>
              </NavLink>
            </li>
            <li className="sidebar-leave-mobile">
              <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
                <span className="sidebar-icon">
                  <FaSignOutAlt />
                </span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-profile">
          <NavLink to="/admin/profile" className="profile-link">
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
