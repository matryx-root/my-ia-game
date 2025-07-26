import React, { useEffect, useState } from "react";
import api from "../utils/api";

const TOTAL_PUNTOS = 12;

export default function MisJuegos({ usuario }) {
  const [progreso, setProgreso] = useState([]);
  const [logros, setLogros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usuario) return;
    setLoading(true);
    Promise.all([
      api.get(`/juegos/progreso/${usuario.id}`),
      api.get(`/usuarios/achievement/${usuario.id}`)
    ])
      .then(([prog, achv]) => {
        setProgreso(Array.isArray(prog) ? prog : []);
        setLogros(Array.isArray(achv) ? achv : []);
        setError(null);
      })
      .catch(() => setError("No se pudo cargar tu progreso o logros."))
      .finally(() => setLoading(false));
  }, [usuario]);

  // Agrupar progreso por juego
  const progresoPorJuego = {};
  progreso.forEach(p => {
    if (!progresoPorJuego[p.juegoId]) {
      progresoPorJuego[p.juegoId] = {
        nombre: p.juego?.nombre || `Juego ${p.juegoId}`,
        descripcion: p.juego?.descripcion || "",
        registros: []
      };
    }
    progresoPorJuego[p.juegoId].registros.push(p);
  });

  return (
    <div className="container-fluid py-3 px-2">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-9">
          {/* Título */}
          <h2 className="text-center mb-4 text-primary fw-bold" style={{
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            lineHeight: 1.3
          }}>
            Mi Progreso y Logros en Juegos
          </h2>

          {/* Mensaje de error */}
          {error && (
            <div className="alert alert-danger text-center mb-3" style={{
              fontSize: 'clamp(0.9rem, 4vw, 1rem)'
            }}>
              {error}
            </div>
          )}

          {/* Cargando */}
          {loading && (
            <div className="text-center my-3">
              <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
              <span className="ms-2" style={{
                fontSize: 'clamp(0.9rem, 4vw, 1rem)'
              }}>
                Cargando...
              </span>
            </div>
          )}

          {/* Información del usuario */}
          {!loading && usuario && (
            <div className="card shadow-sm border-0 mb-4" style={{
              borderRadius: '1rem',
              overflow: 'hidden'
            }}>
              <div className="card-body p-3 p-md-4">
                <h5 className="fw-bold mb-3 text-center" style={{
                  fontSize: 'clamp(1.1rem, 5vw, 1.3rem)'
                }}>
                  Información del Usuario
                </h5>
                <div className="row g-2 text-center text-md-start">
                  <div className="col-12 col-md-6">
                    <strong>Nombre:</strong> {usuario.nombre}
                  </div>
                  <div className="col-12 col-md-6">
                    <strong>Email:</strong> {usuario.email}
                  </div>
                  <div className="col-12 col-md-6">
                    <strong>Rol:</strong> {usuario.rol}
                  </div>
                  <div className="col-12 col-md-6">
                    <strong>Colegio:</strong> {usuario.colegio?.nombre || "-"}
                  </div>
                  <div className="col-12 col-md-6">
                    <strong>Edad:</strong> {usuario.edad || "-"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progreso en Juegos */}
          <h5 className="fw-bold mt-4 mb-3" style={{
            fontSize: 'clamp(1.2rem, 5vw, 1.5rem)'
          }}>
            Progreso en Juegos
          </h5>

          {Object.keys(progresoPorJuego).length === 0 ? (
            <p className="text-muted text-center my-4" style={{
              fontSize: 'clamp(0.9rem, 4vw, 1rem)'
            }}>
              No hay progresos registrados aún.
            </p>
          ) : (
            Object.entries(progresoPorJuego).map(([juegoId, juego]) => (
              <div className="my-3" key={juegoId}>
                <h6 className="fw-bold" style={{
                  fontSize: 'clamp(1.1rem, 4vw, 1.3rem)',
                  color: 'var(--color-title, #114eeb)'
                }}>
                  {juego.nombre}{' '}
                  <small className="text-secondary" style={{ fontWeight: 400 }}>
                    (ID: {juegoId})
                  </small>
                </h6>
                {juego.descripcion && (
                  <p className="text-muted mb-2" style={{
                    fontSize: '0.9rem'
                  }}>
                    <strong>Descripción:</strong> {juego.descripcion}
                  </p>
                )}
                <div className="table-responsive">
                  <table className="table table-sm table-bordered table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Juego</th>
                        <th>Avance</th>
                        <th>Completado</th>
                        <th>Fecha</th>
                        <th>Aciertos</th>
                        <th>Desaciertos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {juego.registros
                        .sort((a, b) => new Date(b.fechaActualizacion) - new Date(a.fechaActualizacion))
                        .map((p) => (
                          <tr key={p.id}>
                            <td>{p.id}</td>
                            <td style={{ maxWidth: 150 }}>
                              <div className="text-truncate" title={p.juego?.nombre || "-"}>
                                {p.juego?.nombre || "-"}
                              </div>
                            </td>
                            <td>{p.avance ?? "-"}</td>
                            <td>{p.completado ? "✅" : "❌"}</td>
                            <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                              {new Date(p.fechaActualizacion).toLocaleString()}
                            </td>
                            <td>
                              {typeof p.desaciertos === "number"
                                ? (TOTAL_PUNTOS - p.desaciertos)
                                : (typeof p.aciertos === "number" ? p.aciertos : "-")}
                            </td>
                            <td>{p.desaciertos ?? "-"}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}

          {/* Logros */}
          <h5 className="fw-bold mt-5 mb-3" style={{
            fontSize: 'clamp(1.2rem, 5vw, 1.5rem)'
          }}>
            Logros
          </h5>

          {logros.length === 0 ? (
            <p className="text-muted text-center my-4" style={{
              fontSize: 'clamp(0.9rem, 4vw, 1rem)'
            }}>
              No tienes logros aún.
            </p>
          ) : (
            <ul className="list-unstyled" style={{
              paddingLeft: '1rem',
              fontSize: 'clamp(0.9rem, 4vw, 1rem)'
            }}>
              {logros.map(l => (
                <li key={l.id} className="mb-3 p-2 rounded" style={{
                  background: 'var(--color-card, #fff)',
                  borderLeft: '4px solid #16b973',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                }}>
                  <strong>{l.nombre}</strong>
                  {l.descripcion && <p className="mb-1" style={{ fontSize: '0.95rem' }}>{l.descripcion}</p>}
                  <small className="text-muted">
                    {new Date(l.fechaHora).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}