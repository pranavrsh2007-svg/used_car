# AutoWorth AI - Deployment & Hosting Guide

This guide details how to deploy the Python FastAPI prediction backend to cloud platforms (such as Render) and connect it to your existing frontend.

---

## 1. Production Start Command & Dependencies

- **Production Start Command**:
  ```bash
  uvicorn ml.api:app --host 0.0.0.0 --port $PORT
  ```
- **Build Command**:
  ```bash
  pip install -r ml/requirements.txt
  ```
- **Health Check Path**: `/health` (Returns HTTP 200 with `model_loaded: true`)
- **Root Directory**: Project root (`/`) or `ml/` (configured in hosting dashboard).

---

## 2. Environment Variables Reference

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Yes (injected by host) | `8000` | Port on which FastAPI / Uvicorn listens. |
| `ALLOWED_ORIGINS` | Recommended | `http://localhost:3000,http://localhost:5173` | Comma-separated list of allowed frontend domains for CORS. |
| `MODEL_PATH` | Optional | `ml/models/best_model.joblib` | Absolute or relative path to the serialized ML pipeline artifact. |
| `METADATA_PATH` | Optional | `ml/models/model_metadata.json` | Path to model metadata and metrics JSON. |

---

## 3. Deploying to Render (Step-by-Step)

1. **Commit Project to GitHub**:
   Ensure `ml/models/best_model.joblib` (or your chosen model artifact storage) and `ml/requirements.txt` are included.
   ```bash
   git add ml/ Procfile render.yaml
   git commit -m "feat: add machine learning training pipeline and FastAPI backend"
   git push origin main
   ```

2. **Create Web Service on Render**:
   - Log into [dashboard.render.com](https://dashboard.render.com).
   - Click **New +** -> **Web Service**.
   - Connect your GitHub repository.
   - Configure the following settings:
     - **Name**: `autoworth-ai-api`
     - **Environment**: `Python 3`
     - **Region**: Closest to your users (e.g., Singapore / Frankfurt / Oregon)
     - **Branch**: `main`
     - **Build Command**: `pip install -r ml/requirements.txt`
     - **Start Command**: `uvicorn ml.api:app --host 0.0.0.0 --port $PORT`
     - **Plan**: Free (or Starter for zero cold-start)

3. **Configure Environment Variables**:
   Under the **Environment** tab, set:
   - `ALLOWED_ORIGINS`: `https://your-frontend-domain.vercel.app,http://localhost:3000`

4. **Verify Health Endpoint**:
   Once deployment completes, visit:
   ```
   https://<your-render-service-name>.onrender.com/health
   ```
   Expected response:
   ```json
   {
     "status": "healthy",
     "model_loaded": true,
     "model_name": "XGBoost Regressor",
     "model_version": "1.0",
     "uptime_seconds": 15.2
   }
   ```

> [!NOTE]
> **Free Tier Cold-Start Delay**: Free instances on Render spin down after 15 minutes of inactivity. The first incoming request after idle sleep may take ~30–50 seconds to warm up. The frontend client includes timeout and status messaging.

---

## 4. Connecting the Frontend to the Deployed API

1. In your frontend hosting platform (e.g., Vercel, Netlify, or Cloud Run):
   Set the environment variable:
   ```
   VITE_API_BASE_URL=https://<your-render-service-name>.onrender.com
   ```
2. For local testing pointing to the remote backend:
   Edit `.env`:
   ```env
   VITE_API_BASE_URL="https://<your-render-service-name>.onrender.com"
   ```
3. Re-build the frontend:
   ```bash
   npm run build
   ```

---

## 5. Local API Development Run Command

To run both services side-by-side locally:

- **Terminal 1 (Python Backend)**:
  ```bash
  python ml/api.py
  # Serving on http://localhost:8000
  ```

- **Terminal 2 (React Frontend)**:
  ```bash
  npm run dev
  # Serving on http://localhost:3000
  ```
