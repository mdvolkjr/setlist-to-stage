# CLAUDE.md — conventions for this repo

Read this first. Also read **STATUS.md** (current state), **PLAN.md** (phases), **DECISIONS.md** (why).

## What it is
A musician's setlist & practice manager. Static site on **Firebase Hosting** at
https://setlist-to-stage.web.app/ , backed by **Firebase Auth + Firestore + Storage**.

## Hard conventions (match these)
- **One self-contained HTML file per screen.** No framework, no bundler, no build step.
  Firebase v10 **modular SDK loaded from the CDN**. Shared config in `firebase-init.js`
  (exports `auth, db, storage, googleProvider`). Don't introduce React/Vite/etc.; if you
  ever must, justify it in DECISIONS.md.
- **Pure, reusable logic goes in `lib/*.js`** (ESM, no DOM/Firebase) so it can be unit-tested
  in Node. `package.json` has `"type":"module"` **only** for tests; it's excluded from deploy.
- **Styling**: inline `<style>` per page using the shared parchment/brown palette CSS vars
  (`--cream --parchment --brown --rust --tan --ink --faded --line --green`). Fonts: Playfair
  Display (titles), Libre Baskerville (body), Special Elite (labels).
- **Shared top nav** on app pages: 📚 Library (`index.html`) · 🎸 Bands (`bands.html`), with the
  user avatar/name (top-right) linking to `profile.html`. Song detail is `song.html?id=`.
  `legacy-setlist.html` is the retired pre-Firebase demo (not in nav).

## Pages
`index.html` library · `song.html` song detail · `profile.html` · `bands.html` · `band.html?id=`
(band Song List + setlists) · `setlist.html?band=&id=` (setlist editor + stage/print/export/practice).

## Data model (Firestore)
- `users/{uid}` profile; `users/{uid}/songs/{id}` personal library.
- `bands/{bandId}` `{name, description, memberUids[], members{uid:{name,role}}}`.
- `bands/{bandId}/repertoire/{id}` = the band **Song List** (copies of library songs).
- `bands/{bandId}/setlists/{id}` = `{name, gigDate, sets:[{title, songIds:[repertoireId]}]}`.
Song fields are all optional/additive: `title, artist, key, youtube, spotify, apple, songsterr,
ug, tab1, tab2, tempo, structure, tricky, notes, mp3Url/mp3Path/mp3Name`. Add fields additively.

## Live-render + inline edit gotcha
Firestore `onSnapshot` re-renders lists. When a row is open for inline editing, **suppress the
re-render** (`if (!editingId) render()`) so the open editor doesn't collapse mid-typing. See
`songRow`/`repRow`.

## Deploy / test
- Push to `main` → GitHub Actions (`.github/workflows/firebase-deploy.yml`) auto-deploys hosting +
  Firestore/Storage rules. Dev branch: `claude/repo-fixes-yhlr8o`; open work is pushed there, then
  merged to `main`.
- Verify before commit: extract each page's module script and `node --check` it; run
  `node tests/*.test.js`; static-check that every `$('id')` has a matching `id="..."`.
  **Google sign-in can't be driven headlessly here** — signed-in flows are the human's live test.
- Rules live in `firestore.rules` / `storage.rules`; `firebase.json` `public: "."`, deploy-ignores
  `*.md`, `package.json`, `tests/**`, `*.rules`.

## Product intent
Low-friction gig prep for a working musician (and less-organized musician friends — keep empty
states/onboarding clear). Future (not now): true AI bulk-import via a Cloud Function, Spotify/Apple
playlist creation via OAuth, sheet-music upload+viewer, mobile/PWA. Monetization: lean one-time /
pay-what-you-want, not subscription — keep bands/uploads/exports easy to gate later (see DECISIONS.md).
