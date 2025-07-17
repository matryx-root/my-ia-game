import React from "react";
import { useNavigate } from "react-router-dom";

const robotImg = "https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/000000/external-robot-robotics-flatart-icons-outline-flatarticons.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-bg" /* <-- aquí la clase de fondo */>
      <div className="landing-card">
        <img src={robotImg} alt="robot" style={{ width: 64, marginBottom: 12 }} />
        <h1 className="landing-title">
          <span role="img" aria-label="robot">🤖</span> ¡Bienvenido a <span className="landing-title-highlight">Mi IA Game</span>!
        </h1>
        <p className="landing-desc">
          Aprende y juega con la <span className="landing-ai">Inteligencia Artificial</span>.
        </p>

        <div className="landing-edu">
          <span className="edu-alumno">Educativo para alumnos</span> <span style={{ fontSize: 16 }}>y</span> <span className="edu-docente">herramienta para docentes</span>
        </div>

        <button
          className="landing-btn"
          onClick={() => navigate("/login")}
        >
          ¡Quiero jugar!
        </button>

        <div className="landing-note">
          Desarrollado para estudiantes de primaria y secundaria.<br />
          <span className="landing-docente">¿Docente o familia?</span> También puedes crear y editar juegos.
        </div>
      </div>
    </div>
  );
}
