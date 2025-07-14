import { useNavigate } from "react-router-dom";
import React from "react";

export default function NavBar({ usuario, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");         
    setTimeout(() => {
      onLogout();          
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
    }, 100);
  };

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

        {/* Botón hamburguesa */}
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
          {/* Botones principales */}
          {usuario && (
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              <li className="nav-item">
                <button
                  className="btn btn-outline-info mb-2 mb-lg-0 me-lg-2 w-100"
                  onClick={() => navigate("/categorias")}
                >
                  <i className="bi bi-grid me-1"></i>Categorías
                </button>
              </li>
              {usuario.rol === "admin" && (
                <>
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-info mb-2 mb-lg-0 me-lg-2 w-100"
                      onClick={() => navigate("/admin/juegos")}
                    >
                      <i className="bi bi-collection me-1"></i>Admin Juegos
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-warning mb-2 mb-lg-0 me-lg-2 w-100"
                      onClick={() => navigate("/admin")}
                    >
                      <i className="bi bi-gear-fill me-1"></i>Panel Admin
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-info mb-2 mb-lg-0 me-lg-2 w-100"
                      onClick={() => navigate("/dashboard-admin")}
                    >
                      <i className="bi bi-speedometer2 me-1"></i>Dashboard
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-info mb-2 mb-lg-0 me-lg-2 w-100"
                      onClick={() => navigate("/panel-game")}
                    >
                      <i className="bi bi-bar-chart-fill me-1"></i>Juegos por Usuario
                    </button>
                  </li>
                </>
              )}

              {usuario.rol === "docente" && (
                <li className="nav-item">
                  <button
                    className="btn btn-outline-info mb-2 mb-lg-0 me-lg-2 w-100"
                    onClick={() => navigate("/panel-game")}
                  >
                    <i className="bi bi-bar-chart-fill me-1"></i>Progreso Alumnos
                  </button>
                </li>
              )}

              <li className="nav-item">
                <button
                  className="btn btn-outline-info mb-2 mb-lg-0 me-lg-2 w-100"
                  onClick={() => navigate("/mis-juegos")}
                >
                  <i className="bi bi-bar-chart-fill me-1"></i>Mis Juegos y Logros
                </button>
              </li>

              {(usuario.rol === "alumno" ||
                usuario.rol === "docente" ||
                usuario.rol === "admin") && (
                <li className="nav-item">
                  <button
                    className="btn btn-outline-secondary mb-2 mb-lg-0 me-lg-2 w-100"
                    onClick={() => navigate("/mensajes-soporte")}
                  >
                    <i className="bi bi-chat-left-text me-1"></i>Soporte
                  </button>
                </li>
              )}

              <li className="nav-item">
                <button
                  className="btn btn-outline-success mb-2 mb-lg-0 me-lg-2 w-100"
                  onClick={() => navigate("/configuracion")}
                >
                  <i className="bi bi-gear me-1"></i>Configuración
                </button>
              </li>
              {/* Saludo y badge, siempre visible en mobile y desktop */}
              <li className="nav-item text-center text-lg-end mb-2 mb-lg-0">
                <span className="text-light fw-bold">
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
                </span>
              </li>
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light ms-lg-3 w-100"
                >
                  Salir
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
