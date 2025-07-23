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

  useEffect(() => {
    if (!usuario || (usuario.rol !== "admin" && usuario.rol !== "docente")) {
      alert("No tienes permiso para acceder a este panel.");
      navigate("/");
    }
    
  }, [usuario]);

  useEffect(() => {
    if (!usuario) return;
    setLoading(true);
    api.get("/admin/usuarios")
      .then(res => {
        let filtered = [];
        if (usuario.rol === "admin") {
          filtered = res.filter(u => u.rol !== "admin");
        } else if (usuario.rol === "docente") {
          filtered = res.filter(
            u => u.rol === "alumno" && u.colegioId === usuario.colegioId
          );
        }
        setUsuarios(filtered);
        setError(null);
      })
      .catch(() => setError("No se pudo conectar a usuarios"))
      .finally(() => setLoading(false));
  }, [usuario]);

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
          setProgreso([]);
          setLogros([]);
          setError("No se pudo conectar al progreso o logros.");
        })
        .finally(() => setLoading(false));
    }
  }, [selectedId, usuarios]);

  
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
    <div className="container py-3 px-1">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <h2 className="text-center mb-4 text-primary fw-bold" style={{ fontSize: 28 }}>
            Panel de Juegos y Progreso por Usuario
          </h2>
          {error && (
            <div className="alert alert-danger text-center mb-3">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center my-3">
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span className="ms-2">Cargando datos...</span>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="selectAlumno" className="form-label fw-semibold" style={{ fontSize: 18 }}>
              Selecciona un alumno para ver su historial de juegos:
            </label>
            <select
              id="selectAlumno"
              className="form-select form-select-lg"
              value={selectedId}
              style={{ maxWidth: 400 }}
              onChange={e => setSelectedId(e.target.value)}
            >
              <option value="">Selecciona un alumno</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>
                  {u.nombre} ({u.email})
                  {u.colegio?.nombre ? ` - ${u.colegio.nombre}` : ""}
                </option>
              ))}
            </select>
          </div>

          
          {selectedUser && (
            <div className="card shadow mt-4">
              <div className="card-body">
                <h4 className="mb-2 fw-bold text-center" style={{ fontSize: 22 }}>
                  Progreso de <span className="text-primary">{selectedUser.nombre}</span>
                </h4>
                <div className="d-flex flex-wrap flex-column flex-md-row gap-2 justify-content-center mb-2">
                  <div><strong>Email:</strong> {selectedUser.email}</div>
                  <div><strong>Colegio:</strong> {selectedUser.colegio?.nombre || "-"}</div>
                  <div><strong>Edad:</strong> {selectedUser.edad || "-"}</div>
                </div>
                <hr />

               
                {Object.keys(progresoPorJuego).length === 0 ? (
                  <span className="text-muted">No hay progresos registrados.</span>
                ) : (
                  Object.entries(progresoPorJuego).map(([juegoId, juego]) => (
                    <div className="my-3" key={juegoId}>
                      <h5 className="fw-bold mb-2">
                        {juego.nombre} <span className="text-secondary" style={{ fontWeight: 400 }}>({juegoId})</span>
                      </h5>
                      {juego.descripcion && (
                        <div className="mb-1 text-muted" style={{ fontSize: 15 }}>
                          <strong>Descripción:</strong> {juego.descripcion}
                        </div>
                      )}
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>ID</th>
                              <th>Nombre Juego</th>
                              <th>Avance</th>
                              <th>Completado</th>
                              <th>Fecha y Hora</th>
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
                                  <td>{p.juego?.nombre || "-"}</td>
                                  <td>{p.avance ?? "-"}</td>
                                  <td>{p.completado ? "✅" : "❌"}</td>
                                  <td style={{ minWidth: 120 }}>{new Date(p.fechaActualizacion).toLocaleString()}</td>
                                  <td>
                                    {typeof p.desaciertos === "number"
                                      ? (TOTAL_PUNTOS - p.desaciertos)
                                      : (typeof p.aciertos === "number"
                                        ? p.aciertos
                                        : "-")}
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

                
                <h5 className="fw-bold mt-4 mb-2">Logros</h5>
                {logros.length === 0 ? (
                  <span className="text-muted">No hay logros registrados.</span>
                ) : (
                  <ul style={{ paddingLeft: 18, fontSize: 15 }}>
                    {logros.map(l => (
                      <li key={l.id}>
                        <strong>{l.nombre}</strong>
                        {l.descripcion && <>: {l.descripcion}</>}
                        <span className="text-muted ms-2">
                          ({new Date(l.fechaHora).toLocaleString()})
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
