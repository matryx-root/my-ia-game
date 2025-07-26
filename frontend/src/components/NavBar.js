import { useNavigate } from "react-router-dom";
import React from "react";

export default function NavBar({ usuario, onLogout, configuracion }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Navega primero
    navigate("/");
    // Luego ejecuta logout y limpieza
    onLogout?.();
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
  };

  // Texto del tema actual
  const themeText = configuracion?.tema
    ? configuracion.tema === "Oscuro"
      ? "🌙 Modo Oscuro"
      : configuracion.tema === "Claro"
      ? "☀️ Modo Claro"
      : "🖥️ Predeterminado"
    : "";

  return (
    <nav
      className="navbar navbar-expand-lg mb-4 shadow-sm"
      style={{
        minHeight: 'clamp(56px, 6vh, 72px)',
        background: 'var(--navbar-bg, #000)',
        color: 'var(--color-text)',
        transition: 'background 0.3s, color 0.3s'
      }}
    >
      <div className="container-fluid">
        {/* Logo / Brand */}
        <span
          className="navbar-brand fw-bold"
          style={{
            cursor: "pointer",
            fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
            color: 'var(--color-text)'
          }}
          onClick={() => navigate("/")}
        >
          My IA Game
        </span>

        {/* Botón de toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú colapsable */}
        <div className="collapse navbar-collapse" id="mainNav">
          {usuario ? (
            <div className="w-100">
              {/* Botones de navegación */}
              <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 gap-lg-3 w-100">
                <button
                  className="btn btn-outline-light"
                  onClick={() => navigate("/categorias")}
                  style={{ fontSize: 'clamp(0.85rem, 4vw, 1rem)' }}
                >
                  <i className="bi bi-grid me-1"></i>Categorías
                </button>

                {usuario.rol === "admin" && (
                  <>
                    <button
                      className="btn btn-outline-light"
                      onClick={() => navigate("/admin/juegos")}
                      style={{ fontSize: 'clamp(0.85rem, 4vw, 1rem)' }}
                    >
                      <i className="bi bi-collection me-1"></i>Admin Juegos
                    </button>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/admin")}
                      style={{ fontSize: 'clamp(0.85rem, 4vw, 1rem)' }}
                    >
                      <i className="bi bi-gear-fill me-1"></i>Panel Admin
                    </button>
                    <button
                      className="btn btn-outline-light"
                      onClick={() => navigate("/dashboard-admin")}
                      style={{ fontSize: 'clamp(0.85rem, 4vw, 1rem)' }}
                    >
                      <i className="bi bi-speedometer2 me-1"></i>Dashboard
                    </button>
                    <button
                      className="btn btn-outline-light"
                      onClick={() => navigate("/panel-game")}
                      style={{ fontSize: 'clamp(0.85rem, 4vw, 1rem)' }}
                    >
                      <i className="bi bi-bar-chart-fill me-1"></i>Juegos por Usuario
                    </button>
                  </>
                )}

                {usuario.rol === "docente" && (
                  <button
                    className="btn btn-outline-light"
                    onClick={() => navigate("/panel-game")}
                    style={{ fontSize: 'clamp(0.85rem, 4vw, 1rem)' }}
                  >
                    <i className="bi bi-bar-chart-fill me-1"></i>Progreso Alumnos
                  </button>
                )}

                <button
                  className="btn btn-outline-light"
                  onClick={() => navigate("/mis-juegos")}
                  style={{ fontSize: 'clamp(0.85rem, 4vw, 1rem)' }}
                >
                  <i className="bi bi-bar-chart-fill me-1"></i>Mis Juegos y Logros
                </button>

                {(usuario.rol === "alumno" || usuario.rol === "docente" || usuario.rol === "admin") && (
                  <button
                    className="btn btn-outline-light"
                    onClick={() => navigate("/mensajes-soporte")}
                    style={{ fontSize: 'clamp(0.85rem, 4vw, 1rem)' }}
                  >
                    <i className="bi bi-chat-left-text me-1"></i>Soporte
                  </button>
                )}

                <button
                  className="btn btn-outline-success"
                  onClick={() => navigate("/configuracion")}
                  style={{ fontSize: 'clamp(0.85rem, 4vw, 1rem)' }}
                >
                  <i className="bi bi-gear me-1"></i>Configuración
                </button>

                <button
                  onClick={handleLogout}
                  className="btn btn-danger ms-lg-auto"
                  style={{
                    fontSize: 'clamp(0.85rem, 4vw, 1rem)',
                    padding: '0.375em 0.75em',
                    fontWeight: 500
                  }}
                >
                  Salir
                </button>
              </div>

              {/* Información del usuario (nombre, rol, tema) */}
              <div className="mt-3 mt-lg-2 d-flex flex-column flex-lg-row align-items-lg-center justify-content-lg-end gap-2">
                <span
                  className="usuario-bienvenida fw-bold"
                  style={{ fontSize: 'clamp(0.9rem, 4vw, 1rem)' }}
                >
                  Bienvenido, <strong>{usuario.nombre}</strong>
                </span>

                <div className="d-flex flex-wrap justify-content-center justify-content-lg-end gap-2">
                  {usuario.colegio?.nombre && (
                    <span className="badge bg-info text-dark px-2 py-1" style={{ fontWeight: 500 }}>
                      Colegio {usuario.colegio.nombre}
                    </span>
                  )}
                  {usuario.rol === "admin" && (
                    <span className="badge bg-danger px-2 py-1">ADMIN</span>
                  )}
                  {usuario.rol === "docente" && (
                    <span className="badge bg-primary px-2 py-1">DOCENTE</span>
                  )}
                  {usuario.rol === "alumno" && (
                    <span className="badge bg-success px-2 py-1">ALUMNO</span>
                  )}
                  {themeText && (
                    <span
                      className="badge bg-dark border px-2 py-1"
                      style={{ color: '#f9d923', fontSize: '0.85rem' }}
                    >
                      {themeText}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Botones de login/register */
            <div className="d-flex flex-column flex-lg-row justify-content-end gap-2 ms-auto">
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate("/login")}
                style={{ fontSize: 'clamp(0.85rem, 4vw, 1rem)' }}
              >
                Iniciar sesión
              </button>
              <button
                className="btn btn-outline-success"
                onClick={() => navigate("/register")}
                style={{ fontSize: 'clamp(0.85rem, 4vw, 1rem)' }}
              >
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}