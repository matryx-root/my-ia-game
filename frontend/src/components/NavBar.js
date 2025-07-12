import { useNavigate } from "react-router-dom";
import React from "react";
import { useTranslation } from "react-i18next";


export default function NavBar({ usuario, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // LandingPage
    onLogout();
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <span
          className="navbar-brand fw-bold"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          My IA Game
        </span>
        <div className="d-flex align-items-center">
          {usuario && (
            <>
              {/* Botón Categorías SIEMPRE */}
              <button
                className="btn btn-outline-info me-3"
                onClick={() => navigate("/categorias")}
              >
                <i className="bi bi-grid me-1"></i>
                Categorías
              </button>

              {/* Botones para admin */}
              {usuario.rol === "admin" && (
                <>
                  <button
                    className="btn btn-outline-warning me-3"
                    onClick={() => navigate("/admin")}
                  >
                    <i className="bi bi-gear-fill me-1"></i>
                    Panel Admin
                  </button>
                  <button
                    className="btn btn-outline-info me-3"
                    onClick={() => navigate("/dashboard-admin")}
                  >
                    <i className="bi bi-speedometer2 me-1"></i>
                    Dashboard
                  </button>
                  <button
                    className="btn btn-outline-info me-3"
                    onClick={() => navigate("/panel-game")}
                  >
                    <i className="bi bi-bar-chart-fill me-1"></i>
                    Juegos por Usuario
                  </button>
                </>
              )}

              {/* Botón docente para ver progreso de alumnos */}
              {usuario.rol === "docente" && (
                <button
                  className="btn btn-outline-info me-3"
                  onClick={() => navigate("/panel-game")}
                >
                  <i className="bi bi-bar-chart-fill me-1"></i>
                  Progreso Alumnos
                </button>
              )}

              {/* Botón Soporte/Mensajes: para alumno, docente y admin */}
              {(usuario.rol === "alumno" ||
                usuario.rol === "docente" ||
                usuario.rol === "admin") && (
                <button
                  className="btn btn-outline-secondary me-3"
                  onClick={() => navigate("/mensajes-soporte")}
                >
                  <i className="bi bi-chat-left-text me-1"></i>
                  Soporte
                </button>
              )}

              {/* BOTÓN CONFIGURACIÓN: SIEMPRE VISIBLE SI HAY USUARIO */}
              <button
                className="btn btn-outline-success me-3"
                onClick={() => navigate("/configuracion")}
              >
                <i className="bi bi-gear me-1"></i>
                Configuración
              </button>

              {/* Badge y saludo */}
              <span className="text-light me-3 d-none d-sm-block">
                Bienvenido, <span className="fw-bold">{usuario.nombre}</span>
                {(usuario.rol === "alumno" || usuario.rol === "docente") &&
                  usuario.colegio?.nombre && (
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
              {/* Botón salir */}
              <button
                onClick={handleLogout}
                className="btn btn-outline-light"
              >
                Salir
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
