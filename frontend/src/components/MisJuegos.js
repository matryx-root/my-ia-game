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
    <div className="container py-4">
      <h2 className="mb-4 text-primary fw-bold text-center">
        Mi Progreso y Logros en Juegos
      </h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && (
        <div className="text-center my-3">
          <span className="spinner-border spinner-border-sm" /> Cargando...
        </div>
      )}
      <div className="mb-3">
        <strong>Usuario:</strong> {usuario.nombre} <br />
        <strong>Email:</strong> {usuario.email} <br />
        <strong>Rol:</strong> {usuario.rol} <br />
        <strong>Colegio:</strong> {usuario.colegio?.nombre || "-"} <br />
        <strong>Edad:</strong> {usuario.edad || "-"}
      </div>
      <hr />

      {/* PROGRESO */}
      <h5 className="fw-bold mt-4">Progreso en Juegos</h5>
      {Object.keys(progresoPorJuego).length === 0 ? (
        <span className="text-muted">No hay progresos registrados aún.</span>
      ) : (
        Object.entries(progresoPorJuego).map(([juegoId, juego]) => (
          <div className="my-3" key={juegoId}>
            <h6>
              {juego.nombre} <span className="text-secondary">({juegoId})</span>
            </h6>
            {juego.descripcion && (
              <div className="mb-1 text-muted" style={{ fontSize: 15 }}>
                <strong>Descripción:</strong> {juego.descripcion}
              </div>
            )}
            <div className="table-responsive">
              <table className="table table-sm table-bordered align-middle">
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
                        <td>{new Date(p.fechaActualizacion).toLocaleString()}</td>
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

      {/* LOGROS */}
      <h5 className="fw-bold mt-4">Logros</h5>
      {logros.length === 0 ? (
        <span className="text-muted">No tienes logros aún.</span>
      ) : (
        <ul>
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
  );
}
