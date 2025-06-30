import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function MensajeSoportePage({ usuario }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [respuesta, setRespuesta] = useState({});
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Cargar mensajes: todos si admin/docente, solo propios si alumno
  const cargarMensajes = () => {
    setCargando(true);
    let url = "/mensajes";
    if (usuario.rol === "alumno") url += `?usuarioId=${usuario.id}`;
    api.get(url)
      .then(setMensajes)
      .catch(() => setError("Error al cargar mensajes"))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    if (usuario) cargarMensajes();
    // eslint-disable-next-line
  }, [usuario]);

  // Enviar nuevo mensaje de soporte
  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;
    setCargando(true);
    setError(null);
    try {
      await api.post("/mensajes", {
        usuarioId: usuario.id,
        mensaje: nuevoMensaje
      });
      setNuevoMensaje("");
      cargarMensajes();
    } catch {
      setError("No se pudo enviar el mensaje");
    } finally {
      setCargando(false);
    }
  };

  // Responder mensaje (admin/docente)
  const responder = async (id) => {
    if (!respuesta[id] || !respuesta[id].trim()) return;
    setCargando(true);
    setError(null);
    try {
      await api.put(`/mensajes/${id}/responder`, {
        respuesta: respuesta[id],
        estado: "respondido"
      });
      setRespuesta({ ...respuesta, [id]: "" });
      cargarMensajes();
    } catch {
      setError("No se pudo responder el mensaje");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-primary fw-bold">
        {usuario.rol === "admin"
          ? "Mensajes de Soporte (Admin)"
          : usuario.rol === "docente"
            ? "Mensajes de Soporte (Docente)"
            : "Soporte / Mensajes"}
      </h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Nuevo mensaje: alumno o docente */}
      {(usuario.rol === "alumno" || usuario.rol === "docente") && (
        <form className="mb-3" onSubmit={enviarMensaje}>
          <div className="input-group">
            <input
              className="form-control"
              value={nuevoMensaje}
              placeholder="Escribe tu mensaje de soporte..."
              onChange={e => setNuevoMensaje(e.target.value)}
              disabled={cargando}
              maxLength={500}
            />
            <button className="btn btn-primary" type="submit" disabled={cargando}>
              Enviar
            </button>
          </div>
        </form>
      )}

      {/* Listado de mensajes */}
      {cargando ? (
        <div>Cargando...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                {(usuario.rol === "admin" || usuario.rol === "docente") && <th>Usuario</th>}
                <th>Mensaje</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Respuesta</th>
                {(usuario.rol === "admin" || usuario.rol === "docente") && <th>Responder</th>}
              </tr>
            </thead>
            <tbody>
              {mensajes.length === 0 && (
                <tr>
                  <td colSpan={usuario.rol === "admin" || usuario.rol === "docente" ? 6 : 5}>
                    No hay mensajes registrados.
                  </td>
                </tr>
              )}
              {mensajes.map(m => (
                <tr key={m.id}>
                  {(usuario.rol === "admin" || usuario.rol === "docente") && (
                    <td>
                      {/* Si el backend devuelve el usuario anidado puedes usar: m.usuario?.nombre */}
                      {m.usuario?.nombre || m.usuarioId}
                    </td>
                  )}
                  <td>{m.mensaje}</td>
                  <td>{new Date(m.fechaHora).toLocaleString()}</td>
                  <td>
                    {m.estado === "respondido" ? (
                      <span className="badge bg-success">Respondido</span>
                    ) : (
                      <span className="badge bg-warning text-dark">Pendiente</span>
                    )}
                  </td>
                  <td>
                    {m.respuesta ? (
                      <span className="text-success">{m.respuesta}</span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  {(usuario.rol === "admin" || usuario.rol === "docente") && (
                    <td>
                      {m.estado === "respondido" ? (
                        <span className="text-success">✓</span>
                      ) : (
                        <div className="input-group">
                          <input
                            className="form-control"
                            value={respuesta[m.id] || ""}
                            onChange={e => setRespuesta({ ...respuesta, [m.id]: e.target.value })}
                            maxLength={300}
                          />
                          <button
                            className="btn btn-success"
                            onClick={() => responder(m.id)}
                            disabled={cargando || !respuesta[m.id] || !respuesta[m.id].trim()}
                          >
                            Responder
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
