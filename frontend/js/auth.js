/**
 * auth.js — Handles login and register form submissions.
 * Import this script in login.html and register.html.
 */

import { api, saveAuthData } from "./api.js";
import { showMessage } from "./main.js";

// ─── Login ─────────────────────────────────────────────────────────────────

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById("error-msg");
    errorEl.textContent = "";
    errorEl.style.display = "none";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {
      const data = await api.post("/auth/login/", { username, password });
      saveAuthData(data);
      window.location.href = "/index.html";
    } catch (err) {
      showMessage("error-msg", err.message);
    }
  });
}

// ─── Register ──────────────────────────────────────────────────────────────

const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById("error-msg");
    errorEl.textContent = "";
    errorEl.style.display = "none";

    const username  = document.getElementById("username").value.trim();
    const email     = document.getElementById("email").value.trim();
    const password  = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;

    if (password !== password2) {
      showMessage("error-msg", "Passwords do not match.");
      return;
    }

    try {
      const data = await api.post("/auth/register/", {
        username,
        email,
        password,
        password2,
      });
      saveAuthData(data);
      window.location.href = "/index.html";
    } catch (err) {
      showMessage("error-msg", err.message);
    }
  });
}
