const API_URL = "http://localhost:5000/api";
function getToken() { return localStorage.getItem("token"); }
function headers() {
  const h = { "Content-Type": "application/json" };
  const t = getToken();
  if (t) h["Authorization"] = "Bearer " + t;
  return h;
}
const api = {
  get: (url) =>
    fetch(API_URL + url, { headers: headers() }).then((r) => r.json()),
  post: (url, data) =>
    fetch(API_URL + url, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then((r) => r.json()),
  put: (url, data) =>
    fetch(API_URL + url, { method: "PUT", headers: headers(), body: JSON.stringify(data) }).then((r) => r.json()),
  delete: (url) =>
    fetch(API_URL + url, { method: "DELETE", headers: headers() }).then((r) => r.json()),
};

export default api;
