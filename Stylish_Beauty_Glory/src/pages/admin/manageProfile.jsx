import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaPencilAlt, FaUserSlash, FaUser } from "react-icons/fa";
import { toast } from "react-hot-toast";

//CSS
import "../../styles/Profile_CSS/ProfileBase.css";

//Servicios
import { fetchAdminProfile } from "../../services/Serv_profiles";
import { updateAdmin } from "../../services/Serv_admins";
import { updateUser, inactivateUser } from "../../services/Serv_users";

function ManageProfile() {
  const navigate = useNavigate();

  // Estados de perfil
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  //edicion de contactos
  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [editedPhone, setEditedPhone] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  //edicion de datos profesionales
  const [isEditingProfessional, setIsEditingProfessional] = useState(false);
  const [editedSpecialty, setEditedSpecialty] = useState("");
  const [editedCertifications, setEditedCertifications] = useState("");
  const [editedWorkingDays, setEditedWorkingDays] = useState("");

  //edicion de contraseña
  const [showUserModal, setShowUserModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Cargar perfil
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchAdminProfile();
        if (data?.admin) {
          const admin = data.admin;
          // Normalizar contactos
          const contacts = admin.contacts.map((c) => ({
            type: c.contact_type,
            value: c.contact_value,
          }));
          // Set perfil
          setProfile({ ...admin, contacts });
          // Inicializar estados editables
          setEditedPhone(contacts.find((c) => c.type === "TELEFONO")?.value || "");
          setEditedEmail(contacts.find((c) => c.type === "EMAIL")?.value || "");
          setEditedSpecialty(admin.specialty || "");
          setEditedCertifications(admin.certifications || "");
          setEditedWorkingDays(admin.working_days || "");
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        toast.error(data?.error || "Error al cargar perfil");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  //Carga
  if (loading) return <p>Cargando perfil...</p>;
  if (!profile) return <p>No se pudo cargar el perfil.</p>;

  //detectar cambios
  const hasContactChanges =
    editedPhone !== profile.contacts.find((c) => c.type === "TELEFONO")?.value ||
    editedEmail !== profile.contacts.find((c) => c.type === "EMAIL")?.value;

  const hasProfessionalChanges =
    editedSpecialty !== profile.specialty ||
    editedCertifications !== profile.certifications ||
    editedWorkingDays !== profile.working_days;

  // actualizar usuario (nombre y/o contraseña)
  const handleUpdateUser = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.user_id;

      const updatedData = {};

      if (newPassword) {
        updatedData.password = newPassword;
      }
      if (newUsername) {
        updatedData.username = newUsername;
      }

      const result = await updateUser(userId, updatedData);

      if (result && !result.error) {
        console.log("Usuario actualizado en backend:", result);
        toast.success(result.message || "Usuario actualizado correctamente");
        setShowUserModal(false);
        setNewPassword("");
        setConfirmPassword("");
        setNewUsername("");
      } else {
        console.error("Error al actualizar usuario:", result?.error);
        toast.error(result?.error || "Error al actualizar usuario");
      }
    } catch (err) {
      console.error("Error en handleUpdateUser:", err);
      toast.error("Error al actualizar usuario");
    }
  };

  const handleSaveContacts = async () => {
    try {
      const identityCard = profile.identity_card;

      const updatedData = {
        email: editedEmail,
        phone: editedPhone,
      };

      const result = await updateAdmin(identityCard, updatedData);

      if (result && !result.error) {
        // Actualiza estado local
        setProfile((prev) => ({
          ...prev,
          email: editedEmail,
          phone: editedPhone,
        }));
        setIsEditingContacts(false);
        console.log("Contactos actualizados en backend:", result);
        toast.success(result.message || "Contactos actualizados correctamente");
      } else {
        console.error("Error al actualizar contactos:", result?.error);
        toast.error(result?.error || "Error al actualizar contactos");
      }
    } catch (err) {
      console.error("Error en handleSaveContacts:", err);
      toast.error("Error al actualizar contactos");
    }
  };

  const handleSaveProfessional = async () => {
    try {
      const identityCard = profile.identity_card;

      const updatedData = {
        specialty: editedSpecialty,
        certifications: editedCertifications,
        working_days: editedWorkingDays,
      };

      const result = await updateAdmin(identityCard, updatedData);

      if (result && !result.error) {
        setProfile((prev) => ({
          ...prev,
          ...updatedData,
        }));
        setIsEditingProfessional(false);
        toast.success(result.message || "Datos profesionales actualizados correctamente");
      } else {
        toast.error(result?.error || "Error al actualizar datos profesionales");
      }
    } catch (err) {
      toast.error("Error al actualizar datos profesionales");
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.user_id;

      const result = await inactivateUser(userId);

      if (result && !result.error) {
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
              onClick={() => setShowUserModal(true)}
            >
              <FaUser className="btn-icon" />
              Editar mi usuario
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
                  onChange={(e) => setEditedPhone(e.target.value)}
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
                  onChange={(e) => setEditedEmail(e.target.value)}
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

          <p>
            <strong>Especialidad:</strong>
          </p>
          {isEditingProfessional ? (
            <textarea
              value={editedSpecialty}
              onChange={(e) => setEditedSpecialty(e.target.value)}
              className="contact-textarea"
            />
          ) : (
            <p>{editedSpecialty}</p>
          )}

          <p>
            <strong>Certificaciones:</strong>
          </p>
          {isEditingProfessional ? (
            <textarea
              value={editedCertifications}
              onChange={(e) => setEditedCertifications(e.target.value)}
              className="contact-textarea"
            />
          ) : (
            <p>{editedCertifications}</p>
          )}

          <p>
            <strong>Días laborales:</strong>
          </p>
          {isEditingProfessional ? (
            <textarea
              value={editedWorkingDays}
              onChange={(e) => setEditedWorkingDays(e.target.value)}
              className="contact-textarea"
            />
          ) : (
            <p>{editedWorkingDays}</p>
          )}
        </section>
      </div>

      {/* MODAL USUARIO */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <h3>Editar usuario</h3>

            <p>Nombre de usuario:</p>
            <input
              type="text"
              placeholder="Nuevo nombre"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="contact-input"
            />

            <p>Nueva contraseña:</p>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="contact-input"
            />

            <p>Confirmar contraseña:</p>
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="contact-input"
            />

            <div className="modal-actions">
              <button
                className="modal-btn confirm"
                onClick={() => {
                  if (!newPassword || newPassword === confirmPassword) {
                    handleUpdateUser();
                  } else {
                    toast.error("Las contraseñas no coinciden o son demasiado cortas");
                  }
                }}
              >
                Guardar
              </button>
              <button className="modal-btn cancel" onClick={() => setShowUserModal(false)}>
                Cancelar
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
            <p>
              Esta acción desactivará tu cuenta permanentemente. Para reactivarla, deberás contactar
              al administrador.
            </p>
            <div className="modal-actions">
              <button
                className="modal-btn confirm"
                onClick={() => {
                  handleDeactivateAccount();
                  setShowDeactivateModal(false);
                }}
              >
                Confirmar
              </button>
              <button className="modal-btn cancel" onClick={() => setShowDeactivateModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageProfile;
