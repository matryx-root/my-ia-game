import React from "react";
import { useNavigate } from "react-router-dom";


export default function LandingPage(onJugar) {
  const navigate = useNavigate();
  return (
    <div style={{
      background: 'linear-gradient(135deg, #6ee7b7 0%, #a7c7e7 100%)',
      height: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center"
    }}>
      <h1 style={{
        fontFamily: 'Comic Sans MS, Comic Sans, cursive',
        fontSize: 54, color: "#1a237e", marginBottom: 24
      }}>
        🤖 ¡Bienvenido a <span style={{ color: "#1de9b6" }}>Mi IA Game</span>!
      </h1>
      <p style={{
        fontSize: 24, color: "#424242", marginBottom: 32,
        fontFamily: 'Comic Sans MS, Comic Sans, cursive'
      }}>
        Aprende y juega con la Inteligencia Artificial.
      </p>
      <button
        style={{
          background: "#2196f3", color: "white", fontSize: 28,
          border: "none", borderRadius: 18, padding: "18px 44px",
          cursor: "pointer", marginBottom: 18, fontWeight: "bold"
        }}
        onClick={() => navigate("/login")}
      >¡Quiero jugar!</button>
      <img src="https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/000000/external-robot-robotics-flatart-icons-outline-flatarticons.png" alt="robot" />
      <div style={{ marginTop: 32, fontSize: 14, color: "#888" }}>
        Desarrollado para niños de primaria. <br /> ¿Docente o familia? También puedes jugar.
      </div>
    </div>
  );
}
