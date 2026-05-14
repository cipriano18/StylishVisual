import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaPencilAlt, FaUserSlash, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";

import "../../styles/Profile_CSS/ProfileBase.css";
import { fetchAdminProfile } from "../../services/Serv_profiles";
import { updateAdmin } from "../../services/Serv_admins";
import { updateUser, inactivateUser } from "../../services/Serv_users";
import { getContactValue, normalizeContacts, formatIsoDate } from "../../utils/profile";
import { getStoredUser, setStoredUser } from "../../utils/session";

function ManageProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [editedPhone, setEditedPhone] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [isEditingProfessional, setIsEditingProfessional] = useState(false);
  const [editedSpecialty, setEditedSpecialty] = useState("");
  const [editedCertifications, setEditedCertifications] = useState("");
  const [editedWorkingDays, setEditedWorkingDays] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchAdminProfile();
        if (!response?.admin) {
          toast.error(response?.error || "Error al cargar perfil");
          return;
        }

        const admin = response.admin;
        const contacts = normalizeContacts(admin.contacts);

        setProfile({ ...admin, contacts });
        setEditedPhone(getContactValue(contacts, "TELEFONO"));
        setEditedEmail(getContactValue(contacts, "EMAIL"));
        setEditedSpecialty(admin.specialty || "");
        setEditedCertifications(admin.certifications || "");
        setEditedWorkingDays(admin.working_days || "");
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        toast.error("Error al cargar perfil");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const resetUserFields = () => {
    setShowUserModal(false);
    setNewPassword("");
    setConfirmPassword("");
    setNewUsername("");
    setVisiblePasswords({
      newPassword: false,
      confirmPassword: false,
    });
  };

  const togglePasswordVisibility = (field) => {
    setVisiblePasswords((previousValue) => ({
      ...previousValue,
      [field]: !previousValue[field],
    }));
  };

  const resetContactFields = () => {
    setEditedPhone(getContactValue(profile?.contacts, "TELEFONO"));
    setEditedEmail(getContactValue(profile?.contacts, "EMAIL"));
    setIsEditingContacts(false);
  };

  const resetProfessionalFields = () => {
    setEditedSpecialty(profile?.specialty || "");
    setEditedCertifications(profile?.certifications || "");
    setEditedWorkingDays(profile?.working_days || "");
    setIsEditingProfessional(false);
  };

  const hasContactChanges =
    editedPhone !== getContactValue(profile?.contacts, "TELEFONO") ||
    editedEmail !== getContactValue(profile?.contacts, "EMAIL");

  const hasProfessionalChanges =
    editedSpecialty !== (profile?.specialty || "") ||
    editedCertifications !== (profile?.certifications || "") ||
    editedWorkingDays !== (profile?.working_days || "");

  const handleUpdateUser = async () => {
    const storedUser = getStoredUser();
    const userId = storedUser?.user_id;

    if (!userId) {
      toast.error("No se pudo identificar el usuario actual");
      return;
    }

    const updatedData = {};
    if (newPassword) updatedData.password = newPassword;
    if (newUsername) updatedData.username = newUsername;

    if (Object.keys(updatedData).length === 0) {
      toast.error("No hay cambios para guardar");
      return;
    }

    try {
      const result = await updateUser(userId, updatedData);
      if (result?.error) {
        toast.error(result.error || "Error al actualizar usuario");
        return;
      }

      if (newUsername) {
        const nextUser = { ...storedUser, username: newUsername };
        setStoredUser(nextUser);
        setProfile((previousValue) => ({
          ...previousValue,
          user: {
            ...previousValue.user,
            username: newUsername,
          },
        }));
      }

      toast.success(result?.message || "Usuario actualizado correctamente");
      resetUserFields();
    } catch (error) {
      console.error("Error en handleUpdateUser:", error);
      toast.error("Error al actualizar usuario");
    }
  };

  const handleSaveContacts = async () => {
    try {
      const result = await updateAdmin(profile.identity_card, {
        email: editedEmail,
        phone: editedPhone,
      });

      if (result?.error) {
        toast.error(result.error || "Error al actualizar contactos");
        return;
      }

      const nextContacts = [
        { type: "TELEFONO", value: editedPhone },
        { type: "EMAIL", value: editedEmail },
      ];

      setProfile((previousValue) => ({
        ...previousValue,
        contacts: nextContacts,
      }));
      setIsEditingContacts(false);
      toast.success(result?.message || "Contactos actualizados correctamente");
    } catch (error) {
      console.error("Error en handleSaveContacts:", error);
      toast.error("Error al actualizar contactos");
    }
  };

  const handleSaveProfessional = async () => {
    const updatedData = {
      specialty: editedSpecialty,
      certifications: editedCertifications,
      working_days: editedWorkingDays,
    };

    try {
      const result = await updateAdmin(profile.identity_card, updatedData);
      if (result?.error) {
        toast.error(result.error || "Error al actualizar datos profesionales");
        return;
      }

      setProfile((previousValue) => ({
        ...previousValue,
        ...updatedData,
      }));
      setIsEditingProfessional(false);
      toast.success(result?.message || "Datos profesionales actualizados correctamente");
    } catch (error) {
      console.error("Error en handleSaveProfessional:", error);
      toast.error("Error al actualizar datos profesionales");
    }
  };

  const handleDeactivateAccount = async () => {
    const storedUser = getStoredUser();
    const userId = storedUser?.user_id;

    if (!userId) {
      toast.error("No se pudo identificar el usuario actual");
      return;
    }

    try {
      const result = await inactivateUser(userId);
      if (result?.error) {
        toast.error(result.error || "Error al desactivar cuenta");
        return;
      }

      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error en handleDeactivateAccount:", error);
      toast.error("Error al desactivar cuenta");
    } finally {
      setShowDeactivateModal(false);
    }
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (!profile) return <p>No se pudo cargar el perfil.</p>;

  return (
    <>
      <div className="profile-wrapper">
        <h2 className="profile-greeting">
          Hola de nuevo {profile.primary_name} {profile.first_surname}!
        </h2>

        <section className="profile-section account">
          <div className="account-left">
            <FaUserCircle className="profile-icon" />
            <div className="profile-info">
              <div className="profile-username">{profile.user.username}</div>
              <div className="profile-entry-date">
                <strong>Ingreso:</strong> {formatIsoDate(profile.entry_date)}
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
                <button className="profile-btn profile-btn-edit" onClick={resetContactFields}>
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
                  onChange={(event) => setEditedPhone(event.target.value)}
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
                  onChange={(event) => setEditedEmail(event.target.value)}
                  className="contact-input"
                />
              ) : (
                <span>{editedEmail}</span>
              )}
            </div>
          </div>
        </section>

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
                <button className="profile-btn profile-btn-edit" onClick={resetProfessionalFields}>
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
              onChange={(event) => setEditedSpecialty(event.target.value)}
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
              onChange={(event) => setEditedCertifications(event.target.value)}
              className="contact-textarea"
            />
          ) : (
            <p>{editedCertifications}</p>
          )}

          <p>
            <strong>Dias laborales:</strong>
          </p>
          {isEditingProfessional ? (
            <textarea
              value={editedWorkingDays}
              onChange={(event) => setEditedWorkingDays(event.target.value)}
              className="contact-textarea"
            />
          ) : (
            <p>{editedWorkingDays}</p>
          )}
        </section>
      </div>

      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <h3>Editar usuario</h3>

            <p>Nombre de usuario:</p>
            <input
              type="text"
              placeholder="Nuevo nombre"
              value={newUsername}
              onChange={(event) => setNewUsername(event.target.value)}
              className="contact-input"
            />

            <p>Nueva contraseña:</p>
            <div className="password-input-wrapper">
              <input
                type={visiblePasswords.newPassword ? "text" : "password"}
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="contact-input"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("newPassword")}
                aria-label={
                  visiblePasswords.newPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {visiblePasswords.newPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <p>Confirmar contraseña:</p>
            <div className="password-input-wrapper">
              <input
                type={visiblePasswords.confirmPassword ? "text" : "password"}
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="contact-input"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                aria-label={
                  visiblePasswords.confirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {visiblePasswords.confirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="modal-actions">
              <button
                className="modal-btn confirm"
                onClick={() => {
                  if (!newPassword || newPassword === confirmPassword) {
                    handleUpdateUser();
                  } else {
                    toast.error("Las contraseñas no coinciden");
                  }
                }}
              >
                Guardar
              </button>
              <button className="modal-btn cancel" onClick={resetUserFields}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeactivateModal && (
        <div className="modal-overlay">
          <div className="modal-content medium">
            <h3>Estas seguro?</h3>
            <p>
              Esta acción desactivara tu cuenta permanentemente. Para reactivarla, deberás contactar
              al administrador.
            </p>
            <div className="modal-actions">
              <button className="modal-btn confirm" onClick={handleDeactivateAccount}>
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
