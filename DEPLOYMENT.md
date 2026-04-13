# Deployment Guide — Mother's Recipe

   | Service | Platform | Status |
|---------|----------|--------|
| Backend API | Render | ✅ Live |
| Database | Neon (PostgreSQL) | ✅ Live |
| Images | Cloudinary | ✅ Live |
| Frontend | Cloudflare Pages | ✅ Live |

---

## ต้องทำต่อ — Google Login Setup

ระบบ Google Login ถูก implement เรียบร้อยแล้ว แต่ยังต้องตั้งค่าบน Google Cloud Console
และใส่ Client ID ก่อนจะใช้งานได้จริง

### 1. สร้าง Google OAuth2 Client ID

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com)
2. สร้าง Project ใหม่ หรือเลือก Project ที่มีอยู่
3. เปิด **APIs & Services → OAuth consent screen**
   - User Type: **External**
   - กรอก App name (`Mother's Recipe`), User support email, Developer email
   - Scopes: เพิ่ม `email` และ `profile`
   - Save
4. ไปที่ **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: `mothers-recipe-web`
   - **Authorized JavaScript origins** — เพิ่ม:
     ```
     https://mothers-recipe.pages.dev
     http://localhost:3000
     http://127.0.0.1:5500
     ```
     *(ใส่ Cloudflare Pages URL จริงด้วย ถ้าต่างจากนี้)*
5. คลิก **Create** → คัดลอก **Client ID**
   รูปแบบ: `123456789-xxxxxxxxxxxx.apps.googleusercontent.com`

---

### 2. ใส่ Client ID ใน Render

ไปที่ Render → Web Service → **Environment** → เพิ่ม:

| Key | Value |
|-----|-------|
| `GOOGLE_CLIENT_ID` | `123456789-xxxxxxxxxxxx.apps.googleusercontent.com` |

คลิก **Save Changes** — Render จะ redeploy อัตโนมัติ

---

### 3. ใส่ Client ID ใน Frontend

เปิดไฟล์ `frontend/login.html` แล้วแก้บรรทัด 62:

```html
<!-- ก่อน -->
data-client_id="YOUR_GOOGLE_CLIENT_ID"

<!-- หลัง -->
data-client_id="123456789-xxxxxxxxxxxx.apps.googleusercontent.com"
```

จากนั้น commit และ push — Cloudflare Pages จะ deploy ให้อัตโนมัติ

```bash
git add frontend/login.html
git commit -m "config: add Google Client ID to login page"
git push
```

---

### 4. ทดสอบ Google Login

- [ ] เปิด `https://mothers-recipe.pages.dev/login.html`
- [ ] กดปุ่ม **Sign in with Google**
- [ ] เลือก Google account
- [ ] ควร redirect กลับหน้า Home และ login สำเร็จ
- [ ] ตรวจสอบ `localStorage` ใน DevTools — ต้องมี `access_token`, `user`
- [ ] ทดสอบ login ครั้งที่ 2 ด้วย account เดิม — ต้องไม่สร้าง user ซ้ำ

---

## Local Development

```bash
# 1. เปิด backend
cd backend
venv/Scripts/activate        # Windows
pip install -r requirements.txt
python manage.py runserver

# 2. เปิด frontend
cd ../frontend
npx serve .                  # หรือใช้ VS Code Live Server
```

`.env` ที่ใช้ local (ไม่ต้องการ DATABASE_URL — ใช้ SQLite):
```
DEBUG=True
SECRET_KEY=local-dev-secret-key-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:5500
GOOGLE_CLIENT_ID=          ← ใส่ Client ID ที่ได้จาก Google Cloud Console
```

---

## Common Issues

| ปัญหา | วิธีแก้ |
|-------|---------|
| ปุ่ม Google ไม่ขึ้น | ตรวจสอบว่า `data-client_id` ไม่ใช่ `YOUR_GOOGLE_CLIENT_ID` |
| Google login error: "idpiframe_initialization_failed" | URL ไม่อยู่ใน Authorized JavaScript origins ของ Google Cloud |
| Google login ผ่านแต่ backend คืน 401 | `GOOGLE_CLIENT_ID` ใน Render ยังไม่ได้ตั้งค่า |
| CORS errors | ตรวจสอบ `CORS_ALLOWED_ORIGINS` ใน Render ตรงกับ Cloudflare Pages URL |
| 401 Unauthorized | Token หมดอายุ — เช็ค localStorage ใน DevTools |
| รูปภาพ upload ไม่ได้ | เช็ค `CLOUD_NAME` และ `UPLOAD_PRESET` ใน add-recipe.html |
| Render ช้าตอนเปิดครั้งแรก | Free tier หลับหลัง 15 นาที — request แรกใช้เวลา ~30 วินาที |
