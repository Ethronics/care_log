# How to set up intelligent care log summaries (step by step)

This guide gets the **free Google Gemini** summarization working so carers see smart summaries when they tick “Summarize on save”.

---

## Step 1: Get a free Gemini API key

1. Open a browser and go to: **https://ai.google.dev/**
2. Click **“Get started”** or **“Get API key”** (or go to https://aistudio.google.com/app/apikey).
3. Sign in with your Google account.
4. Click **“Create API key”** (you can pick an existing Google Cloud project or create one).
5. Copy the key (it looks like `AIzaSy...`). Keep it private; don’t commit it to git.

---

## Step 2: Configure the backend

1. Open the **backend** folder of the project (same folder as `app/` and `requirements.txt`).
2. Create or edit the file named **`.env`** in that folder (e.g. `care_log/backend/.env`).
3. Add or update this line (use your real key from Step 1):

   ```env
   GEMINI_API_KEY=AIzaSy...your-actual-key-here
   ```

4. If you already have other variables in `.env` (e.g. `DATABASE_URL`, `SECRET_KEY`), keep them and just add or change the `GEMINI_API_KEY` line.
5. Save the file.

**Note:** If you still have `OPENAI_API_KEY=...` in that file from before, you can remove it or leave it; the app now uses only `GEMINI_API_KEY`.

---

## Step 3: Install backend dependencies

1. Open a terminal.
2. Go to the **backend** directory:

   ```bash
   cd path/to/care_log/backend
   ```

   (Replace `path/to/care_log` with your actual project path.)

3. Activate the Python virtual environment if you use one:

   - **Windows:** `venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`

4. Install (or reinstall) dependencies so the Gemini library is present:

   ```bash
   pip install -r requirements.txt
   ```

5. You should see `google-generativeai` installed. If you get errors, fix them before continuing.

---

## Step 4: Configure the frontend to use the backend

1. Open the **frontend** folder (where `package.json` and `src/` live).
2. Create or edit **`.env`** in the **frontend** folder (e.g. `care_log/frontend/.env`).
3. Set the backend URL:

   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

   Use a different URL only if your backend runs elsewhere (e.g. `http://127.0.0.1:8000`).

4. Save the file.
5. **Restart the frontend dev server** if it’s already running (env vars are read at start).

---

## Step 5: Start the backend server

1. In a terminal, go to the **backend** directory and activate the venv if needed (see Step 3).
2. Start the API:

   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

   Or, if your project uses it:

   ```bash
   python run.py
   ```

3. Leave this terminal open. You should see something like “Uvicorn running on http://127.0.0.1:8000”.
4. Optional check: open **http://localhost:8000/health** in the browser; you should get `{"status":"healthy"}`.

---

## Step 6: Start the frontend

1. Open a **second** terminal.
2. Go to the **frontend** directory:

   ```bash
   cd path/to/care_log/frontend
   ```

3. Install npm dependencies if you haven’t yet:

   ```bash
   npm install
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. Leave this terminal open. The app usually runs at **http://localhost:3000**.

---

## Step 7: Test intelligent summarization

1. In the browser, go to **http://localhost:3000** (or the URL shown by `npm run dev`).
2. Log in if the app requires it.
3. Open a **service user** (e.g. from “Service users” or “Care logs” → pick a person).
4. Click **“Take a log”** (or “Add log”) to open the care log form.
5. In **Notes**, type or use **Voice input** to add a few sentences (e.g. “Gave morning medication. Had breakfast and tea. Was in good spirits and went for a short walk.”).
6. Tick the box: **“Summarize on save (keeps full text as raw)”**.
7. Click **“Save log”** (or “Add log”).
8. You should briefly see **“Summarizing…”**; then the log is saved.
9. In the timeline you should see:
   - A **short summary** as the main text (from Gemini).
   - A **“Show raw”** link; clicking it shows the full text you entered.

If that works, intelligent summarization is set up correctly.

---

## Troubleshooting

- **“Summarizing…” then error or simple extract only**  
  - Check that `GEMINI_API_KEY` is set correctly in **backend** `.env` and that you restarted the backend after changing it.  
  - Check the backend terminal for Python errors (e.g. missing `google-generativeai` or invalid key).

- **Frontend doesn’t call the backend**  
  - Confirm `VITE_API_BASE_URL=http://localhost:8000` in **frontend** `.env` and that you **restarted the frontend** dev server.

- **Backend not reachable**  
  - Ensure the backend is running on port 8000 and nothing else is blocking it (firewall, wrong port).

- **CORS errors in the browser**  
  - The backend is already set to allow `http://localhost:3000`. If you use another origin, add it to the backend CORS settings.

- **Gemini rate limits**  
  - The free tier has limits. If you hit them, you’ll get errors; the app will fall back to the simple summary. Wait a bit or check https://ai.google.dev/ for limits.

---

## Summary checklist

- [ ] Gemini API key obtained from https://ai.google.dev/ (or https://aistudio.google.com/app/apikey).
- [ ] `GEMINI_API_KEY=...` in **backend** `.env`.
- [ ] `pip install -r requirements.txt` in the backend (includes `google-generativeai`).
- [ ] `VITE_API_BASE_URL=http://localhost:8000` in **frontend** `.env`.
- [ ] Backend running (e.g. `uvicorn app.main:app --reload --port 8000`).
- [ ] Frontend running (e.g. `npm run dev` in frontend folder).
- [ ] Tested by adding a log with “Summarize on save” and checking summary + “Show raw”.
