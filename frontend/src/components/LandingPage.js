import React from "react";
import { useNavigate } from "react-router-dom";


export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-bg" /* <-- aquí la clase de fondo */>
      <div className="landing-card">
        
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
          ¡Quiero jugar Perlita!
        </button>

        <div className="landing-note">
          Desarrollado para estudiantes de primaria y secundaria.<br />
          Se destaca el caso de Finlandia , donde se enseña inteligencia artificial desde la educación básica.<br />
          <span className="landing-docente">¿Docente o familia?</span> 
        </div>
      </div>
    </div>
  );
}
