// src/components/DashboardAdmin.js

import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

// Íconos para las tarjetas
const CARD_ICONS = {
  Usuarios: "bi-people-fill",
  Colegios: "bi-building",
  Configuraciones: "bi-gear-fill",
  Mensajes: "bi-chat-dots-fill",
  Errores: "bi-bug-fill",
  "Logs Juego": "bi-controller",
  "Logs Ingreso": "bi-door-open-fill",
  Logros: "bi-trophy-fill"
};

export default function DashboardAdmin({ usuario }) {
  const [resumen, setResumen] = useState({});
  const [ultimos, setUltimos] = useState({
    usuarios: [],
    colegios: [],
    configuraciones: [],
    mensajes: [],
    errores: [],
    logsJuego: [],
    logsIngreso: [],
    logros: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario || usuario.rol !== "admin") {
      alert("Solo el administrador puede acceder.");
      navigate("/");
      return;
    }
    setLoading(true);
    setError(null);

    Promise.all([
      api.get("/dashboard/resumen"),
      api.get("/dashboard/usuarios"),
      api.get("/dashboard/colegios"),
      api.get("/dashboard/configuraciones"),
      api.get("/dashboard/mensajes"),
      api.get("/dashboard/errores"),
      api.get("/dashboard/logsJuego"),
      api.get("/dashboard/logsIngreso"),
      api.get("/dashboard/logros"),
    ])
      .then(([
        resumen, usuarios, colegios, configuraciones,
        mensajes, errores, logsJuego, logsIngreso, logros
      ]) => {
        setResumen(resumen || {});
        setUltimos({
          usuarios: usuarios || [],
          colegios: colegios || [],
          configuraciones: configuraciones || [],
          mensajes: mensajes || [],
          errores: errores || [],
          logsJuego: logsJuego || [],
          logsIngreso: logsIngreso || [],
          logros: logros || []
        });
      })
      .catch(err => {
        setError("No se pudo cargar el dashboard. " + (err?.message || ""));
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [usuario]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <span className="spinner-border"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 text-primary fw-bold">
        <i className="bi bi-bar-chart-fill me-2"></i>
        Dashboard Administración
      </h2>
      {/* Tarjetas resumen */}
      <div className="row g-4 mb-4">
        {[
          ["Usuarios", resumen.totalUsuarios, "Total de usuarios registrados"],
          ["Colegios", resumen.totalColegios, "Cantidad de colegios creados"],
          ["Configuraciones", resumen.totalConfiguraciones, "Preferencias individuales guardadas"],
          ["Mensajes", resumen.totalMensajes, "Mensajes de soporte y avisos"],
          ["Errores", resumen.totalErrores, "Errores registrados en el sistema"],
          ["Logs Juego", resumen.totalLogsJuego, "Actividad de juego de los usuarios"],
          ["Logs Ingreso", resumen.totalLogsIngreso, "Registros de inicio de sesión"],
          ["Logros", resumen.totalLogros, "Logros obtenidos por los usuarios"]
        ].map(([label, value, help]) => (
          <DashboardCard key={label} label={label} value={value} help={help} icon={CARD_ICONS[label]} />
        ))}
      </div>

      {/* Tablas de últimos elementos */}
      <div className="row g-4">
        <DashboardTable title="Últimos Usuarios" rows={ultimos.usuarios} columns={["nombre", "email", "rol"]} icon="bi-people-fill" badge="primary" />
        <DashboardTable title="Últimos Colegios" rows={ultimos.colegios} columns={["nombre", "nivel"]} icon="bi-building" badge="secondary" />
        <DashboardTable title="Últimos Mensajes Soporte" rows={ultimos.mensajes} columns={["mensaje", "fechaHora", "estado"]} icon="bi-chat-dots-fill" badge="info" />
        <DashboardTable title="Últimos Errores" rows={ultimos.errores} columns={["fechaHora", "mensaje"]} icon="bi-bug-fill" badge="danger" />
        <DashboardTable title="Últimos Logs de Juego" rows={ultimos.logsJuego} columns={["fechaHora", "accion", "detalle"]} icon="bi-controller" badge="success" />
        <DashboardTable title="Últimos Logs de Ingreso" rows={ultimos.logsIngreso} columns={["fechaHora", "ip", "userAgent"]} icon="bi-door-open-fill" badge="warning" />
        <DashboardTable title="Últimos Logros" rows={ultimos.logros} columns={["nombre", "fechaHora"]} icon="bi-trophy-fill" badge="success" />
      </div>
    </div>
  );
}

// Tarjeta resumen (dashboard)
function DashboardCard({ label, value, help, icon }) {
  return (
    <div className="col-6 col-md-3">
      <div className="card shadow text-center border-0 h-100" title={help}>
        <div className="card-body">
          <div className="fw-bold fs-2 d-flex align-items-center justify-content-center">
            <i className={`bi ${icon} me-2 text-primary`} style={{ fontSize: 30 }}></i>
            {value ?? "-"}
          </div>
          <div className="fs-6">{label}</div>
        </div>
      </div>
    </div>
  );
}

// Tabla resumen últimos datos (usuarios, colegios, mensajes, etc.)
function DashboardTable({ title, rows, columns, icon, badge }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div className="col-12 col-md-6">
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <i className={`bi ${icon} me-2`}></i> {title}
        </div>
        <div className="table-responsive">
          <table className="table table-sm mb-0 align-middle">
            <thead>
              <tr>
                {columns.map(c => (
                  <th key={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id || idx}>
                  {columns.map(c => (
                    <td key={c}>
                      {/* Fechas con formato */}
                      {c.toLowerCase().includes("fecha") || c.toLowerCase().includes("hora")
                        ? (row[c] ? new Date(row[c]).toLocaleString() : "-")
                        : // Estados y badges
                        c === "estado"
                        ? (
                          <span className={`badge bg-${badge || "secondary"}`}>
                            {row[c]}
                          </span>
                        )
                        : // Mensajes y descripciones
                        c === "mensaje" && row[c]?.length > 80
                        ? row[c].slice(0, 80) + "..."
                        : // Usuario anidado
                        typeof row[c] !== "undefined"
                        ? String(row[c])
                        : row.usuario?.nombre || "-"
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
