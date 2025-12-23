<!-- COPILOT INSTRUCTIONS for EDC repository -->
# Copilot / AI Agent Quick Guide

Purpose: Give an AI coding agent the minimal, actionable context to be productive in this repo.

- **Big picture:** This repo is a small static affiliate site package with an optional build pipeline that enriches static HTML using the Amazon Product Advertising API (PA-API). There are two main workflows: a simple static-deploy workflow (edit the HTML files and deploy) and an automated build workflow (run `npm run build` to fetch Amazon data and generate a `dist/` site).

- **Key files and what they control:**
  - [package.json](../package.json) — scripts: `build`, `dev`, `deploy` (Netlify). Use these as primary commands.
  - [src/build.js](../src/build.js) — main build pipeline. Reads `src/products.json`, calls PA-API, injects product cards into `index.html`, writes `dist/index.html`, and copies asset files.
  - [src/products.json](../src/products.json) — canonical product list. Products with `asin: "NEEDS_ASIN"` are skipped.
  - [index.html](../index.html) — base HTML used by the build script; contains category sections that the build replaces via regex.
  - [app.js](../app.js) — frontend interactions, widgets, and visual effects (WebGL, counters, theme switching). Treat as purely client-side code.
  - [DEPLOYMENT-GUIDE.md](../DEPLOYMENT-GUIDE.md) — human-facing instructions for manual deploy and quick edits.
  - `netlify.toml` / [netlify deploy] — present for Netlify deployment (used by `npm run deploy`).

- **Environment & secrets:** The build pipeline requires Amazon credentials and partner tag in environment variables. Expect a `.env` file during development with these names:
  - `MY_AWS_ACCESS_KEY_ID`
  - `MY_AWS_SECRET_ACCESS_KEY`
  - `MY_AWS_REGION` (defaults to `us-east-1`)
  - `MY_AWS_PARTNER_TAG` (affiliate tag used to build links)

- **Developer commands (concrete):**
  - Install: `npm install`
  - Local build: `npm run build` — runs Node script `src/build.js` and outputs to `dist/`.
  - Dev server: `npm run dev` — builds then serves `dist/` with `http-server` on default port.
  - Deploy (Netlify CLI required): `npm run deploy` — runs build then `netlify deploy --prod` (requires Netlify auth).

- **Important build behaviors & gotchas (must-document for agents):**
  - `src/build.js` uses the `paapi5-nodejs-sdk` and fetches items in batches (batch size 10) and intentionally rate-limits with a 1s delay between batches.
  - The build script constructs affiliate links automatically using `product.asin` and `MY_AWS_PARTNER_TAG` — so do not hardcode affiliate links when using the automated build.
  - If `src/products.json` contains products whose `asin` is `NEEDS_ASIN`, `build.js` will skip them and exit with code 1 if no valid ASINs exist.
  - The HTML injection is done by regex replacements (not a template engine), so modifications to the structure of `index.html` must preserve the category section markers and class names used by the script (`<section class="category-section">`, `<h2 class="category-title">`, `<div class="products-grid">`).

- **When to edit raw HTML vs. use the build:**
  - For quick manual deploys (no PA-API), follow [DEPLOYMENT-GUIDE.md](../DEPLOYMENT-GUIDE.md): replace `href="#"` links with your Amazon affiliate links and rename `ugreen-brand-showcase.html` → `index.html`.
  - For dynamic product data (ratings, prices, images), provide valid ASINs in `src/products.json` and supply environment variables, then use the build pipeline to generate `dist/`.

- **Conventions & patterns:**
  - Frontend logic lives in `app.js` (no bundler). Prefer small, targeted edits there for UI changes.
  - Build outputs go to `dist/` and include `index.html`, `ugreen-vs-anker.html`, `style.css`, `app.js`, `script.js`, and `images/` (copied by the build script).
  - Styling is simple CSS (Tailwind directives appear in `style.css` header). Avoid adding heavy build tooling unless requested.

- **Integration points / external deps:**
  - Amazon PA-API via `paapi5-nodejs-sdk` (credentials required).
  - Netlify CLI integration for deploy (if `npm run deploy` is used).
  - `ejs` is listed in `package.json` but the current `src/build.js` does not use EJS templating — be cautious when introducing EJS without updating build logic.

- **Examples to copy/paste:**
  - Build locally with env (Windows PowerShell):

```powershell
npm install
Set-Item -Path env:MY_AWS_ACCESS_KEY_ID -Value "AKIA..."
Set-Item -Path env:MY_AWS_SECRET_ACCESS_KEY -Value "secret"
Set-Item -Path env:MY_AWS_PARTNER_TAG -Value "yourtag-20"
npm run build
```

- **PR guidance for agents:**
  - When changing HTML structure that `src/build.js` depends on, include a brief note in the PR describing required regex/template updates to `src/build.js` and run `npm run build` to verify `dist/` output.
  - Avoid committing real secrets. Use `.env` (ignored) and document any new env vars in this file.

If anything above is unclear or you'd like more examples (e.g., sample `src/products.json` edits, exact `index.html` snippets that the build expects), tell me which section to expand. 
