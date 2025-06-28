import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function PanelGame({ usuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [progreso, setProgreso] = useState([]);
  const [logros, setLogros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Acceso solo docente o admin
  useEffect(() => {
    if (!usuario || (usuario.rol !== "admin" && usuario.rol !== "docente")) {
      alert("No tienes permiso para acceder a este panel.");
      navigate("/");
    }
    // eslint-disable-next-line
  }, [usuario]);

  // Cargar usuarios a mostrar según rol
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

  // Cuando cambia el alumno seleccionado, cargar sus detalles
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
        api.get(`/admin/progreso/${user.id}`),
        api.get(`/admin/logros/${user.id}`)
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

  // Si no hay alumnos para mostrar:
  if (!loading && usuarios.length === 0) {
    return (
      <div className="container py-5">
        <h2 className="text-center mb-4 text-primary fw-bold">
          Panel de Juegos y Progreso por Usuario
        </h2>
        {error && (
          <div className="alert alert-danger text-center mb-3">
            {error}
          </div>
        )}
        <div className="alert alert-info text-center">
          {usuario.rol === "docente"
            ? "No tienes alumnos registrados en tu colegio."
            : "No hay usuarios disponibles para mostrar."}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 text-primary fw-bold">
        Panel de Juegos y Progreso por Usuario
      </h2>
      {error && (
        <div className="alert alert-danger text-center mb-3">
          {error}
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="selectAlumno" className="form-label fw-semibold">
          Selecciona un alumno para ver su detalle de juegos y logros:
        </label>
        <select
          id="selectAlumno"
          className="form-select"
          value={selectedId}
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
            <h4 className="mb-2 fw-bold">
              Progreso de <span className="text-primary">{selectedUser.nombre}</span>
            </h4>
            <div>
              <strong>Email:</strong> {selectedUser.email}
              <br />
              <strong>Colegio:</strong>{" "}
              {selectedUser.colegio?.nombre || "-"}
              <br />
              <strong>Edad:</strong> {selectedUser.edad || "-"}
            </div>
            <hr />
            <h5 className="fw-bold mt-3">Progreso en Juegos</h5>
            {progreso.length === 0 ? (
              <span className="text-muted">No hay progreso registrado.</span>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Juego</th>
                      <th>Avance</th>
                      <th>Completado</th>
                      <th>Última actualización</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progreso.map(p => (
                      <tr key={p.id}>
                        <td>{p.juego?.nombre || p.juegoId}</td>
                        <td>{p.avance ?? "-"}</td>
                        <td>{p.completado ? "✅" : "❌"}</td>
                        <td>
                          {new Date(p.fechaActualizacion).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <h5 className="fw-bold mt-3">Logros</h5>
            {logros.length === 0 ? (
              <span className="text-muted">No hay logros registrados.</span>
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
        </div>
      )}
    </div>
  );
}
