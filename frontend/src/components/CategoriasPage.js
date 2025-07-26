import React from "react";
import { useNavigate } from "react-router-dom";

// Datos de categorías
const categorias = [
  {
    id: "IA Reactiva",
    nombre: "IA Reactiva",
    clase: "ia-reactiva",
    icon: "⚡",
    descripcion:
      "Sistemas expertos, IA simbólica, lógica difusa. Actúan solo con reglas fijas, sin aprendizaje ni memoria."
  },
  {
    id: "IA con Memoria Limitada",
    nombre: "IA con Memoria Limitada",
    clase: "ia-memoria",
    icon: "🧑‍🔬",
    descripcion:
      "Machine Learning (ML) supervisado/no supervisado, Deep Learning (DL), Reinforcement Learning (RL), Computer Vision y NLP. Aprenden de datos históricos recientes."
  },
  {
    id: "ANI (IA Estrecha)",
    nombre: "ANI (IA Estrecha)",
    clase: "ia-estrecha",
    icon: "🤖",
    descripcion:
      "Aplicaciones específicas de ML/DL para tareas concretas como chatbots, traducción automática, reconocimiento de imágenes."
  },
  {
    id: "IA con Teoría de la Mente",
    nombre: "IA con Teoría de la Mente",
    clase: "ia-mente",
    icon: "🔣",
    descripcion:
      "Modelos que simulan emociones o intenciones, NLP avanzado, Computer Vision avanzada para detección de gestos o expresiones."
  }
];

export default function CategoriasPage() {
  const navigate = useNavigate();

  return (
    <div className="categorias-bg" style={{ minHeight: '100vh' }}>
      {/* Título */}
      <div
        style={{
          padding: 'clamp(20px, 5vw, 24px) 0 clamp(10px, 3vw, 16px) 0',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: 'clamp(1.75rem, 8vw, 2.5rem)',
          letterSpacing: '-1px',
          color: 'var(--color-title, #1565c0)'
        }}
      >
        ¡Elige una categoría de IA!
        <span style={{ marginLeft: '0.5em', fontSize: 'clamp(1.75rem, 8vw, 2.5rem)' }}>🧑‍🎓</span>
      </div>

      {/* Grid de categorías */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 'clamp(20px, 5vw, 40px)',
          padding: 'clamp(20px, 5vw, 24px) clamp(10px, 5vw, 10px) 60px clamp(10px, 5vw, 10px)'
        }}
      >
        {categorias.map(cat => (
          <div
            key={cat.id}
            role="button"
            tabIndex={0}
            className={`categoria-card ${cat.clase}`}
            onClick={() => navigate(`/categoria/${cat.id}`)}
            onKeyPress={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(`/categoria/${cat.id}`);
              }
            }}
            style={{
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <div className="icono-categoria">{cat.icon}</div>
            <div className="titulo-categoria">{cat.nombre}</div>
            <div className="descripcion-categoria">{cat.descripcion}</div>
          </div>
        ))}
      </div>
    </div>
  );
}