import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/App";
import Register from "../pages/Register";
import Login from "../pages/Login";

// --- ADMIN ---
import AdminLayout from "../layouts/AdminLayout";
import ManageRoles from "../pages/admin/manageRoles";
import ManageAdmins from "../pages/admin/manageAdmins";
import ManageUsers from "../pages/admin/showUsers";
import ManageSuppliers from "../pages/admin/manageSuppliers";
import ManageAccountsPayable from "../pages/admin/manageAccountsPayable";
import ManageProfileAdmin from "../pages/admin/manageProfile";
import ManageServices from "../pages/admin/manageServices";
import ManagePortFolio from "../pages/admin/managePortFolio";

// --- CLIENTE ---
import ClientLayout from "../layouts/ClientLayout";
import ManageMyDetails from "../pages/client/manageProfile";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🔹 Páginas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* 🔹 Sección de administración */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Redirección automática si solo entra a /admin */}
        <Route index element={<Navigate to="admins" replace />} />

        <Route path="roles" element={<ManageRoles />} />
        <Route path="admins" element={<ManageAdmins />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="suppliers" element={<ManageSuppliers />} />
        <Route path="payable" element={<ManageAccountsPayable />} />
        <Route path="profile" element={<ManageProfileAdmin />} />
        <Route path="service" element={<ManageServices />} />
        <Route path="portfolio" element={<ManagePortFolio />} />
      </Route>

      {/* 🔹 Sección de clientes */}
      <Route path="/client" element={<ClientLayout />}>
        {/* Redirección automática si solo entra a /client */}
        <Route index element={<Navigate to="profile" replace />} />

        <Route path="profile" element={<ManageMyDetails />} />
      </Route>

      {/* 🔹 Si la ruta no existe */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
