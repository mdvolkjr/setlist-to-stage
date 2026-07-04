# The Setlist Book 🎸

A band setlist + personal song-library app, backed by Firebase (Google login,
cloud Firestore, and Storage for uploaded MP3s). Static HTML/JS — no build step.

Live at: `https://setlist-to-stage.web.app/`

## What's here

- **`index.html`** — your personal **song library** (the "person" level). Sign in
  with Google, add songs (with title/artist autocomplete via the iTunes search
  API), and move each song between **Learning** (practice) and **Repertoire**
  (know it well). Data syncs to the cloud, so it follows you across devices.
- **`song.html`** — the per-song **detail page**: key, tempo, notes, structure,
  tricky parts, YouTube + Songsterr embeds, links to Spotify / Apple Music /
  Ultimate Guitar / Songsterr, extra performances, and an **MP3 upload +
  player** for songs that aren't on YouTube.
- **`legacy-setlist.html`** — the original localStorage-only 3-set band setlist,
  kept for reference during the transition. (Its 📖 detail links point at the new
  Firestore-backed `song.html` and won't resolve; the setlist itself still works.)
- **`firebase-init.js`** — shared Firebase app/auth/db/storage setup.
- **`firebase.json`, `.firebaserc`, `firestore.rules`, `storage.rules`** — hosting
  + security config.

## Data model (Firestore)

```
users/{uid}/songs/{songId}
  title, artist, key, status: "learning" | "learned"
  youtube, spotify, apple, songsterr, ug, tab1, tab2
  tempo, structure, tricky, notes
  mp3Url, mp3Path, mp3Name, artwork, perfs[]
  createdAt, updatedAt
```

Bands (level 2) and setlists (level 3) build on this same foundation in the next
pass — rules for `bands/{bandId}` are already stubbed in `firestore.rules`.

## One-time Firebase setup (in the console)

1. **Authentication → Get started → Google** — enable the Google provider.
2. **Firestore Database → Create database** — production mode is fine; the
   rules in this repo lock each user to their own data.
3. **Storage → Get started** — required for MP3 upload. New projects must be on
   the **Blaze (pay-as-you-go)** plan to use Storage (effectively free at this
   scale, but a card must be on file).

## Deploy

### Automatic (GitHub Actions)

`.github/workflows/firebase-deploy.yml` deploys hosting + Firestore/Storage rules
on every push to `main`. One-time setup:

1. **Create a service-account key:** Firebase Console → ⚙️ Project settings →
   **Service accounts** → **Generate new private key**. (This grants the Firebase
   Admin role.) A JSON file downloads.
2. **Add it to GitHub:** repo → **Settings → Secrets and variables → Actions →
   New repository secret**. Name it `FIREBASE_SERVICE_ACCOUNT`, and paste the
   entire contents of that JSON file as the value.
3. Push to `main` (or run the workflow manually from the **Actions** tab). Done.

### Manual (Firebase CLI)

With the [Firebase CLI](https://firebase.google.com/docs/cli) installed and
`firebase login` done once:

```bash
firebase deploy                       # hosting + firestore rules + storage rules
# or individually:
firebase deploy --only hosting
firebase deploy --only firestore:rules,storage
```

## Local development

Because the app uses ES modules, open it through a local server (not `file://`):

```bash
npx serve .          # then visit the printed http://localhost:… URL
```
