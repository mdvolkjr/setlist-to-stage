# DECISIONS — non-trivial choices & reasoning

## Stack / architecture
- **No framework, one self-contained HTML file per screen**, Firebase v10 modular SDK from the CDN, shared config in `firebase-init.js`. Reason: matches the existing repo; zero build step keeps "edit a file → merge to main → auto-deploy" simple. Introducing React/Vite would be a large, unjustified change (kickoff says note any new framework here — deliberately not adding one).
- **Firestore data model**: `users/{uid}` (profile) + `users/{uid}/songs` (library); `bands/{bandId}` with `memberUids[]` + `members{}`, `bands/{bandId}/repertoire` (band Song List), `bands/{bandId}/setlists` (each: `{name, gigDate, sets:[{title, songIds[]}]}`). Setlist songs reference repertoire doc ids.
- **Band Song List songs are copies of library songs** (carry their own title/artist/key/links), not live references. Reason: a band often plays a song in a different key / with a different reference video than your personal copy. Trade-off: editing one doesn't propagate to the other — documented for the user; can add opt-in linking later.
- **Extensible per-song schema**: song docs already carry many optional fields (`youtube, spotify, apple, songsterr, ug, tab1, tab2, tempo, structure, tricky, notes, mp3*`). New fields are additive (absent = default), so we avoid a rigid schema. A free-text `notes` + link fields cover most future needs without migrations.

## Playlist export
- **YouTube** via `https://www.youtube.com/watch_videos?video_ids=ID1,ID2,…`. Reason: creates an ad-hoc ordered playlist with **no API key and no login** — the only zero-friction option. Limit: ~50 IDs per URL (documented in UI).
- **Spotify/Apple**: no unauthenticated playlist-creation API exists. We ship a copyable ordered list + rely on their search. Real creation would need per-user OAuth + Web API calls — deferred (STATUS needs-input #2).
- **Offline**: **M3U** referencing uploaded MP3 URLs. Works with VLC/most players. Only songs with an uploaded MP3 are included.

## Bulk import (when built)
- **Heuristic parser first, not AI.** Reason: an LLM key can't be safely embedded client-side, and this app has no server yet. The heuristic parser covers the common real inputs (`Title - Artist`, `Title by Artist`, CSV `title,artist`, numbered lists, bare titles). True AI parsing = a Firebase Cloud Function calling Claude (Blaze + secret) — offered as an opt-in, not assumed.
- Always **review-before-commit** with dedupe vs the existing library (case-insensitive title+artist match).

## File storage
- Uploaded MP3s (and future sheet music) go to **Firebase Storage** under a per-user/-song path, URL saved on the song doc. Reason: keeps large binaries out of Firestore, isolates them for future per-tier quotas.

## Monetization-safe choices
- Bands are separate docs → gating "1 free band vs. many" is a count check, not a refactor.
- Uploads isolated in Storage → per-tier quotas are a rule/counter, not surgery.
- Exports/import are discrete entry points → easy to flag behind a one-time unlock later.
- No "unlimited everything" constant baked into core logic.

## Pitch-shift (research, Phase 7 — to expand)
- Most YouTube pitch/speed plugins operate on a normal watch URL. Feasible path: an **"Open in YouTube"** deep link per song (already have video IDs) + optional `&t=` start timestamp, so a user's browser plugin can act on it. Native in-app pitch shifting would require the YouTube IFrame API + Web Audio (CORS-restricted on YouTube audio) — not feasible cleanly. Recommendation: ship deep-links, don't attempt in-app DSP on YouTube streams.
