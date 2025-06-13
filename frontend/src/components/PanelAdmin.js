import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";


export default function PanelAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [nuevo, setNuevo] = useState(null);
  const [editar, setEditar] = useState(null);

  const navigate = useNavigate();
  // Cargar usuarios
  const cargarUsuarios = () => {
    api.get("/admin/usuarios")
      .then(res => {
        if (res.error) setError(res.error);
        else setUsuarios(res);
      })
      .catch(() => setError("No se pudo conectar"));
  };

  useEffect(cargarUsuarios, []);

  // Eliminar usuario
const eliminarUsuario = id => {
  if (!window.confirm("¿Eliminar este usuario?")) return;
  api.delete(`/admin/usuarios/${id}`).then(cargarUsuarios);
};

  // Agregar usuario
  const handleAgregar = e => {
    e.preventDefault();
    api.post("/admin/usuarios", nuevo).then(() => {
      setNuevo(null);
      cargarUsuarios();
    });
  };

  // Guardar edición
const handleEditar = e => {
  e.preventDefault();
  api.put(`/admin/usuarios/${editar.id}`, editar).then(() => {
    setEditar(null);
    cargarUsuarios();
  });
};

  return (
    <div className="container-fluid px-4 mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <h2 className="text-center mb-4 text-primary fw-bold">Panel de Administración</h2>
          {error && (
            <div className="text-danger text-center mb-3">
              {typeof error === "string" ? error : JSON.stringify(error)}
            </div>
          )}

          {/* Botón para crear usuario */}
          {!nuevo && (
            <div className="mb-3">
              <button className="btn btn-success" onClick={() => setNuevo({ nombre: "", email: "", password: "", rol: "usuario", edad: "", celular: "" })}>
                Crear usuario
              </button>
            </div>
          )}

          {/* Formulario para crear usuario */}
          {nuevo && (
            <form className="row g-2 mb-3" onSubmit={handleAgregar}>
              <div className="col-md">
                <input className="form-control" placeholder="Nombre" required value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} />
              </div>
              <div className="col-md">
                <input className="form-control" placeholder="Email" required type="email" value={nuevo.email} onChange={e => setNuevo({ ...nuevo, email: e.target.value })} />
              </div>
              <div className="col-md">
                <input className="form-control" placeholder="Contraseña" required type="password" value={nuevo.password} onChange={e => setNuevo({ ...nuevo, password: e.target.value })} />
              </div>
              <div className="col-md">
                <input className="form-control" placeholder="Rol" value={nuevo.rol} onChange={e => setNuevo({ ...nuevo, rol: e.target.value })} />
              </div>
              <div className="col-md">
                <input className="form-control" placeholder="Edad" type="number" value={nuevo.edad} onChange={e => setNuevo({ ...nuevo, edad: e.target.value })} />
              </div>
              <div className="col-md">
                <input className="form-control" placeholder="Celular" value={nuevo.celular} onChange={e => setNuevo({ ...nuevo, celular: e.target.value })} />
              </div>
              <div className="col-auto">
                <button className="btn btn-success me-2" type="submit">Guardar</button>
                <button className="btn btn-secondary" onClick={() => setNuevo(null)}>Cancelar</button>
              </div>
            </form>
          )}

          <div className="table-responsive rounded-3 shadow">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Edad</th>
                  <th>Celular</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  editar && editar.id === u.id ? (
                    <tr key={u.id}>
                      <td><input className="form-control" value={editar.nombre} onChange={e => setEditar({ ...editar, nombre: e.target.value })} /></td>
                      <td><input className="form-control" value={editar.email} onChange={e => setEditar({ ...editar, email: e.target.value })} /></td>
                      <td><input className="form-control" value={editar.rol} onChange={e => setEditar({ ...editar, rol: e.target.value })} /></td>
                      <td><input className="form-control" value={editar.edad} onChange={e => setEditar({ ...editar, edad: e.target.value })} /></td>
                      <td><input className="form-control" value={editar.celular} onChange={e => setEditar({ ...editar, celular: e.target.value })} /></td>
                      <td className="text-center">
                        <button className="btn btn-success btn-sm me-2" onClick={handleEditar}>Guardar</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditar(null)}>Cancelar</button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={u.id}>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td>{u.rol}</td>
                      <td>{u.edad}</td>
                      <td>{u.celular}</td>
                      <td className="text-center">
                        <button className="btn btn-warning btn-sm me-2" onClick={() => setEditar(u)}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => eliminarUsuario(u.id)}>Eliminar</button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
