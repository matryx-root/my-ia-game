import React, { useEffect, useState } from "react";
import { getJuegos, crearJuego, actualizarJuego, borrarJuego, uploadArchivoJuego, downloadArchivoJuego } from "../utils/api";

export default function JuegosAdmin({ usuario }) {
  const [juegos, setJuegos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: "", descripcion: "", archivo: "" });
  const [edit, setEdit] = useState(null);
  const [archivoSubir, setArchivoSubir] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Cargar juegos
  const cargar = () => getJuegos().then(setJuegos);
  useEffect(() => { cargar(); }, []);

  // Crear juego
  const handleCrear = async e => {
    e.preventDefault();
    try {
      let archivoNombre = nuevo.archivo;
      if (archivoSubir) {
        const { archivo } = await uploadArchivoJuego(archivoSubir);
        archivoNombre = archivo;
      }
      await crearJuego({ ...nuevo, archivo: archivoNombre });
      setNuevo({ nombre: "", descripcion: "", archivo: "" });
      setArchivoSubir(null);
      setSuccess("Juego creado correctamente.");
      cargar();
    } catch (err) {
      setError("No se pudo crear el juego.");
    }
  };

  // Editar juego
  const handleEditar = async e => {
    e.preventDefault();
    try {
      let archivoNombre = edit.archivo;
      if (archivoSubir) {
        const { archivo } = await uploadArchivoJuego(archivoSubir);
        archivoNombre = archivo;
      }
      await actualizarJuego(edit.id, { ...edit, archivo: archivoNombre });
      setEdit(null);
      setArchivoSubir(null);
      setSuccess("Juego actualizado correctamente.");
      cargar();
    } catch (err) {
      setError("No se pudo actualizar el juego.");
    }
  };

  // Eliminar juego
  const handleBorrar = async (id) => {
    if (!window.confirm("¿Eliminar este juego?")) return;
    try {
      await borrarJuego(id);
      setSuccess("Juego eliminado correctamente.");
      cargar();
    } catch {
      setError("No se pudo eliminar el juego.");
    }
  };

  return (
    <div className="container-fluid py-3 px-2">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-10">
          {/* Título */}
          <h2 className="fw-bold mb-4 text-center" style={{
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            color: 'var(--color-title, #114eeb)'
          }}>
            Administrar Juegos
          </h2>

          {/* Mensajes */}
          {error && (
            <div className="alert alert-danger text-center mb-3" style={{
              fontSize: 'clamp(0.9rem, 4vw, 1rem)'
            }}>
              {error}
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

          {/* Formulario de creación */}
          <form className="row g-3 mb-4" onSubmit={handleCrear}>
            <div className="col-12 col-md-4">
              <input
                className="form-control"
                placeholder="Nombre"
                required
                value={nuevo.nombre}
                onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })}
                style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
              />
            </div>
            <div className="col-12 col-md-4">
              <input
                className="form-control"
                placeholder="Descripción"
                required
                value={nuevo.descripcion}
                onChange={e => setNuevo({ ...nuevo, descripcion: e.target.value })}
                style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
              />
            </div>
            <div className="col-12 col-md-4">
              <input
                type="file"
                className="form-control"
                accept=".js"
                onChange={e => setArchivoSubir(e.target.files[0])}
                style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
              />
            </div>
            <div className="col-12 d-flex justify-content-center">
              <button
                className="btn btn-success btn-lg px-4"
                type="submit"
                style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
              >
                Crear Juego
              </button>
            </div>
          </form>

          {/* Tabla de juegos */}
          <div className="table-responsive rounded-3 shadow-sm" style={{
            borderRadius: '1rem',
            overflow: 'hidden',
            border: '1px solid #dee2e6'
          }}>
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ minWidth: 60 }}>ID</th>
                  <th style={{ minWidth: 140 }}>Nombre</th>
                  <th style={{ minWidth: 160 }}>Descripción</th>
                  <th style={{ minWidth: 140 }}>Archivo</th>
                  <th className="text-center" style={{ minWidth: 140 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {juegos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      <em>No hay juegos registrados.</em>
                    </td>
                  </tr>
                ) : (
                  juegos.map(j => edit && edit.id === j.id ? (
                    <tr key={j.id}>
                      <td>{j.id}</td>
                      <td><input className="form-control" value={edit.nombre} onChange={e => setEdit({ ...edit, nombre: e.target.value })} /></td>
                      <td><input className="form-control" value={edit.descripcion} onChange={e => setEdit({ ...edit, descripcion: e.target.value })} /></td>
                      <td>
                        <div className="mb-1 text-muted small">{edit.archivo}</div>
                        <input
                          type="file"
                          className="form-control"
                          accept=".js"
                          onChange={e => setArchivoSubir(e.target.files[0])}
                          style={{ fontSize: '0.85rem' }}
                        />
                      </td>
                      <td className="text-center">
                        <button className="btn btn-success btn-sm me-2" onClick={handleEditar}>Guardar</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEdit(null)}>Cancelar</button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={j.id}>
                      <td>{j.id}</td>
                      <td className="text-truncate" style={{ maxWidth: 140 }} title={j.nombre}>
                        {j.nombre}
                      </td>
                      <td className="text-truncate" style={{ maxWidth: 160 }} title={j.descripcion}>
                        {j.descripcion}
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: 100 }} title={j.archivo}>
                          {j.archivo || "-"}
                        </div>
                        {j.archivo && (
                          <button
                            className="btn btn-link btn-sm p-0 mt-1"
                            onClick={() => downloadArchivoJuego(j.archivo)}
                            style={{ fontSize: '0.85rem' }}
                          >
                            Descargar
                          </button>
                        )}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => setEdit(j)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleBorrar(j.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
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