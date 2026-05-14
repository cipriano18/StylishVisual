import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaPencilAlt, FaKey, FaUserSlash, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";

import "../../styles/Profile_CSS/ProfileBase.css";
import { fetchClientProfile } from "../../services/Serv_profiles";
import { updateUser, inactivateUser } from "../../services/Serv_users";
import { updateClient } from "../../services/Serv_clients";
import { getContactValue, formatIsoDate } from "../../utils/profile";
import { getStoredUser, setStoredUser } from "../../utils/session";

const normalizeGenderValue = (genderValue = "") => {
  const normalizedValue = genderValue.trim().toLowerCase();

  if (normalizedValue.startsWith("m")) return "Masculino";
  if (normalizedValue.startsWith("f")) return "Femenino";
  if (normalizedValue.startsWith("o")) return "Otro";

  return genderValue;
};

function ManageProfile() {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [editedPrimaryName, setEditedPrimaryName] = useState("");
  const [editedSecondaryName, setEditedSecondaryName] = useState("");
  const [editedFirstSurname, setEditedFirstSurname] = useState("");
  const [editedSecondSurname, setEditedSecondSurname] = useState("");
  const [editedBirthDate, setEditedBirthDate] = useState("");
  const [editedGender, setEditedGender] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchClientProfile();
        if (!response?.client) {
          toast.error(response?.error || "No se pudo cargar el perfil");
          return;
        }

        const client = response.client;
        setProfile(client);
        setEditedPrimaryName(client.primary_name || "");
        setEditedSecondaryName(client.secondary_name || "");
        setEditedFirstSurname(client.first_surname || "");
        setEditedSecondSurname(client.second_surname || "");
        setEditedBirthDate(formatIsoDate(client.birth_date));
        setEditedGender(normalizeGenderValue(client.gender || ""));
        setEditedPhone(getContactValue(client.contacts, "TELEFONO"));
        setEditedEmail(getContactValue(client.contacts, "EMAIL"));
      } catch (error) {
        console.error("Error al cargar perfil cliente:", error);
        toast.error("No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const resetUserFields = () => {
    setShowPasswordModal(false);
    setNewUsername("");
    setNewPassword("");
    setConfirmPassword("");
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

  const resetPersonalFields = () => {
    setEditedPrimaryName(profile?.primary_name || "");
    setEditedSecondaryName(profile?.secondary_name || "");
    setEditedFirstSurname(profile?.first_surname || "");
    setEditedSecondSurname(profile?.second_surname || "");
    setEditedBirthDate(formatIsoDate(profile?.birth_date));
    setEditedGender(normalizeGenderValue(profile?.gender || ""));
    setIsEditingPersonal(false);
  };

  const resetContactFields = () => {
    setEditedPhone(getContactValue(profile?.contacts, "TELEFONO"));
    setEditedEmail(getContactValue(profile?.contacts, "EMAIL"));
    setIsEditingContacts(false);
  };

  const hasPersonalChanges =
    profile &&
    (editedPrimaryName !== (profile.primary_name || "") ||
      editedSecondaryName !== (profile.secondary_name || "") ||
      editedFirstSurname !== (profile.first_surname || "") ||
      editedSecondSurname !== (profile.second_surname || "") ||
      editedBirthDate !== formatIsoDate(profile.birth_date) ||
      editedGender !== normalizeGenderValue(profile.gender || ""));

  const hasContactChanges =
    profile &&
    (editedPhone !== getContactValue(profile.contacts, "TELEFONO") ||
      editedEmail !== getContactValue(profile.contacts, "EMAIL"));

  const handleUpdateUser = async () => {
    const storedUser = getStoredUser();
    const userId = storedUser?.user_id;

    if (!userId) {
      toast.error("No se pudo identificar el usuario actual");
      return;
    }

    const updatedData = {};
    if (newUsername) updatedData.username = newUsername;
    if (newPassword) updatedData.password = newPassword;

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
      console.error("Error al actualizar usuario:", error);
      toast.error("Error al actualizar usuario");
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

  const handleSavePersonal = async () => {
    const updatedData = {
      primary_name: editedPrimaryName,
      secondary_name: editedSecondaryName,
      first_surname: editedFirstSurname,
      second_surname: editedSecondSurname,
      gender: editedGender?.trim().charAt(0).toUpperCase(),
      birth_date: editedBirthDate,
    };

    try {
      const result = await updateClient(profile.identity_card, updatedData);
      if (result?.error) {
        toast.error(result.error || "Error al actualizar datos personales");
        return;
      }

      setProfile((previousValue) => ({
        ...previousValue,
        ...updatedData,
      }));
      setIsEditingPersonal(false);
      toast.success(result?.message || "Datos personales actualizados correctamente");
    } catch (error) {
      console.error("Error en handleSavePersonal:", error);
      toast.error("Error al actualizar datos personales");
    }
  };

  const handleSaveContacts = async () => {
    const updatedData = {
      phone: editedPhone,
      email: editedEmail,
    };

    try {
      const result = await updateClient(profile.identity_card, updatedData);
      if (result?.error) {
        toast.error(result.error || "Error al actualizar datos de contacto");
        return;
      }

      setProfile((previousValue) => ({
        ...previousValue,
        contacts: [
          { contact_type: "TELEFONO", contact_value: editedPhone },
          { contact_type: "EMAIL", contact_value: editedEmail },
        ],
      }));
      setIsEditingContacts(false);
      toast.success(result?.message || "Datos de contacto actualizados correctamente");
    } catch (error) {
      console.error("Error en handleSaveContacts:", error);
      toast.error("Error al actualizar datos de contacto");
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

        <section className="profile-section contacts">
          <div className="section-header">
            <h3>Información personal</h3>

            {isEditingPersonal ? (
              <div className="edit-actions">
                <button
                  className="profile-btn profile-btn-save"
                  disabled={!hasPersonalChanges}
                  onClick={handleSavePersonal}
                >
                  Guardar
                </button>
                <button className="profile-btn profile-btn-edit" onClick={resetPersonalFields}>
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
                  <label className="name-input-group">
                    <span className="name-input-label">Primer nombre</span>
                    <input
                      className="contact-input"
                      value={editedPrimaryName}
                      onChange={(event) => setEditedPrimaryName(event.target.value)}
                    />
                  </label>
                  <label className="name-input-group">
                    <span className="name-input-label">Segundo nombre</span>
                    <input
                      className="contact-input"
                      value={editedSecondaryName}
                      onChange={(event) => setEditedSecondaryName(event.target.value)}
                    />
                  </label>
                  <label className="name-input-group">
                    <span className="name-input-label">Primer apellido</span>
                    <input
                      className="contact-input"
                      value={editedFirstSurname}
                      onChange={(event) => setEditedFirstSurname(event.target.value)}
                    />
                  </label>
                  <label className="name-input-group">
                    <span className="name-input-label">Segundo apellido</span>
                    <input
                      className="contact-input"
                      value={editedSecondSurname}
                      onChange={(event) => setEditedSecondSurname(event.target.value)}
                    />
                  </label>
                </div>
              ) : (
                <span>
                  {editedPrimaryName} {editedSecondaryName} {editedFirstSurname}{" "}
                  {editedSecondSurname}
                </span>
              )}
            </div>

            <div className="contact-field">
              <strong>Genero</strong>
              {isEditingPersonal ? (
                <select
                  className="contact-input"
                  value={editedGender}
                  onChange={(event) => setEditedGender(event.target.value)}
                >
                  <option value="">Seleccione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              ) : (
                <span>{normalizeGenderValue(editedGender)}</span>
              )}
            </div>

            <div className="contact-field">
              <strong>Fecha de nacimiento</strong>
              {isEditingPersonal ? (
                <input
                  type="date"
                  className="contact-input"
                  value={editedBirthDate}
                  onChange={(event) => setEditedBirthDate(event.target.value)}
                />
              ) : (
                <span>{editedBirthDate}</span>
              )}
            </div>
          </div>
        </section>

        <section className="profile-section contacts">
          <div className="section-header">
            <h3>Información de contacto</h3>

            {isEditingContacts ? (
              <div className="edit-actions">
                <button
                  className="profile-btn profile-btn-save"
                  disabled={!hasContactChanges}
                  onClick={handleSaveContacts}
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
                  type="tel"
                  className="contact-input"
                  value={editedPhone}
                  onChange={(event) => setEditedPhone(event.target.value)}
                />
              ) : (
                <span>{editedPhone}</span>
              )}
            </div>

            <div className="contact-field contact-field-email">
              <strong>Email</strong>
              {isEditingContacts ? (
                <input
                  type="email"
                  className="contact-input contact-input-email"
                  value={editedEmail}
                  onChange={(event) => setEditedEmail(event.target.value)}
                />
              ) : (
                <span>{editedEmail}</span>
              )}
            </div>
          </div>
        </section>

        {showPasswordModal && (
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
                Esta acción desactivara tu cuenta permanentemente. Para reactivarla, deberÃ¡s
                contactar al administrador.
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
      </div>
    </>
  );
}

export default ManageProfile;
