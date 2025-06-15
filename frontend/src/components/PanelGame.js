// src/components/PanelGame.js
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function PanelGame({ usuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [progresos, setProgresos] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar todos los usuarios
  useEffect(() => {
    api.get("/admin/usuarios")
      .then(res => setUsuarios(res))
      .catch(() => setError("No se pudo cargar usuarios"));
  }, []);

  // Al seleccionar usuario, cargar juegos jugados
  const handleSelectUser = user => {
    setSelectedUser(user);
    api.get(`/admin/progreso-usuario/${user.id}`)
      .then(res => setProgresos(res))
      .catch(() => setError("No se pudo cargar progreso del usuario"));
  };

  // Volver al listado de usuarios
  const volverUsuarios = () => {
    setSelectedUser(null);
    setProgresos([]);
  };

  return (
    <div className="container-fluid px-4 mt-5">
      <h2 className="text-center mb-4 text-primary fw-bold">Panel de Juegos por Usuario</h2>
      {error && (
        <div className="text-danger text-center mb-3">{error}</div>
      )}

      {!selectedUser && (
        <div>
          <h5>Selecciona un usuario para ver sus juegos:</h5>
          <div className="table-responsive rounded-3 shadow mt-3">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>{u.rol}</td>
                    <td>
                      <button className="btn btn-info btn-sm" onClick={() => handleSelectUser(u)}>
                        Ver juegos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedUser && (
        <div>
          <button className="btn btn-secondary mb-3" onClick={volverUsuarios}>
            ← Volver a usuarios
          </button>
          <h4 className="mb-3">Juegos y progreso de <b>{selectedUser.nombre}</b></h4>
          <div className="table-responsive rounded-3 shadow">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Juego</th>
                  <th>Puntaje / Avance</th>
                  <th>Completado</th>
                  <th>Última actualización</th>
                </tr>
              </thead>
              <tbody>
                {progresos.length > 0 ? progresos.map(p => (
                  <tr key={p.id}>
                    <td>{p.juego?.nombre || "-"}</td>
                    <td>{p.avance !== null ? p.avance : "-"}</td>
                    <td>{p.completado ? "Sí" : "No"}</td>
                    <td>{new Date(p.fechaActualizacion).toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="text-center">No hay registros de progreso.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
