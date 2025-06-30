import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await api.post("/usuarios/login", { email, password });
      setLoading(false);

      if (res.token && res.usuario) {
        // Guarda el usuario COMPLETO (objeto), el token, y otros campos si necesitas
        localStorage.setItem("usuario", JSON.stringify(res.usuario));
        localStorage.setItem("token", res.token);

        // Extras opcionales por compatibilidad:
        localStorage.setItem("userId", res.usuario.id);
        localStorage.setItem("rol", res.usuario.rol || "");
        if (res.usuario.colegioId)
          localStorage.setItem("colegioId", res.usuario.colegioId);

        if (typeof onLogin === "function") onLogin(res.usuario);

        // Redirección según el rol
        if (res.usuario.rol === "admin") {
          navigate("/admin");
        } else if (res.usuario.rol === "docente") {
          navigate("/panel-game");
        } else {
          navigate("/categorias");
        }
      } else if (res.error === "correo_no_existe") {
        setErrorMsg("Login fallido, su correo no está registrado.");
      } else if (res.error === "password_incorrecta") {
        setErrorMsg("Login fallido, su contraseña no es la misma a la registrada.");
      } else {
        setErrorMsg(res.mensaje || res.error || "Login fallido. Verifica tu email y contraseña.");
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg("Login fallido. Usuario o contraseña incorrectos, o no tienes cuenta registrada.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "400px" }}>
        <form onSubmit={handleLogin} className="text-center" autoComplete="off">
          <h2 className="mb-4">Iniciar Sesión</h2>
          {errorMsg && (
            <div className="alert alert-danger py-2">{errorMsg}</div>
          )}
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Correo"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
          <div className="mt-3">
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              className="btn btn-link p-0"
              style={{ textDecoration: "underline" }}
              onClick={() => navigate("/register")}
            >
              Regístrate aquí
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
