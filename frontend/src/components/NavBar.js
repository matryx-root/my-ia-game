import { useNavigate } from "react-router-dom";
import React from "react";

export default function NavBar({ usuario, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // <--- LandingPage, NO /login
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
              {/* Botón Categorías SIEMPRE para usuario logueado */}
              <button
                className="btn btn-outline-info me-3"
                onClick={() => navigate("/categorias")}
              >
                <i className="bi bi-grid me-1"></i>
                Categorías
              </button>

              {/* Si el usuario es admin, muestra el botón de PanelAdmin */}
              {usuario.rol === "admin" && (
                <button
                  className="btn btn-outline-warning me-3"
                  onClick={() => navigate("/admin")}
                >
                  <i className="bi bi-gear-fill me-1"></i>
                  Panel Admin
                </button>
              )}
              <span className="text-light me-3 d-none d-sm-block">
                Bienvenido, <span className="fw-bold">{usuario.nombre}</span>
                {usuario.rol === "admin" && (
                  <span className="badge bg-danger ms-2">ADMIN</span>
                )}
              </span>
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
