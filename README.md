# HabeshaCutz ✦

**Elite barber booking platform — React + Firebase + Calendly + GitHub Pages**

A full MVP where barbers showcase their Instagram portfolio and clients book via their Calendly link.

---

## Tech Stack

| Layer      | Tech                        |
|------------|-----------------------------|
| Frontend   | React 18 + Vite             |
| Auth       | Firebase Authentication     |
| Database   | Firestore (Firebase)        |
| Booking    | Calendly (embedded widget)  |
| Portfolio  | Instagram links             |
| Hosting    | GitHub Pages (or Vercel)    |

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/habeshacuts.git
cd habeshacuts
npm install
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project: `habeshacuts`
3. Enable **Authentication** → Sign-in method → **Email/Password**
4. Enable **Firestore** → Start in production mode
5. Go to **Project Settings** → **Your apps** → Add a web app
6. Copy the config values

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 4. Deploy Firestore rules

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # select your project
firebase deploy --only firestore:rules
```

### 5. Run locally

```bash
npm run dev
# → http://localhost:5173
```

---

## How Calendly Integration Works

Barbers paste their Calendly URL into their dashboard. When a client visits their profile, the Calendly inline widget loads directly on the page using `react-calendly`. No extra API keys needed.

**For barbers:**
1. Create a free Calendly account at [calendly.com](https://calendly.com)
2. Create an event type (e.g. "Haircut - 45 min")
3. Copy the booking URL: `https://calendly.com/yourname/haircut`
4. Paste it into the Barber Dashboard → My Profile → Calendly URL field

---

## Deploy to GitHub Pages

```bash
# 1. Update vite.config.js base to your repo name
#    base: '/habeshacuts/'

# 2. Update package.json homepage
#    "homepage": "https://YOUR_USERNAME.github.io/habeshacuts"

# 3. Deploy
npm run deploy
```

---

## Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
# Follow prompts — add your VITE_FIREBASE_* env vars in the Vercel dashboard
```

Add a `vercel.json` for SPA routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Firestore Data Model

### `users/{uid}`
```json
{
  "uid": "abc123",
  "name": "Kofi Mensah",
  "email": "kofi@example.com",
  "role": "barber | client",
  "createdAt": 1700000000000
}
```

### `barbers/{uid}`
```json
{
  "uid": "abc123",
  "name": "Kofi Mensah",
  "shopName": "The Gold Chair",
  "city": "Toronto, ON",
  "bio": "Specializing in crisp fades...",
  "instagramHandle": "koficuts",
  "calendlyUrl": "https://calendly.com/koficuts/haircut",
  "specialties": ["Fades", "Lineups", "Beard Trims"],
  "services": [
    { "name": "Fade + Lineup", "price": 35, "duration": 45 },
    { "name": "Beard Trim", "price": 20, "duration": 20 }
  ],
  "startingPrice": 30,
  "rating": "4.9",
  "reviewCount": 127,
  "updatedAt": 1700000000000
}
```

---

## Pages

| Route            | Description                                  |
|------------------|----------------------------------------------|
| `/`              | Home — hero, how it works, featured barbers  |
| `/barbers`       | Browse + filter barbers by city/specialty    |
| `/barbers/:id`   | Barber profile + Instagram + Calendly widget |
| `/auth`          | Login / Register (client or barber)          |
| `/join`          | Barber landing page                          |
| `/dashboard`     | Barber dashboard (profile, services setup)   |
| `/my-bookings`   | Client bookings page                         |

---

## Next Version (v2) Roadmap

- [ ] Stripe payment deposits
- [ ] SMS/email reminders
- [ ] Review & rating system
- [ ] Barber availability calendar (custom, no Calendly)
- [ ] Admin moderation panel
- [ ] Mobile app (React Native)

---

## License

MIT — built with ❤️ for the culture.
