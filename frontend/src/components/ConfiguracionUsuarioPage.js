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
      .catch(() => setError("No se pudo cargar la configuración."))
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
    <div className="container-fluid py-3 px-2">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          {/* Título */}
          <h2 className="text-primary fw-bold text-center mb-4" style={{
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            color: 'var(--color-title, #114eeb)'
          }}>
            Configuración de Usuario
          </h2>

          {/* Mensajes */}
          {error && (
            <div className="alert alert-danger text-center mb-3" style={{
              fontSize: 'clamp(0.9rem, 4vw, 1rem)'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success text-center mb-3" style={{
              fontSize: 'clamp(0.9rem, 4vw, 1rem)'
            }}>
              {success}
            </div>
          )}

          {cargando ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3" style={{ fontSize: 'clamp(0.9rem, 4vw, 1rem)' }}>
                Cargando configuración...
              </p>
            </div>
          ) : (
            <form onSubmit={guardarConfig} style={{
              maxWidth: '100%',
              margin: 'auto'
            }}>
              {/* Tema visual */}
              <div className="mb-4">
                <label className="form-label fw-bold" style={{
                  fontSize: 'clamp(1rem, 4vw, 1.2rem)'
                }}>
                  Tema visual
                </label>
                <select
                  className="form-select"
                  name="tema"
                  value={config.tema}
                  onChange={handleChange}
                  disabled={cargando}
                  style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
                >
                  <option value="Predeterminado">Predeterminado</option>
                  <option value="Oscuro">Oscuro</option>
                  <option value="Claro">Claro</option>
                </select>
              </div>

              {/* Idioma */}
              <div className="mb-4">
                <label className="form-label fw-bold" style={{
                  fontSize: 'clamp(1rem, 4vw, 1.2rem)'
                }}>
                  Idioma
                </label>
                <select
                  className="form-select"
                  name="idioma"
                  value={config.idioma}
                  onChange={handleChange}
                  disabled={cargando}
                  style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
                >
                  <option value="Español">Español</option>
                  <option value="Inglés">Inglés</option>
                </select>
              </div>

              {/* Sonido */}
              <div className="form-check form-switch mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="sonido"
                  name="sonido"
                  checked={!!config.sonido}
                  onChange={handleChange}
                  disabled={cargando}
                  style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
                />
                <label className="form-check-label fw-bold" htmlFor="sonido" style={{
                  fontSize: 'clamp(0.95rem, 4vw, 1.1rem)'
                }}>
                  Sonido Activado
                </label>
              </div>

              {/* Notificaciones */}
              <div className="form-check form-switch mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="notificaciones"
                  name="notificaciones"
                  checked={!!config.notificaciones}
                  onChange={handleChange}
                  disabled={cargando}
                  style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}
                />
                <label className="form-check-label fw-bold" htmlFor="notificaciones" style={{
                  fontSize: 'clamp(0.95rem, 4vw, 1.1rem)'
                }}>
                  Notificaciones Activadas
                </label>
              </div>

              {/* Botón de guardar */}
              <div className="d-flex justify-content-center mt-4">
                <button
                  className="btn btn-primary btn-lg px-4"
                  type="submit"
                  disabled={cargando}
                  style={{
                    fontSize: 'clamp(0.9rem, 4vw, 1.1rem)',
                    fontWeight: 500
                  }}
                >
                  {cargando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Guardando...
                    </>
                  ) : "Guardar configuración"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}