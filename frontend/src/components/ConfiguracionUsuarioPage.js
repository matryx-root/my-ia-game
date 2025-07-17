import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function ConfiguracionUsuarioPage({ usuario, onConfigChange }) {
  const [config, setConfig] = useState({
    tema: "Predeterminado",
    idioma: "Español",
    sonido: true,
    notificaciones: true
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!usuario?.id) return;
    setCargando(true);
    api.get(`/configuracion/${usuario.id}`)
      .then(res => {
        if (res) {
          setConfig({
            tema: res.tema || "Predeterminado",
            idioma: res.idioma || "Español",
            sonido: res.sonido ?? true,
            notificaciones: res.notificaciones ?? true,
          });
        }
        setError(null);
      })
      .catch(() => setError("No se pudo cargar la configuración"))
      .finally(() => setCargando(false));
  }, [usuario]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setConfig(c => ({
      ...c,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const guardarConfig = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await api.post(`/configuracion/${usuario.id}`, config);
      setSuccess("¡Configuración guardada correctamente!");
      if (onConfigChange) onConfigChange({ ...config });
    } catch (err) {
      setError("No se pudo guardar la configuración.");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-primary fw-bold mb-4 text-center">
        Configuración de Usuario
      </h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form style={{ maxWidth: 550, margin: "auto" }} onSubmit={guardarConfig}>
        <div className="mb-3">
          <label className="form-label fw-bold">Tema visual</label>
          <select
            className="form-select"
            name="tema"
            value={config.tema}
            onChange={handleChange}
            disabled={cargando}
          >
            <option value="Predeterminado">Predeterminado</option>
            <option value="Oscuro">Oscuro</option>
            <option value="Claro">Claro</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Idioma</label>
          <select
            className="form-select"
            name="idioma"
            value={config.idioma}
            onChange={handleChange}
            disabled={cargando}
          >
            <option value="Español">Español</option>
            <option value="Inglés">Inglés</option>
          </select>
        </div>
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="sonido"
            name="sonido"
            checked={!!config.sonido}
            onChange={handleChange}
            disabled={cargando}
          />
          <label className="form-check-label fw-bold" htmlFor="sonido">
            Sonido Activado
          </label>
        </div>
        <div className="form-check form-switch mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="notificaciones"
            name="notificaciones"
            checked={!!config.notificaciones}
            onChange={handleChange}
            disabled={cargando}
          />
          <label className="form-check-label fw-bold" htmlFor="notificaciones">
            Notificaciones Activadas
          </label>
        </div>
        <button className="btn btn-primary" type="submit" disabled={cargando}>
          Guardar configuración
        </button>
      </form>
    </div>
  );
}
