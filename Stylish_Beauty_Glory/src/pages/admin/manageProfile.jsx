import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUserCircle,
  FaPencilAlt,
  FaKey,
  FaUserSlash,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import "../../styles/Profile_CSS/ProfileBase.css";
import { API_BASE } from "../../services/config";

function ManageProfile() {

  /* ===============================
     🔹 Estados BASE (SIEMPRE ARRIBA)
     =============================== */
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     🔹 Estados CONTACTOS
     =============================== */
  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [editedPhone, setEditedPhone] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  /* ===============================
     🔹 Estados PROFESIONALES
     =============================== */
  const [isEditingProfessional, setIsEditingProfessional] = useState(false);
  const [editedSpecialty, setEditedSpecialty] = useState("");
  const [editedCertifications, setEditedCertifications] = useState("");
  const [editedWorkingDays, setEditedWorkingDays] = useState("");

  /* ===============================
     🔹 Estados MODALES
     =============================== */
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  /* ===============================
     🔄 Cargar perfil desde backend
     =============================== */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await axios.get(
          `${API_BASE}/profile/admin`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const admin = res.data.admin;

        // Normalizar contactos
        const contacts = admin.contacts.map(c => ({
          type: c.contact_type,
          value: c.contact_value,
        }));

        // Set perfil
        setProfile({
          ...admin,
          contacts,
        });

        // Inicializar estados editables
        setEditedPhone(contacts.find(c => c.type === "TELEFONO")?.value || "");
        setEditedEmail(contacts.find(c => c.type === "EMAIL")?.value || "");
        setEditedSpecialty(admin.specialty || "");
        setEditedCertifications(admin.certifications || "");
        setEditedWorkingDays(admin.working_days || "");

      } catch (error) {
        console.error(
          "Error al cargar perfil:",
          error.response?.status,
          error.response?.data
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ===============================
     ⏳ Estados de carga seguros
     =============================== */
  if (loading) return <p>Cargando perfil...</p>;
  if (!profile) return <p>No se pudo cargar el perfil.</p>;

  /* ===============================
     🧠 Detectar cambios
     =============================== */
  const hasContactChanges =
    editedPhone !== profile.contacts.find(c => c.type === "TELEFONO")?.value ||
    editedEmail !== profile.contacts.find(c => c.type === "EMAIL")?.value;

  const hasProfessionalChanges =
    editedSpecialty !== profile.specialty ||
    editedCertifications !== profile.certifications ||
    editedWorkingDays !== profile.working_days;

  /* ===============================
     🧩 Handlers
     =============================== */
  const handleSaveContacts = () => {
    console.log("Contactos actualizados:", editedPhone, editedEmail);
    setIsEditingContacts(false);
  };

  const handleSaveProfessional = () => {
    console.log("Datos profesionales actualizados:", {
      especialidad: editedSpecialty,
      certificaciones: editedCertifications,
      dias: editedWorkingDays,
    });
    setIsEditingProfessional(false);
  };

  /* ===============================
     🖥️ JSX
     =============================== */
  return (
    <>
      <div className="profile-wrapper">

        <h2 className="profile-greeting">
          Hola de nuevo {profile.primary_name} {profile.first_surname}!
        </h2>

        {/* CUENTA */}
        <section className="profile-section account">
          <div className="account-left">
            <FaUserCircle className="profile-icon" />
            <div className="profile-info">
              <div className="profile-username">{profile.user.username}</div>
              <div className="profile-entry-date">
                <strong>Ingreso:</strong> {profile.entry_date.slice(0, 10)}
              </div>
              <div className={`profile-status ${profile.user.status.toLowerCase()}`}>
                <span className="status-dot"></span>
                {profile.user.status}
              </div>
            </div>
          </div>

          <div className="account-right">
            <button
              className="profile-btn profile-btn-primary"
              onClick={() => setShowPasswordModal(true)}
            >
              <FaKey className="btn-icon" />
              Cambiar contraseña
            </button>

            <button
              className="profile-btn profile-btn-danger"
              onClick={() => setShowDeactivateModal(true)}
            >
              <FaUserSlash className="btn-icon" />
              Darme de baja
            </button>
          </div>
        </section>

        {/* CONTACTOS */}
        <section className="profile-section contacts">
          <div className="section-header">
            <h3>Información de contacto</h3>

            {isEditingContacts ? (
              <div className="edit-actions">
                <button
                  className="profile-btn profile-btn-save"
                  onClick={handleSaveContacts}
                  disabled={!hasContactChanges}
                >
                  Guardar
                </button>
                <button
                  className="profile-btn profile-btn-edit"
                  onClick={() => setIsEditingContacts(false)}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                className="profile-btn profile-btn-edit"
                onClick={() => setIsEditingContacts(true)}
              >
                <FaPencilAlt className="btn-icon" />
                Editar
              </button>
            )}
          </div>

          <div className="contact-info">
            <div className="contact-field">
              <strong>Teléfono</strong>
              {isEditingContacts ? (
                <input
                  value={editedPhone}
                  onChange={e => setEditedPhone(e.target.value)}
                  className="contact-input"
                />
              ) : (
                <span>{editedPhone}</span>
              )}
            </div>

            <div className="contact-field">
              <strong>Email</strong>
              {isEditingContacts ? (
                <input
                  value={editedEmail}
                  onChange={e => setEditedEmail(e.target.value)}
                  className="contact-input"
                />
              ) : (
                <span>{editedEmail}</span>
              )}
            </div>
          </div>
        </section>

        {/* PROFESIONAL */}
        <section className="profile-section professional">
          <div className="section-header">
            <h3>Datos profesionales</h3>

            {isEditingProfessional ? (
              <div className="edit-actions">
                <button
                  className="profile-btn profile-btn-save"
                  onClick={handleSaveProfessional}
                  disabled={!hasProfessionalChanges}
                >
                  Guardar
                </button>
                <button
                  className="profile-btn profile-btn-edit"
                  onClick={() => setIsEditingProfessional(false)}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                className="profile-btn profile-btn-edit"
                onClick={() => setIsEditingProfessional(true)}
              >
                <FaPencilAlt className="btn-icon" />
                Editar
              </button>
            )}
          </div>

          <p><strong>Especialidad:</strong></p>
          {isEditingProfessional ? (
            <textarea
              value={editedSpecialty}
              onChange={e => setEditedSpecialty(e.target.value)}
              className="contact-textarea"
            />
          ) : (
            <p>{editedSpecialty}</p>
          )}

          <p><strong>Certificaciones:</strong></p>
          {isEditingProfessional ? (
            <textarea
              value={editedCertifications}
              onChange={e => setEditedCertifications(e.target.value)}
              className="contact-textarea"
            />
          ) : (
            <p>{editedCertifications}</p>
          )}

          <p><strong>Días laborales:</strong></p>
          {isEditingProfessional ? (
            <textarea
              value={editedWorkingDays}
              onChange={e => setEditedWorkingDays(e.target.value)}
              className="contact-textarea"
            />
          ) : (
            <p>{editedWorkingDays}</p>
          )}
        </section>
      </div>

      {/* MODAL CONTRASEÑA */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <h3>Cambiar contraseña</h3>

            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="contact-input"
            />

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="contact-input"
            />

            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancelar
              </button>
              <button
                className="modal-btn confirm"
                onClick={() => {
                  if (newPassword === confirmPassword && newPassword.length >= 6) {
                    console.log("Contraseña actualizada");
                    setShowPasswordModal(false);
                  }
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BAJA */}
      {showDeactivateModal && (
        <div className="modal-overlay">
          <div className="modal-content medium">
            <h3>¿Estás seguro?</h3>
            <p>Esta acción desactivará tu cuenta.</p>
            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setShowDeactivateModal(false)}
              >
                Cancelar
              </button>
              <button
                className="modal-btn confirm"
                onClick={() => {
                  console.log("Cuenta desactivada");
                  setShowDeactivateModal(false);
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageProfile; 