# Environment Variables - Simple Explanation

Think of environment variables like a checklist of settings your app needs to work:

| Setting | What it does | Example | Where to get it |
|---------|-------------|---------|-----------------|
| **DB_USER** | Username to access database | `postgres` | PostgreSQL install |
| **DB_PASSWORD** | Password for database | `MyPassword123` | You create this |
| **DB_HOST** | Where your database lives | `localhost` or `db.railway.internal` | Database provider |
| **DB_PORT** | Port number for database | `5432` | Usually 5432 (default) |
| **DB_NAME** | Name of your database | `25hard` | You created this |
| **JWT_SECRET** | Secret code for login tokens | `super_random_string_xyz` | Make up something random |
| **CHALLENGE_PASSWORD** | Password everyone uses to login | `Challenge2026!` | Decide together with Cedric/Nader/Rahil |
| **SENDGRID_API_KEY** | Password for email service | `SG.xxxxxxxx...` | SendGrid dashboard |
| **SENDGRID_FROM_EMAIL** | Email that sends reminders | `noreply@25hard.com` | Any email you control |
| **FIREBASE_PROJECT_ID** | Name of your photo storage | `25hard-abc123` | Firebase console |
| **FIREBASE_PRIVATE_KEY** | Secret key for Firebase | (Long multi-line key) | Firebase service account JSON |
| **FIREBASE_CLIENT_EMAIL** | Firebase account email | `firebase-adminsdk@...` | Firebase service account JSON |
| **PORT** | Port number app runs on | `5000` | You choose (5000 is default) |

## Step-by-Step: Fill in your .env file

### 1. Database Setup

**For local database (PostgreSQL on your computer):**
```
DB_USER=postgres
DB_PASSWORD=password_you_set_during_install
DB_HOST=localhost
DB_PORT=5432
DB_NAME=25hard
```

**For hosted database (Railway/Supabase):**
```
DB_USER=postgres
DB_PASSWORD=from_railway_dashboard
DB_HOST=containers-us-west-XXX.railway.app
DB_PORT=5432
DB_NAME=postgres
```

### 2. Security Settings

```
JWT_SECRET=generate_random_string_like_this_aB3cD9eF2gH5i1jK8lM4nO0pQ6rS7tU9v
CHALLENGE_PASSWORD=ask_cedric_nader_rahil_what_they_want_to_use
```

### 3. Email Setup

Go to https://sendgrid.com and get your API key:

```
SENDGRID_API_KEY=SG.paste_your_full_key_here_starting_with_SG
SENDGRID_FROM_EMAIL=noreply@yourcompany.com
```

### 4. Photo Storage Setup

Download JSON from Firebase → Project Settings → Service Accounts:

```
FIREBASE_PROJECT_ID=project-id-from-json
FIREBASE_PRIVATE_KEY_ID=key-id-from-json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMultiline...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=number-from-json
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=url-from-json
```

### 5. Server Settings

```
PORT=5000
NODE_ENV=development
```

---

## Common Mistakes to Avoid

❌ **Don't include quotes around values:**
```
# WRONG:
SENDGRID_API_KEY="SG.xxxxx"

# RIGHT:
SENDGRID_API_KEY=SG.xxxxx
```

❌ **Don't add spaces around `=`:**
```
# WRONG:
JWT_SECRET = my_secret

# RIGHT:
JWT_SECRET=my_secret
```

❌ **Don't commit `.env` to GitHub:**
```
# Put this in .gitignore (already done):
.env
```

❌ **Don't mix up database names:**
```
# Make sure DB_NAME matches what you created:
createdb 25hard
# Then use:
DB_NAME=25hard
```

---

## How to find each value

### PostgreSQL (Database)
1. During install, you set a password → use as `DB_PASSWORD`
2. If local: `DB_HOST=localhost`
3. If hosted (Railway): Copy from railway dashboard

### SendGrid (Email)
1. Create account at sendgrid.com
2. Settings → API Keys → Create API Key
3. Copy full key (starts with `SG.`)

### Firebase (Photos)
1. Create project at console.firebase.google.com
2. Project Settings ⚙️ → Service Accounts
3. Click "Generate New Private Key"
4. Download JSON file
5. Copy values from JSON into your `.env`

### JWT_SECRET & CHALLENGE_PASSWORD
1. `JWT_SECRET`: Generate random string (20+ characters, mix letters/numbers/symbols)
   - Or use: https://www.random.org/strings/
2. `CHALLENGE_PASSWORD`: Ask Cedric, Nader, Rahil what password they want to use

---

## Testing Your Environment Variables

After you create `.env`, test that everything works:

```bash
# Backend folder
cd backend

# Try to start server
npm run dev

# You should see:
# "Server running on port 5000"
# "Email scheduler initialized"

# If you see errors, check:
# 1. Database connection (DB_* variables)
# 2. Email service (SENDGRID_* variables)
# 3. Photo storage (FIREBASE_* variables)
```

---

## Need to change a variable?

1. Stop the server (Ctrl+C)
2. Edit the `.env` file
3. Save
4. Start server again (`npm run dev`)
5. Variables are now updated

---

Still stuck? Check the main [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more details!
