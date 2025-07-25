const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Devuelve el token JWT desde localStorage
function getToken() {
  return localStorage.getItem("token");
}

// Genera headers para fetch, añadiendo Authorization si hay token
function headers(custom = {}) {
  const h = { "Content-Type": "application/json", ...custom };
  const t = getToken();
  if (t) h["Authorization"] = "Bearer " + t;
  return h;
}

// Maneja la respuesta de la API, extrayendo JSON o texto y lanzando errores claros
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
      (typeof data === "object" && (data.error || data.message)) ||
      data ||
      response.statusText;
    if (process.env.NODE_ENV === "development") {
      console.error("API error:", errMsg, data);
    }
    throw new Error(errMsg);
  }
  return data;
}

// --- AQUI LA CLAVE: login/register SÍ funcionan sin token ---
const api = {
  get: (url) => {
    // Permitir login/register/colegios sin token
    if (
      url.startsWith("/usuarios/login") ||
      url.startsWith("/usuarios/register") ||
      url.startsWith("/colegios")
    ) {
      return fetch(API_URL + url, { headers: headers() }).then(handleResponse);
    }
    const t = getToken();
    if (!t) {
      // Si requiere token y no hay, rechaza
      return Promise.reject(new Error("Sesión expirada. Debes iniciar sesión."));
    }
    return fetch(API_URL + url, { headers: headers() }).then(handleResponse);
  },

  post: (url, data) => {
    // Permitir login/register sin token
    if (
      url === "/usuarios/login" ||
      url === "/usuarios/register"
    ) {
      return fetch(API_URL + url, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(data),
      }).then(handleResponse);
    }
    const t = getToken();
    if (!t) {
      return Promise.reject(new Error("Sesión expirada. Debes iniciar sesión."));
    }
    return fetch(API_URL + url, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  put: (url, data) => {
    const t = getToken();
    if (!t) {
      return Promise.reject(new Error("Sesión expirada. Debes iniciar sesión."));
    }
    return fetch(API_URL + url, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  delete: (url) => {
    const t = getToken();
    if (!t) {
      return Promise.reject(new Error("Sesión expirada. Debes iniciar sesión."));
    }
    return fetch(API_URL + url, {
      method: "DELETE",
      headers: headers(),
    }).then(handleResponse);
  },

  postFile: (url, formData) => {
    const t = getToken();
    if (!t) {
      return Promise.reject(new Error("Sesión expirada. Debes iniciar sesión."));
    }
    return fetch(API_URL + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getToken(),
        // Ojo: *NO* incluyas "Content-Type" aquí, fetch la pone automáticamente en multipart/form-data
      },
      body: formData,
    }).then(handleResponse);
  },
};

export default api;

/* ---- FUNCIONES ESPECÍFICAS DE JUEGOS ---- */
export function getJuegos() {
  return api.get("/admin/juegos");
}

export function crearJuego(data) {
  return api.post("/admin/juegos", data);
}

export function actualizarJuego(id, data) {
  return api.put(`/admin/juegos/${id}`, data);
}

export function borrarJuego(id) {
  return api.delete(`/admin/juegos/${id}`);
}

export function uploadArchivoJuego(file) {
  const formData = new FormData();
  formData.append("archivo", file);
  return api.postFile("/admin/juegos/upload", formData);
}

export function downloadArchivoJuego(nombreArchivo) {
  fetch(`${API_URL}/admin/juegos/download/${nombreArchivo}`, {
    method: "GET",
    headers: { Authorization: "Bearer " + getToken() },
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("No se pudo descargar archivo");
      const blob = await res.blob();
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
