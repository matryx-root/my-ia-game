// utils/api.js

// Base URL configurable para despliegue local o en la nube
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Devuelve el token JWT almacenado localmente
function getToken() {
  return localStorage.getItem("token");
}

// Construye las cabeceras para cada request (puedes extenderlas si lo necesitas)
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
    throw new Error(data.error || data.message || response.statusText);
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

  // Ejemplo: Para subir archivos en el futuro
  postFile: (url, formData) =>
    fetch(API_URL + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getToken(),
        // NO pongas Content-Type para FormData, el navegador lo gestiona
      },
      body: formData,
    }).then(handleResponse),
};

export default api;
