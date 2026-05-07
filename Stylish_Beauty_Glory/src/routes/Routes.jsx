import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/App";
import Register from "../pages/Register";
import Login from "../pages/Login";

import AdminLayout from "../layouts/AdminLayout";
import ManageAdmins from "../pages/admin/manageAdmins";
import ManageUsers from "../pages/admin/showUsers";
import ManageSuppliers from "../pages/admin/manageSuppliers";
import ManageAccountsPayable from "../pages/admin/manageAccountsPayable";
import ManageProfileAdmin from "../pages/admin/manageProfile";
import ManageServices from "../pages/admin/manageServices";
import ManagePortFolio from "../pages/admin/managePortFolio";
import ManageSales from "../pages/admin/manageSales";
import ManageAppointments from "../pages/admin/manageAppointments";
import ManageSchedule from "../pages/admin/adminSchedule";
import ShowReports from "../pages/admin/showReports";

import ClientLayout from "../layouts/ClientLayout";
import ManageMyDetails from "../pages/client/manageProfile";
import ClientHome from "../pages/client/home";
import ClientAppointments from "../pages/client/scheduleAppointments";
import ClientSchedule from "../pages/client/clientSchedule";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="admins" replace />} />
        <Route path="admins" element={<ManageAdmins />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="suppliers" element={<ManageSuppliers />} />
        <Route path="payable" element={<ManageAccountsPayable />} />
        <Route path="profile" element={<ManageProfileAdmin />} />
        <Route path="service" element={<ManageServices />} />
        <Route path="portfolio" element={<ManagePortFolio />} />
        <Route path="sales" element={<ManageSales />} />
        <Route path="appointments" element={<ManageAppointments />} />
        <Route path="schedule" element={<ManageSchedule />} />
        <Route path="reports" element={<ShowReports />} />
      </Route>

      <Route path="/client" element={<ClientLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="profile" element={<ManageMyDetails />} />
        <Route path="home" element={<ClientHome />} />
        <Route path="appointments" element={<ClientAppointments />} />
        <Route path="schedule" element={<ClientSchedule />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
