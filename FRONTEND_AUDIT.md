# Frontend cleanup and shared appearance

Branch: `fix/frontend-cleanup-global-theme`
Base: `ada7d53` (`main` at the start of this work).

## Issues corrected

| Area | Finding | Change |
| --- | --- | --- |
| Theme | Home owned a local boolean and mutated `body.dark`; other pages had no control or consistent colors. | Root `ThemeProvider`, `useContext` through `useTheme`, shared toggle on every route, light/dark variables, system default, local-storage persistence and cross-tab updates. |
| CSS | Home's global `header`, body resets and generic classes leaked into dashboards. | Scope homepage styles; remove duplicate login resets; make admin and driver surfaces theme-aware. |
| Mobile | Driver dashboard nested `100vh` inside hidden overflow; content could be unreachable. Admin heading/actions competed for a narrow row. Mobile home menu did not wrap reliably. | Scrollable driver layout and bounded map, compact mobile admin navigation, separate heading/action rows and accessible wrapping home navigation. |
| Login/recovery | Password recovery existed twice. Standalone forms lacked required/minimum validation, pending states and useful error styles. Login used clickable paragraphs and an alert dialog. | One route per auth form, labels/autocomplete, disabled pending buttons, accessible inline success/errors, confirmation password, trimmed token/email, backend-compatible password byte validation. Keep `/forget-password` alias. |
| Account/bin forms | Whitespace names passed native required checks; password validation did not match bcrypt byte limits. | Trim and validate account names; enforce existing backend length limits; validate password bytes; retain server error feedback and input. Zero coordinates remain valid. |
| Team management | UI offered deletion of the signed-in administrator, which the backend rejects. | Disable self-deletion with explanatory text and guard repeated deletes. Backend remains authoritative. |
| Driver map | User marker icon was declared but unused; another icon and state/ref were dead. Map attribution was absent. | Use the intended user icon, remove dead declarations, include attribution and invalidate map size after resizing. |
| Driver loading | No response yet could be presented as a completed route. | Display loading feedback and render task status only after tasks arrive. |
| Routing | No catch-all route, and two driver URLs rendered inconsistent shells. | Working themed 404; redirect legacy driver route to the full driver shell; replace auth redirects in history. |
| API/deployment | Missing production configuration silently pointed clients at localhost. HTML fallback responses could be treated as success. Requests had no timeout. | Validate production HTTPS backend URL at build; reject invalid JSON successes; bounded request timeout and actionable network errors. |
| Hosting | No SPA rewrite configuration or project-specific deployment instructions. | Vercel frontend rewrites, `.env.example`, frontend README covering root directory, API URL, cookies, CORS origin, email and HTTPS requirements. |
| Unused code | Duplicate unused BinForm, empty CSS, unreferenced Tailwind v3-style config, obsolete login CSS referencing a missing image, unused animations/imports. | Remove superseded files, simplify 404, remove unused framer-motion and autoprefixer direct dependencies and update lockfile. |

## Verification

- `npm run lint`: passes (baseline had seven lint errors).
- `npm test`: 11 passing tests, including API failures, HTML fallback rejection, cancellation, and multibyte password limits.
- `VITE_API_URL=https://api.example.com npm run build`: passes. This URL was a build-only placeholder, not a live backend test.
- Browser verification with local Chromium/Playwright: 12 routes × 4 widths (320, 375, 768, 1280) × 2 themes = **96 checks**. No document horizontal overflow, wrong theme, Vite overlay or uncaught page errors.
- Forms checked against intercepted API fixtures: login, forgot password, reset password, account creation and bin creation, including validation, server rejection, retry, pending states, password mismatch, selected role, and latitude/longitude zero.
- Navigation checks: theme preserved across routes and reload; storage event sync; mobile menu; protected-route redirect; legacy driver redirect; logout; self-deletion disabled.
- Dark desktop/mobile screenshots were inspected and used to correct the compressed heading and reduced-motion animation delays.

## Verification limits and deployment requirements

Browser API responses were local fixtures shaped from the backend controllers. This does **not** establish live database writes, email delivery, cross-site session cookies, GPS proximity checks, or routing/map-provider availability. External map tiles were stubbed in layout tests; map controls and markers rendered locally. No production deployment or real account/data mutation was performed.

Set Vercel Root Directory to `client`, add the real HTTPS `VITE_API_URL` to the relevant deployment environment, and configure the backend's exact `CLIENT_URL` and production email settings before deploying. The existing backend supports one allowed frontend origin, so preview URLs need a matching backend configuration. See `client/README.md`.
