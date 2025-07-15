import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function LogsJuegoPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarLogs = () => {
    setLoading(true);
    setError("");
    api.get('/logs-juego')
      .then(data => setLogs(data))
      .catch(() => setError("No se pudieron cargar los logs de juego."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarLogs();
  }, []);

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Logs de Juego</h3>
        <button className="btn btn-outline-primary" onClick={cargarLogs} disabled={loading}>
          {loading ? "Actualizando..." : <><i className="bi bi-arrow-clockwise"></i> Recargar</>}
        </button>
      </div>
      {error && (
        <div className="alert alert-danger py-2 mb-3">{error}</div>
      )}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
          <div className="mt-2">Cargando logs...</div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Juego</th>
                <th>Acción</th>
                <th>Detalle</th>
                <th>Duración (s)</th>
                <th>Fecha/Hora</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted">
                    No hay registros de logs de juegos.
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.usuario?.nombre || log.usuarioId}</td>
                    <td>{log.juego?.nombre || log.juegoId}</td>
                    <td>{log.accion}</td>
                    <td>{log.detalle}</td>
                    <td>{log.duracion}</td>
                    <td>{new Date(log.fechaHora).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
