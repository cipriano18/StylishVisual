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
     Estados base
     =============================== */
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     Estados de edición (SIEMPRE declarados)
     =============================== */
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);

  const [editedPrimaryName, setEditedPrimaryName] = useState("");
  const [editedSecondaryName, setEditedSecondaryName] = useState("");
  const [editedFirstSurname, setEditedFirstSurname] = useState("");
  const [editedSecondSurname, setEditedSecondSurname] = useState("");
  const [editedBirthDate, setEditedBirthDate] = useState("");
  const [editedGender, setEditedGender] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  /* ===============================
     Modales
     =============================== */
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  /* ===============================
     Cargar perfil
     =============================== */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await axios.get(
          `${API_BASE}/profile/client`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data.client;
        setProfile(data);

        // Sincronizar estados editables
        setEditedPrimaryName(data.primary_name || "");
        setEditedSecondaryName(data.secondary_name || "");
        setEditedFirstSurname(data.first_surname || "");
        setEditedSecondSurname(data.second_surname || "");
        setEditedBirthDate(data.birth_date ? data.birth_date.slice(0, 10) : "");
        setEditedGender(data.gender || "");

        const phone = data.contacts?.find(c => c.contact_type === "TELEFONO")?.contact_value || "";
        const email = data.contacts?.find(c => c.contact_type === "EMAIL")?.contact_value || "";

        setEditedPhone(phone);
        setEditedEmail(email);

      } catch (error) {
        console.error("Error al cargar perfil cliente:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ===============================
     Helpers
     =============================== */
  const hasChanges =
    profile &&
    (
      editedPrimaryName !== profile.primary_name ||
      editedSecondaryName !== profile.secondary_name ||
      editedFirstSurname !== profile.first_surname ||
      editedSecondSurname !== profile.second_surname ||
      editedBirthDate !== (profile.birth_date?.slice(0, 10) || "") ||
      editedGender !== profile.gender ||
      editedPhone !== (profile.contacts?.find(c => c.contact_type === "TELEFONO")?.contact_value || "") ||
      editedEmail !== (profile.contacts?.find(c => c.contact_type === "EMAIL")?.contact_value || "")
    );

  /* ===============================
     Render condicional (SEGURO)
     =============================== */
  if (loading) return <p>Cargando perfil...</p>;
  if (!profile) return <p>No se pudo cargar el perfil.</p>;

  /* ===============================
     JSX
     =============================== */
  return (
    <>
      <div className="profile-wrapper">

        <h2 className="profile-greeting">
          Hola de nuevo {profile.primary_name} {profile.first_surname}!
        </h2>

        {/* Cuenta */}
        <section className="profile-section account">
          <div className="account-left">
            <FaUserCircle className="profile-icon" />
            <div className="profile-info">
              <div className="profile-username">{profile.user.username}</div>

              <div className="profile-entry-date">
                <strong>Cédula:</strong> {profile.identity_card}
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

        {/* Información personal */}
        <section className="profile-section contacts">
          <div className="section-header">
            <h3>Información personal</h3>

            {isEditingPersonal ? (
              <div className="edit-actions">
                <button className="profile-btn profile-btn-save" disabled={!hasChanges}>
                  Guardar
                </button>
                <button
                  className="profile-btn profile-btn-edit"
                  onClick={() => setIsEditingPersonal(false)}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                className="profile-btn profile-btn-edit"
                onClick={() => setIsEditingPersonal(true)}
              >
                <FaPencilAlt className="btn-icon" />
                Editar
              </button>
            )}
          </div>

          <div className="contact-info">
            <div className="contact-field">
              <strong>Nombre completo</strong>
              {isEditingPersonal ? (
                <div className="name-inputs">
                  <input value={editedPrimaryName} onChange={e => setEditedPrimaryName(e.target.value)} />
                  <input value={editedSecondaryName} onChange={e => setEditedSecondaryName(e.target.value)} />
                  <input value={editedFirstSurname} onChange={e => setEditedFirstSurname(e.target.value)} />
                  <input value={editedSecondSurname} onChange={e => setEditedSecondSurname(e.target.value)} />
                </div>
              ) : (
                <span>{editedPrimaryName} {editedSecondaryName} {editedFirstSurname} {editedSecondSurname}</span>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ManageProfile;