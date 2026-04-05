import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaMoneyBillWave,
  FaSpa,
  FaFileInvoiceDollar,
  FaCrown,
  FaFilter,
  FaSearch,
} from "react-icons/fa";
import "../../styles/Admins_CSS/ShowReports.css";
import {
  getSalesReport,
  getSalesChart,
  getMostRequestedServices,
  getPendingInvoicesReport,
} from "../../services/Serv_reports";
import LoaderOverlay from "../overlay/UniversalOverlay";

function getDefaultDates() {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);

  const format = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return {
    startDate: format(start),
    endDate: format(today),
  };
}

function DashboardReports() {
  //estado de overlay
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [salesData, setSalesData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [invoicesData, setInvoicesData] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [totals, setTotals] = useState({
    sales: 0,
    services: 0,
    invoices: 0,
    invoicesAmount: 0,
  });

  const fetchReports = (start, end) => {
    // Ventas (reporte)
    getSalesReport(start, end).then((res) => {
      if (res?.message) {
        setTotals((prev) => ({ ...prev, sales: res.total_amount }));

        const sales = Array.isArray(res.sales) ? res.sales : []; // ← FIX línea 63

        const grouped = sales.reduce((acc, sale) => {
          if (sale?.client?.name) {
            const clientName = sale.client.name;
            if (!acc[clientName]) acc[clientName] = 0;
            acc[clientName] += Number(sale.amount) || 0;
          }
          return acc;
        }, {});

        const groupedArray = Object.entries(grouped)
          .map(([name, total]) => ({ name, total }))
          .sort((a, b) => b.total - a.total);

        setClientsData(groupedArray);
      } else {
        setClientsData([]); // ← FIX: limpiar si no hay datos
        toast.error(res?.error || "Ocurrió un error al obtener el reporte de ventas.");
      }
    });

    // Ventas (gráfico)
    getSalesChart(start, end).then((res) => {
      if (res?.message) {
        setSalesData(Array.isArray(res.chart_data) ? res.chart_data : []); // ← FIX
      } else {
        setSalesData([]); // ← FIX: limpiar si no hay datos
        toast.error(res?.error || "Ocurrio un error al cargar los datos del grafico de ventas.");
      }
    });

    // Servicios más solicitados
    getMostRequestedServices(start, end).then((res) => {
      if (res?.message) {
        setServicesData(Array.isArray(res.chart_data) ? res.chart_data : []); // ← FIX
        setTotals((prev) => ({ ...prev, services: res.total_services }));
      } else {
        setServicesData([]); // ← FIX: limpiar si no hay datos
        toast.error(res?.error || "Ocurrio un error al cargar los servicios mas solicitados.");
      }
    });

    // Facturas pendientes
    getPendingInvoicesReport().then((res) => {
      if (res?.message) {
        const invoices = Array.isArray(res.invoices) ? res.invoices : []; // ← FIX línea 100

        const grouped = invoices.reduce((acc, invoice) => {
          const supplierName = invoice?.supplier?.name; // ← FIX: acceso seguro
          if (supplierName) {
            if (!acc[supplierName]) acc[supplierName] = 0;
            acc[supplierName] += invoice.amount;
          }
          return acc;
        }, {});

        const groupedArray = Object.entries(grouped).map(([name, total]) => ({
          supplier: name,
          amount: total,
        }));
        setInvoicesData(groupedArray);

        setTotals((prev) => ({
          ...prev,
          invoices: res.total_pending_invoices,
          invoicesAmount: res.total_amount_pending,
        }));
      } else {
        setInvoicesData([]); // ← FIX: limpiar si no hay datos
        toast.error(res?.error || "Ocurrió un error al obtener las facturas pendientes.");
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    const { startDate, endDate } = getDefaultDates();
    setStartDate(startDate);
    setEndDate(endDate);
    fetchReports(startDate, endDate);
    setLoading(false);
  }, []);

  const COLORS = ["#f0c0c0", "#ffa7a7", "#f08080", "#875858"];

  return (
    <div className="dashboard">
      {loading && <LoaderOverlay message="Cargando Reportes..." />}
      {/* Toolbar */}
      <div className="ui-toolbar">
        <div className="ui-toolbar-title">
          <h4>Reportes & Gráficos</h4>
        </div>

        <div className="ui-toolbar-controls">
          {/* Filtros desktop */}
          <div className="ui-toolbar-filter ui-toolbar-filter-desktop">
            <label>Desde:</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <label>Hasta:</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <button
              className="ui-toolbar-btn"
              onClick={() => {
                const today = new Date().toISOString().split("T")[0];
                if (endDate > today) {
                  toast.error("La fecha final no puede ser mayor a hoy.");
                  return;
                }
                fetchReports(startDate, endDate);
              }}
            >
              <FaSearch className="ui-toolbar-btn-icon" />
              Aplicar
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
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <label>Hasta:</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  <button
                    className="ui-toolbar-btn"
                    onClick={() => {
                      const today = new Date().toISOString().split("T")[0];
                      if (endDate > today) {
                        toast.error("La fecha final no puede ser mayor a hoy.");
                        return;
                      }
                      fetchReports(startDate, endDate);
                      setShowFilters(false);
                    }}
                  >
                    <FaSearch className="ui-toolbar-btn-icon" />
                    Aplicar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Fila superior: Cards */}
      <div className="dashboard-top">
        <div className="card">
          <FaMoneyBillWave /> Ventas Totales: ₡{totals.sales || 0}
        </div>
        <div className="card">
          <FaSpa /> Servicios Solicitados: {totals.services || "Ninguno"}
        </div>
        <div className="card">
          <FaFileInvoiceDollar /> Facturas Pendientes: {totals.invoices} (₡{totals.invoicesAmount})
        </div>
        <div className="card">
          <FaCrown /> Mejor Cliente: {clientsData[0]?.name || "Ninguno"}
        </div>
      </div>
      {/*Medio */}
      <div className="dashboard-middle">
        {/* Columna izquierda */}
        <div className="dashboard-left">
          <div className="chart-container">
            <h3>Deuda por proveedor</h3>
            {invoicesData.length === 0 ? (
              <p>Sin datos para el período seleccionado</p>
            ) : (
              <ResponsiveContainer width="100%" height={314}>
                <BarChart data={invoicesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="supplier" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#875858" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="chart-container">
            <h3>Ventas por período</h3>
            {salesData.length === 0 ? (
              <p>Sin datos para el período seleccionado</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={salesData} margin={{ left: 20, right: 10, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis width={80} tickFormatter={(value) => `₡${value.toLocaleString()}`} />
                  <Tooltip formatter={(value) => [`₡${value.toLocaleString()}`, "Ventas"]} />
                  <Legend />
                  <Line type="monotone" dataKey="total_sales" stroke="#f08080" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Columna derecha */}
        <div className="dashboard-right">
          <div className="chart-container">
            <h3>Servicios más solicitados</h3>
            {servicesData.length === 0 ? (
              <p>Sin datos para el período seleccionado</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={servicesData.map((entry, index) => ({
                      ...entry,
                      fill: COLORS[index % COLORS.length],
                    }))}
                    dataKey="total_requests"
                    nameKey="service_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="chart-container">
            <h3>Top 5 en consumo</h3>
            {clientsData.length === 0 ? (
              <p>Sin datos para el período seleccionado</p>
            ) : (
              <table className="clients-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {clientsData.slice(0, 5).map((client, index) => (
                    <tr key={index}>
                      <td>{client.name}</td>
                      <td>₡{client.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardReports;
