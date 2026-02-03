import handgift from "../../assets/Mano_anim.gif";
export default function LoaderOverlay({ message }) {
  return (
    <div style={{
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
      zIndex: 9999
    }}>
      {/* Tu GIF */}
      <img 
        src= {handgift}
        alt="Cargando..."
        style={{ width: "120px", height: "120px"}}
      />

      {/* Texto */}
      <p style={{ color: "#ba8282", fontSize: "1.2rem" }}>
        {message || "Cargando..."}
      </p>
    </div>
  );
}
