import { useState } from "react";
import {
  FaUserCircle,
  FaPencilAlt,
  FaKey,
  FaUserSlash,
  FaEye, 
  FaEyeSlash
} from "react-icons/fa";
import "../../styles/Profile_CSS/ProfileBase.css";

function ManageProfile() {
  const [profile] = useState({
    identity_card: "602530154",
    primary_name: "Carlos",
    secondary_name: "Andrés",
    first_surname: "Mora",
    second_surname: "Jiménez",
    birth_date: "1990-06-15T00:00:00.000Z",
    gender: "Masculino",
    user: {
      user_id: 2,
      username: "otro1234",
      status: "Activo",
      role_id: 2,
    },
    contacts: [
      { contact_type: "EMAIL", contact_value: "carlos@example.com" },
      { contact_type: "TELEFONO", contact_value: "88888888" },
    ],
  });

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);

  const [editedPrimaryName, setEditedPrimaryName] = useState(profile.primary_name);
  const [editedSecondaryName, setEditedSecondaryName] = useState(profile.secondary_name);
  const [editedFirstSurname, setEditedFirstSurname] = useState(profile.first_surname);
  const [editedSecondSurname, setEditedSecondSurname] = useState(profile.second_surname);

  const [editedBirthDate, setEditedBirthDate] = useState(
    profile.birth_date ? profile.birth_date.slice(0, 10) : ""
  );
  const [editedGender, setEditedGender] = useState(profile.gender);
  const [editedPhone, setEditedPhone] = useState(
    profile.contacts.find(c => c.contact_type === "TELEFONO")?.contact_value || ""
  );
  const [editedEmail, setEditedEmail] = useState(
    profile.contacts.find(c => c.contact_type === "EMAIL")?.contact_value || ""
  );

  const hasPersonalChanges =
    editedPrimaryName !== profile.primary_name ||
    editedSecondaryName !== profile.secondary_name ||
    editedFirstSurname !== profile.first_surname ||
    editedSecondSurname !== profile.second_surname ||
    editedBirthDate !== profile.birth_date.slice(0, 10) ||
    editedGender !== profile.gender ||
    editedPhone !== profile.contacts.find(c => c.contact_type === "TELEFONO")?.contact_value ||
    editedEmail !== profile.contacts.find(c => c.contact_type === "EMAIL")?.contact_value;

  const handleSavePersonal = () => {
    console.log("Datos personales guardados:", {
      primary_name: editedPrimaryName,
      secondary_name: editedSecondaryName,
      first_surname: editedFirstSurname,
      second_surname: editedSecondSurname,
      birth_date: editedBirthDate,
      gender: editedGender,
      phone: editedPhone,
      email: editedEmail,
    });
    setIsEditingPersonal(false);
  };
  {/*--- Manejo de cambio de contraseña (Modal)---*/}
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  {/*--- Manejo de dar de baja (Modal)---*/}
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  return (
    <>
    <div className="profile-wrapper">
      {/*Saludo */}
      <h2 className="profile-greeting">
        Hola de nuevo {profile.primary_name} {profile.first_surname}!
      </h2>

      {/*Sección de cuenta */}
      <section className="profile-section account">
        <div className="account-left">
          <FaUserCircle className="profile-icon" />
          <div className="profile-info">
            <div className="profile-username">{profile.user.username}</div>
            <div className="profile-entry-date">
              <strong>Cédula:</strong> {profile.identity_card || "Sin cédula"}
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
          <button className="profile-btn profile-btn-danger"
          onClick={() => setShowDeactivateModal(true)}
          >
            <FaUserSlash className="btn-icon" />
            Darme de baja
          </button>
        </div>
      </section>

        {/*Datos personales*/}
      <section className="profile-section contacts">
  <div className="section-header">
    <h3>Información personal</h3>
    {isEditingPersonal ? (
      <div className="edit-actions">
        <button
          className="profile-btn profile-btn-save"
          onClick={handleSavePersonal}
          disabled={!hasPersonalChanges}
        >
          Guardar
        </button>
        <button
          className="profile-btn profile-btn-edit"
          onClick={() => {
            setEditedPrimaryName(profile.primary_name);
            setEditedSecondaryName(profile.secondary_name);
            setEditedFirstSurname(profile.first_surname);
            setEditedSecondSurname(profile.second_surname);
            setEditedBirthDate(profile.birth_date.slice(0, 10));
            setEditedGender(profile.gender);
            setEditedPhone(profile.contacts.find(c => c.contact_type === "TELEFONO")?.contact_value || "");
            setEditedEmail(profile.contacts.find(c => c.contact_type === "EMAIL")?.contact_value || "");
            setIsEditingPersonal(false);
          }}
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
  <div className="name-field">
    <label>Primer nombre</label>
    <input
      type="text"
      value={editedPrimaryName}
      onChange={(e) => setEditedPrimaryName(e.target.value)}
      className="contact-input"
    />
  </div>
  <div className="name-field">
    <label>Segundo nombre</label>
    <input
      type="text"
      value={editedSecondaryName}
      onChange={(e) => setEditedSecondaryName(e.target.value)}
      className="contact-input"
    />
  </div>
  <div className="name-field">
    <label>Primer apellido</label>
    <input
      type="text"
      value={editedFirstSurname}
      onChange={(e) => setEditedFirstSurname(e.target.value)}
      className="contact-input"
    />
  </div>
  <div className="name-field">
    <label>Segundo apellido</label>
    <input
      type="text"
      value={editedSecondSurname}
      onChange={(e) => setEditedSecondSurname(e.target.value)}
      className="contact-input"
    />
  </div>
</div>
      ) : (
        <span>
          {editedPrimaryName} {editedSecondaryName} {editedFirstSurname} {editedSecondSurname}
        </span>
      )}
    </div>

    <div className="contact-field">
      <strong>Fecha de nacimiento</strong>
      {isEditingPersonal ? (
        <input
          type="date"
          value={editedBirthDate}
          onChange={(e) => setEditedBirthDate(e.target.value)}
          className="contact-input"
        />
      ) : (
        <span>{editedBirthDate}</span>
      )}
    </div>

    <div className="contact-field">
      <strong>Género</strong>
      {isEditingPersonal ? (
        <select
          value={editedGender}
          onChange={(e) => setEditedGender(e.target.value)}
          className="contact-input"
        >
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>
      ) : (
        <span>{editedGender}</span>
      )}
    </div>

    <div className="contact-field">
      <strong>Teléfono</strong>
      {isEditingPersonal ? (
        <input
          type="text"
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
      {isEditingPersonal ? (
        <input
          type="email"
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
    </div>

    {/* Modal de cambio de contraseña */}
    {showPasswordModal && (
      <div className="modal-overlay">
        <div className="modal-content small">
          <h3>Cambiar contraseña</h3>
          <div className="password-field">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="contact-input"
            />
            <button
              type="button"
              className="visibility-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? < FaEye/> : <FaEyeSlash />}
            </button>
          </div>

          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="contact-input"
            />
            <button
              type="button"
              className="visibility-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? < FaEye/> : <FaEyeSlash />}
            </button>
          </div>
          <div className="modal-actions">
            <button
              className="modal-btn cancel"
              onClick={() => {
                setNewPassword("");
                setConfirmPassword("");
                setShowPasswordModal(false);
              }}
            >
              Cancelar
            </button>
            <button
              className="modal-btn confirm"
              onClick={() => {
                if (newPassword === confirmPassword && newPassword.length >= 6) {
                  console.log("Contraseña actualizada:", newPassword);
                  setShowPasswordModal(false);
                  setNewPassword("");
                  setConfirmPassword("");
                } else {
                  alert("Las contraseñas no coinciden o son demasiado cortas.");
                }
              }}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    )}
    {/* Modal de dar de baja */}
    {showDeactivateModal && (
      <div className="modal-overlay">
        <div className="modal-content medium">
          <h3>¿Estás seguro?</h3>
          <p>Esta acción desactivará tu cuenta. ¿Querés continuar?</p>
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
                // Aquí podrías llamar a una función para desactivar la cuenta
              }}
            >
              Sí, darme de baja
            </button>
          </div>
        </div>
      </div>
    )}

    </>
  );
}
export default ManageProfile;