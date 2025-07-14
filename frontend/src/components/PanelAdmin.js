// src/components/PanelAdmin.js

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

  // Solo admin puede acceder
  useEffect(() => {
    if (!usuario || usuario.rol !== "admin") {
      alert("No tienes permiso para acceder a este panel.");
      navigate("/");
    }
    // eslint-disable-next-line
  }, [usuario]);

  // Cargar usuarios y colegios
  const cargarDatos = () => {
    api.get("/admin/usuarios")
      .then(res => setUsuarios(res))
      .catch(() => setError("No se pudo conectar a usuarios"));
    // Cargar colegios con endpoint público si existe
    api.get("/colegios")
      .then(res => setColegios(Array.isArray(res) ? res : []))
      .catch(() => setError("No se pudo conectar a colegios"));
  };
  useEffect(cargarDatos, []);

  // Eliminar usuario
  const eliminarUsuario = id => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    api.delete(`/admin/usuarios/${id}`).then(() => {
      setSuccess("Usuario eliminado correctamente.");
      cargarDatos();
    }).catch(() => setError("No se pudo eliminar."));
  };

  // Agregar usuario
  const handleAgregar = e => {
    e.preventDefault();
    if (
      !nuevo.nombre ||
      !nuevo.email ||
      !nuevo.password ||
      !nuevo.rol ||
      nuevo.colegioId === undefined
    ) {
      alert("Todos los campos obligatorios, incluido el colegio y rol, deben estar completos.");
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

  // Guardar edición
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
    <div className="container-fluid px-4 mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <h2 className="text-center mb-4 text-primary fw-bold">Panel de Administración</h2>
          {error && (
            <div className="text-danger text-center mb-3">
              {typeof error === "string" ? error : JSON.stringify(error)}
            </div>
          )}
          {success && (
            <div className="alert alert-success text-center mb-3" onClick={() => setSuccess(null)} style={{ cursor: "pointer" }}>
              {success}
            </div>
          )}

          {/* Botón para crear usuario */}
          {!nuevo && (
            <div className="mb-3">
              <button className="btn btn-success" onClick={() => setNuevo({
                nombre: "", email: "", password: "", rol: "alumno", edad: "", celular: "", colegioId: ""
              })}>
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
                <select className="form-control" required value={nuevo.rol} onChange={e => setNuevo({ ...nuevo, rol: e.target.value })}>
                  <option value="">Rol</option>
                  <option value="alumno">Alumno</option>
                  <option value="docente">Docente</option>
                </select>
              </div>
              <div className="col-md">
                <select className="form-control" value={nuevo.colegioId || ""} required onChange={e => setNuevo({ ...nuevo, colegioId: e.target.value })}>
                  <option value="">Selecciona colegio</option>
                  {colegios.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} ({c.nivel})</option>
                  ))}
                </select>
              </div>
              <div className="col-md">
                <input className="form-control" placeholder="Edad" type="number" value={nuevo.edad} onChange={e => setNuevo({ ...nuevo, edad: e.target.value })} />
              </div>
              <div className="col-md">
                <input className="form-control" placeholder="Celular" value={nuevo.celular} onChange={e => setNuevo({ ...nuevo, celular: e.target.value })} />
              </div>
              <div className="col-auto">
                <button className="btn btn-success me-2" type="submit">Guardar</button>
                <button className="btn btn-secondary" type="button" onClick={() => setNuevo(null)}>Cancelar</button>
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
                  <th>Colegio</th>
                  <th>Edad</th>
                  <th>Celular</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  editar && editar.id === u.id ? (
                    <tr key={u.id}>
                      <td>
                        <input className="form-control" value={editar.nombre} onChange={e => setEditar({ ...editar, nombre: e.target.value })} />
                      </td>
                      <td>
                        <input className="form-control" value={editar.email} onChange={e => setEditar({ ...editar, email: e.target.value })} />
                      </td>
                      <td>
                        <select className="form-control" value={editar.rol} onChange={e => setEditar({ ...editar, rol: e.target.value })}>
                          <option value="alumno">Alumno</option>
                          <option value="docente">Docente</option>
                        </select>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          value={editar.colegioId || ""}
                          onChange={e => setEditar({ ...editar, colegioId: e.target.value })}
                        >
                          <option value="">Selecciona colegio</option>
                          {colegios.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre} ({c.nivel})</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input className="form-control" value={editar.edad || ""} onChange={e => setEditar({ ...editar, edad: e.target.value })} />
                      </td>
                      <td>
                        <input className="form-control" value={editar.celular || ""} onChange={e => setEditar({ ...editar, celular: e.target.value })} />
                      </td>
                      <td className="text-center">
                        <button className="btn btn-success btn-sm me-2" onClick={handleEditar}>Guardar</button>
                        <button className="btn btn-secondary btn-sm" type="button" onClick={() => setEditar(null)}>Cancelar</button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={u.id}>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td>{u.rol}</td>
                      <td>{u.colegio?.nombre || "-"}</td>
                      <td>{u.edad}</td>
                      <td>{u.celular}</td>
                      <td className="text-center">
                        <button className="btn btn-warning btn-sm me-2" onClick={() => setEditar({
                          ...u,
                          colegioId: u.colegioId || "",
                          edad: u.edad || "",
                          celular: u.celular || ""
                        })}>Editar</button>
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