import { apiFetch } from "./api";

// Obtener todos los proveedores
export async function fetchSuppliers() {
  try {
    const res = await apiFetch("/suppliers");
    return await res.json();
  } catch {
    return null;
  }
}

// Actualizar un proveedor existente
export async function updateSupplier(id, updatedData) {
  try {
    const res = await apiFetch(`/suppliers/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedData),
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Crear un nuevo proveedor
export async function createSupplier(newSupplier) {
  try {
    const res = await apiFetch("/suppliers", {
      method: "POST",
      body: JSON.stringify(newSupplier),
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Inactivar un proveedor
export async function inactivateSupplier(id) {
  try {
    const res = await apiFetch(`/suppliers/${id}/inactivar`, {
      method: "PUT",
    });
    return await res.json();
  } catch {
    return null;
  }
}
