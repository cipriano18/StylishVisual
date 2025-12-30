import { apiFetch } from "./api";

// Obtener facturas por rango de fechas
export async function fetchFacturass(inicio, fin) {
  try {
    const res = await apiFetch(`/invoices/${inicio}/${fin}`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function createFactura(data) {
  try {
    const res = await apiFetch("/invoices", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      const camposFaltantes = Array.isArray(responseData.missing_fields)
        ? responseData.missing_fields.join(", ")
        : "";

      const mensajeError = camposFaltantes
        ? `${responseData.error}: ${camposFaltantes}`
        : responseData.error || "Error al crear la factura.";

      return { error: mensajeError };
    }

    return responseData;
  } catch (err) {
    console.error("Error en createFactura:", err);
    return { error: "Error de conexión con el servidor." };
  }
}

// Editar una factura existente
export async function updateFactura(id, updatedData) {
  try {
    console.log("Enviando factura editada:", { updatedData });

    const res = await apiFetch(`/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedData),
    });

    const responseData = await res.json();

    if (!res.ok) {
      const mensajeError =
        responseData.error || "Error al actualizar la factura.";
      return { error: mensajeError };
    }

    return responseData;
  } catch (err) {
    console.error("Error en updateFactura:", err);
    return { error: "Error de conexión con el servidor." };
  }
}
