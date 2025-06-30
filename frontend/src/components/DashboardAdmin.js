import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function DashboardAdmin({ usuario }) {
  const [resumen, setResumen] = useState({});
  const [ultimos, setUltimos] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario || usuario.rol !== "admin") {
      alert("Solo el administrador puede acceder.");
      navigate("/");
      return;
    }
    setLoading(true);
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
    ]).then(([
      resumen, usuarios, colegios, configuraciones,
      mensajes, errores, logsJuego, logsIngreso, logros
    ]) => {
      setResumen(resumen);
      setUltimos({
        usuarios, colegios, configuraciones,
        mensajes, errores, logsJuego, logsIngreso, logros
      });
      setLoading(false);
    });
    // eslint-disable-next-line
  }, [usuario]);

  if (loading) return <div className="container py-5 text-center"><span className="spinner-border"></span></div>;

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 text-primary fw-bold">Dashboard Administración</h2>
      <div className="row g-4 mb-4">
        <DashboardCard label="Usuarios" value={resumen.totalUsuarios} />
        <DashboardCard label="Colegios" value={resumen.totalColegios} />
        <DashboardCard label="Configuraciones" value={resumen.totalConfiguraciones} />
        <DashboardCard label="Mensajes" value={resumen.totalMensajes} />
        <DashboardCard label="Errores" value={resumen.totalErrores} />
        <DashboardCard label="Logs Juego" value={resumen.totalLogsJuego} />
        <DashboardCard label="Logs Ingreso" value={resumen.totalLogsIngreso} />
        <DashboardCard label="Logros" value={resumen.totalLogros} />
      </div>

      <div className="row g-4">
        <DashboardTable title="Últimos Usuarios" rows={ultimos.usuarios} columns={["nombre", "email", "rol"]} />
        <DashboardTable title="Últimos Colegios" rows={ultimos.colegios} columns={["nombre", "nivel"]} />
        <DashboardTable title="Últimos Mensajes Soporte" rows={ultimos.mensajes} columns={["mensaje", "fechaHora", "estado"]} />
        <DashboardTable title="Últimos Errores" rows={ultimos.errores} columns={["fechaHora", "mensaje"]} />
        <DashboardTable title="Últimos Logs de Juego" rows={ultimos.logsJuego} columns={["fechaHora", "accion", "detalle"]} />
        <DashboardTable title="Últimos Logs de Ingreso" rows={ultimos.logsIngreso} columns={["fechaHora", "ip", "userAgent"]} />
        <DashboardTable title="Últimos Logros" rows={ultimos.logros} columns={["nombre", "fechaHora"]} />
      </div>
    </div>
  );
}

function DashboardCard({ label, value }) {
  return (
    <div className="col-6 col-md-3">
      <div className="card shadow text-center border-0">
        <div className="card-body">
          <div className="fw-bold fs-2">{value ?? "-"}</div>
          <div className="fs-6">{label}</div>
        </div>
      </div>
    </div>
  );
}

function DashboardTable({ title, rows, columns }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div className="col-12 col-md-6">
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">{title}</div>
        <div className="table-responsive">
          <table className="table table-sm mb-0">
            <thead>
              <tr>
                {columns.map(c => <th key={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id || idx}>
                  {columns.map(c => <td key={c}>{String(row[c] ?? (row.usuario?.nombre || "-"))}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
