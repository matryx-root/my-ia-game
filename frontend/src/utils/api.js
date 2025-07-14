// src/utils/api.js

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

function headers(custom = {}) {
  const h = { "Content-Type": "application/json", ...custom };
  const t = getToken();
  if (t) h["Authorization"] = "Bearer " + t;
  return h;
}

async function handleResponse(response) {
  const contentType = response.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }
  if (!response.ok) {
    const errMsg =
      (typeof data === "object" && data.error) ||
      (typeof data === "object" && data.message) ||
      data ||
      response.statusText;
    if (process.env.NODE_ENV === "development") {
      console.error("API error:", errMsg, data);
    }
    throw new Error(errMsg);
  }
  return data;
}

// --- API centralizado (original) ---
const api = {
  get: (url) =>
    fetch(API_URL + url, { headers: headers() }).then(handleResponse),

  post: (url, data) =>
    fetch(API_URL + url, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  put: (url, data) =>
    fetch(API_URL + url, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  delete: (url) =>
    fetch(API_URL + url, {
      method: "DELETE",
      headers: headers(),
    }).then(handleResponse),

  // Para subir archivos con FormData (sin Content-Type manual)
  postFile: (url, formData) =>
    fetch(API_URL + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getToken(),
        // Content-Type se gestiona solo para FormData
      },
      body: formData,
    }).then(handleResponse),
};

export default api;

// ========== JUEGOS ADMIN ==========
// Todas devuelven Promesa (igual que api.get, etc.)

// GET /admin/juegos
export function getJuegos() {
  return api.get("/admin/juegos");
}

// POST /admin/juegos
export function crearJuego(data) {
  return api.post("/admin/juegos", data);
}

// PUT /admin/juegos/:id
export function actualizarJuego(id, data) {
  return api.put(`/admin/juegos/${id}`, data);
}

// DELETE /admin/juegos/:id
export function borrarJuego(id) {
  return api.delete(`/admin/juegos/${id}`);
}

// POST /admin/juegos/upload (archivo)
export function uploadArchivoJuego(formData) {
  // Usa postFile para FormData (ya añade Auth)
  return api.postFile("/admin/juegos/upload", formData);
}

// GET /admin/juegos/download/:archivo (descarga .js)
export function downloadArchivoJuego(nombreArchivo) {
  // OJO: Esto retorna un blob, no texto ni json
  return fetch(`${API_URL}/admin/juegos/download/${nombreArchivo}`, {
    method: "GET",
    headers: { Authorization: "Bearer " + getToken() },
  }).then(async (res) => {
    if (!res.ok) throw new Error("No se pudo descargar archivo");
    return await res.blob();
  });
}
