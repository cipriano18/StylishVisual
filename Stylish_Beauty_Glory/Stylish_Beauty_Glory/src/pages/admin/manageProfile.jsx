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
    identity_card: "123456789",
    primary_name: "Makin",
    secondary_name: "David",
    first_surname: "Artavia",
    second_surname: "Zuniga",
    specialty: "Gestión de proyectos, Desarrollo de software, comunicación efectiva, liderazgo, trabajo en equipo, resolución de problemas, adaptabilidad, pensamiento crítico, creatividad, gestión del tiempo, atención al cliente, marketing digital, análisis de datos, diseño UX/UI",
    entry_date: "2025-09-01T00:00:00.000Z",
    certifications: "PMP, Scrum Master, ITIL, Six Sigma, AWS Certified Solutions Architect, Google Analytics, HubSpot Inbound Marketing, Adobe Certified Expert, Cisco CCNA, Microsoft Certified: Azure Fundamentals, CompTIA Security+, Certified Ethical Hacker (CEH), Lean Six Sigma Green Belt",
    working_days: "Lunes a Viernes, 8:00 AM - 5:00 PM, Sábados 9:00 AM - 1:00 PM, Domingos libres.",
    user: {
      user_id: 1,
      username: "Makartz",
      status: " Activo",
      role_id: 1,
    },
    contacts: [
      { type: "EMAIL", value: "maki@example.com" },
      { type: "TELEFONO", value: "88889999" },
    ],
  });

  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [editedPhone, setEditedPhone] = useState(
    profile.contacts.find(c => c.type === "TELEFONO")?.value || ""
  );
  const [editedEmail, setEditedEmail] = useState(
    profile.contacts.find(c => c.type === "EMAIL")?.value || ""
  );

  const [editedSpecialty, setEditedSpecialty] = useState(profile.specialty);
  const [editedCertifications, setEditedCertifications] = useState(profile.certifications);
  const [editedWorkingDays, setEditedWorkingDays] = useState(profile.working_days);

  const hasContactChanges =
  editedPhone !== profile.contacts.find(c => c.type === "TELEFONO")?.value ||
  editedEmail !== profile.contacts.find(c => c.type === "EMAIL")?.value;

    const handleSaveContacts = () => {
    console.log("Guardado:", editedPhone, editedEmail);
    setIsEditingContacts(false);
    // Aquí podrías actualizar el perfil si tenés backend
    };

    const [isEditingProfessional, setIsEditingProfessional] = useState(false);

const hasProfessionalChanges =
  editedSpecialty !== profile.specialty ||
  editedCertifications !== profile.certifications ||
  editedWorkingDays !== profile.working_days;

const handleSaveProfessional = () => {
  console.log("Datos profesionales guardados:", {
    especialidad: editedSpecialty,
    certificaciones: editedCertifications,
    dias: editedWorkingDays,
  });
  setIsEditingProfessional(false);
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
      {/* 👋 Saludo */}
      <h2 className="profile-greeting">
        Hola de nuevo {profile.primary_name} {profile.first_surname}!
      </h2>

      {/* 🧑 Sección de cuenta */}
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
          <button className="profile-btn profile-btn-primary"
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

        {/* 📞 Sección de contactos */}
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
                onClick={() => {
                    setEditedPhone(profile.contacts.find(c => c.type === "TELEFONO")?.value || "");
                    setEditedEmail(profile.contacts.find(c => c.type === "EMAIL")?.value || "");
                    setIsEditingContacts(false);
                }}
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
            {isEditingContacts ? (
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

        {/* 🧠 Sección profesional */}
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
                onClick={() => {
                    setEditedSpecialty(profile.specialty);
                    setEditedCertifications(profile.certifications);
                    setEditedWorkingDays(profile.working_days);
                    setIsEditingProfessional(false);
                }}
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

        {/* Especialidad */}
        <div className="profile-block">
            <div className="profile-block-header">
            <strong>Especialidad</strong>
            </div>
            <p className="profile-block-text">
            {isEditingProfessional ? (
                <textarea
                value={editedSpecialty}
                onChange={(e) => setEditedSpecialty(e.target.value)}
                className="contact-textarea"
                rows={3}
                />
            ) : (
                editedSpecialty
            )}
            </p>
        </div>

        {/* Certificaciones */}
        <div className="profile-block">
            <div className="profile-block-header">
            <strong>Certificaciones</strong>
            </div>
            <p className="profile-block-text">
            {isEditingProfessional ? (
                <textarea
                value={editedCertifications}
                onChange={(e) => setEditedCertifications(e.target.value)}
                className="contact-textarea"
                rows={3}
                />
            ) : (
                editedCertifications
            )}
            </p>
        </div>

        {/* Días laborales */}
        <div className="profile-block">
            <div className="profile-block-header">
            <strong>Días laborales</strong>
            </div>
            <p className="profile-block-text">
            {isEditingProfessional ? (
                <textarea
                value={editedWorkingDays}
                onChange={(e) => setEditedWorkingDays(e.target.value)}
                className="contact-textarea"
                rows={1}
                />
            ) : (
                editedWorkingDays
            )}
            </p>
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