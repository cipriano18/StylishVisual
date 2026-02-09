import { useEffect, useState } from "react";
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
} from "react-icons/fa";

export default function AdminLayout() {
  const [openCitas, setOpenCitas] = useState(false);

  /* ===============================
     🔹 Estado del admin
     =============================== */
  const [nombreUsuario, setNombreUsuario] = useState("Cargando...");
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  /* ===============================
     🔄 Cargar perfil admin
     =============================== */
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setNombreUsuario("Administrador");
          return;
        }

        const res = await axios.get(
          `${API_BASE}/profile/admin`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const admin = res.data.admin;

        setNombreUsuario(
          `${admin.primary_name} ${admin.first_surname}`
        );

      } catch (error) {
        console.error("Error cargando perfil admin:", error);
        setNombreUsuario("Administrador");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchAdminProfile();
  }, []);

  /* ===============================
     🖥️ JSX
     =============================== */
  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        {/* LOGO */}
        <div className="sidebar-logo">
          <Link to="/">
            <img
              src={Logo}
              alt="Logo"
              className="logo-sidebar"
            />
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
            <NavLink to="/admin/appointments" className={({ isActive }) => isActive ? "active-link" : ""}>
              <FaRegCalendarPlus className="sidebar-icon" />
              Citas
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/agenda" className={({ isActive }) => isActive ? "active-link" : ""}>
             <FaBookOpen className="sidebar-icon" />
              Agenda
            </NavLink>
          </li>
        </ul>
      )}
    </li>
    {/* Usuarios y Roles */}
    <li>
      <NavLink to="/admin/users" className={({ isActive }) => isActive ? "active-link" : ""}>
        <FaUsers className="sidebar-icon" />
        Gestión de Usuarios
      </NavLink>
    </li>
    <li>
      <NavLink to="/admin/roles" className={({ isActive }) => isActive ? "active-link" : ""}>
        <FaUserShield className="sidebar-icon" />
        Gestión de Roles de usuario
      </NavLink>
    </li>
    <li>
      <NavLink to="/admin/admins" className={({ isActive }) => isActive ? "active-link" : ""}>
        <FaUserTie className="sidebar-icon" />
        Gestión de Administradores
      </NavLink>
    </li>

    {/* Servicios y Portafolio */}
    <li>
      <NavLink to="/admin/service" className={({ isActive }) => isActive ? "active-link" : ""}>
        <FaSpa className="sidebar-icon" />
        Gestión de Servicios
      </NavLink>
    </li>
    <li>
      <NavLink to="/admin/portfolio" className={({ isActive }) => isActive ? "active-link" : ""}>
        <FaImages className="sidebar-icon" />
        Gestión de Portafolio
      </NavLink>
    </li>

    {/* Ventas y Finanzas */}
    <li>
      <NavLink to="/admin/sales" className={({ isActive }) => isActive ? "active-link" : ""}>
        <FaTags className="sidebar-icon" />
        Gestión de Ventas
      </NavLink>
    </li>
    <li>
      <NavLink to="/admin/payable" className={({ isActive }) => isActive ? "active-link" : ""}>
        <FaMoneyBillWave className="sidebar-icon" />
        Gestión de Cuentas por Pagar
      </NavLink>
    </li>

    {/* Proveedores */}
    <li>
      <NavLink to="/admin/suppliers" className={({ isActive }) => isActive ? "active-link" : ""}>
        <FaTruck className="sidebar-icon" />
        Gestión de Proveedores
      </NavLink>
    </li>
  </ul>
</nav>


        {/* PERFIL */}
        <div className="sidebar-profile">
          <NavLink to="/admin/profile" className="profile-link">
            <FaUserCircle className="sidebar-icon" />
            <div className="profile-text">
              <span className="profile-name">
                {loadingProfile ? "Cargando..." : nombreUsuario}
              </span>
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
