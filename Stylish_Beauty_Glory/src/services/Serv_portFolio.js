import { apiFetch } from "./api";

// Obtener todos los portafolios
export async function fetchPortfolios() {
  try {
    const res = await apiFetch("/portfolios");
    return await res.json();
  } catch {
    return null;
  }
}
// Crear un nuevo portafolio
export async function createPortfolio(formData) {
  try {
    const res = await apiFetch("/portfolios", {
      method: "POST",
      body: formData,
    });

    return await res.json();
  } catch {
    return null;
  }
}

// Editar un portafolio existente
export async function updatePortfolio(id, formData) {
  try {
    const res = await apiFetch(`/portfolios/${id}`, {
      method: "PUT",
      body: formData,
    });
    return await res.json();
  } catch {
    return null;
  }
}

// Eliminar un portafolio
export async function deletePortfolio(id) {
  try {
    const res = await apiFetch(`/portfolios/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch {
    return null;
  }
}
