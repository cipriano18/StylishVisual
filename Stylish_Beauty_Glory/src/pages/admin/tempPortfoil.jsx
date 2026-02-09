import React, { useEffect } from "react";
import {
  createSale,
  fetchSalesByDateRange,
  updateSale,
  deleteSale,
} from "../../services/Serv_sales";

export default function SalesTestPage() {
  useEffect(() => {
    async function testSalesCrud() {
        // 1️⃣ Crear una venta (Funciona)
        const newSale = await createSale({
        client_id: 1,
        date: new Date("2026-02-06").toISOString(), // 🔑 conversión a ISO
        amount: 5500.5,
        });
        console.log("Venta creada:", newSale);

      // 2️⃣ Consultar ventas por rango de fechas (Funciona)
      const salesInRange = await fetchSalesByDateRange("2025-10-01", "2025-10-31");
      console.log("Ventas en rango:", salesInRange);

      // 3️⃣ Editar una venta por ID (Funciona)
      const updatedSale = await updateSale(1, {
        client_id: 2,
        date: new Date("2025-10-25").toISOString(), // 🔑 conversión a ISO
        amount: 7500.0,
      });
      console.log("Venta actualizada:", updatedSale);

      // 4️⃣ Eliminar una venta por ID (Funciona)
      const deletedSale = await deleteSale(2);
      console.log("Venta eliminada:", deletedSale);
    }

    testSalesCrud();
  }, []);

  return (
    <div>
      <h1>Pruebas de CRUD de Ventas</h1>
      <p>Abre la consola para ver los resultados de las operaciones.</p>
    </div>
  );
}
