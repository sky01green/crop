# Deployment Guide: Vercel & Render

This guide explains how to host your **Frontend on Vercel** and your **Backend on Render**, while keeping your **Database on Supabase**.

---

## 🏗️ Phase 1: Preparation (GitHub)
Before you start, ensure your code is pushed to a **GitHub Repository**. 
Render and Vercel will automatically redeploy your app whenever you push changes to your `main` branch.

---

## 🐍 Phase 2: Host Backend on Render
Render is perfect for Flask applications.

### 1. Create a New Web Service
1.  Login to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** > **Web Service**.
3.  Connect your GitHub repository.

### 2. Configure Service Settings
-   **Name**: `crop-disease-backend`
-   **Runtime**: `Python 3`
-   **Build Command**: `pip install -r backend/requirements.txt`
-   **Start Command**: `gunicorn --bind 0.0.0.0:$PORT run:app`
-   *Note: If your backend is in a subfolder, you may need to set the `Root Directory` to `backend` in Render settings.*

### 3. Set Environment Variables
Go to the **Environment** tab on Render and add the Following:
-   `DATABASE_URL`: (Paste your Supabase URI)
-   `SECRET_KEY`: (A long random string)
-   `JWT_SECRET_KEY`: (Another random string)
-   `FLASK_ENV`: `production`

> [!WARNING]
> **Important Note on Images**: Render's free tier has "ephemeral storage." This means any photos uploaded to `backend/uploads` will be **deleted** when the server restarts. For a production app, consider using **Supabase Storage** to host your images permanently.

---

## ⚛️ Phase 3: Host Frontend on Vercel
Vercel is the best platform for React/Vite applications.

### 1. Import Project
1.  Login to [Vercel](https://vercel.com/).
2.  Click **Add New** > **Project**.
3.  Connect your GitHub repository.

### 2. Configure Build Settings
-   **Framework Preset**: `Vite`
-   **Root Directory**: `frontend`
-   **Build Command**: `npm run build`
-   **Output Directory**: `dist`

### 3. Set Environment Variables
Click on **Environment Variables** and add:
-   `VITE_API_URL`: `https://your-backend-url.onrender.com/api`
    *(Replace with the actual URL Render gives you for your backend).*

---

## 🔗 Phase 4: Final Connection (CORS)
After your backend is live on Render, you must allow your Vercel URL in your backend's CORS settings.

1.  Open `backend/app/__init__.py`.
2.  In the `create_app` function, we currently have:
    ```python
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    ```
3.  This `"*"` works for testing, but in production, you should eventually change it to your Vercel URL for better security:
    ```python
    CORS(app, resources={r"/api/*": {"origins": ["https://your-frontend.vercel.app"]}})
    ```

---

## 📝 Deployment Summary Flow
1. **Supabase** (Database is already live).
2. **Render** (Deploys Backend ➔ Gives you a URL).
3. **Vercel** (Deploys Frontend ➔ Link to Render URL).
4. **App Live!**
