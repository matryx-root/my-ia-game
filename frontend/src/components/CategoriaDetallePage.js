import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import categoriasJuegos from "../data/categoriasJuegos";

export default function CategoriaDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mapeo de nombres de categorías (opcional, para mostrar mejor)
  const nombresCategorias = {
    iaReactiva: "IA Reactiva",
    iaMemoria: "IA con Memoria",
    iaEstrecha: "IA Estrecha",
    iaMente: "IA con Mente"
  };

  const nombreCategoria = nombresCategorias[id] || id;
  const juegos = categoriasJuegos[id] || [];

  // Validar si la categoría existe
  if (!categoriasJuegos.hasOwnProperty(id)) {
    return (
      <div className="container-fluid py-4 px-3">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="alert alert-danger text-center" style={{
              fontSize: 'clamp(0.9rem, 4vw, 1rem)'
            }}>
              Categoría no encontrada.
            </div>
            <div className="text-center mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/categorias")}
                style={{ fontSize: 'clamp(0.9rem, 4vw, 1rem)' }}
              >
                Volver a Categorías
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-2">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-11">
          {/* Título */}
          <h2 className="text-center mb-4" style={{
            fontSize: 'clamp(1.75rem, 6vw, 2.5rem)',
            color: 'var(--color-title, #114eeb)',
            fontWeight: 800,
            lineHeight: 1.3
          }}>
            Juegos de la categoría{' '}
            <span className="fw-bold" style={{ color: 'var(--color-text)' }}>
              {nombreCategoria}
            </span>
          </h2>

          {/* Mensaje si no hay juegos */}
          {juegos.length === 0 ? (
            <div className="alert alert-warning text-center mb-5" style={{
              fontSize: 'clamp(0.9rem, 4vw, 1rem)',
              maxWidth: 600,
              margin: '2rem auto'
            }}>
              No hay juegos disponibles para esta categoría aún.
            </div>
          ) : (
            <div className="row justify-content-center g-4" style={{
              '--bs-gutter-x': '1.5rem',
              '--bs-gutter-y': '2rem'
            }}>
              {juegos.map(j => (
                <div
                  key={j.key}
                  className="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3"
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <div
                    className="card shadow-sm h-100"
                    style={{
                      width: '100%',
                      maxWidth: 300,
                      padding: '1.5em',
                      borderRadius: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      background: 'var(--color-card)',
                      color: 'var(--color-text)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 2px 8px var(--color-card-shadow)';
                    }}
                  >
                    <div>
                      <h4 className="fw-bold text-center mb-2" style={{
                        fontSize: 'clamp(1.1rem, 4vw, 1.3rem)'
                      }}>
                        {j.nombre}
                      </h4>
                      <p style={{
                        fontSize: 'clamp(0.9rem, 4vw, 1.1rem)',
                        lineHeight: 1.5,
                        color: 'var(--color-text)'
                      }}>
                        {j.descripcion}
                      </p>
                    </div>
                    <button
                      className="btn btn-primary mt-auto"
                      style={{
                        fontSize: 'clamp(0.85rem, 4vw, 1rem)',
                        padding: '0.6em 1.2em',
                        fontWeight: 500
                      }}
                      onClick={() => navigate(`/juego/${j.archivo}`)}
                    >
                      Jugar {j.nombre}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botón de volver */}
          <div className="text-center mt-5 mb-4">
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/categorias")}
              style={{
                fontSize: 'clamp(0.9rem, 4vw, 1rem)',
                padding: '0.5em 1.5em'
              }}
            >
              Volver a Categorías
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}