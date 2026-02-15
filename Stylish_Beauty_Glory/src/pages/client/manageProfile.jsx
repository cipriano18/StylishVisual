import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {FaUserCircle,FaPencilAlt,FaKey,FaUserSlash} from "react-icons/fa";
import "../../styles/Profile_CSS/ProfileBase.css";
import { fetchClientProfile } from "../../services/Serv_profiles";
import { updateUser, inactivateUser } from "../../services/Serv_users";
import { updateClient } from "../../services/Serv_clients"; 
import { toast } from "react-hot-toast";
import LoaderOverlay from "../overlay/UniversalOverlay";

function ManageProfile() {
  const navigate = useNavigate();
  //Modal de cambio de contraseña
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
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
     Cargar perfil
     =============================== */
    useEffect(() => {
       const loadProfile = async () => {
         try { 
          const data = await fetchClientProfile();
          if (data?.client) {
            const client = data.client;
            setProfile(client); 
            // Sincronizar estados editables 
            setEditedPrimaryName(client.primary_name || "");
            setEditedSecondaryName(client.secondary_name || "");
            setEditedFirstSurname(client.first_surname || "");
            setEditedSecondSurname(client.second_surname || "");
            setEditedBirthDate(client.birth_date ? client.birth_date.slice(0, 10) : "");
            setEditedGender(client.gender || "");
            const phone = client.contacts?.find(c => c.contact_type === "TELEFONO")?.contact_value || "";
            const email = client.contacts?.find(c => c.contact_type === "EMAIL")?.contact_value || "";

            setEditedPhone(phone);
            setEditedEmail(email);
           } 
          } catch (error) {
            console.error("Error al cargar perfil cliente:", error);
          } finally {
            setLoading(false); 
          } 
        }; 
        loadProfile(); 
      }, []);
      /* ===============================
      Handlers
      =============================== */

const handleUpdatePassword = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.user_id; 

    const updatedData = { password: newPassword };

    const result = await updateUser(userId, updatedData);

    if (result && !result.error) {
      toast.success(result.message || "Contraseña actualizada correctamente");
      setShowPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(result?.error || "Error al actualizar contraseña");
    }
  } catch (err) {
    toast.error("Error al actualizar contraseña");
  }
};

const handleDeactivateAccount = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.user_id;

    const result = await inactivateUser(userId);

    if (result && !result.error) {

      // Opcional: limpiar sesión y redirigir al login
      localStorage.clear();
      navigate("/");

    } else {
      console.error("Error al desactivar cuenta:", result?.error);
      toast.error(result?.error || "Error al desactivar cuenta");
    }
  } catch (err) {
    console.error("Error en handleDeactivateAccount:", err);
    toast.error("Error al desactivar cuenta");
  } finally {
    setShowDeactivateModal(false);
  }
};

const handleSavePersonal = async () => {
  try {
    const identityCard = profile.identity_card;

    const updatedData = {
      primary_name: editedPrimaryName,
      secondary_name: editedSecondaryName,
      first_surname: editedFirstSurname,
      second_surname: editedSecondSurname,
      gender: editedGender,
      birth_date: editedBirthDate,
      phone: editedPhone,
      email: editedEmail,
    };

    const result = await updateClient(identityCard, updatedData);

    if (result && !result.error) {
      // Actualizar estado local con los nuevos datos
      setProfile(prev => ({
        ...prev,
        ...updatedData,
      }));
      setIsEditingPersonal(false);
      toast.success(result.message || "Datos personales actualizados correctamente");
    } else {
      toast.error(result?.error || "Error al actualizar datos personales");
    }
  } catch (err) {
    console.error("Error en handleSavePersonal:", err);
    toast.error("Error al actualizar datos personales");
  }
};

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
      <button
        className="profile-btn profile-btn-save"
        disabled={!hasChanges}
        onClick={handleSavePersonal}
      >
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
{/* Nombre completo */}
<div className="contact-field">
  <strong>Nombre completo</strong>
  {isEditingPersonal ? (
    <div className="name-inputs">
      <input 
        className="contact-input"
        value={editedPrimaryName} 
        onChange={e => setEditedPrimaryName(e.target.value)} 
      />
      <input 
        className="contact-input"
        value={editedSecondaryName} 
        onChange={e => setEditedSecondaryName(e.target.value)} 
      />
      <input 
        className="contact-input"
        value={editedFirstSurname} 
        onChange={e => setEditedFirstSurname(e.target.value)} 
      />
      <input 
        className="contact-input"
        value={editedSecondSurname} 
        onChange={e => setEditedSecondSurname(e.target.value)} 
      />
    </div>
  ) : (
    <span>{editedPrimaryName} {editedSecondaryName} {editedFirstSurname} {editedSecondSurname}</span>
  )}
</div>

{/* Género */}
<div className="contact-field">
  <strong>Género</strong>
  {isEditingPersonal ? (
    <select 
      className="contact-input"
      value={editedGender} 
      onChange={e => setEditedGender(e.target.value)}
    >
      <option value="">Seleccione...</option>
      <option value="MASCULINO">Masculino</option>
      <option value="FEMENINO">Femenino</option>
      <option value="OTRO">Otro</option>
    </select>
  ) : (
    <span>{editedGender}</span>
  )}
</div>

{/* Fecha de nacimiento */}
<div className="contact-field">
  <strong>Fecha de nacimiento</strong>
  {isEditingPersonal ? (
    <input
      type="date"
      className="contact-input"
      value={editedBirthDate}
      onChange={e => setEditedBirthDate(e.target.value)}
    />
  ) : (
    <span>{editedBirthDate}</span>
  )}
</div>

{/* Teléfono */}
<div className="contact-field">
  <strong>Teléfono</strong>
  {isEditingPersonal ? (
    <input
      type="tel"
      className="contact-input"
      value={editedPhone}
      onChange={e => setEditedPhone(e.target.value)}
    />
  ) : (
    <span>{editedPhone}</span>
  )}
</div>

{/* Email */}
<div className="contact-field">
  <strong>Email</strong>
  {isEditingPersonal ? (
    <input
      type="email"
      className="contact-input"
      value={editedEmail}
      onChange={e => setEditedEmail(e.target.value)}
    />
  ) : (
    <span>{editedEmail}</span>
  )}
</div>
  </div>
</section>
      </div>
      {/* MODAL CONTRASEÑA */}
{showPasswordModal && (
  <div className="modal-overlay">
    <div className="modal-content small">
      <h3>Cambiar contraseña</h3>

      <input
        type="text"
        placeholder="Nueva contraseña"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        className="contact-input"
      />

      <input
        type="text"
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
              handleUpdatePassword();
            } else {
              toast.error("Las contraseñas no coinciden o son demasiado cortas");
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
            <p>Esta acción desactivará tu cuenta permanentemente. Para reactivarla, deberás contactar al administrador.</p>
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
                  handleDeactivateAccount();
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