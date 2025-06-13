import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Registro({ onRegister }) {
  const [data, setData] = useState({
    nombre: "",
    email: "",
    password: "",
    edad: "",
    celular: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validación simple
  const validate = () => {
    const newErrors = {};
    if (!data.nombre) newErrors.nombre = "Nombre es requerido";
    if (!data.email) newErrors.email = "Email es requerido";
    else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = "Email no válido";
    if (!data.password) newErrors.password = "Contraseña es requerida";
    else if (data.password.length < 6) newErrors.password = "Mínimo 6 caracteres";
    if (data.edad && (data.edad < 5 || data.edad > 120)) newErrors.edad = "Edad no válida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios de campos
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  // Manejar registro
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.post("/usuarios/register", data);
      if (res.mensaje) {
        alert("¡Registro exitoso!");
        if (onRegister) onRegister();
        navigate("/login"); // Lleva a login después de registro
      } else {
        alert(res.error || "Error en el registro");
      }
    } catch (error) {
      alert("Error en la conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0 text-center">Registro</h2>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleRegister} autoComplete="off">
                {/* Nombre */}
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre Completo</label>
                  <input
                    id="nombre"
                    className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                    name="nombre"
                    placeholder="Ej: Juan Pérez"
                    onChange={handleChange}
                    value={data.nombre}
                    required
                  />
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <input
                    id="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    name="email"
                    type="email"
                    placeholder="Ej: usuario@dominio.com"
                    onChange={handleChange}
                    value={data.email}
                    required
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                {/* Contraseña */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    id="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    name="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    onChange={handleChange}
                    value={data.password}
                    required
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                {/* Edad y Celular en row */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="edad" className="form-label">Edad (opcional)</label>
                    <input
                      id="edad"
                      className={`form-control ${errors.edad ? "is-invalid" : ""}`}
                      name="edad"
                      type="number"
                      min="5"
                      max="120"
                      placeholder="Ej: 25"
                      onChange={handleChange}
                      value={data.edad}
                    />
                    {errors.edad && <div className="invalid-feedback">{errors.edad}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="celular" className="form-label">Celular (opcional)</label>
                    <input
                      id="celular"
                      className="form-control"
                      name="celular"
                      type="tel"
                      placeholder="Ej: 3001234567"
                      onChange={handleChange}
                      value={data.celular}
                    />
                  </div>
                </div>
                {/* Botón de registro */}
                <div className="d-grid gap-2 mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registrando...
                      </>
                    ) : "Registrarse"}
                  </button>
                </div>
                {/* Enlace para login */}
                <div className="text-center mt-3">
                  ¿Ya tienes cuenta?{" "}
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    style={{ textDecoration: "underline" }}
                    onClick={() => navigate("/login")}
                  >
                    Inicia sesión aquí
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
