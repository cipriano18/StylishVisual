
import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { 
    createSale,
    fetchSalesByDateRange,
    updateSale,
    deleteSale }
    from "../../services/Serv_sales"; //Funciones de la API

import "../../styles/Modals_CSS/modalBase.css";
import "../../styles/Table_CSS/TableBase.css";
import "../../styles/Ui-Toolbar_CSS/Ui-toolbar.css";
import { toast } from "react-hot-toast";

function ManageSales() {
    
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



    //cargar ventas del mes actual al iniciar
    useEffect(() => {
    const loadSales = async () => {
        try {
        const { start, end } = getCurrentMonthRange();
        setSearchStartDate(start); 
        setSearchEndDate(end);
        const res = await fetchSalesByDateRange(start, end);
        console.log("Ventas del mes actual:", res);
        if (res && res.sales) {
            setSales(res.sales);
        } else {
            toast.error(res.error || "Error al cargar ventas del mes");
        }
        } catch (err) {
        toast.error("Error al cargar ventas del mes");
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
            toast.success("Ventas filtradas correctamente");
            } else {
            toast.error("No se encontraron ventas en ese rango");
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
    return (
      (!start || saleDate >= start) &&
      (!end || saleDate <= end)
    );
  });
    //Agregar venta
    const handleAddSale = async () => {
    try {
        if (!newClientId || !newAmount || !newDate) {
        toast.error("Todos los campos son obligatorios");
        return;
        }

        const newSaleData = {
        client_id: parseInt(newClientId, 10),
        amount: parseFloat(newAmount),
        date: new Date(newDate).toISOString(), // formato ISO

        };

        const res = await createSale(newSaleData);
        //console.log("Respuesta al agregar venta:", res);
        if (res) {
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
      setSales((prev) =>
        prev.map((s) => (s.sale_id === saleToEdit.sale_id ? res.sale : s))
      );
      toast.success("Factura actualizada correctamente");
      setShowEditModal(false);
      setSaleToEdit(null);
    } else {
      toast.error("Error al actualizar la factura");
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
        setSales((prev) =>
            prev.filter((s) => s.sale_id !== saleToDelete.sale_id)
        );
        toast.success("Venta eliminada correctamente");
        setShowDeleteModal(false);
        setSaleToDelete(null);
        } else {
        toast.error("Error al eliminar la venta");
        }
    } catch (err) {
        toast.error("Error inesperado al eliminar");
    }
    };


  return (
    <>
      {/* Toolbar */}
      <div className="ui-toolbar">
        <h1 className="ui-toolbar-title">Gestión de Ventas</h1>
        <div className="ui-toolbar-controls">
          <button className="ui-toolbar-btn" onClick={() => setShowModal(true)}>
            <FaPlus className="ui-toolbar-btn-icon" />
            Agregar venta
          </button>
          <div className="ui-toolbar-filter">
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
          </div>
            <button className="ui-toolbar-btn" onClick={handleFilterSales}>
            <FaSearch className="ui-toolbar-btn-icon" />
            Filtrar
            </button>
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
  {sales.map((sale) => (
    <tr key={sale.sale_id}>
      <td>{sale.client?.name}</td>
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

      {/* Modal agregar */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <h2>Nueva factura</h2>
            <p>ID Cliente</p>
            <input
            type="text"
            placeholder="ID Cliente"
            value={newClientId}
            onChange={(e) => setNewClientId(e.target.value)}
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
                <h2>Editar factura</h2>
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
