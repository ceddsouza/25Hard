# 25Hard Challenge App - Setup Guide

This guide will walk you through setting up and deploying the 25Hard challenge app step-by-step.

## Table of Contents
1. [Environment Variables Explained](#environment-variables)
2. [Prerequisites](#prerequisites)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Database Setup](#database-setup)
6. [Email Setup (SendGrid)](#email-setup)
7. [Photo Storage Setup (Firebase)](#photo-storage-setup)
8. [Running Locally](#running-locally)
9. [Deployment to Production](#deployment-to-production)

---

## Environment Variables

**Environment variables** are settings that your app reads to connect to external services. They contain sensitive information like passwords and API keys that should NOT be shared publicly.

Think of them like a configuration file that tells your app:
- "Connect to this database"
- "Use this email service"
- "Use this password for login"

They live in a `.env` file (which is never committed to GitHub).

### Why not hardcode them?
- **Security**: If you hardcode passwords in code and push to GitHub, they're exposed publicly
- **Flexibility**: You can use different settings for local development vs production without changing code

### How they work:
1. You create a `.env` file with key=value pairs
2. The app reads the `.env` file and uses those values
3. If you deploy to hosting, you set the values there instead of a file

---

## Prerequisites

Before starting, ensure you have:
- **Node.js** installed (v18+)
- A **GitHub account**
- A code editor (VS Code recommended)
- **PostgreSQL** installed locally or a hosted database (Railway/Supabase)
- **SendGrid account** (for emails)
- **Firebase account** (for photo storage)

Install Node.js from: https://nodejs.org/

---

## Backend Setup

### Step 1: Navigate to backend folder
```bash
cd 25Hard/backend
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Create `.env` file

In the `backend` folder, create a new file called `.env` (not `.env.example`):

**Copy this template and fill in your values:**

```
DB_USER=postgres
DB_PASSWORD=YOUR_DATABASE_PASSWORD
DB_HOST=localhost
DB_PORT=5432
DB_NAME=25hard
JWT_SECRET=super_secret_random_string_change_this_1234567890
CHALLENGE_PASSWORD=your_secure_password_here
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@25hard.com
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=xxxxxxxxxxxxxxxxxxxxx
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase...
PORT=5000
NODE_ENV=development
```

**Where to get each value:**

| Variable | Where to find | Example |
|----------|--------------|---------|
| `DB_PASSWORD` | PostgreSQL password you set during install | `MyPassword123` |
| `JWT_SECRET` | Make up a random string | `super_secret_xyz123_abcd_efgh` |
| `CHALLENGE_PASSWORD` | Decide a password for login (ask Cedric/Nader/Rahil) | `Challenge2026!` |
| `SENDGRID_API_KEY` | [SendGrid Dashboard](https://app.sendgrid.com/settings/api_keys) | Starts with `SG.` |
| `SENDGRID_FROM_EMAIL` | Your email or noreply address | `noreply@25hard.com` |
| `FIREBASE_*` | [Firebase Console](https://console.firebase.google.com) > Project Settings > Service Account | See section below |

### Step 4: Initialize database

Run the SQL schema to create tables:

```bash
psql -U postgres -d 25hard -f schema.sql
```

Or if you're using a hosted database (Railway/Supabase), run `schema.sql` in their SQL editor.

---

## Frontend Setup

### Step 1: Navigate to frontend folder
```bash
cd 25Hard/frontend
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Create `.env` file

In the `frontend` folder, create a `.env` file:

```
VITE_API_URL=http://localhost:5000
```

For production (after deployment), change this to your backend URL:
```
VITE_API_URL=https://your-backend-url.railway.app
```

---

## Database Setup

### Option A: Local PostgreSQL

1. Install PostgreSQL: https://www.postgresql.org/download/
2. Create a database:
   ```bash
   createdb 25hard
   ```
3. Run the schema:
   ```bash
   psql -U postgres -d 25hard -f backend/schema.sql
   ```

### Option B: Hosted Database (Railway/Supabase)

**Railway.app** (easiest):
1. Go to https://railway.app
2. Create account (or sign in with GitHub)
3. Create new project → Add PostgreSQL
4. Copy the database URL
5. Paste into your backend `.env` file variables

**Or Supabase.com**:
1. Go to https://supabase.com
2. Create new project
3. Go to Project Settings → Database
4. Copy connection string
5. Use in `.env` file

---

## Email Setup (SendGrid)

SendGrid sends the daily reminder emails (6 AM & 6 PM).

### Step 1: Create SendGrid Account
1. Go to https://sendgrid.com
2. Sign up (free tier covers us)
3. Verify your email

### Step 2: Get API Key
1. Go to Settings → [API Keys](https://app.sendgrid.com/settings/api_keys)
2. Click "Create API Key"
3. Name it "25Hard"
4. Copy the full key (starts with `SG.`)
5. **Paste into backend `.env` as `SENDGRID_API_KEY`**

### Step 3: Verify Sender Email
1. Go to Settings → [Sender Authentication](https://app.sendgrid.com/settings/sender_auth)
2. Add your domain OR verify single sender
3. Use this email in `.env` as `SENDGRID_FROM_EMAIL`

**Test it:**
After deploying, the app will send emails at 6 AM and 6 PM daily. You'll see logs in your hosting dashboard.

---

## Photo Storage Setup (Firebase)

Firebase stores the daily check-in photos securely.

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Create Project"
3. Name: `25Hard`
4. Disable Google Analytics (optional)
5. Create

### Step 2: Enable Cloud Storage
1. In Firebase Console, go to Build → Storage
2. Click "Get Started"
3. Start in production mode
4. Choose a location (US multi-region is fine)
5. Create

### Step 3: Set Storage Rules

In the Storage rules editor, paste this:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{userId}/{allPaths=**} {
      allow read, write: if request.auth != null || true;
    }
  }
}
```

Click "Publish".

### Step 4: Get Service Account Key

1. Go to Project Settings (⚙️ gear icon)
2. Click "Service Accounts" tab
3. Click "Generate New Private Key"
4. A JSON file downloads

**Now copy these values from the JSON file into your `.env`:**

From JSON:
```json
{
  "type": "service_account",
  "project_id": "25hard-xxxxx",           → FIREBASE_PROJECT_ID
  "private_key_id": "abc123def456...",    → FIREBASE_PRIVATE_KEY_ID
  "private_key": "-----BEGIN PRIVATE...", → FIREBASE_PRIVATE_KEY
  "client_email": "firebase-adminsdk...", → FIREBASE_CLIENT_EMAIL
  "client_id": "123456789",               → FIREBASE_CLIENT_ID
  ...
}
```

---

## Running Locally

Now let's test everything locally.

### Terminal 1: Start Database
```bash
# If using local PostgreSQL
postgres -D /usr/local/var/postgres
```

### Terminal 2: Start Backend
```bash
cd 25Hard/backend
npm run dev
```

You should see:
```
Server running on port 5000
Email scheduler initialized
```

### Terminal 3: Start Frontend
```bash
cd 25Hard/frontend
npm run dev
```

You should see:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Testing Login

1. Open http://localhost:5173 in your browser
2. Use any of these emails:
   - `ced.dsouza@gmail.com`
   - `marcomerhi@gmail.com`
   - `rahilhoque@gmail.com`
3. Use the password you set as `CHALLENGE_PASSWORD`
4. You should see the dashboard

---

## Deployment to Production

### Deploy Frontend (Vercel)

1. Push code to GitHub (create new repo)
2. Go to https://vercel.com
3. Click "New Project"
4. Connect GitHub and select the repo
5. In "Environment Variables", add:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
6. Click Deploy

Your frontend is now live at a URL like `25hard-app.vercel.app`

### Deploy Backend (Railway)

1. Go to https://railway.app
2. Create new project → GitHub
3. Select your `25Hard` repo
4. Add service → PostgreSQL (if not already)
5. In Variables, paste all from your `.env` file
6. Deploy

Railway gives you a URL like `25hard-backend.railway.app`

### Update Frontend Environment

Go back to Vercel and update `VITE_API_URL` to your Railway URL.

---

## Checklists

### Before Going Live

- [ ] Database is set up and accessible
- [ ] SendGrid API key works (send test email)
- [ ] Firebase storage is configured
- [ ] Both frontend and backend run locally
- [ ] Login works with correct credentials
- [ ] Checklist submission works (including photo upload)
- [ ] Leaderboard displays all 3 users
- [ ] Backend and frontend deployed to production

### Email Reminders Schedule

- **6:00 AM** - Morning reminder to check in
- **6:00 PM** - Evening reminder (last chance)
- **12:15 AM** - Check for missed days, send alerts if needed

---

## Troubleshooting

### "Cannot connect to database"
- Check `DB_HOST`, `DB_USER`, `DB_PASSWORD` in `.env`
- Make sure PostgreSQL is running
- Try connecting manually: `psql -U postgres -d 25hard`

### "SendGrid API key invalid"
- Check you copied the FULL key (including `SG.` prefix)
- Regenerate key in SendGrid dashboard
- Make sure no extra spaces in `.env`

### "Firebase permission denied"
- Check service account key is pasted correctly (especially `FIREBASE_PRIVATE_KEY`)
- Verify Storage rules are published

### "Frontend can't reach backend"
- Check `VITE_API_URL` in frontend `.env`
- Make sure backend is running and accessible
- Check CORS is enabled in backend (`cors` package)

### "Email not sending"
- Check cron jobs run at correct times
- Look at backend logs for errors
- Verify `SENDGRID_FROM_EMAIL` is authenticated in SendGrid

---

## Need Help?

If you get stuck:
1. Check the error message in the terminal
2. Look at the relevant section above
3. Feel free to ask me for guidance!

Good luck with 25Hard! 🔥
