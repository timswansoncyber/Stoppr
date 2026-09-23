# Stoppr

A private, local-first streak tracker for quitting a habit: streak counter with relapse logging, a panic button with guided breathing, levels and distinctions, a reading library, and a daily journal. All data stays in the browser (`localStorage`).

## Develop

```bash
npm install
npm run dev
```

## Deploy

Pushing to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`. In the repo's **Settings → Pages**, set the source to **GitHub Actions**.

The Vite `base` is `/Stoppr/`, so the repo must be named `Stoppr` (or update `base` in `vite.config.ts`).
