import React, { useEffect, useState } from "react";
import api from "../utils/api";

const SOLO_VALIDOS_REGEX = /^[A-ZÁÉÍÓÚÑ0-9 ]*$/;
const LIMPIAR_REGEX = /[^A-ZÁÉÍÓÚÑ0-9 ]/gi;

const MIN_MSG_LEN = 10;
const MAX_MSG_LEN = 100;
const MAX_RESPUESTA_LEN = 100;

export default function MensajeSoportePage({ usuario }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [destinatarioId, setDestinatarioId] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [respuesta, setRespuesta] = useState({});
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);

 
  const [editandoId, setEditandoId] = useState(null); 
  const [mensajeEditado, setMensajeEditado] = useState(""); 

  
  useEffect(() => {
    if (usuario?.rol === "admin") {
      api.get("/admin/usuarios")
        .then(setUsuarios)
        .catch(() => setUsuarios([]));
    }
  }, [usuario]);

  
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
    
  }, [usuario]);

  const normalizaTexto = (texto, toMayus = true) =>
    (toMayus ? texto.toUpperCase() : texto)
      .replace(LIMPIAR_REGEX, "")
      .replace(/\s{2,}/g, " ");

  
  const handleMensajeChange = (e) => {
    let valor = e.target.value;
    valor = normalizaTexto(valor);
    setNuevoMensaje(valor.slice(0, MAX_MSG_LEN));
  };

  
  const handleRespuestaChange = (id, texto) => {
    let valor = normalizaTexto(texto);
    setRespuesta((prev) => ({ ...prev, [id]: valor.slice(0, MAX_RESPUESTA_LEN) }));
  };

  
  const handleEditarChange = (texto) => {
    let valor = normalizaTexto(texto);
    setMensajeEditado(valor.slice(0, MAX_MSG_LEN));
  };

  
  const enviarMensaje = async (e) => {
    e.preventDefault();
    setError(null);

    const texto = nuevoMensaje.trim();
    if (usuario.rol === "admin" && !destinatarioId) {
      setError("Selecciona el destinatario");
      return;
    }
    if (!texto || texto.length < MIN_MSG_LEN) {
      setError(`El mensaje debe tener al menos ${MIN_MSG_LEN} caracteres útiles.`);
      return;
    }
    if (texto.length > MAX_MSG_LEN) {
      setError(`El mensaje no puede superar ${MAX_MSG_LEN} caracteres.`);
      return;
    }
    if (!SOLO_VALIDOS_REGEX.test(texto)) {
      setError("Solo se permiten letras, números y espacios (sin símbolos, tildes raras ni signos).");
      return;
    }
    setEnviando(true);
    try {
      if (usuario.rol === "admin") {
        await api.post("/mensajes", {
          usuarioId: Number(destinatarioId),
          mensaje: texto
        });
      } else {
        await api.post("/mensajes", {
          usuarioId: usuario.id,
          mensaje: texto
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
      setEnviando(false);
    }
  };

  
  const responder = async (id) => {
    const texto = (respuesta[id] || "").trim();
    if (!texto || texto.length < MIN_MSG_LEN) {
      setError(`La respuesta debe tener al menos ${MIN_MSG_LEN} caracteres.`);
      return;
    }
    if (texto.length > MAX_RESPUESTA_LEN) {
      setError(`La respuesta no puede superar ${MAX_RESPUESTA_LEN} caracteres.`);
      return;
    }
    if (!SOLO_VALIDOS_REGEX.test(texto)) {
      setError("Solo se permiten letras, números y espacios en la respuesta.");
      return;
    }
    setCargando(true);
    setError(null);
    try {
      await api.put(`/mensajes/${id}/responder`, {
        respuesta: texto,
        estado: "respondido"
      });
      setRespuesta((prev) => ({ ...prev, [id]: "" }));
      cargarMensajes();
    } catch {
      setError("No se pudo responder el mensaje");
    } finally {
      setCargando(false);
    }
  };

  
  const editarMensaje = async (id) => {
    const texto = (mensajeEditado || "").trim();
    if (!texto || texto.length < MIN_MSG_LEN) {
      setError(`El mensaje editado debe tener al menos ${MIN_MSG_LEN} caracteres.`);
      return;
    }
    if (texto.length > MAX_MSG_LEN) {
      setError(`El mensaje no puede superar ${MAX_MSG_LEN} caracteres.`);
      return;
    }
    if (!SOLO_VALIDOS_REGEX.test(texto)) {
      setError("Solo se permiten letras, números y espacios.");
      return;
    }
    setCargando(true);
    setError(null);
    try {
      await api.put(`/mensajes/${id}/editar`, {
        mensaje: texto
      });
      setEditandoId(null);
      setMensajeEditado("");
      cargarMensajes();
    } catch {
      setError("No se pudo editar el mensaje");
    } finally {
      setCargando(false);
    }
  };

  
  const eliminarMensaje = async (id) => {
    if (!window.confirm("¿Estás seguro que quieres eliminar este mensaje?")) return;
    setCargando(true);
    setError(null);
    try {
      await api.delete(`/mensajes/${id}`);
      cargarMensajes();
    } catch {
      setError("No se pudo eliminar el mensaje");
    } finally {
      setCargando(false);
    }
  };

  
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

  
  const puedeEnviar =
    !enviando &&
    nuevoMensaje.trim().length >= MIN_MSG_LEN &&
    nuevoMensaje.trim().length <= MAX_MSG_LEN &&
    (usuario.rol !== "admin" || destinatarioId) &&
    SOLO_VALIDOS_REGEX.test(nuevoMensaje.trim());

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

      
      <form className="mb-3" onSubmit={enviarMensaje}>
        <div className="input-group">
          {usuario.rol === "admin" && (
            <select
              className="form-select"
              value={destinatarioId}
              onChange={e => setDestinatarioId(e.target.value)}
              disabled={enviando}
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
                ? "MENSAJE INFORMATIVO O AVISO A USUARIO SELECCIONADO..."
                : "ESCRIBE TU MENSAJE DE SOPORTE..."
            }
            onChange={handleMensajeChange}
            disabled={enviando}
            maxLength={MAX_MSG_LEN}
            minLength={MIN_MSG_LEN}
            style={{ textTransform: "uppercase", letterSpacing: 1 }}
            required
          />
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!puedeEnviar}
            title={!puedeEnviar ? `El mensaje debe tener entre ${MIN_MSG_LEN} y ${MAX_MSG_LEN} caracteres, solo letras, números y espacios.` : ""}
          >
            {enviando ? "Enviando..." : "Enviar"}
          </button>
        </div>
        <div className="form-text">
          Solo MAYÚSCULAS. Sin símbolos ni signos. Mínimo {MIN_MSG_LEN}, máximo {MAX_MSG_LEN} caracteres.
        </div>
      </form>

      
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
                {usuario.rol === "admin" && <th>Editar</th>}
                {usuario.rol === "admin" && <th>Eliminar</th>}
                {usuario.rol !== "admin" && <th>Acción</th>}
              </tr>
            </thead>
            <tbody>
              {mensajes.length === 0 && (
                <tr>
                  <td colSpan={usuario.rol === "admin" ? 8 : 6}>
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
                  
                  <td>
                    {usuario.rol === "admin" && editandoId === m.id ? (
                      <input
                        className="form-control"
                        value={mensajeEditado}
                        onChange={e => handleEditarChange(e.target.value)}
                        maxLength={MAX_MSG_LEN}
                        minLength={MIN_MSG_LEN}
                        style={{ textTransform: "uppercase", letterSpacing: 1 }}
                        placeholder={`MÍN. ${MIN_MSG_LEN} CARACTERES`}
                      />
                    ) : (
                      m.mensaje
                    )}
                  </td>
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
                  
                  {usuario.rol === "admin" && (
                    <td>
                      {m.estado === "respondido" ? (
                        <span className="text-success">✓</span>
                      ) : (
                        <div className="input-group">
                          <input
                            className="form-control"
                            value={respuesta[m.id] || ""}
                            onChange={e => handleRespuestaChange(m.id, e.target.value)}
                            maxLength={MAX_RESPUESTA_LEN}
                            minLength={MIN_MSG_LEN}
                            style={{ textTransform: "uppercase", letterSpacing: 1 }}
                            placeholder={`MÍN. ${MIN_MSG_LEN} CARACTERES`}
                          />
                          <button
                            className="btn btn-success"
                            onClick={() => responder(m.id)}
                            disabled={
                              cargando ||
                              !(respuesta[m.id] && respuesta[m.id].trim().length >= MIN_MSG_LEN && SOLO_VALIDOS_REGEX.test(respuesta[m.id].trim()))
                            }
                          >
                            Responder
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                  
                  {usuario.rol === "admin" && (
                    <td>
                      {editandoId === m.id ? (
                        <>
                          <button
                            className="btn btn-warning btn-sm me-1"
                            onClick={() => editarMensaje(m.id)}
                            disabled={
                              cargando ||
                              !(mensajeEditado && mensajeEditado.trim().length >= MIN_MSG_LEN && SOLO_VALIDOS_REGEX.test(mensajeEditado.trim()))
                            }
                          >
                            Guardar
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setEditandoId(null);
                              setMensajeEditado("");
                            }}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => {
                            setEditandoId(m.id);
                            setMensajeEditado(m.mensaje);
                          }}
                          disabled={cargando}
                        >
                          Editar
                        </button>
                      )}
                    </td>
                  )}
                 
                  {usuario.rol === "admin" && (
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => eliminarMensaje(m.id)}
                        disabled={cargando}
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                 
                  {usuario.rol !== "admin" && (
                    <td>
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
