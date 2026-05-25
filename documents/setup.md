# VedaAI — Setup & Deployment Guide

This guide details how to configure environment variables, set up local database networks, and deploy VedaAI to production cloud servers.

---

## 💻 1. Local Setup

### Step 1: Install Dependencies
Run the install command in both directories:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Backend Environment Variables
Create a file at `backend/.env` containing:
```ini
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
FRONTEND_URL=http://localhost:5173
JWT_SECRET=yoursecretjwtkeyhere

# Database URI (MongoDB Atlas)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/vedaai?retryWrites=true&w=majority

# AI API Keys
GROQ_API_KEY=gsk_your_groq_api_key
GEMINI_API_KEY=AIzaSy_your_gemini_api_key
```

### Step 3: Configure Frontend Environment Variables
Create a file at `frontend/.env` containing:
```ini
# Points to local Fastify server
VITE_BACKEND_URL=http://localhost:3001/api

VITE_SUPABASE_URL=https://jdoqtntvnmipltufcdvv.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable__SyARu70pGmCBjcD_dGhWQ_I-0i0lds
```

### Step 4: Run Servers
Open two terminal windows to run both servers concurrently:
```bash
# In the backend directory
npm run dev

# In the frontend directory
npm run dev
```
The application will be running locally on `http://localhost:5173`.

---

## 🔌 2. MongoDB Atlas Whitelist Configuration

To allow external cloud environments (like Render and Vercel) to talk to your MongoDB cluster:
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. On the left-hand sidebar, navigate to **Security** -> **Network Access**.
3. Click the green **Add IP Address** button.
4. Set the IP Access List Entry to:
   ```text
   0.0.0.0/0
   ```
5. Ensure the switch **"This entry is temporary"** is toggled **OFF** (to prevent connection dropping after 6 hours).
6. Click **Confirm**. Wait 30 seconds for the status to change to **Active**.

---

## 🚀 3. Cloud Production Deployment

### A. Deploy Backend to Render.com
1. Create a **New Web Service** pointing to your GitHub repository.
2. Configure settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
3. Add the following **Environment Variables** in Render dashboard:
   - `MONGO_URI`: Your production MongoDB URI.
   - `JWT_SECRET`: A secure random secret string.
   - `GROQ_API_KEY`: Your active Groq API key.
   - `GEMINI_API_KEY`: Your active Gemini API key.
   - `NODE_ENV`: `production` *(Critical: tells the logger to disable dev pretty-printing).*
   - `LOG_LEVEL`: `info`

### B. Deploy Frontend to Vercel
1. Go to Vercel and create a new project pointing to your GitHub repository.
2. In the configuration:
   - **Framework Preset**: `Vite` (automatic)
   - **Root Directory**: `frontend` *(Critical: compile from the frontend directory).*
3. Add **Environment Variables**:
   - `VITE_BACKEND_URL`: `[YOUR_RENDER_BACKEND_URL]/api` *(e.g. `https://veda-backend.onrender.com/api`)*
   - `VITE_SUPABASE_URL`: `https://jdoqtntvnmipltufcdvv.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `sb_publishable__SyARu70pGmCBjcD_dGhWQ_I-0i0lds`
4. Click **Deploy**.
