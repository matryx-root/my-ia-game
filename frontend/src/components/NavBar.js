import { useNavigate } from "react-router-dom";
import React from "react";

export default function NavBar({ usuario, onLogout, configuracion }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
    setTimeout(() => {
      onLogout();
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
    }, 100);
  };

  // Opcional: Muestra el tema actual (puedes quitar si no lo usas)
  const themeText = configuracion?.tema
    ? configuracion.tema === "Oscuro"
      ? "🌙 Modo Oscuro"
      : configuracion.tema === "Claro"
      ? "☀️ Modo Claro"
      : "🖥️ Predeterminado"
    : "";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm" style={{ minHeight: 64 }}>
      <div className="container-fluid">
        <span
          className="navbar-brand fw-bold"
          style={{ cursor: "pointer", fontSize: 22 }}
          onClick={() => navigate("/")}
        >
          My IA Game
        </span>

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

        <div className="collapse navbar-collapse" id="mainNav">
          {usuario ? (
            <div className="w-100">
              <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 gap-lg-2 w-100">
                <button className="btn btn-outline-info" onClick={() => navigate("/categorias")}>
                  <i className="bi bi-grid me-1"></i>Categorías
                </button>
                {usuario.rol === "admin" && (
                  <>
                    <button className="btn btn-outline-info" onClick={() => navigate("/admin/juegos")}>
                      <i className="bi bi-collection me-1"></i>Admin Juegos
                    </button>
                    <button className="btn btn-outline-warning" onClick={() => navigate("/admin")}>
                      <i className="bi bi-gear-fill me-1"></i>Panel Admin
                    </button>
                    <button className="btn btn-outline-info" onClick={() => navigate("/dashboard-admin")}>
                      <i className="bi bi-speedometer2 me-1"></i>Dashboard
                    </button>
                    <button className="btn btn-outline-info" onClick={() => navigate("/panel-game")}>
                      <i className="bi bi-bar-chart-fill me-1"></i>Juegos por Usuario
                    </button>
                  </>
                )}
                {usuario.rol === "docente" && (
                  <button className="btn btn-outline-info" onClick={() => navigate("/panel-game")}>
                    <i className="bi bi-bar-chart-fill me-1"></i>Progreso Alumnos
                  </button>
                )}
                <button className="btn btn-outline-info" onClick={() => navigate("/mis-juegos")}>
                  <i className="bi bi-bar-chart-fill me-1"></i>Mis Juegos y Logros
                </button>
                {(usuario.rol === "alumno" || usuario.rol === "docente" || usuario.rol === "admin") && (
                  <button className="btn btn-outline-secondary" onClick={() => navigate("/mensajes-soporte")}>
                    <i className="bi bi-chat-left-text me-1"></i>Soporte
                  </button>
                )}
                <button className="btn btn-outline-success" onClick={() => navigate("/configuracion")}>
                  <i className="bi bi-gear me-1"></i>Configuración
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light ms-lg-2"
                  style={{ minWidth: 85 }}
                >
                  Salir
                </button>
              </div>

              <div className="mt-2 mt-lg-0 d-flex flex-column flex-lg-row align-items-lg-center justify-content-lg-end">
                <span className="usuario-bienvenida fw-bold" style={{ fontSize: 16 }}>
                  Bienvenido, {usuario.nombre}{" "}
                  {usuario.colegio?.nombre && (
                    <span
                      className="badge bg-info ms-2"
                      style={{ color: "#222", fontWeight: 600 }}
                    >
                      Colegio {usuario.colegio.nombre}
                    </span>
                  )}
                  {usuario.rol === "admin" && (
                    <span className="badge bg-danger ms-2">ADMIN</span>
                  )}
                  {usuario.rol === "docente" && (
                    <span className="badge bg-primary ms-2">DOCENTE</span>
                  )}
                  {usuario.rol === "alumno" && (
                    <span className="badge bg-success ms-2">ALUMNO</span>
                  )}
                  {themeText && (
                    <span className="badge bg-dark ms-2 border" style={{ color: "#f9d923" }}>
                      {themeText}
                    </span>
                  )}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-100 text-end">
              <button
                className="btn btn-outline-primary ms-2"
                onClick={() => navigate("/login")}
              >
                Iniciar sesión
              </button>
              <button
                className="btn btn-outline-success ms-2"
                onClick={() => navigate("/register")}
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
