// src/pages/Portafolios.jsx
import React, { useEffect, useState } from "react";

function Portafolios() {
  const [portfolios, setPortfolios] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/portfolios")
      .then((res) => res.json())
      .then((data) => setPortfolios(data.portfolios || []))
      .catch((err) => console.error("Error cargando portafolios:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", e.target.image.files[0]);
    formData.append("id_service", e.target.id_service.value);
    formData.append("description", e.target.description.value);

    try {
      const response = await fetch("http://localhost:3000/api/portfolios", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Error desconocido al subir la imagen");
      } else {
        setMessage(data.message || "Imagen subida correctamente");
        setPortfolios([...portfolios, data.portfolio]);
      }
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      setMessage("Error de conexión con el servidor");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/portfolios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      setPortfolios(portfolios.filter((p) => p.id_portafolio !== id));
    } catch (err) {
      console.error("Error eliminando:", err);
      setMessage("Error al eliminar portafolio");
    }
  };

  const handleEdit = async (id, formData) => {
    try {
      const res = await fetch(`http://localhost:3000/api/portfolios/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData
      });
      const data = await res.json();
      setMessage(data.message || data.error);

      setPortfolios(
        portfolios.map((p) =>
          p.id_portafolio === id ? { ...p, ...data.portfolio } : p
        )
      );
    } catch (err) {
      console.error("Error editando:", err);
      setMessage("Error al editar portafolio");
    }
  };

  // 🔹 estilos rápidos
  const inputStyle = {
    backgroundColor: "white",
    color: "black",
    border: "1px solid #ccc",
    padding: "6px",
    borderRadius: "4px",
    margin: "4px 0",
    display: "block",
    width: "100%"
  };
  const textStyle = { color: "black" // 👈 asegura que los <p> se vean negros 
  };
  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "6px"
  };

  const itemStyle = {
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "12px",
    margin: "10px",
    width: "250px",
    textAlign: "center",
    backgroundColor: "#f9f9f9"
  };

  const gridStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px"
  };

  return (
    <div className="portafolios-page" style={{ padding: "20px" }}>
      <h1>Gestión de Portafolios</h1>

      {/* Formulario de subida */}
      <section className="upload-portfolio" style={{ marginBottom: "20px" }}>
        <h2>Subir nueva imagen</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: "300px" }}>
          <label>Servicio ID:</label>
          <input type="number" name="id_service" required style={inputStyle} />

          <label>Descripción:</label>
          <input type="text" name="description" style={inputStyle} />

          <label>Imagen:</label>
          <input type="file" name="image" accept="image/png, image/jpeg" required style={inputStyle} />

          <button type="submit" style={buttonStyle}>Subir</button>
        </form>
      </section>

      {/* Mensajes */}
      {message && <p>{message}</p>}

      {/* Listado de portafolios */}
      <h2>Lista de portafolios</h2>
      <div className="portfolio-grid" style={gridStyle}>
        {portfolios.map((p) => (
          <div key={p.id_portafolio} className="portfolio-item" style={itemStyle}>
            <img src={p.imagen_url} alt={p.descripcion} width="200" style={{ borderRadius: "4px" }} />
            <p>{p.descripcion}</p>

            <button onClick={() => handleDelete(p.id_portafolio)} style={{ ...buttonStyle, backgroundColor: "#dc3545" }}>
              Eliminar
            </button>

            {/* Formulario de edición */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData();
                if (e.target.image.files[0]) {
                  formData.append("image", e.target.image.files[0]);
                }
                formData.append("id_service", e.target.id_service.value);
                formData.append("description", e.target.description.value);
                handleEdit(p.id_portafolio, formData);
              }}
              style={{ marginTop: "10px" }}
            >
              <input type="number" name="id_service" defaultValue={p.id_servicio} style={inputStyle} />
              <input type="text" name="description" defaultValue={p.descripcion} style={inputStyle} />
              <p style={textStyle}>{p.descripcion}</p>
              <input type="file" name="image" accept="image/png, image/jpeg" style={inputStyle} />
              <button type="submit" style={buttonStyle}>Actualizar</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Portafolios;