# Smart Waste frontend

React, Vite, React Router, Leaflet and Tailwind CSS. The application uses cookie authentication against the Express backend in `../server`.

## Local development

Use Node.js 22.12+ or a compatible newer version.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Start the backend separately, with `CLIENT_URL` matching the Vite origin (`http://localhost:5173` by default). `VITE_API_URL` accepts a backend origin or a URL ending in `/api`; it is public configuration, never a place for credentials.

```sh
npm run lint
npm test
```

## Deploy to Vercel

- Set the project **Root Directory** to `client` and framework to Vite.
- Install: `npm ci`; build: `npm run build`; output: `dist`.
- Set `VITE_API_URL` to the deployed **HTTPS backend** URL for each production/preview environment, then rebuild. Builds fail with a clear message when this value is missing, HTTP, or localhost.
- `vercel.json` rewrites frontend routes to `index.html`, so opening or refreshing `/login`, `/reset-password`, and dashboard URLs works. `/api` is excluded; this frontend deployment does not host the backend.
- Set the backend's `CLIENT_URL` to the exact frontend origin (without a trailing slash) and `NODE_ENV=production`. The backend then sets `SameSite=None; Secure` cookies. Preview URLs require a backend configured for their exact origin. Browser third-party cookie restrictions can still apply; same-site custom domains are preferable.
- Password recovery requires the backend SMTP configuration. The frontend never sends email itself. Geolocation requires HTTPS and user permission.

For other static hosts, configure equivalent SPA fallbacks that leave actual assets and API routes alone. Serve `dist`; do not publish the source directory.

## Appearance and forms

`ThemeProvider` wraps all routes. `useTheme()` consumes React Context, and the shared toggle is available on every page. An explicit light/dark choice persists in local storage and synchronizes across tabs; otherwise the system preference is used. CSS variables style public, admin, driver, forms, 404 and map controls. Map tiles retain their original cartographic colors.

Login, forgot password and reset password each have one implementation. `/forget-password` remains as a compatible alias. Password reset tokens are entered from email, and passwords must meet the backend's 8-character / 72-byte limits. Account creation and bin creation validate inputs and preserve failed submissions for correction.
