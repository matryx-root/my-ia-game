import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const TOTAL_PUNTOS = 12;

export default function PanelGame({ usuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [progreso, setProgreso] = useState([]);
  const [logros, setLogros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Validación de acceso
  useEffect(() => {
    if (!usuario || (usuario.rol !== "admin" && usuario.rol !== "docente")) {
      setError("No tienes permiso para acceder a este panel.");
      setTimeout(() => navigate("/"), 1500);
    }
  }, [usuario, navigate]);

  // Cargar usuarios
  useEffect(() => {
    if (!usuario || error) return;
    setLoading(true);
    api.get("/admin/usuarios")
      .then(res => {
        let filtered = [];
        if (usuario.rol === "admin") {
          filtered = res.filter(u => u.rol !== "admin");
        } else if (usuario.rol === "docente") {
          filtered = res.filter(u => u.rol === "alumno" && u.colegioId === usuario.colegioId);
        }
        setUsuarios(filtered);
        setError(null);
      })
      .catch(() => setError("No se pudo cargar la lista de usuarios."))
      .finally(() => setLoading(false));
  }, [usuario, error]);

  // Cargar progreso y logros del usuario seleccionado
  useEffect(() => {
    if (!selectedId) {
      setSelectedUser(null);
      setProgreso([]);
      setLogros([]);
      return;
    }
    const user = usuarios.find(u => u.id === Number(selectedId));
    setSelectedUser(user);
    if (user) {
      setLoading(true);
      Promise.all([
        api.get(`/juegos/progreso/${user.id}`),
        api.get(`/usuarios/achievement/${user.id}`)
      ])
        .then(([prog, achv]) => {
          setProgreso(Array.isArray(prog) ? prog : []);
          setLogros(Array.isArray(achv) ? achv : []);
          setError(null);
        })
        .catch(() => {
          setError("No se pudo cargar el progreso o logros del usuario.");
          setProgreso([]);
          setLogros([]);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedId, usuarios]);

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
            Panel de Juegos y Progreso por Usuario
          </h2>

          {/* Mensajes de error */}
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
              <span className="ms-2" style={{ fontSize: 'clamp(0.9rem, 4vw, 1rem)' }}>
                Cargando datos...
              </span>
            </div>
          )}

          {/* Selector de alumno */}
          <div className="mb-4">
            <label htmlFor="selectAlumno" className="form-label fw-semibold" style={{
              fontSize: 'clamp(1rem, 4vw, 1.2rem)'
            }}>
              Selecciona un alumno para ver su historial de juegos:
            </label>
            <select
              id="selectAlumno"
              className="form-select form-select-lg"
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              style={{
                fontSize: 'clamp(0.9rem, 4vw, 1.1rem)',
                maxWidth: '100%'
              }}
            >
              <option value="">Selecciona un alumno</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>
                  {u.nombre} ({u.email}){u.colegio?.nombre ? ` - ${u.colegio.nombre}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Información del usuario seleccionado */}
          {selectedUser && (
            <div className="card shadow-sm border-0 mt-4" style={{
              borderRadius: '1rem',
              overflow: 'hidden'
            }}>
              <div className="card-body p-3 p-md-4">
                <h4 className="mb-3 fw-bold text-center" style={{
                  fontSize: 'clamp(1.25rem, 5vw, 1.5rem)'
                }}>
                  Progreso de{' '}
                  <span className="text-primary">{selectedUser.nombre}</span>
                </h4>

                {/* Info básica */}
                <div className="d-flex flex-wrap gap-2 justify-content-center mb-3">
                  <div className="badge bg-light text-dark border">
                    <strong>Email:</strong> {selectedUser.email}
                  </div>
                  <div className="badge bg-light text-dark border">
                    <strong>Colegio:</strong> {selectedUser.colegio?.nombre || "-"}
                  </div>
                  <div className="badge bg-light text-dark border">
                    <strong>Edad:</strong> {selectedUser.edad || "-"}
                  </div>
                </div>

                <hr className="my-3" />

                {/* Progreso por juego */}
                {Object.keys(progresoPorJuego).length === 0 ? (
                  <p className="text-muted text-center my-3" style={{
                    fontSize: 'clamp(0.9rem, 4vw, 1rem)'
                  }}>
                    No hay progresos registrados.
                  </p>
                ) : (
                  Object.entries(progresoPorJuego).map(([juegoId, juego]) => (
                    <div className="my-3" key={juegoId}>
                      <h5 className="fw-bold mb-2" style={{
                        fontSize: 'clamp(1.1rem, 4vw, 1.3rem)'
                      }}>
                        {juego.nombre}{' '}
                        <small className="text-secondary" style={{ fontWeight: 400 }}>
                          (ID: {juegoId})
                        </small>
                      </h5>
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
                <h5 className="fw-bold mt-4 mb-2" style={{
                  fontSize: 'clamp(1.1rem, 4vw, 1.3rem)'
                }}>
                  Logros
                </h5>
                {logros.length === 0 ? (
                  <p className="text-muted" style={{
                    fontSize: 'clamp(0.9rem, 4vw, 1rem)'
                  }}>
                    No hay logros registrados.
                  </p>
                ) : (
                  <ul className="list-unstyled" style={{
                    paddingLeft: '1rem',
                    fontSize: 'clamp(0.9rem, 4vw, 1rem)'
                  }}>
                    {logros.map(l => (
                      <li key={l.id} className="mb-2">
                        <strong>{l.nombre}</strong>
                        {l.descripcion && <>: {l.descripcion}</>}
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                          ({new Date(l.fechaHora).toLocaleString()})
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Mensaje cuando no hay usuario seleccionado */}
          {!selectedUser && !error && !loading && (
            <div className="text-center my-5">
              <p className="text-muted" style={{
                fontSize: 'clamp(1rem, 5vw, 1.2rem)'
              }}>
                Selecciona un alumno para ver su progreso.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}