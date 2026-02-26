# Invintory Web App (Custom Build)

This repo is now a **web app** version of Invintory (not iOS), focused on a wine inventory system of record with enrichment and AI assistant workflows.

## Features included

- Rich wine record structure with key fields: bottle name, producer, region, country, cellar location/position, pricing, dates, scores, bottle size, and drinking window.
- Add bottle flow with manual entry.
- "Smart Fill" button that simulates public data enrichment (wine.com / K&L style providers).
- AI Sommelier chat panel with inventory-aware mock recommendations.
- In-memory data store suitable for demos and rapid iteration.

## Project structure

- `web/index.html` — main UI shell.
- `web/styles.css` — app styling.
- `web/app.js` — inventory, enrichment, and chat logic.
- `tests/app.test.mjs` — node tests for repository/services.

## Run locally

```bash
npm test
npm start
```

Then open `http://localhost:4173`.

## Demo script

1. View seeded bottle in Inventory.
2. Add a new bottle manually and save.
3. Use **Smart Fill from public data** to prefill producer/region/country.
4. Ask the AI Sommelier for pairings (for example, "What should I open with steak?").

## Next production steps

- Replace in-browser mock enrichment with backend integrations/APIs.
- Add image upload + OCR/computer vision for bottle-label recognition.
- Add persistent database and auth.
- Add real LLM backend with retrieval over personal cellar data.
