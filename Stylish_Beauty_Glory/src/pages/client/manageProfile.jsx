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
        setEditedGender(client.gender || "");
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
    setEditedGender(profile?.gender || "");
    setEditedPhone(getContactValue(profile?.contacts, "TELEFONO"));
    setEditedEmail(getContactValue(profile?.contacts, "EMAIL"));
    setIsEditingPersonal(false);
  };

  const hasChanges =
    profile &&
    (editedPrimaryName !== (profile.primary_name || "") ||
      editedSecondaryName !== (profile.secondary_name || "") ||
      editedFirstSurname !== (profile.first_surname || "") ||
      editedSecondSurname !== (profile.second_surname || "") ||
      editedBirthDate !== formatIsoDate(profile.birth_date) ||
      editedGender !== (profile.gender || "") ||
      editedPhone !== getContactValue(profile.contacts, "TELEFONO") ||
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
      phone: editedPhone,
      email: editedEmail,
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
        contacts: [
          { contact_type: "TELEFONO", contact_value: editedPhone },
          { contact_type: "EMAIL", contact_value: editedEmail },
        ],
      }));
      setIsEditingPersonal(false);
      toast.success(result?.message || "Datos personales actualizados correctamente");
    } catch (error) {
      console.error("Error en handleSavePersonal:", error);
      toast.error("Error al actualizar datos personales");
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
                <strong>Cedula:</strong> {profile.identity_card}
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
              Cambiar contrasena
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
            <h3>Informacion personal</h3>

            {isEditingPersonal ? (
              <div className="edit-actions">
                <button
                  className="profile-btn profile-btn-save"
                  disabled={!hasChanges}
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
                  <input
                    className="contact-input"
                    value={editedPrimaryName}
                    onChange={(event) => setEditedPrimaryName(event.target.value)}
                  />
                  <input
                    className="contact-input"
                    value={editedSecondaryName}
                    onChange={(event) => setEditedSecondaryName(event.target.value)}
                  />
                  <input
                    className="contact-input"
                    value={editedFirstSurname}
                    onChange={(event) => setEditedFirstSurname(event.target.value)}
                  />
                  <input
                    className="contact-input"
                    value={editedSecondSurname}
                    onChange={(event) => setEditedSecondSurname(event.target.value)}
                  />
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
                <span>{editedGender}</span>
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

            <div className="contact-field">
              <strong>Telefono</strong>
              {isEditingPersonal ? (
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

            <div className="contact-field">
              <strong>Email</strong>
              {isEditingPersonal ? (
                <input
                  type="email"
                  className="contact-input"
                  value={editedEmail}
                  onChange={(event) => setEditedEmail(event.target.value)}
                />
              ) : (
                <span>{editedEmail}</span>
              )}
            </div>
          </div>
        </section>
      </div>

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

            <p>Nueva contrasena:</p>
            <div className="password-input-wrapper">
              <input
                type={visiblePasswords.newPassword ? "text" : "password"}
                placeholder="Nueva contrasena"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="contact-input"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("newPassword")}
                aria-label={
                  visiblePasswords.newPassword ? "Ocultar contrasena" : "Mostrar contrasena"
                }
              >
                {visiblePasswords.newPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <p>Confirmar contrasena:</p>
            <div className="password-input-wrapper">
              <input
                type={visiblePasswords.confirmPassword ? "text" : "password"}
                placeholder="Confirmar contrasena"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="contact-input"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                aria-label={
                  visiblePasswords.confirmPassword
                    ? "Ocultar contrasena"
                    : "Mostrar contrasena"
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
                    toast.error("Las contrasenas no coinciden");
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
              Esta accion desactivara tu cuenta permanentemente. Para reactivarla, deberas contactar
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
