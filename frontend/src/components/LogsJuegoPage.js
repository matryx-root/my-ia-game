import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function LogsJuegoPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/logs-juego').then(setLogs);
  }, []);

  return (
    <div className="container my-4">
      <h3>Logs de Juego</h3>
      <table className="table table-bordered">
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
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.usuario?.nombre || log.usuarioId}</td>
              <td>{log.juego?.nombre || log.juegoId}</td>
              <td>{log.accion}</td>
              <td>{log.detalle}</td>
              <td>{log.duracion}</td>
              <td>{new Date(log.fechaHora).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
