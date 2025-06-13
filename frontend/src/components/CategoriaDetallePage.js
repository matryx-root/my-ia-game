// src/components/CategoriaDetallePage.js

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import categoriasJuegos from "../data/categoriasJuegos";

export default function CategoriaDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Consigue los juegos de la categoría seleccionada
  const juegos = categoriasJuegos[id] || [];

  return (
    <div style={{
      minHeight: "90vh", background: "#f4fafd", padding: 40
    }}>
      <h2 className="text-center mb-5 text-primary" style={{ fontSize: 38 }}>
        Juegos de la categoría
      </h2>
      <div className="text-center mt-5">
        <button className="btn btn-secondary" onClick={() => navigate("/categorias")}>
          Volver a Categorías
        </button>
      </div>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 35, justifyContent: "center"
      }}>
        {juegos.length === 0 ? (
          <div className="alert alert-warning text-center">
            No hay juegos disponibles para esta categoría aún.
          </div>
        ) : (
          juegos.map(j => (
            <div key={j.key}
              className="card shadow-lg"
              style={{
                width: 270, padding: 22, margin: 10, borderRadius: 18,
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div>
                <h4 className="fw-bold text-center mb-2">{j.nombre}</h4>
                <p style={{ fontSize: 17 }}>{j.descripcion}</p>
              </div>
              <button className="btn btn-primary mt-3"
                onClick={() => navigate(`/juego/${j.archivo}`)}
              >
                Jugar {j.nombre}
              </button>
            </div>
          ))
        )}
      </div>
      <div className="text-center mt-5">
        <button className="btn btn-secondary" onClick={() => navigate("/categorias")}>
          Volver a Categorías
        </button>
      </div>
    </div>
  );
}
