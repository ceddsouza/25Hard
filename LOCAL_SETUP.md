# 🚀 Quick Local Setup (No Email/Photos Yet)

Get 25Hard running locally in 10 minutes. Email & photo uploads work later.

## Prerequisites
- Node.js installed (v18+): https://nodejs.org/
- PostgreSQL installed: https://www.postgresql.org/download/

---

## Step 1: Create Database

Open Terminal and run:

```bash
createdb 25hard
psql -U postgres -d 25hard -f /Users/cedric/25Hard/backend/schema.sql
```

If this works, you'll see no errors. ✅

---

## Step 2: Start Backend

```bash
cd /Users/cedric/25Hard/backend
npm run dev
```

You should see:
```
Server running on port 5000
Email scheduler initialized
```

**Leave this running.** ✅

---

## Step 3: Start Frontend (New Terminal)

```bash
cd /Users/cedric/25Hard/frontend
npm run dev
```

You should see:
```
VITE v4.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

**Leave this running.** ✅

---

## Step 4: Login

Open browser to: **http://localhost:5173**

Use any of these emails:
- `ced.dsouza@gmail.com`
- `marcomerhi@gmail.com`
- `rahilhoque@gmail.com`

Password: `25Hard`

---

## ✅ You're Live Locally!

You should see:
1. Dashboard with your name
2. Streak counter (will be 0, that's normal)
3. Today's checklist form
4. Leaderboard tab

### What works:
- ✅ Login
- ✅ Checklist form (submit without photo for now)
- ✅ Streak tracking
- ✅ Leaderboard

### What doesn't work yet:
- ❌ Photo uploads (needs Firebase)
- ❌ Email reminders (needs SendGrid)

---

## Troubleshooting

### "Cannot connect to database"
```bash
# Check postgres is running and 25hard database exists
psql -U postgres -l | grep 25hard
```

### "Port 5000 already in use"
```bash
# Find what's using it
lsof -i :5000

# Change PORT in backend/.env to 5001
PORT=5001
```

### "Frontend can't connect to backend"
- Make sure backend terminal shows "Server running on port 5000"
- Make sure frontend has `VITE_API_URL=http://localhost:5000` in `.env`
- Try hard refresh in browser (Cmd+Shift+R)

---

## When Ready for Email & Photos

See `SETUP_GUIDE.md` for adding:
1. SendGrid (email reminders)
2. Firebase (photo uploads)

But for now, the app is fully functional without them! 🎉
