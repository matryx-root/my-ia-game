import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function MensajeSoportePage({ usuario }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [destinatarioId, setDestinatarioId] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [respuesta, setRespuesta] = useState({});
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Traer todos los usuarios (admin)
  useEffect(() => {
    if (usuario?.rol === "admin") {
      api.get("/admin/usuarios")
        .then(setUsuarios)
        .catch(() => setUsuarios([]));
    }
  }, [usuario]);

  // Cargar mensajes
  const cargarMensajes = () => {
    setCargando(true);
    let url = "/mensajes";
    if (usuario.rol !== "admin") url += `?usuarioId=${usuario.id}`;
    api.get(url)
      .then(setMensajes)
      .catch(() => setError("Error al cargar mensajes"))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    if (usuario) cargarMensajes();
    // eslint-disable-next-line
  }, [usuario]);

  // Enviar mensaje (admin a cualquiera, usuarios solo a sí mismos)
  const enviarMensaje = async (e) => {
    e.preventDefault();
    setError(null);

    if (usuario.rol === "admin" && !destinatarioId) {
      setError("Selecciona el destinatario");
      return;
    }
    if (!nuevoMensaje.trim()) {
      setError("El mensaje no puede estar vacío");
      return;
    }
    setCargando(true);
    try {
      if (usuario.rol === "admin") {
        await api.post("/mensajes", {
          usuarioId: Number(destinatarioId),
          mensaje: nuevoMensaje.trim()
        });
      } else {
        await api.post("/mensajes", {
          usuarioId: usuario.id,
          mensaje: nuevoMensaje.trim()
        });
      }
      setNuevoMensaje("");
      setDestinatarioId("");
      cargarMensajes();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err.message ||
        "No se pudo enviar el mensaje"
      );
    } finally {
      setCargando(false);
    }
  };

  // Responder mensaje (admin)
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

  // Marcar como leído (solo alumno/docente)
  const marcarLeido = async (id) => {
    setCargando(true);
    setError(null);
    try {
      await api.put(`/mensajes/${id}/leido`);
      cargarMensajes();
    } catch {
      setError("No se pudo marcar como leído");
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

      {/* Formulario para enviar mensaje */}
      <form className="mb-3" onSubmit={enviarMensaje}>
        <div className="input-group">
          {/* Si es admin, elige destinatario */}
          {usuario.rol === "admin" && (
            <select
              className="form-select"
              value={destinatarioId}
              onChange={e => setDestinatarioId(e.target.value)}
              disabled={cargando}
              style={{ maxWidth: 250 }}
              required
            >
              <option value="">A quién enviar (elige usuario)...</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>
                  {u.nombre} ({u.rol}, {u.colegio?.nombre || "Sin colegio"})
                </option>
              ))}
            </select>
          )}
          <input
            className="form-control"
            value={nuevoMensaje}
            placeholder={
              usuario.rol === "admin"
                ? "Mensaje informativo o aviso a usuario seleccionado..."
                : "Escribe tu mensaje de soporte..."
            }
            onChange={e => setNuevoMensaje(e.target.value)}
            disabled={cargando}
            maxLength={500}
            required
          />
          <button className="btn btn-primary" type="submit" disabled={cargando}>
            Enviar
          </button>
        </div>
      </form>

      {/* Tabla de mensajes */}
      {cargando ? (
        <div>Cargando...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                {usuario.rol === "admin" && <th>Usuario</th>}
                <th>Mensaje</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Respuesta</th>
                {usuario.rol === "admin" && <th>Responder</th>}
                {usuario.rol !== "admin" && <th>Acción</th>}
              </tr>
            </thead>
            <tbody>
              {mensajes.length === 0 && (
                <tr>
                  <td colSpan={usuario.rol === "admin" ? 6 : 6}>
                    No hay mensajes registrados.
                  </td>
                </tr>
              )}
              {mensajes.map(m => (
                <tr key={m.id}>
                  {usuario.rol === "admin" && (
                    <td>
                      {m.usuario?.nombre || m.usuarioId}
                    </td>
                  )}
                  <td>{m.mensaje}</td>
                  <td>{new Date(m.fechaHora).toLocaleString()}</td>
                  <td>
                    {m.estado === "respondido" ? (
                      <span className="badge bg-success">Respondido</span>
                    ) : m.estado === "leido" ? (
                      <span className="badge bg-info text-dark">Leído</span>
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
                  {/* Acciones */}
                  {usuario.rol === "admin" && (
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
                  {usuario.rol !== "admin" && (
                    <td>
                      {/* Botón marcar como leído (solo para mensajes pendientes que no son propios) */}
                      {!m.leido && m.estado === "pendiente" && (
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => marcarLeido(m.id)}
                          disabled={cargando}
                        >
                          Marcar como leído
                        </button>
                      )}
                      {m.leido && (
                        <span className="badge bg-info text-dark">Leído</span>
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
