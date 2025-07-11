// src/components/CategoriasPage.js

import React from "react";
import { useNavigate } from "react-router-dom";

const categorias = [
  {
    id: "IA Reactiva",
    nombre: "IA Reactiva",
    color: "#ffab91",
    icon: "⚡",
    descripcion:
      "Sistemas expertos, IA simbólica, lógica difusa. Actúan solo con reglas fijas, sin aprendizaje ni memoria."
  },
  {
    id: "IA con Memoria Limitada",
    nombre: "IA con Memoria Limitada",
    color: "#f8bbd0",
    icon: "🧑‍🔬",
    descripcion:
      "Machine Learning (ML) supervisado/no supervisado, Deep Learning (DL), Reinforcement Learning (RL), Computer Vision y NLP. Aprenden de datos históricos recientes."
  },
  {
    id: "ANI (IA Estrecha)",
    nombre: "ANI (IA Estrecha)",
    color: "#b2dfdb",
    icon: "🤖",
    descripcion:
      "Aplicaciones específicas de ML/DL para tareas concretas como chatbots, traducción automática, reconocimiento de imágenes."
  },
  {
    id: "IA con Teoría de la Mente",
    nombre: "IA con Teoría de la Mente",
    color: "#fff176",
    icon: "🔣",
    descripcion:
      "Modelos que simulan emociones o intenciones, NLP avanzado, Computer Vision avanzada para detección de gestos o expresiones."
  }
];

export default function CategoriasPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#e3f2fd", minHeight: "100vh" }}>
      <div
        style={{
          padding: "24px 0 16px 0",
          textAlign: "center",
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: "-1px",
          color: "#1565c0"
        }}
      >
        ¡Elige una categoría de IA!
        <span style={{ marginLeft: 10, fontSize: 34 }}>🧑‍🎓</span>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 40,
          padding: "24px 10px 60px 10px"
        }}
      >
        {categorias.map(cat => (
          <div
            key={cat.id}
            role="button"
            tabIndex={0}
            style={{
              background: cat.color,
              borderRadius: 20,
              width: 340,
              minHeight: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: 24,
              cursor: "pointer",
              boxShadow: "0 8px 32px #0002",
              boxSizing: "border-box",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onClick={() => navigate(`/categoria/${cat.id}`)}
            onKeyPress={e => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(`/categoria/${cat.id}`);
              }
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.035)";
              e.currentTarget.style.boxShadow = "0 12px 40px #0004";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 32px #0002";
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 10 }}>{cat.icon}</div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: 23,
                textAlign: "center",
                marginBottom: 10
              }}
            >
              {cat.nombre}
            </div>
            <div
              style={{
                fontSize: 16,
                textAlign: "center",
                lineHeight: 1.4,
                maxWidth: 280,
                wordBreak: "break-word",
                color: "#444"
              }}
            >
              {cat.descripcion}
            </div>
          </div>
        ))}
      </div>

      {/* Botón fijo para acceder a logros */}
      <button
        className="btn btn-outline-success"
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 1000,
          fontWeight: 600,
          fontSize: 18,
          boxShadow: "0 4px 18px #0002",
        }}
        onClick={() => navigate("/logros")}
      >
        <i className="bi bi-trophy-fill me-2"></i>
        Mis Logros
      </button>
    </div>
  );
}
