import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Outlet, NavLink, Link } from "react-router-dom";
import axios from "axios";

import "../styles/Sidebar_CSS/sidebar.css";
import Logo from "../assets/Stylish_Logo_White.png";

import { Toaster } from "react-hot-toast";
import { API_BASE } from "../services/config";

// Íconos
import {
  FaUserShield,
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

export default function AdminLayout() {
  const [openCitas, setOpenCitas] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 👈 nuevo estado
  const [nombreUsuario, setNombreUsuario] = useState("Cargando...");
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setNombreUsuario("Administrador");
          return;
        }

        const res = await axios.get(`${API_BASE}/profile/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const admin = res.data.admin;

        setNombreUsuario(`${admin.primary_name} ${admin.first_surname}`);
      } catch (error) {
        console.error("Error cargando perfil admin:", error);
        setNombreUsuario("Administrador");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchAdminProfile();
  }, []);

  return (
    <div className="admin-layout">
      {/* ✅ BOTÓN HAMBURGUESA - solo visible en móvil/tablet */}
      {createPortal(
        <button
          className={`hamburger-btn ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>,
        document.body // 👈 se renderiza directo en el body, fuera del layout
      )}

      {/* ✅ OVERLAY - fondo oscuro al abrir */}
      {menuOpen && <div className="hamburger-overlay" onClick={() => setMenuOpen(false)} />}

      {/* ✅ MENÚ CENTRADO */}
      {menuOpen && (
        <div className="hamburger-menu">
          <nav>
            <ul>
              <li>
                <button
                  className={`sidebar-toggle ${openCitas ? "active-link" : ""}`}
                  onClick={() => setOpenCitas(!openCitas)}
                >
                  <FaCalendarAlt className="sidebar-icon" />
                  <span>Gestión de citas</span>
                  <span className="sidebar-arrow">
                    {openCitas ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                </button>
                {openCitas && (
                  <ul className="hamburger-submenu">
                    <li>
                      <NavLink
                        to="/admin/appointments"
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) => (isActive ? "active-link" : "")}
                      >
                        <FaRegCalendarPlus className="sidebar-icon" /> Citas
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/admin/schedule"
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) => (isActive ? "active-link" : "")}
                      >
                        <FaBookOpen className="sidebar-icon" /> Agenda
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <NavLink
                  to="/admin/users"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaUsers className="sidebar-icon" /> Gestión de Usuarios
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/roles"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaUserShield className="sidebar-icon" /> Gestión de Roles
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/admins"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaUserTie className="sidebar-icon" /> Gestión de Administradores
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/service"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaSpa className="sidebar-icon" /> Gestión de Servicios
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/portfolio"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaImages className="sidebar-icon" /> Gestión de Portafolio
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/sales"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaTags className="sidebar-icon" /> Gestión de Ventas
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/payable"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaMoneyBillWave className="sidebar-icon" /> Cuentas por Pagar
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/suppliers"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaTruck className="sidebar-icon" /> Gestión de Proveedores
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/reports"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaChartBar className="sidebar-icon" /> Reportes & Gráficos
                </NavLink>
              </li>
              {/* Perfil y salir */}
              <li>
                <NavLink
                  to="/admin/profile"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  <FaUserCircle className="sidebar-icon" /> Perfil
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                  <FaSignOutAlt className="sidebar-icon" /> Cerrar sesión
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="sidebar">
        {/* LOGO */}
        <div className="sidebar-logo">
          <Link to="/">
            <img src={Logo} alt="Logo" className="logo-sidebar" />
          </Link>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="sidebar-nav">
          <ul>
            {/* Citas */}
            <li>
              <button
                className={`sidebar-toggle ${openCitas ? "active-link" : ""}`}
                onClick={() => setOpenCitas(!openCitas)}
              >
                <FaCalendarAlt className="sidebar-icon" />
                <span className="sidebar-text">Gestión de citas</span>
                <span className="sidebar-arrow">
                  {openCitas ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              </button>

              {openCitas && (
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/admin/appointments"
                      className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                      <FaRegCalendarPlus className="sidebar-icon" />
                      Citas
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/schedule"
                      className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                      <FaBookOpen className="sidebar-icon" />
                      Agenda
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            {/* Usuarios y Roles */}
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
                to="/admin/roles"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <FaUserShield className="sidebar-icon" />
                Gestión de Roles de usuario
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
            {/* Servicios y Portafolio */}
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
            {/* Ventas y Finanzas */}
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
            {/* Proveedores */}
            <li>
              <NavLink
                to="/admin/suppliers"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <FaTruck className="sidebar-icon" />
                Gestión de Proveedores
              </NavLink>
            </li>
            {/* Reportes */}
            <li>
              <NavLink
                to="/admin/reports"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <FaChartBar className="sidebar-icon" />
                Reportes & Gráficos
              </NavLink>
            </li>

            {/* Opciones fantasma solo para móvil */}
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
              <NavLink to="/login" className={({ isActive }) => (isActive ? "active-link" : "")}>
                <span className="sidebar-icon">
                  <FaSignOutAlt />
                </span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* PERFIL */}
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

      {/* CONTENIDO */}
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
