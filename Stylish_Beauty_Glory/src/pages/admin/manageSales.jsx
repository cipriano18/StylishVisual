import { useState, useEffect } from "react";
import Select from "react-select";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import { toast } from "react-hot-toast";

import { getPageNumbers } from "../../utils/pagination.js";
//CSS
import "../../styles/Modals_CSS/modalBase.css";
import "../../styles/Table_CSS/TableBase.css";
import "../../styles/Ui-Toolbar_CSS/Ui-toolbar.css";

//Servicios & Overlays
import {
  createSale,
  fetchSalesByDateRange,
  updateSale,
  deleteSale,
} from "../../services/Serv_sales";
import { getClients } from "../../services/Serv_clients";
import LoaderOverlay from "../overlay/UniversalOverlay";

function ManageSales() {
  const [showFilters, setShowFilters] = useState(false);
  //estado de overlay
  const [loading, setLoading] = useState(false);

  //imputs modal agregar
  const [newClientId, setNewClientId] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState("");

  //mes actual
  const getCurrentMonthRange = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0 = enero

    const start = new Date(year, month, 1); // primer día del mes
    const end = now; // hoy

    const format = (d) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    return { start: format(start), end: format(end) };
  };

  const [clients, setClients] = useState([]);
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await getClients();

        if (Array.isArray(res.clients)) {
          setClients(res.clients);
        } else {
          toast.error(res?.error || "Error al cargar clientes");
        }
      } catch (error) {
        console.error("Error cargando clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const clientOptions = clients.map((c) => ({
    value: c.client_id,
    label: `${c.primary_name} ${c.secondary_name} ${c.first_surname} ${c.second_surname}`,
  }));

  //cargar ventas del mes actual al iniciar
  useEffect(() => {
    const loadSales = async () => {
      try {
        setLoading(true);
        const { start, end } = getCurrentMonthRange();
        setSearchStartDate(start);
        setSearchEndDate(end);
        const res = await fetchSalesByDateRange(start, end);
        if (res && res.sales) {
          setSales(res.sales);
        } else {
          toast.error(res.error || "Error al cargar ventas del mes");
        }
      } catch (err) {
        toast.error("Error al cargar ventas del mes");
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, []);

  const handleFilterSales = async () => {
    try {
      // Validar que haya fechas seleccionadas
      if (!searchStartDate || !searchEndDate) {
        toast.error("Debes seleccionar ambas fechas");
        return;
      }

      const res = await fetchSalesByDateRange(searchStartDate, searchEndDate);
      if (res && res.sales) {
        setSales(res.sales);
        setCurrentPage(1);
        toast.success(res?.message || "Ventas filtradas correctamente");
      } else {
        toast.error(res?.error || "No se encontraron ventas en ese rango");
      }
    } catch (err) {
      toast.error("Error al filtrar ventas");
    }
  };

  const [sales, setSales] = useState([]);
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);

  //estados modal editar
  const [showEditModal, setShowEditModal] = useState(false);
  const [saleToEdit, setSaleToEdit] = useState(null);
  const [editClientId, setEditClientId] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");

  // Filtrado por rango de fechas
  const filteredSales = sales.filter((sale) => {
    if (!searchStartDate && !searchEndDate) return true;
    const saleDate = new Date(sale.date);
    const start = searchStartDate ? new Date(searchStartDate) : null;
    const end = searchEndDate ? new Date(searchEndDate) : null;
    return (!start || saleDate >= start) && (!end || saleDate <= end);
  });

  // 👈 Agrega esto después
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const currentItems = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //Agregar venta
  const handleAddSale = async () => {
    try {
      if (!newAmount || !newDate) {
        toast.error("Todos los campos son obligatorios");
        return;
      }

      const newSaleData = {
        amount: parseFloat(newAmount),
        date: new Date(newDate).toISOString(),
      };
      if (newClientId) {
        newSaleData.client_id = parseInt(newClientId, 10);
      }

      const res = await createSale(newSaleData);
      console.log("Respuesta al agregar venta:", res);
      if (res?.sale) {
        // Actualizar la tabla con la nueva venta
        setSales((prev) => [...prev, res.sale]);
        toast.success(res.message || "Factura agregada correctamente");
        setShowModal(false);

        // limpiar inputs
        setNewClientId("");
        setNewAmount("");
        setNewDate("");
      } else {
        toast.error(res.error || "Error al agregar la factura");
      }
    } catch (err) {
      toast.error("Error inesperado al agregar");
    }
  };

  //editar venta
  const handleUpdateSale = async () => {
    try {
      if (!saleToEdit) {
        toast.error("No hay venta seleccionada para editar");
        return;
      }

      // Construir payload solo con los campos que se editaron
      const updatedData = {};
      if (editClientId) updatedData.client_id = parseInt(editClientId, 10);
      if (editAmount) updatedData.amount = parseFloat(editAmount);
      if (editDate) updatedData.date = new Date(editDate).toISOString();

      const res = await updateSale(saleToEdit.sale_id, updatedData);

      if (res && res.sale) {
        // Actualizar la tabla reemplazando la venta editada
        setSales((prev) => prev.map((s) => (s.sale_id === saleToEdit.sale_id ? res.sale : s)));
        toast.success(res?.message || "Factura actualizada correctamente");
        setShowEditModal(false);
        setSaleToEdit(null);
      } else {
        toast.error(res?.error || "Error al actualizar la factura");
      }
    } catch (err) {
      toast.error("Error inesperado al actualizar");
    }
  };

  //eliminar venta
  const handleDeleteSale = async () => {
    try {
      if (!saleToDelete) {
        toast.error("No hay venta seleccionada para eliminar");
        return;
      }

      const res = await deleteSale(saleToDelete.sale_id);

      if (res) {
        // Actualizar la tabla quitando la venta eliminada
        setSales((prev) => prev.filter((s) => s.sale_id !== saleToDelete.sale_id));
        toast.success(res?.message || "Venta eliminada correctamente");
        setShowDeleteModal(false);
        setSaleToDelete(null);
      } else {
        toast.error(res?.error || "Error al eliminar la venta");
      }
    } catch (err) {
      toast.error("Error inesperado al eliminar");
    }
  };

  return (
    <>
      {/* Toolbar */}
      <div className="ui-toolbar">
        {loading && <LoaderOverlay message="Cargando Ventas..." />}
        <h1 className="ui-toolbar-title">Gestión de Ventas</h1>
        <div className="ui-toolbar-controls">
          {/* Botón agregar - siempre visible */}
          <button className="ui-toolbar-btn" onClick={() => setShowModal(true)}>
            <FaPlus className="ui-toolbar-btn-icon" />
            Agregar venta
          </button>

          {/* Filtros desktop */}
          <div className="ui-toolbar-filter ui-toolbar-filter-desktop">
            <label>Desde:</label>
            <input
              type="date"
              value={searchStartDate}
              onChange={(e) => setSearchStartDate(e.target.value)}
            />
            <label>Hasta:</label>
            <input
              type="date"
              value={searchEndDate}
              onChange={(e) => setSearchEndDate(e.target.value)}
            />
            <button className="ui-toolbar-btn" onClick={handleFilterSales}>
              <FaSearch className="ui-toolbar-btn-icon" />
              Filtrar
            </button>
          </div>

          {/* Botón filtro - móvil/tablet */}
          <div className="ui-toolbar-filter-wrapper">
            <button
              className="ui-toolbar-btn ui-toolbar-filter-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="ui-toolbar-btn-icon" />
              Filtros
            </button>

            {showFilters && (
              <>
                <div className="ui-toolbar-popover-overlay" onClick={() => setShowFilters(false)} />
                <div className="ui-toolbar-popover">
                  <label>Desde:</label>
                  <input
                    type="date"
                    value={searchStartDate}
                    onChange={(e) => setSearchStartDate(e.target.value)}
                  />
                  <label>Hasta:</label>
                  <input
                    type="date"
                    value={searchEndDate}
                    onChange={(e) => setSearchEndDate(e.target.value)}
                  />
                  <button
                    className="ui-toolbar-btn"
                    onClick={() => {
                      handleFilterSales();
                      setShowFilters(false);
                    }}
                  >
                    <FaSearch className="ui-toolbar-btn-icon" />
                    Filtrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Tabla de ventas */}
      <div className="table-list">
        {filteredSales.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>ID Cita</th>
                <th>Monto</th>
                <th>Fecha de venta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((sale) => (
                <tr key={sale.sale_id}>
                  <td>{sale.client?.name || "No registrado"}</td>
                  <td>{sale.appointment?.appointment_id || "-"}</td>
                  <td>{sale.amount}</td>
                  <td>{sale.date.split("T")[0]}</td>
                  <td>
                    <button
                      className="icon-btn edit"
                      title="Editar"
                      onClick={() => {
                        setSaleToEdit(sale);
                        setEditClientId(sale.client.client_id || "");
                        setEditAmount(sale.amount || "");
                        setEditDate(sale.date ? sale.date.split("T")[0] : "");
                        setShowEditModal(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-btn delete"
                      title="Eliminar"
                      onClick={() => {
                        setSaleToDelete(sale);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-info">No se encontraron ventas</p>
        )}
      </div>
      {totalPages > 1 && (
        <div className="ui-pagination">
          <button
            className="ui-pagination-btn"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
      {/* Modal agregar */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <h2>Nueva venta</h2>

            <p>Cliente</p>
            <Select
              options={clientOptions}
              placeholder="Selecciona o escribe..."
              isClearable
              isSearchable
              value={clientOptions.find((opt) => opt.value === newClientId) || null}
              onChange={(selected) => setNewClientId(selected ? selected.value : "")}
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderRadius: "999px",
                  backgroundColor: state.isFocused ? "#fff1f1" : "#fef6f6",
                  boxShadow: state.isFocused
                    ? "0 0 0 3px rgba(186, 130, 130, 0.3)"
                    : "0 2px 6px rgba(186, 130, 130, 0.2)",
                  border: "none",
                  padding: "6px",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.95rem",
                  color: "#ba8282",
                }),
                option: (base, state) => ({
                  ...base,
                  fontSize: "0.9rem",
                  color: state.isSelected ? "#fff" : "#4a2e2e",
                  backgroundColor: state.isSelected
                    ? "#ba8282"
                    : state.isFocused
                      ? "#fef6f6"
                      : "white",
                }),
              }}
            />

            <p>Monto</p>
            <input
              type="number"
              placeholder="Monto"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
            />

            <p>Fecha de venta</p>
            <input
              type="date"
              placeholder="Fecha de venta"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />

            <div className="modal-actions">
              <button className="modal-btn confirm" onClick={handleAddSale}>
                Agregar
              </button>
              <button className="modal-btn cancel" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content medium">
            <h2>¿Eliminar venta?</h2>
            <p>
              ¿Estás seguro de que deseas eliminar la venta de{" "}
              <strong>{saleToDelete?.client?.name}</strong>?
            </p>

            <div className="modal-actions">
              <button className="modal-btn confirm" onClick={handleDeleteSale}>
                Sí, eliminar
              </button>
              <button className="modal-btn cancel" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal editar */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <h2>Editar venta</h2>
            <p>ID Cliente</p>
            <input
              type="text"
              placeholder="ID Cliente"
              value={editClientId}
              onChange={(e) => setEditClientId(e.target.value)}
            />
            <p>Monto</p>
            <input
              type="number"
              placeholder="Monto"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
            />
            <p>Fecha de venta</p>
            <input
              type="date"
              placeholder="Fecha de venta"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
            />
            <div className="modal-actions">
              <button className="modal-btn confirm" onClick={handleUpdateSale}>
                Guardar
              </button>
              <button className="modal-btn cancel" onClick={() => setShowEditModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageSales;
