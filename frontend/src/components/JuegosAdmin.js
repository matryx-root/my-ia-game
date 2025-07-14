import React, { useEffect, useState } from "react";
import {
  getJuegos, crearJuego, actualizarJuego, borrarJuego,
  uploadArchivoJuego, downloadArchivoJuego
} from "../utils/api";

export default function JuegosAdmin({ usuario }) {
  const [juegos, setJuegos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: "", descripcion: "", archivo: "" });
  const [edit, setEdit] = useState(null);
  const [archivoSubir, setArchivoSubir] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const cargar = () => getJuegos().then(setJuegos);

  useEffect(() => { cargar(); }, []);

  // CREAR
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
      setSuccess("Juego creado.");
      cargar();
    } catch (err) {
      setError("No se pudo crear.");
    }
  };

  // EDITAR
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
      setSuccess("Juego actualizado.");
      cargar();
    } catch (err) {
      setError("No se pudo actualizar.");
    }
  };

  // ELIMINAR
  const handleBorrar = async (id) => {
    if (!window.confirm("¿Eliminar este juego?")) return;
    try {
      await borrarJuego(id);
      setSuccess("Juego eliminado.");
      cargar();
    } catch {
      setError("No se pudo eliminar.");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-3">Administrar Juegos</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success" onClick={() => setSuccess(null)}>{success}</div>}
      
      {/* CREAR JUEGO */}
      <form className="row g-2 mb-4" onSubmit={handleCrear}>
        <div className="col-md-3">
          <input className="form-control" required placeholder="Nombre" value={nuevo.nombre}
            onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} />
        </div>
        <div className="col-md-4">
          <input className="form-control" required placeholder="Descripción" value={nuevo.descripcion}
            onChange={e => setNuevo({ ...nuevo, descripcion: e.target.value })} />
        </div>
        <div className="col-md-3">
          <input type="file" className="form-control" accept=".js"
            onChange={e => setArchivoSubir(e.target.files[0])} />
        </div>
        <div className="col-md-2">
          <button className="btn btn-success w-100">Crear</button>
        </div>
      </form>

      {/* TABLA */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Archivo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {juegos.map(j => edit && edit.id === j.id ? (
              <tr key={j.id}>
                <td>{j.id}</td>
                <td><input className="form-control" value={edit.nombre} onChange={e => setEdit({ ...edit, nombre: e.target.value })} /></td>
                <td><input className="form-control" value={edit.descripcion} onChange={e => setEdit({ ...edit, descripcion: e.target.value })} /></td>
                <td>
                  {edit.archivo}
                  <input type="file" className="form-control mt-1" accept=".js"
                    onChange={e => setArchivoSubir(e.target.files[0])} />
                </td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={handleEditar}>Guardar</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEdit(null)}>Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={j.id}>
                <td>{j.id}</td>
                <td>{j.nombre}</td>
                <td>{j.descripcion}</td>
                <td>
                  {j.archivo}
                  {j.archivo &&
                    <button className="btn btn-link btn-sm ms-2" onClick={() => downloadArchivoJuego(j.archivo)}>
                      Descargar
                    </button>
                  }
                </td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => setEdit(j)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleBorrar(j.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}