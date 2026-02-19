import { apiFetch } from "./api";

// Obtener reporte de ventas
export async function getSalesReport(startDate, endDate) {
  try {
    const res = await apiFetch(`/reports/sales/${startDate}/${endDate}`, {
      method: "GET",
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Obtener información de gráfico de ventas
export async function getSalesChart(startDate, endDate) {
  try {
    const res = await apiFetch(`/charts/sales/${startDate}/${endDate}`, {
      method: "GET",
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Servicios más solicitados
export async function getMostRequestedServices(startDate, endDate) {
  try {
    const res = await apiFetch(`/charts/services/${startDate}/${endDate}`, {
      method: "GET",
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Reporte de facturas pendientes
export async function getPendingInvoicesReport() {
  try {
    const res = await apiFetch("/reports/invoices/pending", {
      method: "GET",
    });
    return await res.json();
  } catch {
    return null;
  }
}
