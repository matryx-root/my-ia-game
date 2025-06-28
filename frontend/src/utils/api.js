// utils/api.js

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Devuelve el token JWT almacenado localmente
function getToken() {
  return localStorage.getItem("token");
}

// Construye las cabeceras para cada request
function headers(custom = {}) {
  const h = { "Content-Type": "application/json", ...custom };
  const t = getToken();
  if (t) h["Authorization"] = "Bearer " + t;
  return h;
}

// Función para manejar la respuesta y errores HTTP
async function handleResponse(response) {
  const contentType = response.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }
  if (!response.ok) {
    // Esto permite que en tu catch puedas mostrar el error como string legible
    const errMsg =
      (typeof data === "object" && data.error) ||
      (typeof data === "object" && data.message) ||
      data ||
      response.statusText;
    // Opcional: log
    if (process.env.NODE_ENV === "development") {
      console.error("API error:", errMsg, data);
    }
    throw new Error(errMsg);
  }
  return data;
}

// API centralizado
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
// export { API_URL }; // Descomenta si necesitas la URL en otros archivos
