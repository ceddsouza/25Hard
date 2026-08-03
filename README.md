# 🔥 25Hard Challenge App

A web app for tracking the 25Hard challenge - 26 days of accountability with daily check-ins, streak tracking, and leaderboards.

## Challenge Rules

Complete all items daily to maintain your streak:
- 💪 2 Workouts
- 📖 10 Pages in a book
- 🚫 No Alcohol
- 🥗 Clean Eating
- 📸 Photo proof

**Duration:** September 7 - October 2, 2026 (26 days)

## Features

- **Daily Checklist**: Track all 4 requirements + photo upload
- **Email Reminders**: 6 AM and 6 PM daily reminders
- **Streak Tracking**: See your current streak and missed days
- **Leaderboard**: Compete with Cedric, Nader, and Rahil
- **Private**: Only accessible to the 3 challenge participants
- **Photo Storage**: Secure photo uploads with Firebase

## Quick Start

### For Local Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5173

### Setup

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for detailed instructions on:
- Setting up environment variables
- Configuring the database
- Setting up email (SendGrid)
- Setting up photo storage (Firebase)
- Deploying to production

## Project Structure

```
25Hard/
├── backend/                 # Node.js/Express API
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic (email, streaks, photos)
│   ├── middleware/         # Authentication
│   ├── index.js            # Server entry point
│   ├── db.js               # Database connection
│   ├── schema.sql          # Database schema
│   └── package.json
├── frontend/               # React app
│   ├── src/
│   │   ├── pages/         # Login, Dashboard
│   │   ├── components/    # Checklist, Leaderboard, etc.
│   │   ├── styles/        # CSS files
│   │   └── App.jsx        # Main component
│   └── package.json
└── SETUP_GUIDE.md         # Detailed setup instructions
```

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Email**: SendGrid
- **Photos**: Firebase Storage
- **Authentication**: JWT

## Login Credentials

Users are hardcoded for privacy:
- Cedric D'Souza (ced.dsouza@gmail.com)
- Nader Merhi (marcomerhi@gmail.com)
- Rahil Hoque (rahilhoque@gmail.com)

All use the same challenge password (set during setup).

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email & password
- `GET /api/auth/me` - Get current user

### Checklist
- `POST /api/checklist/submit` - Submit daily checklist
- `GET /api/checklist/today` - Get today's checklist
- `GET /api/checklist/history/:userId` - Get past logs

### Leaderboard
- `GET /api/leaderboard` - Get all users' streaks

### Streak
- `GET /api/streak/:userId` - Get user's streak info
- `POST /api/streak/continue-streak` - Pay $10 to continue after miss

## Deployment

### Frontend: Vercel
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Backend: Railway
Push to GitHub, connect to Railway, set environment variables.

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for step-by-step instructions.

## Environment Variables

All sensitive data is stored in `.env` files (never committed to GitHub).

See `.env.example` in both `backend/` and `frontend/` folders for templates.

## License

Private - For 25Hard challenge only.
