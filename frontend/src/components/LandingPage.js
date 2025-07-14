import React from "react";
import { useNavigate } from "react-router-dom";

const robotImg = "https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/000000/external-robot-robotics-flatart-icons-outline-flatarticons.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #60a3d9 0%, #65e1c8 100%)",
        fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif",
      }}
    >
      <div style={{
        background: "rgba(255,255,255,0.98)",
        borderRadius: 32,
        boxShadow: "0 6px 32px #1d35577a",
        padding: "48px 44px 32px 44px",
        textAlign: "center",
        minWidth: 370,
        maxWidth: 520,
      }}>
        <img src={robotImg} alt="robot" style={{ width: 64, marginBottom: 12 }} />
        <h1
          style={{
            fontWeight: 800,
            fontSize: 40,
            marginBottom: 12,
            letterSpacing: 0.5,
            color: "#222b48",
            textShadow: "0 1px 3px #b0e0ef60"
          }}
        >
          <span role="img" aria-label="robot">🤖</span> ¡Bienvenido a <span style={{ color: "#16b973", textShadow: "none" }}>Mi IA Game</span>!
        </h1>
        <p style={{
          fontSize: 22,
          color: "#1b406b",
          fontWeight: 500,
          margin: "18px 0 32px 0",
          textShadow: "0 1px 2px #fff8"
        }}>
          Aprende y juega con la <span style={{ color: "#1864ab", fontWeight: 700 }}>Inteligencia Artificial</span>.
        </p>

        <div style={{
          fontSize: 18,
          color: "#383858",
          fontWeight: 500,
          marginBottom: 30,
        }}>
          <span style={{ color: "#ff9900" }}>Educativo para alumnos</span> <span style={{ fontSize: 16 }}>y</span> <span style={{ color: "#902de4" }}>herramienta para docentes</span>
        </div>

        <button
          style={{
            background: "linear-gradient(90deg, #1864ab 80%, #16b973 100%)",
            color: "#fff",
            fontSize: 25,
            border: "none",
            borderRadius: 16,
            padding: "15px 46px",
            cursor: "pointer",
            marginBottom: 8,
            fontWeight: "bold",
            boxShadow: "0 2px 18px #16b97360",
            transition: "background 0.3s",
          }}
          onClick={() => navigate("/login")}
        >
          ¡Quiero jugar!
        </button>

        <div style={{ marginTop: 38, fontSize: 15, color: "#555c6e" }}>
          Desarrollado para estudiantes de primaria y secundaria.<br />
          <span style={{ color: "#1864ab", fontWeight: 600 }}>¿Docente o familia?</span> También puedes crear y editar juegos.
        </div>
      </div>
    </div>
  );
}
