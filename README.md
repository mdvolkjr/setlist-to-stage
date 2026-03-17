# Band Setlist Book 🎸

A static HTML/JS band setlist manager. No frameworks, no build step — open `index.html` in any browser.

## Features
- 3 setlists with all songs
- Pre-filled YouTube links for known songs
- ✓ checkbox to mark songs you know well (grays them out)
- Key field per song on the main list
- Click 📖 on any song to open its **full detail page** with:
  - Embedded YouTube video preview
  - Embedded Songsterr tab preview
  - Notes, key, tempo, structure, tricky parts
  - Multiple tab links (UG, Songsterr, + 2 more)
  - Additional performances / live versions section
- All data saved to browser `localStorage` — no server needed

## Usage
Just open `index.html` in your browser. For GitHub Pages, it'll be live at:
`https://mdvolkjr.github.io/band-setlist/`

## Files
- `index.html` — Main setlist with all 3 sets
- `song.html` — Song detail page (navigated to via `?id=` param)
