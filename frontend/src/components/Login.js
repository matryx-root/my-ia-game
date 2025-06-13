import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await api.post("/usuarios/login", { email, password });
    if (res.token) {
      localStorage.setItem("userId", res.usuario.id);
      localStorage.setItem("token", res.token);
      onLogin(res.usuario);
    } else {
      alert(res.mensaje || "Login fallido");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "400px" }}>
        <form onSubmit={handleLogin} className="text-center">
          <h2 className="mb-4">Iniciar Sesión</h2>
          <div className="mb-3">
            <input 
              className="form-control" 
              placeholder="Correo" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div className="mb-3">
            <input 
              type="password" 
              className="form-control" 
              placeholder="Contraseña" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Entrar</button>
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
