import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

// Regex
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const CELULAR_REGEX = /^[0-9]{9}$/;
const NOMBRE_REGEX = /^[A-ZÁÉÍÓÚÑ ]{1,40}$/;

export default function Registro({ onRegister }) {
  const [data, setData] = useState({
    nombre: "",
    email: "",
    password: "",
    edad: "",
    celular: "",
    rol: "",
    colegioId: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [colegios, setColegios] = useState([]);
  const [cargandoColegios, setCargandoColegios] = useState(true);
  const [usuariosExistentes, setUsuariosExistentes] = useState([]);
  const navigate = useNavigate();

  // Cargar colegios y usuarios (para duplicidad email)
  useEffect(() => {
    api.get("/colegios")
      .then(res => setColegios(Array.isArray(res) ? res : []))
      .catch(() => setColegios([]))
      .finally(() => setCargandoColegios(false));

    api.get("/usuarios")
      .then(res => setUsuariosExistentes(res.map(u => u.email.toUpperCase())))
      .catch(() => setUsuariosExistentes([]));
  }, []);

  // Validación profunda
  const validate = (values) => {
    const newErrors = {};

    // Nombre
    if (!values.nombre) newErrors.nombre = "El nombre es requerido";
    else if (!NOMBRE_REGEX.test(values.nombre)) newErrors.nombre = "Solo letras, espacios, máx 40, en MAYÚSCULAS";

    // Email
    if (!values.email) newErrors.email = "Correo es requerido";
    else if (!EMAIL_REGEX.test(values.email)) newErrors.email = "Formato inválido. Ej: DOCENTE@GMAIL.COM";
    else if (usuariosExistentes.includes(values.email.toUpperCase())) newErrors.email = "Este correo ya está registrado. Usa otro.";

    // Contraseña
    if (!values.password) newErrors.password = "Contraseña es requerida";
    else if (!PASSWORD_REGEX.test(values.password)) newErrors.password = "8+ caracteres, mínimo 1 letra y 1 número. Ej: ABCD1234";

    // Rol
    if (!values.rol) newErrors.rol = "Selecciona tu rol";

    // Colegio
    if (!values.colegioId) newErrors.colegioId = "Selecciona un colegio";

    // Edad
    if (values.rol === "alumno") {
      if (!values.edad || isNaN(Number(values.edad))) newErrors.edad = "Edad obligatoria para alumno";
      else if (Number(values.edad) < 8 || Number(values.edad) > 18) newErrors.edad = "Alumno: edad entre 8 y 18";
    } else if (values.rol === "docente") {
      if (!values.edad || isNaN(Number(values.edad))) newErrors.edad = "Edad obligatoria para docente";
      else if (Number(values.edad) < 19 || Number(values.edad) > 60) newErrors.edad = "Docente: edad entre 19 y 60";
    }

    // Celular
    if (values.celular && !CELULAR_REGEX.test(values.celular)) newErrors.celular = "Solo 9 dígitos, ej: 912345678";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Cambios en campos: fuerza mayúsculas y quita errores
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (["nombre", "email"].includes(name)) value = value.toUpperCase();
    setData({ ...data, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  // Limpieza de campos antes de enviar
  const cleanData = (obj) => {
    let cleaned = { ...obj };
    // Limpia solo los campos de texto
    for (let k of ["nombre", "email", "password", "celular"]) {
      if (typeof cleaned[k] === "string") cleaned[k] = cleaned[k].trim();
    }
    return cleaned;
  };

  // Registro
  const handleRegister = async (e) => {
    e.preventDefault();
    const cleaned = cleanData(data);
    if (!validate(cleaned)) return;
    setLoading(true);
    try {
      const res = await api.post("/usuarios/register", {
        ...cleaned,
        colegioId: cleaned.colegioId ? Number(cleaned.colegioId) : null,
        edad: cleaned.edad ? Number(cleaned.edad) : null,
      });
      if (res.mensaje) {
        alert("¡Registro exitoso!");
        if (onRegister) onRegister();
        navigate("/login");
      } else if (res.error && res.error.toLowerCase().includes("correo")) {
        setErrors(prev => ({ ...prev, email: res.error }));
      } else {
        alert(res.error || "Error en el registro");
      }
    } catch (error) {
      // Mejor mensaje para duplicidad
      setErrors(prev => ({
        ...prev,
        email: "No se pudo registrar. Revisa si el correo ya está en uso o verifica tu conexión."
      }));
    } finally {
      setLoading(false);
    }
  };

  // Placeholders
  const placeholderEdad = data.rol === "alumno"
    ? "EJ: 12 (8 a 18 AÑOS)"
    : data.rol === "docente"
    ? "EJ: 25 (19 a 60 AÑOS)"
    : "EDAD";
  const placeholderNombre = "EJ: JUAN PÉREZ";
  const placeholderEmail = "EJ: DOCENTE@GMAIL.COM";
  const placeholderPassword = "EJ: ABCD1234";
  const placeholderCelular = "EJ: 912345678";

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
                    name="nombre"
                    className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                    maxLength={40}
                    placeholder={placeholderNombre}
                    value={data.nombre}
                    onChange={handleChange}
                    required
                    style={{ textTransform: "uppercase", color: "#495057" }}
                  />
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <input
                    id="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    type="email"
                    placeholder={placeholderEmail}
                    value={data.email}
                    onChange={handleChange}
                    required
                    style={{ textTransform: "uppercase", color: "#495057" }}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                {/* Contraseña */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    id="password"
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    type="password"
                    placeholder={placeholderPassword}
                    value={data.password}
                    onChange={handleChange}
                    required
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                {/* Rol */}
                <div className="mb-3">
                  <label htmlFor="rol" className="form-label">Rol</label>
                  <select
                    id="rol"
                    name="rol"
                    className={`form-select ${errors.rol ? "is-invalid" : ""}`}
                    value={data.rol}
                    onChange={handleChange}
                    required
                  >
                    <option value="">SELECCIONA TU ROL</option>
                    <option value="alumno">ALUMNO</option>
                    <option value="docente">DOCENTE</option>
                  </select>
                  {errors.rol && <div className="invalid-feedback">{errors.rol}</div>}
                </div>
                {/* Colegio */}
                <div className="mb-3">
                  <label htmlFor="colegioId" className="form-label">Colegio</label>
                  <select
                    id="colegioId"
                    name="colegioId"
                    className={`form-select ${errors.colegioId ? "is-invalid" : ""}`}
                    value={data.colegioId}
                    onChange={handleChange}
                    required
                    disabled={cargandoColegios}
                  >
                    <option value="">
                      {cargandoColegios
                        ? "CARGANDO COLEGIOS..."
                        : (colegios.length === 0 ? "NO HAY COLEGIOS DISPONIBLES" : "SELECCIONA TU COLEGIO")
                      }
                    </option>
                    {colegios.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} ({c.nivel})
                      </option>
                    ))}
                  </select>
                  {errors.colegioId && <div className="invalid-feedback">{errors.colegioId}</div>}
                </div>
                {/* Edad y Celular */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="edad" className="form-label">Edad</label>
                    <input
                      id="edad"
                      name="edad"
                      className={`form-control ${errors.edad ? "is-invalid" : ""}`}
                      type="number"
                      min={data.rol === "alumno" ? 8 : data.rol === "docente" ? 19 : 8}
                      max={data.rol === "alumno" ? 18 : data.rol === "docente" ? 60 : 99}
                      placeholder={placeholderEdad}
                      value={data.edad}
                      onChange={handleChange}
                      required
                    />
                    {errors.edad && <div className="invalid-feedback">{errors.edad}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="celular" className="form-label">Celular (opcional)</label>
                    <input
                      id="celular"
                      name="celular"
                      className={`form-control ${errors.celular ? "is-invalid" : ""}`}
                      type="tel"
                      placeholder={placeholderCelular}
                      maxLength={9}
                      value={data.celular}
                      onChange={handleChange}
                    />
                    {errors.celular && <div className="invalid-feedback">{errors.celular}</div>}
                  </div>
                </div>
                {/* Botón */}
                <div className="d-grid gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading || cargandoColegios || colegios.length === 0}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registrando...
                      </>
                    ) : "Registrarse"}
                  </button>
                </div>
                {/* Enlace login */}
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
