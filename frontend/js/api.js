/**
 * api.js — Centralized API client for Mother's Recipe
 *
 * Usage:
 *   import { api } from './api.js';
 *   const recipes = await api.get('/recipes/');
 *   const newRecipe = await api.post('/recipes/', { title: '...' });
 */

// ─── Change this to your Render backend URL before deploying ───────────────
const BASE_URL = "https://mother-s-recipe.onrender.com/api";
// For local development use: "http://127.0.0.1:8000/api"
// ───────────────────────────────────────────────────────────────────────────

/**
 * Low-level fetch wrapper.
 * - Automatically attaches the JWT Authorization header.
 * - Redirects to login.html on 401 Unauthorized.
 * - Throws an Error with the server's message on non-2xx responses.
 *
 * @param {string} endpoint  - path after BASE_URL, e.g. "/recipes/"
 * @param {object} options   - standard fetch options (method, body, etc.)
 * @returns {Promise<any>}   - parsed JSON response
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Attach JWT token if we have one
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Session expired or not authenticated → send to login
  if (response.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    window.location.href = "/login.html";
    return;
  }

  // Parse response body (may be empty for 204 No Content)
  let data = null;
  const contentType = response.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    data = await response.json();
  }

  // Throw on any non-2xx status so callers can catch errors
  if (!response.ok) {
    const message = extractErrorMessage(data) || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data;
}

/**
 * Pull a human-readable message out of Django REST Framework error payloads.
 * DRF can return errors in several shapes, so we handle them all.
 */
function extractErrorMessage(data) {
  if (!data) return null;
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  // Collect field-level errors
  const messages = [];
  for (const [field, errors] of Object.entries(data)) {
    const errList = Array.isArray(errors) ? errors : [errors];
    messages.push(`${field}: ${errList.join(", ")}`);
  }
  return messages.join(" | ") || null;
}

// ─── Convenience methods ───────────────────────────────────────────────────

export const api = {
  get: (endpoint) => request(endpoint, { method: "GET" }),
  post: (endpoint, body) => request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  patch: (endpoint, body) => request(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};

// ─── Auth helpers ──────────────────────────────────────────────────────────

export function saveAuthData({ access, refresh, user }) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function isLoggedIn() {
  return !!localStorage.getItem("access_token");
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  window.location.href = "/login.html";
}
