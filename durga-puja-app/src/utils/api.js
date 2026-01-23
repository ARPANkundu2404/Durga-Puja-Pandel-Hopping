const API_BASE_URL = "http://localhost:8080/api";

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...headers,
    },
  };

  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE_URL}${path}`, opts);
  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore json parse errors
  }

  return { ok: res.ok, status: res.status, data };
}

export async function get(path, options = {}) {
  return request(path, { method: "GET", headers: options.headers });
}

export async function post(path, body, options = {}) {
  return request(path, { method: "POST", body, headers: options.headers });
}

export async function put(path, body, options = {}) {
  return request(path, { method: "PUT", body, headers: options.headers });
}

export async function deleteRequest(path, options = {}) {
  return request(path, { method: "DELETE", headers: options.headers });
}

// Simple JWT storage helpers (localStorage)
export function setToken(token) {
  try {
    localStorage.setItem("jwtToken", token);
  } catch {
    void 0;
  }
}

export function getToken() {
  try {
    return localStorage.getItem("jwtToken");
  } catch {
    return null;
  }
}

export function removeToken() {
  try {
    localStorage.removeItem("jwtToken");
  } catch {
    void 0;
  }
}

export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default {
  get,
  post,
  put,
  delete: deleteRequest,
  setToken,
  getToken,
  removeToken,
  authHeaders,
};
