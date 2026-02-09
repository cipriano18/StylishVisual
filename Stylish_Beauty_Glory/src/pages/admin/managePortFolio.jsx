import { useState, useEffect } from "react";
import "../../styles/Modals_CSS/modalBase.css";
import "../../styles/Ui-Toolbar_CSS/Ui-toolbar.css";
import "../../styles/Portfolio_CSS/normalCard.css";
import "../../styles/Portfolio_CSS/PortfolioModal.css";
<<<<<<< HEAD

import { fetchPortfolios, createPortfolio, updatePortfolio, deletePortfolio } from "../../services/Serv_portFolio";
=======
import { fetchPortfolios, createPortfolio } from "../../services/Serv_portFolio";
>>>>>>> 97addcfec71a98c8efd1b41cb790a7ade7453630
import {fetchServices} from "../../services/Serv_services";
import { FaPlus, FaPen, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";

/* ===============================
   🔹 Componente PortfolioCard
   =============================== */
function PortfolioCard({ portfolio, onEdit, onDelete }) {
  return (
    <div
      className="portfolio-card"
      style={{
        backgroundImage: `url(${portfolio.image_url})`, 
      }}
    >
      <div className="portfolio-card-content">
        <div className="portfolio-info">
          <p className="portfolio-description">{portfolio.description}</p>
          <span className="portfolio-service">{portfolio.service_name}</span>
        </div>

      {/* Contenedor de acciones */}
      <div className="portfolio-actions">
          <button
            className="edit-btn"
            onClick={() => onEdit(portfolio)}
            title="Editar portafolio"
          >
            <FaPen />
          </button>
          <button
            className="delete-btn"
            onClick={() => onDelete(portfolio)} // 👈 nueva prop
            title="Eliminar portafolio"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}



/* ===============================
   🔹 Página principal
   =============================== */
function ManagePortfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState([]);
  //Modal editar
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPortfolioData, setEditPortfolioData] = useState({
    id: "",
    description: "",
    id_service: "",
    image: null,
    service_name: ""
  });
  //Modal elimiar
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);

  const handleDeleteClick = (portfolio) => {
    setPortfolioToDelete(portfolio);
    setShowDeleteModal(true);
  };

  const handleDeletePortfolio = async () => {
    try {
      const res = await deletePortfolio(portfolioToDelete.portfolio_id);
      if (res) {
        setPortfolios((prev) =>
          prev.filter((p) => p.portfolio_id !== portfolioToDelete.portfolio_id)
        );
        toast.success("Portafolio eliminado correctamente");
        setShowDeleteModal(false);
      } else {
        toast.error("Error al eliminar el portafolio");
      }
    } catch (err) {
      toast.error("Error inesperado al eliminar");
    }
  };

  // función que se pasa al card
  const handleEditClick = (portfolio) => {
    setEditPortfolioData({
      id: portfolio.portfolio_id,
      description: portfolio.description,
      id_service: portfolio.service_id,
      image: null, // si quieres permitir cambiar imagen
      image_url: portfolio.image_url, // guarda la actual
      service_name: portfolio.service_name
    });
    setShowEditModal(true);
  };


  // Modal agregar
  const [showModal, setShowModal] = useState(false);
  const [newPortfolioData, setNewPortfolioData] = useState({
    description: "",
    id_service: "",
    image: null,
    service_name: "",
  });
  
  // Servicios disponibles
  useEffect(() => {
  const cargarServicios = async () => {
    const data = await fetchServices();
    if (data?.services) {
      setServices(data.services);
    } else {
      console.error("No se pudieron cargar los servicios");
    }
  };
  cargarServicios();
  }, []);

  // Cargar portafolios
  useEffect(() => {
    const cargarPortafolios = async () => {
      const data = await fetchPortfolios();
      if (data?.portfolios) {
        setPortfolios(data.portfolios);
        setFilteredPortfolios(data.portfolios);
      } else {
        toast.error("Error cargando portafolios");
      }
    };
    cargarPortafolios();
  }, []);

  // Filtrar por tipo
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    if (!term) {
      setFilteredPortfolios(portfolios);
    } else {
      setFilteredPortfolios(
        portfolios.filter((p) =>
          p.service_name?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, portfolios]);

  // Agregar portafolio
  const handleAddPortfolio = async () => {
    if (!newPortfolioData.description || !newPortfolioData.image) {
      toast.error("Completa todos los campos");
      return;
    }

    const formData = new FormData();
    formData.append("id_service", newPortfolioData.id_service);
    formData.append("image", newPortfolioData.image);
    formData.append("description", newPortfolioData.description);
    try {
      const data = await createPortfolio(formData);
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setPortfolios((prev) => [...prev, data.portfolio]);
      setFilteredPortfolios((prev) => [...prev, data.portfolio]);
      toast.success("Portafolio agregado correctamente");
      setShowModal(false);
      setNewPortfolioData({ description: "", id_service: "", image: null });
    } catch {
      toast.error("Error de red al crear portafolio");
    }
  };
const handleUpdatePortfolio = async (data) => {
  try {
    const formData = new FormData();
    formData.append("description", data.description);
    formData.append("id_service", data.id_service);

    // Si el usuario subió una nueva imagen
    if (data.image) {
      formData.append("image", data.image);
    }

    // Llamada al servicio
    const res = await updatePortfolio(data.id, formData);

    if (res) {
      // ✅ Actualiza localmente con lo que el usuario digitó
      setPortfolios((prev) =>
        prev.map((p) =>
          p.portfolio_id === data.id
            ? {
                ...p,
                description: data.description,
                id_service: data.id_service,
                service_name: data.service_name,
                // si subió nueva imagen, la vista previa se usa localmente
                image_url: data.image
                  ? URL.createObjectURL(data.image)
                  : p.image_url,
              }
            : p
        )
      );

      toast.success("Portafolio actualizado correctamente");
      setShowEditModal(false);
    } else {
      toast.error("Error al actualizar el portafolio");
    }
  } catch (err) {
    toast.error("Error inesperado al actualizar");
  }
};



  return (
    <>
      {/* Toolbar */}
      <div className="ui-toolbar">
        <h1 className="ui-toolbar-title">Gestión de portafolio</h1>
        <div className="ui-toolbar-controls">
          <button className="ui-toolbar-btn" onClick={() => setShowModal(true)}>
            <FaPlus className="ui-toolbar-btn-icon" />
            Nuevo Portafolio
          </button>
          <div className="ui-toolbar-filter">
            <select
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ui-toolbar-select"
            >
              <option value="">Filtrar por servicio</option>
              {services.map((s) => (
                <option key={s.service_id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>


      {/* Grid de portafolios */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginTop: "1.5rem",
        }}
      >
        {filteredPortfolios.map((p) => (
          <PortfolioCard
            key={p.portfolio_id}
            portfolio={p}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      {/* Modal Agregar Portafolio */}
      {showModal && (
        <div className="portfolio-modal-overlay">
          <div className="portfolio-modal-content">
            <h2 className="portfolio-modal-title">Agregar nuevo portafolio</h2>

            <div className="portfolio-modal-body">
              {/* Imagen */}
              <div className="portfolio-modal-image-upload">
                <label htmlFor="portfolio-image" className="portfolio-modal-dropzone">
                  {newPortfolioData.image ? (
                    <img
                      src={URL.createObjectURL(newPortfolioData.image)}
                      alt="Vista previa"
                      className="portfolio-modal-preview"
                    />
                  ) : (
                    <span>Click para agregar la imagen</span>
                  )}
                </label>
                <input
                  type="file"
                  id="portfolio-image"
                  accept="image/png, image/jpeg"
                  onChange={(e) =>
                    setNewPortfolioData({ ...newPortfolioData, image: e.target.files[0] })
                  }
                  className="portfolio-modal-file-input"
                />
                {newPortfolioData.image && (
                  <p className="portfolio-modal-filename">{newPortfolioData.image.name}</p>
                )}
              </div>

              {/* Formulario */}
              <div className="portfolio-modal-form">
                <label className="portfolio-modal-label">Tipo de servicio</label>

                <select
                  value={newPortfolioData.id_service}
                  onChange={(e) => {
                    const selectedService = services.find(
                      (s) => s.service_id === Number(e.target.value)
                    );
                    setNewPortfolioData({
                      ...newPortfolioData,
                      id_service: Number(e.target.value),
                      service_name: selectedService?.service_name || ""
                    });
                  }}
                  className="portfolio-modal-select"
                >
                  <option value="">Selecciona un servicio</option>
                  {services.map((s) => (
                    <option key={s.service_id} value={s.service_id}>
                      {s.name}
                    </option>
                  ))}
                </select>


                <label className="portfolio-modal-label">Descripción</label>
                <textarea
                  value={newPortfolioData.description}
                  onChange={(e) =>
                    setNewPortfolioData({ ...newPortfolioData, description: e.target.value })
                  }
                  className="portfolio-modal-textarea"
                  placeholder="Escribe una descripción..."
                />
              </div>
            </div>

            <div className="portfolio-modal-actions">
              <button className="portfolio-modal-btn confirm" onClick={handleAddPortfolio}>
                Agregar
              </button>
              <button className="portfolio-modal-btn cancel" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Editar Portafolio */}
      {showEditModal && (
        <div className="portfolio-modal-overlay">
          <div className="portfolio-modal-content">
            <h2 className="portfolio-modal-title">Editar portafolio</h2>

            <div className="portfolio-modal-body">
              {/* Imagen */}
              <div className="portfolio-modal-image-upload">
              <label htmlFor="edit-portfolio-image" className="portfolio-modal-dropzone">
                {editPortfolioData.image ? (
                  <img
                    src={URL.createObjectURL(editPortfolioData.image)}
                    alt="Vista previa"
                    className="portfolio-modal-preview"
                  />
                ) : editPortfolioData.image_url ? (
                  <img
                    src={editPortfolioData.image_url}
                    alt="Imagen actual"
                    className="portfolio-modal-preview"
                  />
                ) : (
                  <span>Click para cambiar la imagen</span>
                )}
              </label>

                <input
                  type="file"
                  id="edit-portfolio-image"
                  accept="image/png, image/jpeg"
                  onChange={(e) =>
                    setEditPortfolioData({ ...editPortfolioData, image: e.target.files[0] })
                  }
                  className="portfolio-modal-file-input"
                />
                {editPortfolioData.image && (
                  <p className="portfolio-modal-filename">{editPortfolioData.image.name}</p>
                )}
              </div>

              {/* Formulario */}
              <div className="portfolio-modal-form">
                <label className="portfolio-modal-label">Tipo de servicio</label>
                <select
                  value={editPortfolioData.id_service}
                  onChange={(e) => {
                    const selectedService = services.find(
                      (s) => s.service_id === Number(e.target.value)
                    );
                    setEditPortfolioData({
                      ...editPortfolioData,
                      id_service: Number(e.target.value),
                      service_name: selectedService?.service_name || ""
                    });
                  }}
                  className="portfolio-modal-select"
                >
                  <option value="">Selecciona un servicio</option>
                  {services.map((s) => (
                    <option key={s.service_id} value={s.service_id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <label className="portfolio-modal-label">Descripción</label>
                <textarea
                  value={editPortfolioData.description}
                  onChange={(e) =>
                    setEditPortfolioData({ ...editPortfolioData, description: e.target.value })
                  }
                  className="portfolio-modal-textarea"
                  placeholder="Escribe una descripción..."
                />
              </div>
            </div>

            <div className="portfolio-modal-actions">
              <button
                className="portfolio-modal-btn confirm"
                onClick={() => handleUpdatePortfolio(editPortfolioData)}
              >
                Guardar cambios
              </button>
              <button
                className="portfolio-modal-btn cancel"
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/*Modal elimiar*/}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content medium">
            <h2>¿Eliminar portafolio?</h2>
            <p>
              ¿Estás seguro de que deseas eliminar el portafolio{" "}
              <strong>{portfolioToDelete?.service_name}</strong>?
            </p>
            <div className="modal-actions">
              <button className="modal-btn confirm" onClick={handleDeletePortfolio}>
                Sí, eliminar
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

export default ManagePortfolio;

