# Deployment Guide — Mother's Recipe

Complete step-by-step guide to deploy:
- **Backend** → Render (free tier)
- **Database** → Neon (free PostgreSQL)
- **Images** → Cloudinary (free tier)
- **Frontend** → Cloudflare Pages (free tier)

---

## Step 1 — Set Up Neon (Database)

1. Go to https://neon.tech and sign up for free.
2. Click **"New Project"** → give it a name like `mothers-recipe`.
3. Select region closest to your users (Singapore for Thailand).
4. After creation, click **"Connection string"** and copy the URL.
   It looks like: `postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
5. **Save this URL** — you'll paste it into Render later.

---

## Step 2 — Set Up Cloudinary (Image Storage)

1. Go to https://cloudinary.com and sign up for free.
2. From the Dashboard, note your:
   - **Cloud name** (e.g. `my-cloud`)
   - **API Key**
   - **API Secret**
3. Create an **unsigned upload preset**:
   - Go to **Settings → Upload → Upload presets**
   - Click **"Add upload preset"**
   - Set **Signing Mode** to **"Unsigned"**
   - Under **Folder**, type `mothers-recipe`
   - **Save** and copy the preset name (e.g. `mothers_recipe_preset`)
4. Open `frontend/add-recipe.html` and replace:
   ```js
   const CLOUD_NAME    = "YOUR_CLOUD_NAME";       // ← your cloud name
   const UPLOAD_PRESET = "YOUR_UNSIGNED_PRESET";  // ← your preset name
   ```

---

## Step 3 — Deploy Backend to Render

1. Push your project to GitHub:
   ```bash
   cd "Mother's Recipe"
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/mothers-recipe.git
   git push -u origin main
   ```

2. Go to https://render.com → Sign in → **New → Web Service**

3. Connect your GitHub repository.

4. Configure the service:
   | Setting | Value |
   |---------|-------|
   | **Root Directory** | `backend` |
   | **Runtime** | Python 3 |
   | **Build Command** | `pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate` |
   | **Start Command** | `gunicorn core.wsgi:application --bind 0.0.0.0:$PORT --workers 2` |

5. Under **Environment Variables**, add:
   | Key | Value |
   |-----|-------|
   | `SECRET_KEY` | Click "Generate" | 1a8b8e1261aef62e4bbc3b3710ee00d5
   | `DEBUG` | `False` |
   | `DATABASE_URL` | Your Neon connection string |
   | `CLOUDINARY_CLOUD_NAME` | Your cloud name |
   | `CLOUDINARY_API_KEY` | Your API key |
   | `CLOUDINARY_API_SECRET` | Your API secret |
   | `ALLOWED_HOSTS` | `mothers-recipe-api.onrender.com` |
   | `CORS_ALLOWED_ORIGINS` | Leave blank for now (fill after Step 4) |

6. Click **Create Web Service**.
   - Wait ~3 minutes for the first deploy.
   - Note your backend URL: `https://mothers-recipe-api.onrender.com`

7. Test the API is live:
   ```
   https://mothers-recipe-api.onrender.com/api/recipes/
   ```
   You should see `{"count":0,"results":[]}`.

8. (Optional) Create a superuser via Render Shell:
   ```bash
   python manage.py createsuperuser
   ```

---

## Step 4 — Deploy Frontend to Cloudflare Pages

1. **Update the API URL** in `frontend/js/api.js`:
   ```js
   const BASE_URL = "https://mothers-recipe-api.onrender.com/api";
   ```

2. Push the change to GitHub.

3. Go to https://pages.cloudflare.com → **Create a project → Connect to Git**

4. Select your repository.

5. Configure:
   | Setting | Value |
   |---------|-------|
   | **Project name** | `mothers-recipe` |
   | **Production branch** | `main` |
   | **Framework preset** | None |
   | **Root directory** | `frontend` |
   | **Build command** | *(leave blank)* |
   | **Build output directory** | `/` |

6. Click **Save and Deploy**.
   - Your site will be live at: `https://mothers-recipe.pages.dev`

7. **Go back to Render** → your web service → Environment → update:
   ```
   CORS_ALLOWED_ORIGINS = https://mothers-recipe.pages.dev
   ```
   Then click **Save changes** (triggers a redeploy automatically).

---

## Step 5 — Test Everything

Work through this checklist:

- [ ] Visit `https://mothers-recipe.pages.dev` — recipe list loads
- [ ] Register a new account
- [ ] Log in with the new account
- [ ] Add a recipe (with photo upload via Cloudinary)
- [ ] View the recipe detail page
- [ ] Leave a review with star rating
- [ ] Favorite the recipe
- [ ] Log out → confirm you can still browse but not post

---

## Local Development

```bash
# 1. Set up Python environment
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 2. Create .env file
cp .env.example .env
# Edit .env and fill in your values
# For local DB you can use: DATABASE_URL=sqlite:///db.sqlite3

# 3. Run migrations and start server
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# 4. Serve the frontend (any static server works)
cd ../frontend
npx serve .      # or use VS Code Live Server extension
```

For local frontend development, temporarily change `api.js`:
```js
const BASE_URL = "http://127.0.0.1:8000/api";
```
And add `http://localhost:3000` (or your port) to `CORS_ALLOWED_ORIGINS` in `.env`.

---

## Common Issues

| Problem | Fix |
|---------|-----|
| `CORS` errors in browser | Check `CORS_ALLOWED_ORIGINS` matches your frontend URL exactly |
| `401 Unauthorized` | Token expired or missing — check localStorage in DevTools |
| Images not uploading | Check `CLOUD_NAME` and `UPLOAD_PRESET` in add-recipe.html |
| Render cold start slow | Free tier sleeps after 15 min — first request takes ~30s |
| `SSL required` DB error | Set `ssl_require=True` in settings.py (already done for `DEBUG=False`) |
