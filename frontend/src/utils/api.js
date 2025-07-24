// api.js - Gestión de llamadas a la API con autenticación JWT
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Obtiene el token JWT almacenado en localStorage
 * @returns {string|null} Token o null si no existe
 */
function getToken() {
  return localStorage.getItem("token");
}

/**
 * Genera headers para las solicitudes
 * Incluye Content-Type y Authorization si hay token
 * @param {Object} custom - Headers adicionales
 * @returns {Object} Headers listos para fetch
 */
function headers(custom = {}) {
  const h = { "Content-Type": "application/json", ...custom };
  const token = getToken();
  if (token) {
    h["Authorization"] = "Bearer " + token;
  }
  return h;
}

/**
 * Maneja la respuesta de la API
 * Parsea JSON o texto, y lanza errores con mensaje claro
 * @param {Response} response - Respuesta de fetch
 * @returns {Promise<any>} Datos parseados
 */
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
      console.error("API error:", {
        status: response.status,
        url: response.url,
        message: errMsg,
        data: data,
      });
    }
    throw new Error(errMsg);
  }
  return data;
}

/**
 * Objeto api - Métodos HTTP reutilizables
 */
const api = {
  /**
   * GET: Obtiene datos (requiere token excepto en rutas públicas)
   */
  get: (url) => {
    const publicRoutes = [
      "/usuarios/login",
      "/usuarios/register",
      "/colegios",
    ];
    const isPublic = publicRoutes.some(route => url.startsWith(route));

    if (isPublic) {
      return fetch(API_URL + url, { headers: headers() }).then(handleResponse);
    }

    const token = getToken();
    if (!token) {
      return Promise.reject(new Error("Sesión expirada. Debes iniciar sesión."));
    }
    return fetch(API_URL + url, { headers: headers() }).then(handleResponse);
  },

  /**
   * POST: Envía datos
   * Permite login/register sin token; el resto requiere autenticación
   */
  post: (url, data) => {
    const publicRoutes = ["/usuarios/login", "/usuarios/register"];
    const isPublic = publicRoutes.includes(url);

    if (isPublic) {
      return fetch(API_URL + url, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(data),
      }).then(handleResponse);
    }

    const token = getToken();
    if (!token) {
      return Promise.reject(new Error("Sesión expirada. Debes iniciar sesión."));
    }
    return fetch(API_URL + url, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  /**
   * PUT: Actualiza datos (siempre requiere token)
   */
  put: (url, data) => {
    const token = getToken();
    if (!token) {
      return Promise.reject(new Error("Sesión expirada. Debes iniciar sesión."));
    }
    return fetch(API_URL + url, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  /**
   * DELETE: Elimina datos (requiere token)
   */
  delete: (url) => {
    const token = getToken();
    if (!token) {
      return Promise.reject(new Error("Sesión expirada. Debes iniciar sesión."));
    }
    return fetch(API_URL + url, {
      method: "DELETE",
      headers: headers(),
    }).then(handleResponse);
  },

  /**
   * POST para subir archivos (multipart/form-data)
   * No se incluye Content-Type: lo establece fetch automáticamente
   */
  postFile: (url, formData) => {
    const token = getToken();
    if (!token) {
      return Promise.reject(new Error("Sesión expirada. Debes iniciar sesión."));
    }
    return fetch(API_URL + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        // fetch añade automáticamente el boundary correcto
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
  const token = getToken();
  if (!token) {
    alert("Sesión expirada. Inicia sesión nuevamente.");
    return;
  }

  fetch(`${API_URL}/admin/juegos/download/${nombreArchivo}`, {
    method: "GET",
    headers: { Authorization: "Bearer " + token },
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("No se pudo descargar el archivo");
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
      console.error("Error al descargar:", err);
      alert("Error al descargar: " + err.message);
    });
}