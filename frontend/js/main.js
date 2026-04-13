/**
 * main.js — Shared utilities used across all pages.
 */

import { isLoggedIn, getUser, logout } from "./api.js";
import { i18n } from "./i18n.js";

// ─── Navigation bar: show/hide links based on login state ──────────────────

export function initNav() {
  const navLinks = document.getElementById("nav-links");
  if (!navLinks) return;

  const user = getUser();
  const currentLang = i18n.getLang();

  const langToggle = `
    <div class="lang-toggle" role="group" aria-label="Language">
      <button class="lang-toggle-btn${currentLang === "th" ? " active" : ""}" data-lang="th">TH</button>
      <button class="lang-toggle-btn${currentLang === "en" ? " active" : ""}" data-lang="en">EN</button>
    </div>
  `;

  if (isLoggedIn() && user) {
    navLinks.innerHTML = `
      <a href="/index.html">${i18n.t("nav.home")}</a>
      <a href="/add-recipe.html">${i18n.t("nav.add_recipe")}</a>
      <span class="nav-user">${i18n.t("nav.hi_user", { username: escapeHtml(user.username) })}</span>
      <button id="logout-btn" class="btn-link">${i18n.t("nav.logout")}</button>
      ${langToggle}
    `;
    document.getElementById("logout-btn").addEventListener("click", logout);
  } else {
    navLinks.innerHTML = `
      <a href="/index.html">${i18n.t("nav.home")}</a>
      <a href="/login.html">${i18n.t("nav.login")}</a>
      <a href="/register.html">${i18n.t("nav.register")}</a>
      ${langToggle}
    `;
  }

  // Attach language toggle listeners after innerHTML is set
  navLinks.querySelectorAll(".lang-toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.lang === i18n.getLang()) return;
      document.body.classList.add("lang-transitioning");
      setTimeout(() => {
        i18n.setLang(btn.dataset.lang);
        initNav();
        document.body.classList.remove("lang-transitioning");
      }, 180);
    });
  });
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
  const label = i18n.t(`difficulty.${level}`) || level;
  return `<span class="badge badge-${colors[level] || "gray"}">${escapeHtml(label)}</span>`;
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
