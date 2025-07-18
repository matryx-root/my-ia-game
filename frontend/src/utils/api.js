const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

// Borra token y datos de usuario (opcional: puedes limpiar más cosas si tienes)
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  // Si usas context o Redux, llama aquí también a setUsuario(null)
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

// Genera headers para fetch, añadiendo Authorization si hay token
function headers(custom = {}) {
  const h = { "Content-Type": "application/json", ...custom };
  const t = getToken();
  if (t) h["Authorization"] = "Bearer " + t;
  return h;
}

// Maneja la respuesta, controla errores 401/403 y muestra mensajes claros
async function handleResponse(response) {
  const contentType = response.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  // Si el token está vencido o inválido: borra y saca al login
  if (response.status === 401 || response.status === 403) {
    logout();
    throw new Error("Sesión expirada. Debes iniciar sesión de nuevo.");
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

const api = {
  get: (url) => {
    const token = getToken();
    if (!token) {
      logout();
      return Promise.reject(new Error("Sesión expirada. Debes iniciar sesión."));
    }
    return fetch(API_URL + url, { headers: headers() }).then(handleResponse);
  },
  post: (url, data) => {
    const token = getToken();
    if (!token) {
      logout();
      return Promise.reject(new Error("Sesión expirada. Debes iniciar sesión."));
    }
    return fetch(API_URL + url, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  },
  put: (url, data) => {
    const token = getToken();
    if (!token) {
      logout();
      return Promise.reject(new Error("Sesión expirada. Debes iniciar sesión."));
    }
    return fetch(API_URL + url, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  },
  delete: (url) => {
    const token = getToken();
    if (!token) {
      logout();
      return Promise.reject(new Error("Sesión expirada. Debes iniciar sesión."));
    }
    return fetch(API_URL + url, {
      method: "DELETE",
      headers: headers(),
    }).then(handleResponse);
  },
  postFile: (url, formData) => {
    const token = getToken();
    if (!token) {
      logout();
      return Promise.reject(new Error("Sesión expirada. Debes iniciar sesión."));
    }
    return fetch(API_URL + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      body: formData,
    }).then(handleResponse);
  },
  logout,
  getToken,
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
