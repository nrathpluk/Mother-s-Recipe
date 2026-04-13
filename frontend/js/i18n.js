/**
 * i18n.js — Thai/English translation engine.
 * Usage: import { i18n } from "./i18n.js"
 * Default language: Thai ("th")
 */

const TRANSLATIONS = {
  en: {
    // ── Navigation ─────────────────────────────────────────────────────────
    "nav.logo":         "🍲 Mother's Recipe",
    "nav.home":         "Home",
    "nav.add_recipe":   "+ Add Recipe",
    "nav.hi_user":      "Hi, {username}",
    "nav.logout":       "Logout",
    "nav.login":        "Login",
    "nav.register":     "Register",

    // ── Hero / Search ───────────────────────────────────────────────────────
    "hero.title":          "Recipes Made with Love",
    "hero.subtitle":       "Discover and share home-cooked recipes from families around the world.",
    "search.placeholder":  "Search recipes or ingredients…",
    "search.button":       "Search",

    // ── Recipe states ───────────────────────────────────────────────────────
    "recipes.loading":  "Loading recipes…",
    "recipes.empty":    "No recipes found. Add the first one!",
    "recipes.error":    "Failed to load recipes: {error}",

    // ── Pagination ──────────────────────────────────────────────────────────
    "pagination.prev":  "← Previous",
    "pagination.page":  "Page {page}",
    "pagination.next":  "Next →",

    // ── Recipe card ─────────────────────────────────────────────────────────
    "card.min":           "min",
    "difficulty.easy":    "Easy",
    "difficulty.medium":  "Medium",
    "difficulty.hard":    "Hard",

    // ── Footer ──────────────────────────────────────────────────────────────
    "footer.text":  "© 2025 Mother's Recipe — Built with ❤️",

    // ── Login page ──────────────────────────────────────────────────────────
    "login.title":              "Welcome back 👋",
    "login.subtitle":           "Sign in to share and save your favorite recipes.",
    "login.username_label":     "Username",
    "login.username_ph":        "your_username",
    "login.password_label":     "Password",
    "login.password_ph":        "••••••••",
    "login.button":             "Login",
    "login.divider":            "or",
    "login.no_account":         "Don't have an account?",
    "login.register_anchor":    "Register here",
    "login.logging_in":         "Logging in…",
    "login.google_error":       "Google login failed. Please try again.",

    // ── Add / Edit Recipe page ──────────────────────────────────────────────
    "recipe.add_title":     "Add a New Recipe",
    "recipe.edit_title":    "Edit Recipe",
    "recipe.section_basic": "Basic Info",
    "recipe.section_photo": "Recipe Photo",
    "recipe.section_ingr":  "Ingredients",
    "recipe.section_steps": "Instructions",
    "recipe.label_title":   "Recipe Title *",
    "recipe.label_desc":    "Description *",
    "recipe.label_time":    "Cooking Time (minutes) *",
    "recipe.label_diff":    "Difficulty *",
    "recipe.ph_title":      "e.g. Tom Yum Soup",
    "recipe.ph_desc":       "Briefly describe the dish and its origin…",
    "recipe.ph_time":       "30",
    "recipe.diff_select":   "Select…",
    "recipe.diff_easy":     "Easy",
    "recipe.diff_medium":   "Medium",
    "recipe.diff_hard":     "Hard",
    "recipe.photo_hint":    "Upload directly to Cloudinary. The image URL is automatically saved when you submit.",
    "recipe.ingr_hint":     "Add each ingredient on its own line.",
    "recipe.steps_hint":    "Add each step in order.",
    "recipe.ingr_ph":       "e.g. 2 cups jasmine rice",
    "recipe.step_ph":       "Step {n}: …",
    "recipe.upload_btn":    "📷 Upload Photo",
    "recipe.add_ingr_btn":  "+ Add Ingredient",
    "recipe.add_step_btn":  "+ Add Step",
    "recipe.cancel_btn":    "Cancel",
    "recipe.save_btn":      "Save Recipe",
    "recipe.update_btn":    "Update Recipe",
    "recipe.image_loaded":  "Current image loaded.",
    "recipe.item_ph":       "Add item…",
    "recipe.saving":        "Saving…",
    "recipe.saved":         "Recipe saved! Redirecting…",
    "recipe.err_fields":    "Please fill in all required fields.",
    "recipe.err_ingr":      "Please add at least one ingredient.",
    "recipe.err_steps":     "Please add at least one step.",
    "recipe.upload_fail":   "Upload failed: {error}",
    "recipe.upload_ok":     "✓ Image uploaded!",
    "recipe.load_fail":     "Could not load recipe: {error}",
  },

  th: {
    // ── Navigation ─────────────────────────────────────────────────────────
    "nav.logo":         "🍲 สูตรอาหารของแม่",
    "nav.home":         "หน้าแรก",
    "nav.add_recipe":   "+ เพิ่มสูตรอาหาร",
    "nav.hi_user":      "สวัสดี, {username}",
    "nav.logout":       "ออกจากระบบ",
    "nav.login":        "เข้าสู่ระบบ",
    "nav.register":     "สมัครสมาชิก",

    // ── Hero / Search ───────────────────────────────────────────────────────
    "hero.title":          "สูตรอาหารที่ปรุงด้วยความรัก",
    "hero.subtitle":       "ค้นพบและแบ่งปันสูตรอาหารบ้านจากครอบครัวทั่วโลก",
    "search.placeholder":  "ค้นหาสูตรอาหารหรือส่วนผสม…",
    "search.button":       "ค้นหา",

    // ── Recipe states ───────────────────────────────────────────────────────
    "recipes.loading":  "กำลังโหลดสูตรอาหาร…",
    "recipes.empty":    "ยังไม่มีสูตรอาหาร เพิ่มสูตรแรกกันเลย!",
    "recipes.error":    "โหลดสูตรอาหารไม่สำเร็จ: {error}",

    // ── Pagination ──────────────────────────────────────────────────────────
    "pagination.prev":  "← ก่อนหน้า",
    "pagination.page":  "หน้า {page}",
    "pagination.next":  "ถัดไป →",

    // ── Recipe card ─────────────────────────────────────────────────────────
    "card.min":           "นาที",
    "difficulty.easy":    "ง่าย",
    "difficulty.medium":  "ปานกลาง",
    "difficulty.hard":    "ยาก",

    // ── Footer ──────────────────────────────────────────────────────────────
    "footer.text":  "© 2025 สูตรอาหารของแม่ — สร้างด้วย ❤️",

    // ── Login page ──────────────────────────────────────────────────────────
    "login.title":              "ยินดีต้อนรับกลับ 👋",
    "login.subtitle":           "เข้าสู่ระบบเพื่อแบ่งปันและบันทึกสูตรอาหารที่คุณชื่นชอบ",
    "login.username_label":     "ชื่อผู้ใช้",
    "login.username_ph":        "your_username",
    "login.password_label":     "รหัสผ่าน",
    "login.password_ph":        "••••••••",
    "login.button":             "เข้าสู่ระบบ",
    "login.divider":            "หรือ",
    "login.no_account":         "ยังไม่มีบัญชี?",
    "login.register_anchor":    "สมัครสมาชิกที่นี่",
    "login.logging_in":         "กำลังเข้าสู่ระบบ…",
    "login.google_error":       "เข้าสู่ระบบด้วย Google ไม่สำเร็จ กรุณาลองใหม่",

    // ── Add / Edit Recipe page ──────────────────────────────────────────────
    "recipe.add_title":     "เพิ่มสูตรอาหารใหม่",
    "recipe.edit_title":    "แก้ไขสูตรอาหาร",
    "recipe.section_basic": "ข้อมูลพื้นฐาน",
    "recipe.section_photo": "รูปภาพอาหาร",
    "recipe.section_ingr":  "ส่วนผสม",
    "recipe.section_steps": "วิธีทำ",
    "recipe.label_title":   "ชื่อสูตรอาหาร *",
    "recipe.label_desc":    "คำอธิบาย *",
    "recipe.label_time":    "เวลาทำอาหาร (นาที) *",
    "recipe.label_diff":    "ระดับความยาก *",
    "recipe.ph_title":      "เช่น ต้มยำกุ้ง",
    "recipe.ph_desc":       "อธิบายเมนูและที่มาของอาหารโดยย่อ…",
    "recipe.ph_time":       "30",
    "recipe.diff_select":   "เลือก…",
    "recipe.diff_easy":     "ง่าย",
    "recipe.diff_medium":   "ปานกลาง",
    "recipe.diff_hard":     "ยาก",
    "recipe.photo_hint":    "อัปโหลดไปยัง Cloudinary โดยตรง URL รูปภาพจะถูกบันทึกอัตโนมัติเมื่อส่งแบบฟอร์ม",
    "recipe.ingr_hint":     "เพิ่มส่วนผสมทีละรายการ",
    "recipe.steps_hint":    "เพิ่มขั้นตอนตามลำดับ",
    "recipe.ingr_ph":       "เช่น ข้าวหอมมะลิ 2 ถ้วย",
    "recipe.step_ph":       "ขั้นตอนที่ {n}: …",
    "recipe.upload_btn":    "📷 อัปโหลดรูปภาพ",
    "recipe.add_ingr_btn":  "+ เพิ่มส่วนผสม",
    "recipe.add_step_btn":  "+ เพิ่มขั้นตอน",
    "recipe.cancel_btn":    "ยกเลิก",
    "recipe.save_btn":      "บันทึกสูตรอาหาร",
    "recipe.update_btn":    "อัปเดตสูตรอาหาร",
    "recipe.image_loaded":  "โหลดรูปภาพปัจจุบันแล้ว",
    "recipe.item_ph":       "เพิ่มรายการ…",
    "recipe.saving":        "กำลังบันทึก…",
    "recipe.saved":         "บันทึกสูตรอาหารสำเร็จ! กำลังเปลี่ยนหน้า…",
    "recipe.err_fields":    "กรุณากรอกข้อมูลที่จำเป็นให้ครบ",
    "recipe.err_ingr":      "กรุณาเพิ่มส่วนผสมอย่างน้อยหนึ่งรายการ",
    "recipe.err_steps":     "กรุณาเพิ่มขั้นตอนอย่างน้อยหนึ่งขั้นตอน",
    "recipe.upload_fail":   "อัปโหลดไม่สำเร็จ: {error}",
    "recipe.upload_ok":     "✓ อัปโหลดรูปภาพสำเร็จ!",
    "recipe.load_fail":     "โหลดสูตรอาหารไม่สำเร็จ: {error}",
  },
};

export const i18n = {
  getLang() {
    return localStorage.getItem("lang") || "th";
  },

  setLang(lang) {
    localStorage.setItem("lang", lang);
    this.applyToDOM();
    document.dispatchEvent(new CustomEvent("i18n:langchange", { detail: { lang } }));
  },

  /** Get translated string with optional {placeholder} substitution. */
  t(key, vars = {}) {
    const lang = this.getLang();
    const dict = TRANSLATIONS[lang] || TRANSLATIONS["th"];
    let str = dict[key] ?? TRANSLATIONS["en"][key] ?? key;
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{${k}}`, v);
    }
    return str;
  },

  /** Apply all translations to the current DOM. */
  applyToDOM() {
    // Text content
    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });

    // Placeholder attribute (simple keys)
    document.querySelectorAll("[data-i18n-placeholder]:not([data-i18n-n])").forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPlaceholder);
    });

    // Placeholder attribute with variable substitution (e.g. step number)
    document.querySelectorAll("[data-i18n-placeholder][data-i18n-n]").forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPlaceholder, { n: el.dataset.i18nN });
    });

    // Update lang toggle button active states
    document.querySelectorAll(".lang-toggle-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === this.getLang());
    });

    // Update <html lang="..."> for screen readers
    document.documentElement.lang = this.getLang();
  },

  init() {
    this.applyToDOM();
  },
};
