# ignyte 2026 — Complete Setup Guide

## Folder Structure
```
ignyte2026/
├── frontend/               ← Next.js app (run this to see the website)
│   ├── app/
│   │   ├── page.tsx        ← Main landing page
│   │   ├── layout.tsx      ← Root layout
│   │   ├── admin/
│   │   │   └── page.tsx    ← Admin dashboard
│   │   └── submit/
│   │       └── page.tsx    ← Student project submission
│   ├── components/
│   │   ├── sections/       ← Hero, About, Rules, Benefits, Prizes, etc.
│   │   └── ui/             ← Navbar, Footer
│   ├── lib/
│   │   └── supabase.ts     ← All database operations
│   ├── styles/
│   │   └── globals.css
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── .env.example        ← Copy to .env.local and fill values
│
├── backend/                ← Python FastAPI (optional — for emails & QR)
│   ├── main.py
│   ├── api/
│   │   ├── register.py
│   │   ├── admin.py
│   │   └── qr.py
│   ├── utils/
│   │   ├── supabase_client.py
│   │   └── qr_generator.py
│   ├── emails/
│   │   └── service.py
│   ├── requirements.txt
│   └── .env.example        ← Copy to .env and fill values
│
└── docs/
    ├── schema.sql          ← Run this in Supabase SQL Editor
    └── SETUP.md            ← This file
```

---

## STEP 1 — Supabase Setup (Database)

1. Go to https://supabase.com → Sign up → New Project
2. Name: `ignyte2026` | Region: South Asia (Mumbai) | Set a password
3. Wait ~2 minutes for project to be ready

### Get your keys:
1. Click **Settings** (gear icon) → **API**
2. Copy and save:
   - **Project URL** → `https://xxxxxx.supabase.co`
   - **anon public key** → long string starting with `eyJ...`
   - **service_role key** → another long string (keep SECRET, for backend only)

### Run the database schema:
1. Click **SQL Editor** in left sidebar
2. Click **New query**
3. Open `docs/schema.sql` → Select All → Copy → Paste into SQL Editor
4. Click **Run**
5. You should see: `Success`

### Create Storage Buckets:
1. Click **Storage** in left sidebar
2. Click **New bucket** → Name: `payment-screenshots` → Public: OFF → Create
3. Click **New bucket** → Name: `qr-codes` → Public: ON → Create
4. Click **New bucket** → Name: `project-files` → Public: ON → Create

---

## STEP 2 — Frontend Setup

### Requirements:
- Node.js v18 or higher (download from https://nodejs.org — use LTS version)

### Install & Run:
```bash
# Navigate to frontend folder
cd ignyte2026/frontend

# Create your .env.local file
# Copy .env.example to .env.local and fill in your values:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your anon key...
NEXT_PUBLIC_ADMIN_PASSWORD=ignyte2026admin
NEXT_PUBLIC_UPI_ID=ignyte2026@upi
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Install packages
npm install

# Run the app
npx next dev
```

Open **http://localhost:3000** → Your ignyte website is live!

---

## STEP 3 — Backend Setup (Optional — for emails)

### Requirements:
- Python 3.12+ (download from https://python.org — tick "Add to PATH")

### Install & Run:
```bash
# Navigate to backend folder
cd ignyte2026/backend

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Create .env file from example and fill in values
# SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, etc.

# Install packages
pip install -r requirements.txt

# Run the backend
uvicorn main:app --reload --port 8000
```

API docs available at: **http://localhost:8000/docs**

---

## Pages & URLs

| Page | URL | Description |
|------|-----|-------------|
| Landing Page | http://localhost:3000 | Main ignyte website |
| Admin Dashboard | http://localhost:3000/admin | Manage registrations |
| Submit Project | http://localhost:3000/submit | Students submit hackathon project |
| API Docs | http://localhost:8000/docs | Backend API (if running) |

---

## Admin Dashboard

**URL:** http://localhost:3000/admin
**Password:** `ignyte2026admin` (set in NEXT_PUBLIC_ADMIN_PASSWORD)

### Features:
- **Overview** — Stats cards + pending approvals list + project submissions
- **Registrations** — Full table with search, filter, approve/reject buttons
- **QR Scanner** — Enter participant ID to check them in at the event
- **Analytics** — School-wise breakdown with bar charts

### Approve/Reject Flow:
1. Student registers → appears in **Pending** list
2. Admin clicks **✓ Approve** → status changes to `approved`
3. If backend is running: QR code generated + email sent automatically
4. Admin clicks **✕ Reject** → prompted for reason → status changes to `rejected`

---

## Project Submission (Students)

**URL:** http://localhost:3000/submit

### How it works:
1. Student goes to `/submit`
2. Enters their Participant ID (e.g. `BF26-0001`)
3. System verifies they are approved
4. Student fills: Project Title, Description, GitHub URL, uploads project file
5. Submission saved to database
6. Admin sees it in dashboard under Overview → Project Submissions

---

## Admin Login Credentials (from schema.sql)

| Email | Password | Role |
|-------|----------|------|
| admin@ignyte2026.com | ignyte@2026 | superadmin |
| manager@ignyte2026.com | Manager@2026 | admin |
| volunteer@ignyte2026.com | Volunteer@2026 | admin |

These are stored in the `admin_users` table in Supabase.
The frontend admin dashboard uses `NEXT_PUBLIC_ADMIN_PASSWORD` env variable.

---

## Common Errors & Fixes

**"supabaseUrl is required"**
→ Your `.env.local` file is missing or not filled. Make sure it's in the `frontend/` folder.

**"npm run dev — dev is missing"**
→ You're in the wrong folder. Run: `cd frontend` first.

**"'next' is not recognized"**
→ Run: `npm install` then `npx next dev`

**Registration not saving to Supabase**
→ Check your Supabase URL and anon key in `.env.local`
→ Make sure you ran `schema.sql` in Supabase SQL Editor

**Approve/Reject not working**
→ Check browser console for errors
→ Make sure RLS policies were created (run schema.sql again)
→ Verify your Supabase anon key has UPDATE permission

**Payment screenshot upload failing**
→ Make sure `payment-screenshots` bucket exists in Supabase Storage
→ Bucket must have upload policy enabled

---

## Delete Sample Data Before Real Event

Run this in Supabase SQL Editor:
```sql
DELETE FROM registrations WHERE email LIKE '%sample.com%';
```

---

## Deployment

### Frontend → Vercel (Free):
1. Push `frontend/` folder to GitHub
2. Go to https://vercel.com → Import project
3. Add environment variables in Vercel dashboard
4. Deploy — done!

### Backend → Railway (Free tier):
1. Push `backend/` folder to GitHub
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Add environment variables
4. Railway auto-detects Python and deploys
