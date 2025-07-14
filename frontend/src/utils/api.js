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

// --- API centralizado ---
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

  // Subir archivos con FormData (sin Content-Type manual)
  postFile: (url, formData) =>
    fetch(API_URL + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getToken(),
        // No Content-Type para FormData
      },
      body: formData,
    }).then(handleResponse),
};

export default api;

// ========== JUEGOS ADMIN ==========

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
export function uploadArchivoJuego(file) {
  const formData = new FormData();
  formData.append("archivo", file);
  return api.postFile("/admin/juegos/upload", formData);
}

// GET /admin/juegos/download/:archivo
export function downloadArchivoJuego(nombreArchivo) {
  // Forzar descarga automática usando blob y crear un enlace oculto
  fetch(`${API_URL}/admin/juegos/download/${nombreArchivo}`, {
    method: "GET",
    headers: { Authorization: "Bearer " + getToken() },
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("No se pudo descargar archivo");
      const blob = await res.blob();
      // Descarga directa
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nombreArchivo;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 300);
    })
    .catch((err) => {
      alert("Error al descargar: " + err.message);
    });
}
