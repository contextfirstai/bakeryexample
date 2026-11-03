# Bakery App and Live Build Tracker

A one-page site for a small bakery, with a 12-tile progress tracker across the top.
It is the single example for Context Clinic 03. Each tile changes colour through a real commit.

Built from PRD CFAI-CLC-TRK-PRD-001 v1.1. No backend, no database, no secrets.

## Run it

Open `index.html` in a browser (works offline), or run a local server:

    python3 -m http.server 8000

then visit http://localhost:8000.

## The files

| File | Job |
| --- | --- |
| `index.html` | The page |
| `styles.css` | Look and feel (dark page, tile colours) |
| `data.js` | The one data file: tile states, version, headline, hours |
| `tracker.js` | Tiny script that draws the page from `data.js` |
| `settings.example.json` | Blank template for step 11. Copy to `settings.json` (ignored by Git) |
| `.gitignore` | Keeps real settings and `.env` files out of the repository |

## Changing a tile

Edit one `state` in `data.js` (`not-started`, `in-progress` or `done`), save, reload.
The counter, key and colours follow. Nothing else needs to change.

## Build story

| Step | Page says | Version |
| --- | --- | --- |
| First commit | Fresh bread every morning | none |
| Merged and released | Fresh bread baked every morning | v1.0.0 |
| Hours added, typo | ...and "Open daly from 7am" | v1.1.0 |
| Revert released | Fresh bread baked every morning | v1.1.1 |

## Tests (developer tooling only)

    npm test

Never commit a real key. Any example secret in this repo must be obviously fake.
