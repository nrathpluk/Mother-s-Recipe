# Mother's Recipe — Progress Tracker

> ไฟล์นี้ใช้ติดตามว่าทำอะไรไปแล้วบ้าง และมีอะไรในโปรเจกต์นี้
> **อัปเดตทุกครั้งที่มีการเพิ่ม feature หรือแก้ไขสำคัญ**

---

## สถานะปัจจุบัน

| Service | Platform | สถานะ |
|---------|----------|-------|
| Backend API | Render | ✅ Live |
| Database | Neon (PostgreSQL) | ✅ Live |
| Image Storage | Cloudinary | ✅ Live |
| Frontend | Cloudflare Pages | ✅ Live |

- **Backend URL:** `https://mother-s-recipe.onrender.com/api`
- **Repository:** GitHub (nrathpluk/Mother-s-Recipe)

---

## Tech Stack

| Layer | เทคโนโลยี |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6) |
| Backend | Django 4.2, Django REST Framework |
| Database | PostgreSQL (Neon) |
| Auth | Simple JWT + Google OAuth2 |
| Images | Cloudinary |
| Server | Gunicorn on Render |
| Frontend Host | Cloudflare Pages |

---

## สิ่งที่มีในโปรเจกต์แล้ว

### Backend (Django + DRF)

#### Models (Database)
- [x] **Recipe** — title, description, ingredients (JSON), steps (JSON), cooking_time, difficulty, image_url, created_by, created_at
- [x] **Review** — recipe, user, rating (1–5), comment, created_at | unique: [recipe, user]
- [x] **Favorite** — user, recipe | unique: [user, recipe]
- [x] **User** — Django built-in User model

#### API Endpoints
- [x] `POST /api/auth/register/` — สมัครสมาชิก
- [x] `POST /api/auth/login/` — เข้าสู่ระบบ (username + password)
- [x] `POST /api/auth/google/` — เข้าสู่ระบบด้วย Google OAuth2
- [x] `POST /api/auth/refresh/` — refresh JWT token
- [x] `GET  /api/recipes/` — ดูรายการสูตรอาหารทั้งหมด (paginated, search)
- [x] `POST /api/recipes/` — เพิ่มสูตรอาหาร (ต้อง login)
- [x] `GET  /api/recipes/{id}/` — ดูรายละเอียดสูตรอาหาร
- [x] `PUT  /api/recipes/{id}/` — แก้ไขสูตร (เจ้าของเท่านั้น)
- [x] `DELETE /api/recipes/{id}/` — ลบสูตร (เจ้าของเท่านั้น)
- [x] `GET  /api/reviews/?recipe={id}` — ดู review ของสูตรนั้น
- [x] `POST /api/reviews/` — เขียน review (ต้อง login)
- [x] `GET  /api/favorites/` — ดู favorites ของตัวเอง
- [x] `POST /api/favorites/` — toggle favorite

#### Features อื่น ๆ
- [x] JWT auth (access 7 วัน, refresh 30 วัน)
- [x] IsOwnerOrReadOnly permission (แก้ไข/ลบได้เฉพาะเจ้าของ)
- [x] Search สูตรอาหาร (ชื่อ, คำอธิบาย, ส่วนผสม)
- [x] Pagination (10 รายการต่อหน้า)
- [x] CORS config
- [x] WhiteNoise static files
- [x] average_rating() คำนวณคะแนนเฉลี่ยจาก reviews

### Frontend (HTML/CSS/JS)

#### หน้าเพจ
- [x] **index.html** — หน้าแรก แสดง recipe grid + search + pagination
- [x] **login.html** — หน้า login (username/password + Google button)
- [x] **register.html** — หน้าสมัครสมาชิก
- [x] **add-recipe.html** — ฟอร์มเพิ่ม/แก้ไขสูตรอาหาร + Cloudinary upload
- [x] **recipe-detail.html** — หน้ารายละเอียดสูตร + reviews + favorite

#### JavaScript
- [x] **api.js** — API client (fetch wrapper, JWT header, auto-redirect 401)
- [x] **auth.js** — ฟอร์ม login/register
- [x] **main.js** — initNav, renderStars, difficultyBadge, escapeHtml, showMessage

#### UI/UX
- [x] Responsive grid layout
- [x] Design tokens: cream, terracotta, sage, ink
- [x] Fonts: Playfair Display + Lora
- [x] Dynamic nav bar (แสดงปุ่มต่างกันตาม login state)
- [x] Star rating display (★½☆)
- [x] Difficulty badges (color-coded)
- [x] Edit/Delete buttons (เห็นเฉพาะเจ้าของ)
- [x] Favorite button toggle ♡ / ♥
- [x] XSS protection (escapeHtml)
- [x] Language toggle TH/EN ใน navbar (pill button, smooth fade)
- [x] i18n system — `frontend/js/i18n.js` — ภาษาเก็บใน localStorage, default = ไทย

### Integrations
- [x] **Cloudinary** — upload widget, unsigned preset `mothers_recipe_preset`
- [x] **Google OAuth2** — Google Identity Services, verify ID token ฝั่ง backend
- [x] **Neon PostgreSQL** — DATABASE_URL via dj_database_url
- [x] **Render** — render.yaml config, Gunicorn 2 workers
- [x] **Cloudflare Pages** — static frontend hosting

---

## สิ่งที่ยังต้องทำ / TODO

- [ ] ตั้งค่า Google Client ID ใน Google Cloud Console (Authorized Origins)
- [ ] เพิ่ม profile page (ดูสูตรของตัวเอง, แก้ไขข้อมูลส่วนตัว)
- [ ] เพิ่ม category/tag สำหรับสูตรอาหาร
- [ ] เพิ่ม filter ตาม difficulty หรือ cooking time
- [ ] Email verification ตอนสมัครสมาชิก
- [ ] Password reset flow

---

## Log การเปลี่ยนแปลง

| วันที่ | สิ่งที่ทำ |
|--------|----------|
| 2026-04-12 | สร้างโปรเจกต์ทั้งหมดตั้งแต่ต้น — Django backend, frontend pages, deploy ขึ้น Render + Cloudflare |
| 2026-04-12 | เพิ่ม Google OAuth2 login (Google Identity Services + backend token verify) |
| 2026-04-13 | อัปเดต DEPLOYMENT.md ให้แสดง status table + คำแนะนำ Google Cloud Console |
| 2026-04-13 | สร้างไฟล์ PROGRESS.md ติดตามความคืบหน้าโปรเจกต์ |
| 2026-04-13 | เพิ่ม Thai/English language toggle — i18n.js + data-i18n attrs ใน index, login, add-recipe; toggle pill ใน navbar |
| 2026-04-14 | แก้ 3 console errors ใน login.html: (1) handleGoogleLogin ย้ายไป plain script ก่อน GSI โหลด, (2) import isLoggedIn จาก api.js แทน main.js, (3) เพิ่ม COOP meta tag |
