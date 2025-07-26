import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function PanelAdmin({ usuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [colegios, setColegios] = useState([]);
  const [error, setError] = useState(null);
  const [nuevo, setNuevo] = useState(null);
  const [editar, setEditar] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  // Validación de acceso
  useEffect(() => {
    if (!usuario || usuario.rol !== "admin") {
      setError("No tienes permiso para acceder a este panel.");
      setTimeout(() => navigate("/"), 1500);
    }
  }, [usuario, navigate]);

  // Cargar datos
  const cargarDatos = () => {
    api.get("/admin/usuarios")
      .then(res => setUsuarios(res))
      .catch(() => setError("No se pudo cargar la lista de usuarios."));
    
    api.get("/colegios")
      .then(res => setColegios(Array.isArray(res) ? res : []))
      .catch(() => setError("No se pudo cargar la lista de colegios."));
  };

  useEffect(cargarDatos, []);

  // Eliminar usuario
  const eliminarUsuario = id => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    api.delete(`/admin/usuarios/${id}`)
      .then(() => {
        setSuccess("Usuario eliminado correctamente.");
        cargarDatos();
      })
      .catch(() => setError("No se pudo eliminar el usuario."));
  };

  // Agregar usuario
  const handleAgregar = e => {
    e.preventDefault();
    if (!nuevo.nombre || !nuevo.email || !nuevo.password || !nuevo.rol || nuevo.colegioId === "") {
      alert("Todos los campos obligatorios deben estar completos.");
      return;
    }
    const data = {
      ...nuevo,
      colegioId: nuevo.colegioId ? Number(nuevo.colegioId) : null,
      edad: nuevo.edad ? Number(nuevo.edad) : null
    };
    api.post("/admin/usuarios", data)
      .then(() => {
        setSuccess("Usuario creado correctamente.");
        setNuevo(null);
        cargarDatos();
      })
      .catch(() => setError("No se pudo crear el usuario."));
  };

  // Editar usuario
  const handleEditar = e => {
    e.preventDefault();
    const data = {
      ...editar,
      colegioId: editar.colegioId ? Number(editar.colegioId) : null,
      edad: editar.edad ? Number(editar.edad) : null
    };
    api.put(`/admin/usuarios/${editar.id}`, data)
      .then(() => {
        setSuccess("Usuario actualizado correctamente.");
        setEditar(null);
        cargarDatos();
      })
      .catch(() => setError("No se pudo editar el usuario."));
  };

  return (
    <div className="container-fluid py-3 px-2">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-10">
          {/* Título */}
          <h2 className="text-center mb-4 text-primary fw-bold" style={{
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            lineHeight: 1.3
          }}>
            Panel de Administración
          </h2>

          {/* Mensajes */}
          {error && (
            <div className="alert alert-danger text-center mb-3" style={{
              fontSize: 'clamp(0.9rem, 4vw, 1rem)'
            }}>
              {typeof error === "string" ? error : "Error desconocido"}
            </div>
          )}

          {success && (
            <div
              className="alert alert-success text-center mb-3"
              style={{ cursor: "pointer", fontSize: 'clamp(0.9rem, 4vw, 1rem)' }}
              onClick={() => setSuccess(null)}
            >
              {success}
            </div>
          )}

          {/* Botón para agregar usuario */}
          {!nuevo && (
            <div className="d-flex justify-content-center mb-4">
              <button
                className="btn btn-success btn-lg px-4"
                onClick={() => setNuevo({
                  nombre: "", email: "", password: "", rol: "alumno", edad: "", celular: "", colegioId: ""
                })}
                style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
              >
                🆕 Crear usuario
              </button>
            </div>
          )}

          {/* Formulario de creación */}
          {nuevo && (
            <form className="row g-3 mb-4" onSubmit={handleAgregar}>
              <div className="col-12 col-md-6 col-xl-4">
                <input
                  className="form-control"
                  placeholder="Nombre"
                  required
                  value={nuevo.nombre}
                  onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })}
                  style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
                />
              </div>
              <div className="col-12 col-md-6 col-xl-4">
                <input
                  className="form-control"
                  placeholder="Email"
                  required
                  type="email"
                  value={nuevo.email}
                  onChange={e => setNuevo({ ...nuevo, email: e.target.value })}
                  style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
                />
              </div>
              <div className="col-12 col-md-6 col-xl-4">
                <input
                  className="form-control"
                  placeholder="Contraseña"
                  required
                  type="password"
                  value={nuevo.password}
                  onChange={e => setNuevo({ ...nuevo, password: e.target.value })}
                  style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
                />
              </div>
              <div className="col-12 col-md-6 col-xl-4">
                <select
                  className="form-control"
                  required
                  value={nuevo.rol}
                  onChange={e => setNuevo({ ...nuevo, rol: e.target.value })}
                  style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
                >
                  <option value="">Rol</option>
                  <option value="alumno">Alumno</option>
                  <option value="docente">Docente</option>
                </select>
              </div>
              <div className="col-12 col-md-6 col-xl-4">
                <select
                  className="form-control"
                  required
                  value={nuevo.colegioId || ""}
                  onChange={e => setNuevo({ ...nuevo, colegioId: e.target.value })}
                  style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
                >
                  <option value="">Selecciona colegio</option>
                  {colegios.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} ({c.nivel})</option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6 col-xl-4">
                <input
                  className="form-control"
                  placeholder="Edad"
                  type="number"
                  value={nuevo.edad}
                  onChange={e => setNuevo({ ...nuevo, edad: e.target.value })}
                  style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
                />
              </div>
              <div className="col-12 col-md-6 col-xl-4">
                <input
                  className="form-control"
                  placeholder="Celular"
                  value={nuevo.celular}
                  onChange={e => setNuevo({ ...nuevo, celular: e.target.value })}
                  style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
                />
              </div>
              <div className="col-12 d-flex flex-wrap gap-2 justify-content-center">
                <button
                  className="btn btn-success btn-lg px-4"
                  type="submit"
                  style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
                >
                  Guardar
                </button>
                <button
                  className="btn btn-secondary btn-lg px-4"
                  type="button"
                  onClick={() => setNuevo(null)}
                  style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Tabla de usuarios */}
          <div className="table-responsive rounded-3 shadow-sm" style={{
            borderRadius: '1rem',
            overflow: 'hidden',
            border: '1px solid #dee2e6'
          }}>
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ minWidth: 140 }}>Nombre</th>
                  <th style={{ minWidth: 160 }}>Email</th>
                  <th style={{ minWidth: 100 }}>Rol</th>
                  <th style={{ minWidth: 140 }}>Colegio</th>
                  <th style={{ minWidth: 80 }}>Edad</th>
                  <th style={{ minWidth: 120 }}>Celular</th>
                  <th className="text-center" style={{ minWidth: 140 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      <em>No hay usuarios registrados.</em>
                    </td>
                  </tr>
                ) : (
                  usuarios.map(u => (
                    editar && editar.id === u.id ? (
                      <tr key={u.id}>
                        <td><input className="form-control" value={editar.nombre} onChange={e => setEditar({ ...editar, nombre: e.target.value })} /></td>
                        <td><input className="form-control" value={editar.email} onChange={e => setEditar({ ...editar, email: e.target.value })} /></td>
                        <td>
                          <select className="form-control" value={editar.rol} onChange={e => setEditar({ ...editar, rol: e.target.value })}>
                            <option value="alumno">Alumno</option>
                            <option value="docente">Docente</option>
                          </select>
                        </td>
                        <td>
                          <select className="form-control" value={editar.colegioId || ""} onChange={e => setEditar({ ...editar, colegioId: e.target.value })}>
                            <option value="">Selecciona colegio</option>
                            {colegios.map(c => (
                              <option key={c.id} value={c.id}>{c.nombre} ({c.nivel})</option>
                            ))}
                          </select>
                        </td>
                        <td><input className="form-control" value={editar.edad || ""} onChange={e => setEditar({ ...editar, edad: e.target.value })} /></td>
                        <td><input className="form-control" value={editar.celular || ""} onChange={e => setEditar({ ...editar, celular: e.target.value })} /></td>
                        <td className="text-center">
                          <button className="btn btn-success btn-sm me-2" onClick={handleEditar}>Guardar</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditar(null)}>Cancelar</button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={u.id}>
                        <td>{u.nombre}</td>
                        <td className="text-truncate" style={{ maxWidth: 160 }} title={u.email}>
                          {u.email}
                        </td>
                        <td>{u.rol}</td>
                        <td>{u.colegio?.nombre || "-"}</td>
                        <td>{u.edad || "-"}</td>
                        <td>{u.celular || "-"}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => setEditar({
                              ...u,
                              colegioId: u.colegioId || "",
                              edad: u.edad || "",
                              celular: u.celular || ""
                            })}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminarUsuario(u.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    )
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}