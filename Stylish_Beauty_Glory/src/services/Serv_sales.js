import { apiFetch } from "./api";

// Crear una nueva venta
export async function createSale(data) {
  try {
    const res = await apiFetch("/sales", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // La API devuelve un objeto con "message" y "sale"
    return await res.json();
  } catch (error) {
    console.error("createSale error:", error);
    return null;
  }
}

// Consultar ventas por rango de fechas
export async function fetchSalesByDateRange(startDate, endDate) {
  try {
    const res = await apiFetch(`/sales/${startDate}/${endDate}`);
    return await res.json();
  } catch (error) {
    console.error("fetchSalesByDateRange error:", error);
    return null;
  }
}

// Editar una venta por ID
export async function updateSale(saleId, updatedData) {
  try {
    const res = await apiFetch(`/sales/${saleId}`, {
      method: "PUT",
      body: JSON.stringify(updatedData),
    });

    // La API devuelve la venta actualizada
    return await res.json();
  } catch (error) {
    console.error("updateSale error:", error);
    return null;
  }
}

// Eliminar una venta por ID
export async function deleteSale(saleId) {
  try {
    const res = await apiFetch(`/sales/${saleId}`, {
      method: "DELETE",
    });

    // La API devuelve un mensaje de confirmación
    return await res.json();
  } catch (error) {
    console.error("deleteSale error:", error);
    return null;
  }
}
