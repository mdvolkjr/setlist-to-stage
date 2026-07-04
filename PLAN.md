# PLAN — phased build

Priority order per the kickoff. ✅ = done, 🔨 = this session, ⬜ = queued.

## Phase 0 — Recon & docs ✅
STATUS.md, PLAN.md, DECISIONS.md. Confirmed most core CRUD/bands/setlists already exist.

## Phase 1 — Printable stage setlist 🔨 (`setlist.html`)
- Print-optimized layout (`@media print`), one click from the setlist.
- Font-size presets (Normal / Large / Huge) so it reads from a music stand.
- Reuses the existing Stage View data.

## Phase 2 — Playlist export 🔨 (`setlist.html`)
- **YouTube auto-playlist**: `watch_videos?video_ids=…` from song YouTube IDs — plays the setlist in order, no login.
- **M3U** download from any uploaded MP3s.
- **Copy ordered list** (for pasting into Spotify/Apple search).
- Logic (`ytIdsFromSetlist`, `buildM3U`) unit-tested in `tests/`.

## Phase 3 — Practice session mode 🔨 (`setlist.html`)
- Per-song select checkboxes → "Practice selected (N)" (falls back to whole setlist).
- Focused one-song-at-a-time runner: big title/artist/key, play link, progress, Prev/Next, mark "needs work".

## Phase 4 — Quiz / pop-quiz mode 🔨 (`band.html`)
- "Pop Quiz" over the band Song List (optionally only Learning): random song, Reveal → Next recall drill.

## Phase 5 — Bulk import ⬜ (`index.html`)
- Paste text / CSV → heuristic parse → dedupe vs library → review/edit table → commit. Parser unit-tested. (AI path deferred — see STATUS "needs input".)

## Phase 6 — Sheet music / tab upload + viewer ⬜ (`song.html`)
- Upload PDF/image to Storage; on-screen viewer link. (External tab links already exist.)

## Phase 7 — Stretch: pitch-shift integration research ⬜
- Document feasible "open in YouTube" / deep-link approaches in DECISIONS.md; no blind build.

## Cross-cutting
- Keep each page a single self-contained HTML file (no framework) — matches the repo.
- Responsive-friendly layouts now; no mobile-specific UI yet.
- Verify each phase: syntax check, headless render smoke test where possible, logic unit tests; note what needs live (signed-in) testing.
