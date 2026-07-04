# STATUS — Setlist to Stage 🎸

_Last updated: this session (2026-07-04)._ Live app: https://setlist-to-stage.web.app/

This is the first thing to read. It reflects the app as it actually is, not the generic kickoff assumptions.

---

## ⚠️ Needs input (won't block the rest of the build)

1. **AI bulk-import** — parsing genuinely messy input with an LLM needs an Anthropic API key. A key **cannot** live in client code (this app has no server; the config is public). So the shipped bulk-import uses a **heuristic parser** (handles `Title - Artist`, `Title by Artist`, CSV, numbered lists, plain titles) with a review-before-commit step. To get true AI parsing we'd add a **Firebase Cloud Function** that calls Claude server-side (needs the Blaze plan + a stored secret). Say the word and I'll add that path.
2. **Spotify / Apple Music playlist _creation_** — impossible without each user OAuth-ing into those services and calling their APIs. What ships instead: a **YouTube auto-playlist** (no login, plays the setlist in order), an **M3U** for uploaded MP3s, and a **copyable ordered list** to paste into Spotify/Apple search. Real playlist creation is a bigger, credential-gated feature — flag if you want it.
3. **Playwright MCP not in this session** — the `claude mcp add playwright` command adds it to your local Claude Code; this remote session doesn't have it. I verify with headless-Chromium render smoke tests + Node logic tests. **Signed-in flows (anything past Google login) are your live test** — I can't complete OAuth headlessly here.

---

## ✅ Done (already in the app)

- **Auth** — Google sign-in (Firebase Auth); all data scoped per user.
- **Song Library** (`index.html`) — add via iTunes search or manual; Learning → Repertoire ("learned") flow; inline quick-edit of title/artist/key/YouTube/Spotify/Apple; **filter box**; per-song detail page.
- **Song detail** (`song.html`) — YouTube + Songsterr embeds, key/tempo/artist, notes (structure / tricky / general), multiple tab links, **MP3 upload + playback** (Firebase Storage), extra performances.
- **Bands** (`bands.html`, `band.html`) — create/list multiple bands; per-band **Song List** built from the library or manual entry; inline quick-edit + filter; band settings; members.
- **Setlists** (`setlist.html`) — per-band, gig-dated or practice; multi-set running order built from the Song List; reorder, move between sets, per-song key + play link; **Stage View** (large read-only running order).
- **Infra** — Firestore rules (per-user + per-band-membership), Storage rules, GitHub Actions auto-deploy to Firebase Hosting on push to `main`.

## 🆕 Added this session (done, needs your live sign-in test)

- **Printable stage setlist** (`setlist.html`) — Stage View now has **font-size presets (A / A+ / A++)** and a **🖨 Print** button with a print-optimized black-on-white layout that page-breaks cleanly between sets.
- **Playlist export** (`setlist.html`, "▶ Export") — **YouTube auto-playlist** (plays the setlist in order, no login), **M3U** download for uploaded MP3s, **copy ordered list** for Spotify/Apple. Pure logic in `lib/playlist.js`, unit-tested in `tests/playlist.test.js` (6 tests passing).
- **Practice session mode** (`setlist.html`, "🎯 Practice") — tick songs to focus on (or run the whole setlist), then a distraction-free one-song-at-a-time runner with embedded YouTube, key, progress, and ◀/▶ (arrow keys work).
- **Quiz / pop-quiz mode** (`band.html`, "🎲 Pop Quiz") — random song from the band Song List, Reveal → Next recall drill.

## ⛔ Not started (next sessions)

- **Bulk import** (heuristic parser + review UI) — planned next.
- **Sheet-music / tab file upload + on-screen viewer** (schema has external tab links; file upload+viewer not yet).
- **Spotify/Apple real playlist creation**, **pitch-shift plugin integration** (research notes below), **mobile/PWA pass**, **automated test suite** for logic modules.

---

## 💰 Monetization recommendation (not built — just avoiding corners)

Favor a **one-time unlock or pay-what-you-want**, no subscription (matches your ask). Suggested split:
- **Free forever:** Song Library, **one** band, unlimited setlists on that band, stage view/print, practice + quiz, YouTube export.
- **One-time unlock ("Pro"):** multiple bands, bulk AI import, MP3/sheet uploads beyond a small quota, Spotify/Apple/advanced exports.

Architecturally we're not painted into a corner: bands are separate docs (easy to gate count), uploads already isolated in Storage (easy to quota), exports are discrete functions (easy to flag). No "unlimited" assumption is hardcoded in a way that's hard to gate. See DECISIONS.md.

---

## ▶️ Run / test locally

Static site, no build step. Any static server works:
```
python3 -m http.server 8000     # then open http://localhost:8000/index.html
```
It talks to the real Firebase project (`setlist-to-stage`), so you can sign in and use live data locally. Deploy = merge to `main` (GitHub Actions auto-deploys). Logic unit tests (import parser, playlist builder) live in `tests/` and run with `node tests/*.mjs`.
