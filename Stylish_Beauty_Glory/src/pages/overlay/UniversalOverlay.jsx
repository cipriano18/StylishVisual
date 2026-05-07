import handgift from "../../assets/Mano_anim.gif";

const overlayStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const imageStyles = {
  width: "120px",
  height: "120px",
};

const messageStyles = {
  color: "#ba8282",
  fontSize: "1.2rem",
};

export default function LoaderOverlay({ message }) {
  return (
    <div style={overlayStyles}>
      <img src={handgift} alt="Cargando..." style={imageStyles} />
      <p style={messageStyles}>{message || "Cargando..."}</p>
    </div>
  );
}
