# Smart Waste Collection System

## Run locally

Use Node.js 22.12+ (or a newer supported LTS release).

1. In `server`, run `npm ci`. Create `.env` with `DB_URL`, `JWT_SECRET`, `PORT=4000`, and `CLIENT_URL=http://localhost:5173`, then run `npm run dev`.
2. In `client`, run `npm ci`. Set `VITE_API_URL=http://localhost:4000/api` in `.env`, then run `npm run dev`.

`VITE_API_URL` accepts a backend origin or a URL ending in `/api`, with or without a trailing slash. Restart Vite after changing it. For deployment, set it to your backend URL and set the backend's `CLIENT_URL` to the exact frontend origin; requests use authentication cookies.

## Backend routes

`server/src/app.js` configures middleware and mounts `routes/index.js` at `/api`. `server.js` starts the database connection, simulation and HTTP listener. Route modules import feature controllers; authentication middleware lives in `middlewares/auth.js`.

Existing endpoint paths and access rules are preserved:

| Module | Endpoints (all prefixed by `/api`) |
| --- | --- |
| authRoutes | POST `/login`, `/logout`, `/forgot-password`, `/reset-password`; GET `/me` |
| adminRoutes | POST `/createAdmins`; GET `/allAdmins`, `/adminsById/:id`; PUT `/updateAdmin/:id`; DELETE `/deleteAdmin/:id` |
| binRoutes | POST `/pickups`, `/collect-bin`, `/seed/bins`; GET `/allBins`; DELETE `/deleteBin/:id`, `/deleteAllBins` |
| taskRoutes | GET `/tasks` |
| truckRoutes | POST `/location` |
| locationRoutes | POST `/seed/locations` |
| workflowRoutes | POST `/update-status` |
| index | GET `/health` |

## Frontend services

`client/src/services/api.js` owns base URL normalization, cookies, JSON parsing and HTTP errors. Feature services (`authService`, `adminService`, `binService`, `taskService`, `truckService`, `locationService`, `workflowService`) own endpoint paths and return parsed data. Pages/components call services; they do not call `fetch` or parse Response objects. OSRM requests live in `routingService.js`; route formatting remains in `utils/routing.js`.

## Checks

- `cd server` then `npm test`: HTTP route wiring, auth protection and error handling, using mocked models without MongoDB.
- `cd client` then `npm test`: service URLs, authentication cookies, request bodies and error handling.
- `cd client` then `npm run build`: production frontend build.

The HTTP tests do not replace integration testing with a configured MongoDB and real login session.
