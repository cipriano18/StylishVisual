import { Routes, Route } from "react-router-dom";
import Home from "../pages/App";
import Register from "../pages/Register";
import Login from "../pages/Login";

import AdminLayout from "../layouts/AdminLayout";
import ManageRoles from "../pages/admin/manageRoles";
import ManageAdmins from "../pages/admin/manageAdmins";
import ManageUsers from "../pages/admin/showUsers";
import ManageSuppliers from "../pages/admin/manageSuppliers";
import ManageAccountsPayable from "../pages/admin/manageAccountsPayable";
import ManageProfileAdmin from "../pages/admin/manageProfile";

import ClientLayout from "../layouts/ClientLayout";
import ManageMyDetails from "../pages/client/manageProfile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Sección admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="roles" element={<ManageRoles />} />
        <Route path="admins" element={<ManageAdmins />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="suppliers" element={<ManageSuppliers />} />
        <Route path="payable" element={<ManageAccountsPayable />} />
        <Route path="profile" element={<ManageProfileAdmin />} />
      </Route>


      {/* Sección Clientes */}
      <Route path="/client" element={<ClientLayout />}>
        <Route path="profile" element={<ManageMyDetails />} />
      </Route>

    </Routes>
  );
}

