/**
 * main.js — Shared utilities used across all pages.
 */

import { isLoggedIn, getUser, logout } from "./api.js";

// ─── Navigation bar: show/hide links based on login state ──────────────────

export function initNav() {
  const navLinks = document.getElementById("nav-links");
  if (!navLinks) return;

  const user = getUser();

  if (isLoggedIn() && user) {
    navLinks.innerHTML = `
      <a href="/index.html">Home</a>
      <a href="/add-recipe.html">+ Add Recipe</a>
      <span class="nav-user">Hi, ${escapeHtml(user.username)}</span>
      <button id="logout-btn" class="btn-link">Logout</button>
    `;
    document.getElementById("logout-btn").addEventListener("click", logout);
  } else {
    navLinks.innerHTML = `
      <a href="/index.html">Home</a>
      <a href="/login.html">Login</a>
      <a href="/register.html">Register</a>
    `;
  }
}

// ─── Star rating renderer ───────────────────────────────────────────────────

/**
 * Returns an HTML string of filled/empty stars.
 * @param {number|null} rating  - e.g. 4.3
 * @param {number} max          - usually 5
 */
export function renderStars(rating, max = 5) {
  if (rating === null || rating === undefined) return '<span class="no-rating">No ratings yet</span>';
  const full  = Math.floor(rating);
  const half  = rating - full >= 0.5;
  const empty = max - full - (half ? 1 : 0);
  return (
    "★".repeat(full) +
    (half ? "½" : "") +
    "☆".repeat(empty) +
    ` <small>(${rating})</small>`
  );
}

// ─── Difficulty badge ───────────────────────────────────────────────────────

export function difficultyBadge(level) {
  const colors = { easy: "green", medium: "orange", hard: "red" };
  return `<span class="badge badge-${colors[level] || "gray"}">${level}</span>`;
}

// ─── XSS-safe HTML escaping ─────────────────────────────────────────────────

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─── Show inline error/success messages ────────────────────────────────────

export function showMessage(elementId, message, isError = true) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.className = isError ? "msg error" : "msg success";
  el.style.display = "block";
}
