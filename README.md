# Prep Thamizha — web app

Vite + React web version of the Prep Thamizha TNPSC app, served at https://app.prepthamizha.com (GitHub Pages).

```
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
```

- Routing uses `HashRouter` (`/#/quick5`) so refreshes work on GitHub Pages.
- `src/i18n/strings.js`, `src/quick5.js`, `src/data/motivation.js` are copies of the Android app's files
  (strings.js imports a web `Alert` shim instead of React Native's). Keep them in sync with the app.
- Theme tokens: `src/styles/theme.css` (ported from the app's `ThemeContext.js`).
- Config: copy `.env.example` to `.env` (git-ignored) for the API URL and Firebase keys.
- Pushing to `main` builds and deploys via `.github/workflows/deploy.yml`.
