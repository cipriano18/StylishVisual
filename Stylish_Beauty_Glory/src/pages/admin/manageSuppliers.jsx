import { useState, useEffect } from "react";
import "../../styles/Ui-Toolbar_CSS/Ui-toolbar.css";
import "../../styles/Table_CSS/TableBase.css";
import "../../styles/Modals_CSS/modalBase.css";
import { FaEdit, FaTrash, FaPlus, FaCheckCircle, FaTimesCircle, FaFilter } from "react-icons/fa";
import {
  fetchSuppliers,
  createSupplier,
  inactivateSupplier,
  updateSupplier,
} from "../../services/Serv_suppliers";
import { getPageNumbers } from "../../utils/pagination.js";
import { toast } from "react-hot-toast";

function ManageVendors() {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const currentItems = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const [newVendor, setNewVendor] = useState({ name: "", phone: "", email: "" });
  const [editVendor, setEditVendor] = useState({ id: "", name: "", phone: "", email: "" });
  const [searchName, setSearchName] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Configuración agregar proveedor
  const [showAddModal, setShowAddModal] = useState(false);

  // Configuración eliminar proveedor
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);

  // Configuración editar proveedor
  const [editingId, setEditingId] = useState(null);

  // 🔹 Cargar proveedores desde la API
  useEffect(() => {
    const cargarProveedores = async () => {
      const data = await fetchSuppliers();
      if (Array.isArray(data?.suppliers)) {
        const formatted = data.suppliers.map((p) => ({
          id: p.supplier_id,
          name: p.name,
          status: p.status,
          contacts: p.contacts,
        }));
        setVendors(formatted);
        setFilteredVendors(formatted);
      } else {
        console.error("No se pudo cargar la lista de proveedores");
        toast.error(data.error);
      }
    };
    cargarProveedores();
  }, []);

  useEffect(() => {
    const term = searchName.toLowerCase();
    if (!term) setFilteredVendors(vendors);
    else setFilteredVendors(vendors.filter((v) => v.name?.toLowerCase().includes(term)));
    setCurrentPage(1);
    setEditingId(null);
  }, [searchName, vendors]);

  // 🔹 Crear proveedor
  const handleAddVendor = async () => {
    if (!newVendor.name.trim() || !newVendor.phone.trim() || !newVendor.email.trim()) return;

    const payload = {
      name: newVendor.name.trim(),
      phone: newVendor.phone.trim(),
      email: newVendor.email.trim(),
    };

    const data = await createSupplier(payload);

    if (data?.supplier?.supplier_id) {
      const nuevo = {
        id: data.supplier.supplier_id,
        name: data.supplier.name,
        status: data.supplier.status === "A" ? "Activo" : "Inactivo",
        contacts: data.contacts || [],
      };
      setVendors((prev) => [...prev, nuevo]);
      setFilteredVendors((prev) => [...prev, nuevo]);
      setNewVendor({ name: "", phone: "", email: "" });
      toast.success(data.message || "Proveedor creado correctamente");
    } else {
      toast.error(data?.error || "No se pudo crear el proveedor");
    }
  };

  // 🔹 Editar proveedor
  const handleEditVendor = async () => {
    const id = parseInt(editVendor.id);
    if (isNaN(id)) return;

    const payload = {
      name: editVendor.name,
      phone: editVendor.phone,
      email: editVendor.email,
    };

    try {
      const data = await updateSupplier(id, payload);

      if (data?.supplier?.supplier_id === id) {
        const updated = vendors.map((v) =>
          v.id === id
            ? {
                ...v,
                name: data.supplier.name,
                status: data.supplier.status === "A" ? "Activo" : "Inactivo",
                contacts: data.contacts || [
                  { contact_type: "TELEFONO", contact_value: payload.phone },
                  { contact_type: "EMAIL", contact_value: payload.email },
                ],
              }
            : v
        );

        setVendors(updated);
        setFilteredVendors(updated);
        toast.success(data.message || "Proveedor actualizado correctamente");
      } else {
        toast.error(data?.error || "No se pudo actualizar el proveedor");
      }
    } catch (error) {
      toast.error(data.error || "Error de red al actualizar el proveedor");
    }

    setEditVendor({ id: "", name: "", phone: "", email: "" });
  };

  const handleDeactivateVendor = async () => {
    if (!vendorToDelete) return;
    try {
      const data = await inactivateSupplier(vendorToDelete.id);
      if (data?.supplier?.status === "I") {
        const updated = vendors.map((v) =>
          v.id === vendorToDelete.id ? { ...v, status: "Inactivo" } : v
        );
        setVendors(updated);
        setFilteredVendors(updated);
        setVendorToDelete(null);
        setShowDeleteModal(false);
        toast.success(data.message || "Proveedor inactivado correctamente");
      } else {
        toast.error(data.error || "No se pudo inactivar el proveedor");
      }
    } catch (error) {
      toast.error(data.error || "Error de red al inactivar el proveedor");
    }
  };

  return (
    <>
      <div className="manage-vendors-container">
        {/* 🔹 Toolbar modular */}
        <div className="ui-toolbar">
          <h1 className="ui-toolbar-title">Gestión de Proveedores</h1>

          <div className="ui-toolbar-controls">
            {/* Botón agregar - siempre visible */}
            <button className="ui-toolbar-btn" onClick={() => setShowAddModal(true)}>
              <FaPlus className="ui-toolbar-btn-icon" />
              Nuevo proveedor
            </button>

            {/* Filtros normales - solo desktop */}
            <div className="ui-toolbar-filter ui-toolbar-filter-desktop">
              <label>Nombre:</label>
              <input
                type="text"
                placeholder="Filtrar por nombre"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            {/* Botón filtro - solo móvil/tablet */}
            <div className="ui-toolbar-filter-wrapper">
              <button
                className="ui-toolbar-btn ui-toolbar-filter-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="ui-toolbar-btn-icon" />
                Filtros
              </button>

              {/* Popover */}
              {showFilters && (
                <>
                  <div
                    className="ui-toolbar-popover-overlay"
                    onClick={() => setShowFilters(false)}
                  />

                  <div className="ui-toolbar-popover">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      placeholder="Filtrar por nombre"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 🔹 Tabla modular */}
        <div className="ui-table-wrapper">
          {filteredVendors.length > 0 ? (
            <table className="ui-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((v) => {
                  const isEditing = editingId === v.id;
                  const telefono =
                    v.contacts.find((c) => c.contact_type === "TELEFONO")?.contact_value || "";
                  const correo =
                    v.contacts.find((c) => c.contact_type === "EMAIL")?.contact_value || "";

                  return (
                    <tr key={v.id}>
                      <td data-label="Nombre">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editVendor.name}
                            onChange={(e) => setEditVendor({ ...editVendor, name: e.target.value })}
                          />
                        ) : (
                          v.name
                        )}
                      </td>
                      <td data-label="Teléfono">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editVendor.phone}
                            onChange={(e) =>
                              setEditVendor({ ...editVendor, phone: e.target.value })
                            }
                          />
                        ) : (
                          telefono
                        )}
                      </td>
                      <td data-label="Correo">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editVendor.email}
                            onChange={(e) =>
                              setEditVendor({ ...editVendor, email: e.target.value })
                            }
                          />
                        ) : (
                          correo
                        )}
                      </td>
                      <td data-label="Estado">
                        <span className={`status-label status-${v.status.toLowerCase()}`}>
                          {v.status}
                        </span>
                      </td>
                      <td data-label="Acciones">
                        {isEditing ? (
                          <>
                            <button
                              className="icon-btn"
                              onClick={() => {
                                handleEditVendor();
                                setEditingId(null);
                              }}
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              className="icon-btn"
                              onClick={() => {
                                setEditingId(null);
                                setEditVendor({ id: "", name: "", phone: "", email: "" });
                              }}
                            >
                              <FaTimesCircle />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="icon-btn"
                              onClick={() => {
                                setEditingId(v.id);
                                setEditVendor({
                                  id: v.id,
                                  name: v.name,
                                  phone: telefono,
                                  email: correo,
                                });
                              }}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="icon-btn"
                              onClick={() => {
                                setVendorToDelete(v);
                                setShowDeleteModal(true);
                              }}
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="no-info">No se encontraron proveedores</p>
          )}
        </div>
        {totalPages > 1 && (
          <div className="ui-pagination">
            <button
              className="ui-pagination-btn"
              onClick={() => {
                setCurrentPage((p) => Math.max(p - 1, 1));
                setEditingId(null); // 👈
              }}
              disabled={currentPage === 1}
            >
              Anterior
            </button>

            {getPageNumbers(currentPage, totalPages).map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="ui-pagination-ellipsis">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  className={`ui-pagination-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="ui-pagination-btn"
              onClick={() => {
                setCurrentPage((p) => Math.min(p + 1, totalPages));
                setEditingId(null); // 👈
              }}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/*--- Modal Agregar Proveedor ---*/}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content medium" onClick={(e) => e.stopPropagation()}>
            <h2>Agregar Proveedor</h2>
            <p>Nombre</p>
            <input
              type="text"
              placeholder="Nombre"
              value={newVendor.name}
              onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
            />
            <p>Teléfono</p>
            <input
              type="text"
              placeholder="Teléfono"
              value={newVendor.phone}
              onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
            />
            <p>Correo</p>
            <input
              type="text"
              placeholder="Correo"
              value={newVendor.email}
              onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
            />
            <div className="modal-actions">
              <button
                className="modal-btn confirm"
                onClick={() => {
                  handleAddVendor();
                  setShowAddModal(false);
                }}
              >
                Agregar
              </button>
              <button className="modal-btn cancel" onClick={() => setShowAddModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/*--- Modal Eliminar Proveedor ---*/}
      {showDeleteModal && vendorToDelete && (
        <div className="modal-overlay">
          <div className="modal-content medium">
            <h2>¿Dar de baja proveedor?</h2>
            <p>
              ¿Estás seguro de que deseas dar de baja al proveedor{" "}
              <strong>{vendorToDelete.name}</strong>?
            </p>
            <div className="modal-actions">
              <button className="modal-btn confirm" onClick={handleDeactivateVendor}>
                Sí, dar de baja
              </button>
              <button className="modal-btn cancel" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default ManageVendors;
