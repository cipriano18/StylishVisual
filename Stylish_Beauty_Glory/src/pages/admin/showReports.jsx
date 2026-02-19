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
} from "recharts";
import { FaMoneyBillWave, FaSpa, FaFileInvoiceDollar, FaCrown } from "react-icons/fa";
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

  const format = (date) => date.toISOString().split("T")[0];

  return {
    startDate: format(start),
    endDate: format(today),
  };
}

function DashboardReports() {
  //estado de overlay
  const [loading, setLoading] = useState(true);

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

        // Agrupar ventas por cliente y sumar montos
        const grouped = res.sales.reduce((acc, sale, idx) => {
          if (sale.client && sale.client.name) {
            const clientName = sale.client.name;
            if (!acc[clientName]) {
              acc[clientName] = 0;
            }

            const amount = Number(sale.amount) || 0;
            acc[clientName] += amount;
          }
          return acc;
        }, {});

        // Convertir a array y ordenar por total pagado
        const groupedArray = Object.entries(grouped)
          .map(([name, total]) => ({ name, total }))
          .sort((a, b) => b.total - a.total);

        setClientsData(groupedArray);
      } else {
        toast.error(res?.error || "Ocurrió un error al obtener el reporte de ventas.");
      }
    });

    // Ventas (gráfico)
    getSalesChart(start, end).then((res) => {
      if (res?.message) {
        setSalesData(res.chart_data);
      } else {
        toast.error(res?.error || "Ocurrio un error al cargar los datos del grafico de ventas.");
      }
    });

    // Servicios más solicitados
    getMostRequestedServices(start, end).then((res) => {
      if (res?.message) {
        setServicesData(res.chart_data);
        setTotals((prev) => ({ ...prev, services: res.total_services }));
      } else {
        toast.error(res?.error || "Ocurrio un error al cargar los servicios mas solicitados.");
      }
    });

    // Facturas pendientes
    getPendingInvoicesReport().then((res) => {
      if (res?.message) {
        // Agrupar por proveedor
        const grouped = res.invoices.reduce((acc, invoice) => {
          const supplierName = invoice.supplier.name;
          if (!acc[supplierName]) {
            acc[supplierName] = 0;
          }
          acc[supplierName] += invoice.amount;
          return acc;
        }, {});

        // Convertir a array para el BarChart
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
        {/* Título */}
        <div className="ui-toolbar-title">
          <h4>Reportes & Gráficos</h4>
        </div>

        {/* Controles */}
        <div className="ui-toolbar-controls">
          <div className="ui-toolbar-filter">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
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
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Fila superior: Cards */}
      <div className="dashboard-top">
        <div className="card">
          <FaMoneyBillWave /> Ventas Totales: ₡{totals.sales}
        </div>
        <div className="card">
          <FaSpa /> Servicios Solicitados: {totals.services}
        </div>
        <div className="card">
          <FaFileInvoiceDollar /> Facturas Pendientes: {totals.invoices} (₡{totals.invoicesAmount})
        </div>
        <div className="card">
          <FaCrown /> Mejor Cliente: {clientsData[0]?.name}
        </div>
      </div>
      {/*Medio */}
      <div className="dashboard-middle">
        {/* Columna izquierda */}
        <div className="dashboard-left">
          <div className="chart-container">
            <h3>Ventas por período</h3>
            <LineChart width={800} height={250} data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total_sales" stroke="#f08080" />
            </LineChart>
          </div>

          <div className="chart-container">
            <h3>Deuda por proveedor</h3>
            <BarChart width={800} height={314} data={invoicesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="supplier" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#875858" />
            </BarChart>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="dashboard-right">
          <div className="chart-container">
            <h3>Servicios más solicitados</h3>
            <PieChart width={400} height={250}>
              <Pie
                data={servicesData.map((entry, index) => ({
                  ...entry,
                  fill: COLORS[index % COLORS.length], // asigna color aquí
                }))}
                dataKey="total_requests"
                nameKey="service_name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              />
              <Tooltip />
            </PieChart>
          </div>

          <div className="chart-container">
            <h3>Clientes frecuentes</h3>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardReports;
