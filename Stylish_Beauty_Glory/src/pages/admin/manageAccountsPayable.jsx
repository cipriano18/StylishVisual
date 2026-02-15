import { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { toast } from "react-hot-toast";

//CSS
import "../../styles/Ui-Toolbar_CSS/Ui-toolbar.css";
import "../../styles/Table_CSS/TableBase.css";
import "../../styles/Modals_CSS/modalBase.css";

//Servicios & Overlays
import { fetchFacturass, createFactura, updateFactura } from "../../services/Serv_payables";
import { fetchSuppliers } from "../../services/Serv_suppliers";
import LoaderOverlay from "../overlay/UniversalOverlay";

function ManageAccounts() {
  const [cuentas, setCuentas] = useState([]);
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [facturaEditando, setFacturaEditando] = useState(null);
  const [suppliers, setSuppliers] = useState([]);

  const [consulta, setConsulta] = useState({
    fechaInicio: "",
    fechaFin: "",
  });

  const [nuevaFactura, setNuevaFactura] = useState({
    supplier_id: "",
    type: "Co",
    amount: "",
    date: "",
    due_date: "",
    name: "",
    description: "",
    code: "",
  });
  //carga de proveedores
  useEffect(() => {
    const cargarProveedores = async () => {
      try {
        const result = await fetchSuppliers();
        if (result?.error) {
          toast.error(result.error || "Error al obtener proveedores");
        } else if (Array.isArray(result.suppliers)) {
          setSuppliers(result.suppliers);
        }
      } catch (error) {
        console.error("Error cargando proveedores:", error);
        toast.error("Hubo un error al cargar los proveedores");
      }
    };
    cargarProveedores();
  }, []);

  //Get Inicial de facturas del mes
  useEffect(() => {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const formato = (d) => d.toISOString().split("T")[0];
    const fechaInicio = formato(inicioMes);
    const fechaFin = formato(hoy);

    setConsulta({ fechaInicio, fechaFin });
    fetchFacturas(fechaInicio, fechaFin);
  }, []);

  //get de facturas
  const fetchFacturas = async (inicio, fin) => {
    setError("");

    try {
      setLoading(true);
      const data = await fetchFacturass(inicio, fin);

      if (!data || data.error) {
        const mensaje = data?.error || "Error al obtener las facturas.";
        toast.error(mensaje);
        throw new Error(mensaje);
      }

      const facturas = data.invoices || [];
      setCuentas(facturas);
      setFacturasFiltradas(facturas);
    } catch (err) {
      const mensajeError = err.message || "No se pudieron cargar las facturas.";
      setError(mensajeError);
      toast.error(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  //crear factura
  const handleCrearFactura = async () => {
    const { supplier_id, type, amount, date, due_date, name, description, code } = nuevaFactura;

    const payload = {
      supplier_id: parseInt(supplier_id),
      type,
      amount: parseFloat(amount),
      date,
      name,
      description,
      code,
      ...(type === "Cr" && due_date ? { due_date } : {}),
    };

    try {
      const result = await createFactura(payload);

      if (!result || result.error) {
        toast.error(result?.error || "Error al crear la factura.");
        return false;
      }

      toast.success(result.message);
      await fetchFacturas(consulta.fechaInicio, consulta.fechaFin);

      setNuevaFactura({
        supplier_id: "",
        type: "Co",
        amount: "",
        date: "",
        due_date: "",
        name: "",
        description: "",
        code: "",
      });

      return true;
    } catch (err) {
      toast.error("Error inesperado al crear la factura.");
      console.error(err);
      return false;
    }
  };

  //editar facturas
  const handleEditarFactura = async (facturaEditada) => {
    const { invoice_id, supplier_id, type, amount, date, due_date, status, name, description } =
      facturaEditada;

    const statusNormalizado =
      facturaEditada.status === "Pendiente"
        ? "P"
        : facturaEditada.status === "Cancelado"
          ? "C"
          : facturaEditada.status;

    const payload = {
      supplier_id: parseInt(supplier_id),
      type,
      amount: parseFloat(amount),
      date,
      status: statusNormalizado,
      name,
      description,
      ...(type === "Cr" && { due_date }),
    };

    try {
      const result = await updateFactura(invoice_id, payload);

      if (!result || result.error) {
        toast.error(result?.error || "Error al actualizar la factura.");
        return false;
      }

      toast.success(result.message || "Factura actualizada correctamente.");
      await fetchFacturas(consulta.fechaInicio, consulta.fechaFin);
      return true;
    } catch (err) {
      const mensaje = err?.message || "Error inesperado al actualizar la factura.";
      toast.error(mensaje);
      console.error("Error en handleEditarFactura:", err);
      return false;
    }
  };

  const handleConsultar = () => {
    if (!consulta.fechaInicio || !consulta.fechaFin) return;
    fetchFacturas(consulta.fechaInicio, consulta.fechaFin);
  };

  return (
    <>
      <div className="manage-accounts-container">
        {loading && <LoaderOverlay message="Cargando tus cuentas por pagar..." />}
        {/* 🔹 Toolbar */}
        <div className="ui-toolbar">
          <h1 className="ui-toolbar-title">Gestión de Cuentas por Pagar</h1>
          <div className="ui-toolbar-controls">
            <button className="ui-toolbar-btn" onClick={() => setShowAddModal(true)}>
              <FaPlus className="ui-toolbar-btn-icon" />
              Agregar cuenta
            </button>

            <div className="ui-toolbar-filter">
              <label>Desde:</label>
              <input
                type="date"
                value={consulta.fechaInicio}
                onChange={(e) => setConsulta({ ...consulta, fechaInicio: e.target.value })}
              />
              <label>Hasta:</label>
              <input
                type="date"
                value={consulta.fechaFin}
                onChange={(e) => setConsulta({ ...consulta, fechaFin: e.target.value })}
              />
              <button className="ui-toolbar-btn" onClick={handleConsultar}>
                <FaSearch className="ui-toolbar-btn-icon" />
                Filtrar
              </button>
            </div>
          </div>
        </div>

        {/* 🔹 Tabla */}
        <div className="ui-table-wrapper">
          {loading ? (
            <p className="no-info">Cargando datos...</p>
          ) : error ? (
            <p className="no-info">{error}</p>
          ) : facturasFiltradas.length > 0 ? (
            <table className="ui-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Monto</th>
                  <th>Vencimiento</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturasFiltradas.map((factura) => (
                  <tr key={factura.invoice_id}>
                    <td>{factura.name || "—"}</td>
                    <td>{factura.type}</td>
                    <td>₡{parseFloat(factura.amount).toFixed(2)}</td>
                    <td>{factura.due_date ? factura.due_date.split("T")[0] : "—"}</td>
                    <td>
                      <span className={`status-label status-${factura.status.toLowerCase()}`}>
                        {factura.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="icon-btn"
                        title="Ver detalles"
                        onClick={() => setFacturaSeleccionada(factura)}
                      >
                        <FaEye />
                      </button>

                      <button
                        className="icon-btn"
                        title="Editar"
                        onClick={() => {
                          const tipoNormalizado =
                            factura.type === "Contado"
                              ? "Co"
                              : factura.type === "Crédito"
                                ? "Cr"
                                : factura.type;

                          const limpiarFecha = (f) => f?.split("T")[0] || "";
                          setFacturaEditando({
                            ...factura,
                            type: tipoNormalizado,
                            date: limpiarFecha(factura.date),
                            due_date: limpiarFecha(factura.due_date),
                          });
                        }}
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-info">No se encontraron cuentas en ese rango.</p>
          )}
        </div>
      </div>

      {/*Modal de crear*/}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content medium">
            <h2 style={{ marginBottom: "1rem", color: "#4a2e2e" }}>Nueva cuenta</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <p>Nombre</p>
                <input
                  type="text"
                  value={nuevaFactura.name}
                  onChange={(e) => setNuevaFactura({ ...nuevaFactura, name: e.target.value })}
                />
              </div>

              <div>
                <p>Código</p>
                <input
                  type="text"
                  value={nuevaFactura.code}
                  onChange={(e) => setNuevaFactura({ ...nuevaFactura, code: e.target.value })}
                />
              </div>

              <div>
                <p>Proveedor</p>
                <select
                  value={nuevaFactura.supplier_id}
                  onChange={(e) =>
                    setNuevaFactura({ ...nuevaFactura, supplier_id: parseInt(e.target.value, 10) })
                  }
                >
                  <option value=""> Sin Proveedor</option>
                  {suppliers.map((prov) => (
                    <option key={prov.supplier_id} value={prov.supplier_id}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p>Monto</p>
                <input
                  type="number"
                  min="0"
                  value={nuevaFactura.amount}
                  onChange={(e) => setNuevaFactura({ ...nuevaFactura, amount: e.target.value })}
                />
              </div>
              <div>
                <p>Fecha</p>
                <input
                  type="date"
                  value={nuevaFactura.date}
                  onChange={(e) => setNuevaFactura({ ...nuevaFactura, date: e.target.value })}
                />
              </div>

              <div>
                <p>Tipo</p>
                <select
                  value={nuevaFactura.type}
                  onChange={(e) => setNuevaFactura({ ...nuevaFactura, type: e.target.value })}
                >
                  <option value="Co">Contado</option>
                  <option value="Cr">Crédito</option>
                </select>
              </div>

              {nuevaFactura.type === "Cr" && (
                <div>
                  <p>Fecha de vencimiento</p>
                  <input
                    type="date"
                    value={nuevaFactura.due_date}
                    onChange={(e) => setNuevaFactura({ ...nuevaFactura, due_date: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div>
              <p>Descripción</p>
              <textarea
                value={nuevaFactura.description}
                onChange={(e) => setNuevaFactura({ ...nuevaFactura, description: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button
                className="modal-btn confirm"
                onClick={async () => {
                  const success = await handleCrearFactura();
                  if (success) setShowAddModal(false);
                }}
              >
                Crear
              </button>
              <button className="modal-btn cancel" onClick={() => setShowAddModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/*Modal Ver */}
      {facturaSeleccionada && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <h2 style={{ marginBottom: "1rem", color: "#4a2e2e" }}>Detalles de la cuenta</h2>

            {/* 🔹 Datos de la factura */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div>
                <strong>Nombre:</strong>
                <p>{facturaSeleccionada.name || "—"}</p>
              </div>
              <div>
                <strong>Código:</strong>
                <p>{facturaSeleccionada.code}</p>
              </div>
              <div>
                <strong>Tipo:</strong>
                <p>{facturaSeleccionada.type}</p>
              </div>
              <div>
                <strong>Monto:</strong>
                <p>₡{parseFloat(facturaSeleccionada.amount).toFixed(2)}</p>
              </div>
              <div>
                <strong>Fecha:</strong>
                <p>{facturaSeleccionada.date?.split("T")[0] || "—"}</p>
              </div>

              <div>
                <strong>Vencimiento:</strong>
                <p>
                  {facturaSeleccionada.due_date ? facturaSeleccionada.due_date.split("T")[0] : "—"}
                </p>
              </div>
              <div>
                <strong>Estado:</strong>
                <p>{facturaSeleccionada.status}</p>
              </div>
              <div>
                <strong>Descripción:</strong>
                <p style={{ whiteSpace: "pre-wrap" }}>{facturaSeleccionada.description || "—"}</p>
              </div>
            </div>

            {/* 🔹 Sección de proveedor */}
            <h3 style={{ marginBottom: "0.5rem", color: "#4a2e2e" }}>Proveedor</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div>
                <strong>ID Proveedor:</strong>
                <p>{facturaSeleccionada.supplier_id}</p>
              </div>
              <div>
                <strong>Nombre:</strong>
                <p>{facturaSeleccionada.supplier?.name || "—"}</p>
              </div>
              <div>
                <strong>Estado:</strong>
                <p>{facturaSeleccionada.supplier?.status || "—"}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setFacturaSeleccionada(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/*Modal Editar*/}
      {facturaEditando && (
        <div className="modal-overlay">
          <div className="modal-content medium">
            <h2 style={{ marginBottom: "1rem", color: "#4a2e2e" }}>Editar cuenta</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <p>Nombre</p>
                <input
                  type="text"
                  value={facturaEditando.name}
                  onChange={(e) => setFacturaEditando({ ...facturaEditando, name: e.target.value })}
                />
              </div>
              <div>
                <p>Proveedor</p>
                <select
                  value={facturaEditando.supplier_id} // aquí usas el estado de la factura que estás editando
                  onChange={(e) =>
                    setFacturaEditando({
                      ...facturaEditando,
                      supplier_id: parseInt(e.target.value, 10),
                    })
                  }
                >
                  <option value="">Sin proveedor</option>
                  {suppliers.map((prov) => (
                    <option key={prov.supplier_id} value={prov.supplier_id}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p>Monto</p>
                <input
                  type="number"
                  min="0"
                  value={facturaEditando.amount}
                  onChange={(e) =>
                    setFacturaEditando({ ...facturaEditando, amount: e.target.value })
                  }
                />
              </div>

              <div>
                <p>Fecha</p>
                <input
                  type="date"
                  value={facturaEditando.date?.split("T")[0]}
                  onChange={(e) => setFacturaEditando({ ...facturaEditando, date: e.target.value })}
                />
              </div>

              <div>
                <p>Tipo</p>
                <select
                  value={facturaEditando.type}
                  onChange={(e) => setFacturaEditando({ ...facturaEditando, type: e.target.value })}
                >
                  <option value="Co">Contado</option>
                  <option value="Cr">Crédito</option>
                </select>
              </div>

              {facturaEditando.type === "Cr" && (
                <div>
                  <p>Fecha de vencimiento</p>
                  <input
                    type="date"
                    value={facturaEditando.due_date?.split("T")[0] || ""}
                    onChange={(e) =>
                      setFacturaEditando({
                        ...facturaEditando,
                        due_date: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              <div>
                <p>Estado</p>
                <select
                  value={facturaEditando.status}
                  onChange={(e) =>
                    setFacturaEditando({ ...facturaEditando, status: e.target.value })
                  }
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div>
              <p>Descripción</p>
              <textarea
                value={facturaEditando.description}
                onChange={(e) =>
                  setFacturaEditando({
                    ...facturaEditando,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-actions">
              <button
                className="modal-btn confirm"
                onClick={async () => {
                  const success = await handleEditarFactura(facturaEditando);
                  if (success) setFacturaEditando(null);
                }}
              >
                Guardar cambios
              </button>
              <button className="modal-btn cancel" onClick={() => setFacturaEditando(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageAccounts;
